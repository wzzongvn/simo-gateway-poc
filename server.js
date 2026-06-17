/* =====================================================================
 * InfoPlus - SIMO Relay Gateway (PoC server) - RELAY MODEL
 * Pure Node.js (no external packages). Run:  node server.js  -> :8787
 *
 * Positioning: the gateway is a RELAY between Core Banking and SIMO.
 *   - Core Banking = source / decision owner (sends report requests)
 *   - InfoPlus GW  = relay / transform / transmit / log (no ownership, no approval)
 *   - SIMO (SBV)   = regulator endpoint
 * In-memory state, resets on restart. Static portal served from this dir.
 * ===================================================================== */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8787;
const HOST = "127.0.0.1";
const BIND = "0.0.0.0";

const CRED = { key: "IBKVN_DEMO_KEY", secret: "IBKVN_DEMO_SECRET", user: "ibkvn_simo", pass: "demo#1234" };
const REPORT_EP = "/simo/tktt/1.0/upload-bao-cao-danh-sach-tktt-api";
const MAX_BATCH = 10000;

// ============================ API CATALOG (relay targets) ============================
const API_CATALOG = [
  { code:"simo_001", group:"TKTT-CN", target:"ACCOUNT_IND", op:"PERIODIC",   mode:"BATCH", purpose:"개인 결제계좌 정기 수집(월간 신규)" },
  { code:"simo_002", group:"TKTT-CN", target:"ACCOUNT_IND", op:"SUSPECT",    mode:"EVENT", purpose:"개인 의심계좌 보고" },
  { code:"simo_003", group:"TKTT-CN", target:"ACCOUNT_IND", op:"SUSPECT_UPD",mode:"EVENT", purpose:"개인 의심계좌 KYC 재점검 갱신" },
  { code:"simo_004", group:"TKTT-CN", target:"ACCOUNT_IND", op:"INFO_UPD",   mode:"EVENT", purpose:"개인 계좌개설 고객정보 갱신" },
  { code:"simo_018", group:"TKTT-TC", target:"ACCOUNT_ORG", op:"PERIODIC",   mode:"BATCH", purpose:"법인 결제계좌 정기 수집" },
  { code:"simo_019", group:"TKTT-TC", target:"ACCOUNT_ORG", op:"SUSPECT",    mode:"EVENT", purpose:"법인 의심계좌 보고" },
  { code:"simo_020", group:"TKTT-TC", target:"ACCOUNT_ORG", op:"SUSPECT_UPD",mode:"EVENT", purpose:"법인 의심계좌 갱신" },
  { code:"simo_005", group:"VDT",     target:"EWALLET_IND", op:"PERIODIC",   mode:"BATCH", purpose:"전자지갑(개인) 정기 수집 (TGTT)" },
  { code:"simo_007", group:"VDT",     target:"EWALLET",     op:"SUSPECT",    mode:"EVENT", purpose:"의심 전자지갑 보고 (TGTT)" },
  { code:"simo_016", group:"VDT",     target:"GUARANTEE",   op:"BALANCE",    mode:"BATCH", purpose:"전자지갑 보증계좌 잔액 수집" },
  { code:"simo_027", group:"DVCNTT",  target:"MERCHANT",    op:"PERIODIC",   mode:"BATCH", purpose:"가맹점 정기 수집" },
  { code:"simo_028", group:"DVCNTT",  target:"MERCHANT",    op:"SUSPECT",    mode:"EVENT", purpose:"의심 가맹점 보고" }
];
const CATALOG_BY_CODE = Object.fromEntries(API_CATALOG.map(a=>[a.code,a]));

const HO=["Nguyen","Tran","Le","Pham","Hoang","Vu","Dang","Bui","Do","Ho","Ngo","Duong"];
const DEM=["Van","Thi","Hoang","Minh","Thu","Quang","Hai","Ngoc","Duc","Anh"];
const TEN=["An","Binh","Cuong","Dung","Ha","Khoa","Lan","Minh","Nam","Phuc","Quan","Son","Trang","Vy"];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const pad=(n,l)=>String(n).padStart(l,"0");

function coreRecord(svc, withDefect){
  const sus=/SUSPECT/.test(CATALOG_BY_CODE[svc]?.op||"");
  const r={
    Cif:"CIF"+pad(Math.floor(Math.random()*99999)+1,5),
    SoID:pad(Math.floor(Math.random()*900000000000)+100000000000,12),
    LoaiID:rnd([1,1,3,4]),
    TenKhachHang:`${rnd(HO)} ${rnd(DEM)} ${rnd(TEN)}`,
    NgaySinh:`${pad(1+Math.floor(Math.random()*28),2)}/${pad(1+Math.floor(Math.random()*12),2)}/${1975+Math.floor(Math.random()*30)}`,
    GioiTinh:rnd([0,1]),
    SoDienThoaiDangKyDichVu:"09"+pad(Math.floor(Math.random()*90000000),8),
    DiaChiKiemSoatTruyCap:"AC:DE:"+pad(Math.floor(Math.random()*9999),4)+":"+pad(Math.floor(Math.random()*99),2),
    SoTaiKhoan:"19"+pad(Math.floor(Math.random()*900000000)+100000000,8),
    LoaiTaiKhoan:1,
    TrangThaiHoatDongTaiKhoan: sus?rnd([3,4]):1,
    NgayMoTaiKhoan:`${pad(1+Math.floor(Math.random()*28),2)}/06/2026`,
    QuocTich:"VN"
  };
  if(sus) r.NghiNgo=1;
  if(withDefect){ if(Math.random()<0.5){ r.NgaySinh="1990-01-01"; } else { r.SoTaiKhoan=""; } }
  return r;
}

const REASONS=["FRAUD_SUSPECT","MULE_ACCOUNT","REPORTED_POLICE","ABNORMAL_FLOW"];
const DEMO_BL=[
  {entryId:"S-DEMO01", identifier:"9988776655", kind:"ACCOUNT", reason:"FRAUD_SUSPECT"},
  {entryId:"S-DEMO02", identifier:"1234509876", kind:"ACCOUNT", reason:"REPORTED_POLICE"},
  {entryId:"S-DEMO03", identifier:"VDT8830021", kind:"EWALLET", reason:"MULE_ACCOUNT"}
];
function genMaster(n){
  const o=DEMO_BL.map(x=>({...x,version:1,removed:false,ts:Date.now()}));
  for(let i=0;i<n;i++){ const acc=Math.random()<0.85;
    o.push({entryId:"S-"+pad(i+100,6), identifier:(acc?"":"VDT")+pad(Math.floor(Math.random()*9000000000)+1000000000,10), kind:acc?"ACCOUNT":"EWALLET", reason:rnd(REASONS), version:1, removed:false, ts:Date.now()}); }
  return o;
}

// ============================ STATE ============================
const DB = { relays:[], suspect:[], recvHist:[], txlog:[], seq:{relay:0,recv:0,tx:0,q:0} };
const SIMO = { received:[], master:genMaster(60), tokens:new Map(), refresh:new Map() };
function tx(type, svc, summary, result){
  DB.seq.tx++; DB.txlog.unshift({id:DB.seq.tx, ts:new Date().toISOString(), type, svc:svc||"-", summary, result:result||"-"});
  if(DB.txlog.length>800) DB.txlog.pop();
}

const REQUIRED=["Cif","SoID","LoaiID","TenKhachHang","NgaySinh","GioiTinh","SoTaiKhoan","TrangThaiHoatDongTaiKhoan","NgayMoTaiKhoan","QuocTich","DiaChiKiemSoatTruyCap"];
function validateRecord(r){
  for(const f of REQUIRED){ if(r[f]===undefined||r[f]===null||r[f]==="") return {field:f,code:"ERR_REQUIRED"}; }
  if(!/^\d{2}\/\d{2}\/\d{4}$/.test(r.NgaySinh)) return {field:"NgaySinh",code:"ERR_DATE_FORMAT"};
  if(!/^\d{2}\/\d{2}\/\d{4}$/.test(r.NgayMoTaiKhoan)) return {field:"NgayMoTaiKhoan",code:"ERR_DATE_FORMAT"};
  if(![0,1,2].includes(Number(r.GioiTinh))) return {field:"GioiTinh",code:"ERR_ENUM"};
  return null;
}

// ============================ MOCK SIMO ============================
function mockSimo(req,res,parsed,body){
  const p=parsed.pathname;
  if(p==="/token" && req.method==="POST"){
    const m=/^Basic\s+(.+)$/.exec(req.headers["authorization"]||""); let ok=false;
    if(m){ ok=Buffer.from(m[1],"base64").toString("utf8")===`${CRED.key}:${CRED.secret}`; }
    const f=parseForm(body);
    if(!ok) return json(res,401,{error:"invalid_client"});
    if(f.grant_type==="password"){ if(f.username!==CRED.user||f.password!==CRED.pass) return json(res,401,{error:"invalid_grant"}); }
    else if(f.grant_type==="refresh_token"){ if(!SIMO.refresh.has(f.refresh_token)) return json(res,401,{error:"invalid_grant"}); }
    else return json(res,400,{error:"unsupported_grant_type"});
    const t="ey"+crypto.randomBytes(16).toString("hex"), rt="rt"+crypto.randomBytes(12).toString("hex");
    const ttl=Number(process.env.TOKEN_TTL||3600); SIMO.tokens.set(t,{exp:Date.now()+ttl*1000}); SIMO.refresh.set(rt,1);
    return json(res,200,{access_token:t,refresh_token:rt,token_type:"Bearer",scope:"simo.report",expires_in:ttl});
  }
  if(p===REPORT_EP && req.method==="POST"){
    const bm=/^Bearer\s+(.+)$/.exec(req.headers["authorization"]||""); const ti=bm?SIMO.tokens.get(bm[1]):null;
    if(!ti) return json(res,401,{code:"99",success:false,message:"Token khong hop le"});
    if(Date.now()>ti.exp) return json(res,401,{code:"98",success:false,message:"Token het han"});
    if(!req.headers["mayeucau"]) return json(res,400,{code:"10",success:false,message:"Thieu maYeuCau"});
    let arr; try{ arr=JSON.parse(body); }catch(e){ return json(res,400,{code:"20",success:false,message:"Body khong phai JSON"}); }
    if(!Array.isArray(arr)) return json(res,400,{code:"21",success:false,message:"Body phai la array"});
    if(arr.length>MAX_BATCH) return json(res,400,{code:"22",success:false,message:"Vuot "+MAX_BATCH});
    const rejected=[]; let acc=0;
    arr.forEach((r,i)=>{ const e=validateRecord(r); if(e) rejected.push({index:i,account:r.SoTaiKhoan||null,field:e.field,code:e.code}); else acc++; });
    SIMO.received.push({maYeuCau:req.headers["mayeucau"],kyBaoCao:req.headers["kybaocao"]||"-",total:arr.length,accepted:acc,at:Date.now()});
    const allok=rejected.length===0;
    return json(res,200,{code:allok?"00":"01",success:allok,message:allok?"Tiep nhan thanh cong":"Mot so ban ghi bi tu choi",total:arr.length,accepted:acc,rejectedCount:rejected.length,rejected});
  }
  if(p==="/simo/blacklist/delta" && req.method==="GET"){
    const since=Number(parsed.query.since||0);
    const items=SIMO.master.filter(e=>e.ts>since).map(e=>({entryId:e.entryId,identifier:e.identifier,kind:e.kind,reason:e.reason,op:e.removed?"DELETE":"ADD"}));
    return json(res,200,{cursor:Date.now(),count:items.length,items});
  }
  if(p==="/simo/blacklist/full" && req.method==="GET"){
    const items=SIMO.master.filter(e=>!e.removed).map(e=>({entryId:e.entryId,identifier:e.identifier,kind:e.kind,reason:e.reason,op:"ADD"}));
    return json(res,200,{cursor:Date.now(),count:items.length,items});
  }
  if(p==="/simo/check" && req.method==="POST"){
    let b={}; try{ b=JSON.parse(body); }catch(e){}
    const idn=(b.identifier||"").trim();
    const hit=SIMO.master.find(e=>e.identifier===idn && !e.removed);
    return json(res,200,{identifier:idn, hit:!!hit, entry: hit?{entryId:hit.entryId,kind:hit.kind,reason:hit.reason}:null});
  }
  return null;
}
function callSimo(method,pathname,headers,body){
  return new Promise((resolve,reject)=>{
    const data=body!=null?(typeof body==="string"?body:JSON.stringify(body)):null;
    const h=Object.assign({},headers); if(data) h["content-length"]=Buffer.byteLength(data);
    const r=http.request({host:HOST,port:PORT,path:pathname,method,headers:h},res=>{ let s=""; res.on("data",d=>s+=d); res.on("end",()=>{ let j; try{j=JSON.parse(s);}catch(e){j=s;} resolve({status:res.statusCode,body:j}); }); });
    r.on("error",reject); if(data) r.write(data); r.end();
  });
}
async function getToken(){
  const basic=Buffer.from(`${CRED.key}:${CRED.secret}`).toString("base64");
  const r=await callSimo("POST","/token",{authorization:"Basic "+basic,"content-type":"application/x-www-form-urlencoded"},
    `grant_type=password&username=${CRED.user}&password=${encodeURIComponent(CRED.pass)}`);
  return r.body;
}

// ============================ GATEWAY API ============================
async function gatewayApi(req,res,parsed,body){
  const p=parsed.pathname, q=parsed.query; const send=(c,o)=>json(res,c,o);

  if(p==="/api/connection" && req.method==="GET")
    return send(200,{extranet:true,cert:true,tokenActive:SIMO.tokens.size>0,lastRecv:DB.recvHist[0]?.at||null,simoHost:"mgsimo.sbv.gov.vn (mock)"});
  if(p==="/api/apis" && req.method==="GET") return send(200,{items:API_CATALOG});

  if(p==="/api/relay/report" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const svc=b.svc||"simo_002"; const count=Math.max(1,Math.min(2000,Number(b.count||1)));
    const cat=CATALOG_BY_CODE[svc]||{};
    const records=[]; for(let i=0;i<count;i++){ records.push(coreRecord(svc, count>4 && i%7===3)); }
    DB.seq.relay++; const id="RLY"+pad(DB.seq.relay,4);
    const maYeuCau="IBKVN-"+new Date().toISOString().slice(0,10).replace(/-/g,"")+"-"+pad(DB.seq.relay,4);
    const tk=await getToken();
    const resp=await callSimo("POST",REPORT_EP,{authorization:"Bearer "+tk.access_token,"content-type":"application/json",mayeucau:maYeuCau,kybaocao:"06/2026"},records);
    const r=resp.body||{};
    const rec={ id, ts:Date.now(), svc, mode:cat.mode||"EVENT", count, maYeuCau, code:r.code, success:!!r.success, message:r.message, accepted:r.accepted??null, rejected:r.rejected||[], rejectedCount:r.rejectedCount||0, reqPreview:records[0] };
    DB.relays.unshift(rec); if(DB.relays.length>500) DB.relays.pop();
    tx("REPORT", svc, `중계 ${count}건 -> SIMO`, `code ${r.code} (수락 ${r.accepted}/${r.total})`);
    return send(200,{ id, svc, count, code:r.code, success:!!r.success, accepted:r.accepted, rejectedCount:r.rejectedCount, rejected:(r.rejected||[]).slice(0,15), reqPreview:records[0] });
  }
  if(p==="/api/relay/log" && req.method==="GET"){
    let items=DB.relays; if(q.svc) items=items.filter(x=>x.svc===q.svc);
    return send(200,{ total:items.length, items: items.slice(0,100).map(x=>({id:x.id,ts:x.ts,svc:x.svc,mode:x.mode,count:x.count,code:x.code,success:x.success,accepted:x.accepted,rejectedCount:x.rejectedCount,maYeuCau:x.maYeuCau})) });
  }
  if(/^\/api\/relay\/[^/]+$/.test(p) && req.method==="GET"){
    const id=p.split("/")[3]; const r=DB.relays.find(x=>x.id===id); if(!r) return send(404,{error:"not found"}); return send(200,r);
  }

  if(p==="/api/suspect/receive" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const mode=b.mode==="full"?"full":"delta";
    const since=mode==="full"?0:(DB.recvHist[0]?.cursor||0);
    const r=await callSimo("GET", mode==="full"?"/simo/blacklist/full":`/simo/blacklist/delta?since=${since}`, {});
    let add=0; (r.body.items||[]).forEach(it=>{ const ix=DB.suspect.findIndex(x=>x.identifier===it.identifier);
      if(it.op==="DELETE"){ if(ix>=0) DB.suspect.splice(ix,1); } else if(ix>=0){ DB.suspect[ix]={...it,delivered:true}; } else { DB.suspect.push({...it,delivered:true}); add++; } });
    DB.seq.recv++; const h={id:DB.seq.recv,mode,at:Date.now(),cursor:r.body.cursor,received:(r.body.items||[]).length,add,listSize:DB.suspect.length};
    DB.recvHist.unshift(h); tx("SUSPECT_RECV","-",`${mode} 수신 ${h.received}건 -> 코어 전달`,`보유 ${DB.suspect.length}`);
    return send(200,h);
  }
  if(p==="/api/suspect/list" && req.method==="GET"){
    const page=Math.max(1,Number(q.page||1)), size=Math.min(100,Number(q.size||12));
    return send(200,{ total:DB.suspect.length, page, size, items:DB.suspect.slice((page-1)*size,page*size) });
  }
  if(p==="/api/suspect/recv-history" && req.method==="GET") return send(200,{items:DB.recvHist});
  if(p==="/api/suspect/query" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const idn=(b.identifier||"").trim();
    const r=await callSimo("POST","/simo/check",{"content-type":"application/json"},{identifier:idn});
    const out=r.body||{};
    if(out.hit && !DB.suspect.find(x=>x.identifier===idn)) DB.suspect.push({entryId:out.entry.entryId,identifier:idn,kind:out.entry.kind,reason:out.entry.reason,op:"ADD",delivered:true,viaQuery:true});
    tx("SUSPECT_QUERY","-",`건별 조회 중계: ${idn}`, out.hit?("HIT "+out.entry.reason):"clean");
    return send(200,{ identifier:idn, hit:!!out.hit, entry:out.entry||null, listSize:DB.suspect.length });
  }

  if(p==="/api/screen" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const a=(b.account||"").trim();
    const hit=DB.suspect.find(x=>x.identifier===a);
    tx("SCREEN","-",`샘플 대조: ${a}`, hit?("HIT "+hit.reason):"clean");
    return send(200,{ account:a, hit:!!hit, entry:hit||null, listSize:DB.suspect.length });
  }

  if(p==="/api/txlog" && req.method==="GET") return send(200,{items:DB.txlog.slice(0,100)});

  if(p==="/api/stats" && req.method==="GET"){
    const sent=DB.relays.length;
    const relayedRecords=DB.relays.reduce((s,r)=>s+(r.count||0),0);
    const accepted=DB.relays.reduce((s,r)=>s+(r.accepted||0),0);
    const rejected=DB.relays.reduce((s,r)=>s+(r.rejectedCount||0),0);
    const byApi={}; DB.relays.forEach(r=>byApi[r.svc]=(byApi[r.svc]||0)+1);
    const seed=[6,11,9,14,8,17]; const trend=[...seed,sent];
    return send(200,{ relays:sent, relayedRecords, accepted, rejected, suspect:DB.suspect.length, recvCount:DB.recvHist.length, byApi, trend });
  }
  return null;
}

// ============================ HTTP ============================
function json(res,code,obj){ const s=JSON.stringify(obj); res.writeHead(code,{"content-type":"application/json; charset=utf-8","content-length":Buffer.byteLength(s)}); res.end(s); return true; }
function parseForm(b){ const o={}; (b||"").split("&").forEach(kv=>{const[k,v]=kv.split("="); if(k)o[decodeURIComponent(k)]=decodeURIComponent(v||"");}); return o; }
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json"};
function serveStatic(req,res,parsed){
  let rel=parsed.pathname==="/"?"/index.html":parsed.pathname;
  if(rel!=="/index.html" && rel!=="/app.js"){ res.writeHead(404,{"content-type":"text/plain"}); return res.end("404"); }
  const fp=path.join(__dirname, rel.replace(/^\//,""));
  fs.readFile(fp,(e,d)=>{ if(e){ res.writeHead(404); return res.end("404"); } res.writeHead(200,{"content-type":MIME[path.extname(fp)]||"text/plain"}); res.end(d); });
}
function readBody(req){ return new Promise(r=>{ let b=""; req.on("data",d=>b+=d); req.on("end",()=>r(b)); }); }

const server=http.createServer(async (req,res)=>{
  const parsed=new URL(req.url,`http://${HOST}:${PORT}`);
  parsed.query=Object.fromEntries(parsed.searchParams.entries()); parsed.pathname=decodeURIComponent(parsed.pathname);
  try{
    const body=(req.method==="POST"||req.method==="PUT")?await readBody(req):"";
    if(parsed.pathname==="/token"||parsed.pathname.startsWith("/simo/")){ if(mockSimo(req,res,parsed,body)!==null) return; }
    if(parsed.pathname.startsWith("/api/")){ const r=await gatewayApi(req,res,parsed,body); if(r) return; if(!res.writableEnded) return json(res,404,{error:"unknown api"}); return; }
    return serveStatic(req,res,parsed);
  }catch(e){ if(!res.writableEnded) json(res,500,{error:"server_error",message:String(e.message||e)}); }
});
server.listen(PORT,BIND,()=>console.log(`InfoPlus SIMO Relay GW PoC -> http://localhost:${PORT}`));
