/* =====================================================================
 * InfoPlus - SIMO Relay Gateway (PoC) - v2 operator console
 * Pure Node.js. Run: node server.js -> :8787
 * Relay model: Core Banking (source) -> InfoPlus GW (relay/log) -> SIMO.
 * Monitoring oriented: today status + date-range inquiry + drill-down.
 * In-memory, resets on restart. Seeded with ~7 days of history.
 * ===================================================================== */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8787;
const HOST = "127.0.0.1";
const BIND = "0.0.0.0";
const TZ = 7 * 3600 * 1000; // Asia/Ho_Chi_Minh offset for date grouping

const CRED = { key:"IBKVN_DEMO_KEY", secret:"IBKVN_DEMO_SECRET", user:"ibkvn_simo", pass:"demo#1234" };
const REPORT_EP = "/simo/tktt/1.0/upload-bao-cao-danh-sach-tktt-api";
const MAX_BATCH = 10000;

const API_CATALOG = [
  { code:"simo_001", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"BATCH", purpose:"개인 결제계좌 정기 수집(월간 신규)" },
  { code:"simo_002", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"EVENT", purpose:"개인 의심계좌 보고" },
  { code:"simo_003", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"EVENT", purpose:"개인 의심계좌 KYC 재점검 갱신" },
  { code:"simo_004", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"EVENT", purpose:"개인 계좌개설 고객정보 갱신" },
  { code:"simo_018", group:"TKTT-TC", target:"ACCOUNT_ORG", mode:"BATCH", purpose:"법인 결제계좌 정기 수집" },
  { code:"simo_019", group:"TKTT-TC", target:"ACCOUNT_ORG", mode:"EVENT", purpose:"법인 의심계좌 보고" },
  { code:"simo_007", group:"VDT",     target:"EWALLET",     mode:"EVENT", purpose:"의심 전자지갑 보고 (TGTT)" },
  { code:"simo_028", group:"DVCNTT",  target:"MERCHANT",    mode:"EVENT", purpose:"의심 가맹점 보고" }
];
const CAT = Object.fromEntries(API_CATALOG.map(a=>[a.code,a]));
const EVENT_SVCS = API_CATALOG.filter(a=>a.mode==="EVENT").map(a=>a.code);
const BATCH_SVCS = API_CATALOG.filter(a=>a.mode==="BATCH").map(a=>a.code);

const HO=["Nguyen","Tran","Le","Pham","Hoang","Vu","Dang","Bui","Do","Ho"];
const DEM=["Van","Thi","Hoang","Minh","Thu","Quang","Hai","Ngoc","Duc","Anh"];
const TEN=["An","Binh","Cuong","Dung","Ha","Khoa","Lan","Minh","Nam","Phuc","Quan","Son"];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pad=(n,l)=>String(n).padStart(l,"0");
const dkey=ts=>new Date(ts+TZ).toISOString().slice(0,10);
const todayKey=()=>dkey(Date.now());

function coreRecord(svc, defect){
  const sus=/00[234]|019|007|028/.test(svc);
  const r={ Cif:"CIF"+pad(ri(1,99999),5), SoID:pad(ri(100000000000,999999999999),12), LoaiID:rnd([1,1,3,4]),
    TenKhachHang:`${rnd(HO)} ${rnd(DEM)} ${rnd(TEN)}`, NgaySinh:`${pad(ri(1,28),2)}/${pad(ri(1,12),2)}/${ri(1975,2004)}`,
    GioiTinh:rnd([0,1]), SoDienThoaiDangKyDichVu:"09"+pad(ri(0,99999999),8),
    DiaChiKiemSoatTruyCap:"AC:DE:"+pad(ri(0,9999),4)+":"+pad(ri(0,99),2),
    SoTaiKhoan:"19"+pad(ri(100000000,999999999),8), LoaiTaiKhoan:1, TrangThaiHoatDongTaiKhoan: sus?rnd([3,4]):1,
    NgayMoTaiKhoan:`${pad(ri(1,28),2)}/06/2026`, QuocTich:"VN" };
  if(sus) r.NghiNgo=1;
  if(defect){ if(Math.random()<0.5) r.NgaySinh="1990-01-01"; else r.SoTaiKhoan=""; }
  return r;
}

const REASONS=["FRAUD_SUSPECT","MULE_ACCOUNT","REPORTED_POLICE","ABNORMAL_FLOW"];
const DEMO_BL=[
  {entryId:"S-DEMO01", identifier:"9988776655", kind:"ACCOUNT", reason:"FRAUD_SUSPECT"},
  {entryId:"S-DEMO02", identifier:"1234509876", kind:"ACCOUNT", reason:"REPORTED_POLICE"},
  {entryId:"S-DEMO03", identifier:"VDT8830021", kind:"EWALLET", reason:"MULE_ACCOUNT"},
  {entryId:"S-DEMO04", identifier:"9704061234567890", kind:"CARD", reason:"FRAUD_SUSPECT"}
];
function genMaster(n){
  const o=DEMO_BL.map(x=>({...x, version:1, removed:false, regAt:Date.now()-ri(1,90)*86400000, ts:Date.now()}));
  for(let i=0;i<n;i++){ const k=rnd(["ACCOUNT","ACCOUNT","ACCOUNT","EWALLET","CARD"]);
    const idn = k==="EWALLET"?("VDT"+pad(ri(1000000000,9999999999),10)) : k==="CARD"?("9704"+pad(ri(0,999999999999),12)) : ("19"+pad(ri(100000000,999999999),8));
    o.push({entryId:"S-"+pad(i+100,6), identifier:idn, kind:k, reason:rnd(REASONS), version:1, removed:false, regAt:Date.now()-ri(1,90)*86400000, ts:Date.now()}); }
  return o;
}

// ============================ STATE ============================
const DB = { relays:[], suspect:[], suspectMeta:{lastSync:null,version:0}, txlog:[], seq:{relay:0,tx:0} };
const SIMO = { received:[], master:genMaster(80), tokens:new Map(), refresh:new Map() };

function tx(type, svc, summary, result){ DB.seq.tx++; DB.txlog.unshift({id:DB.seq.tx, ts:new Date().toISOString(), type, svc:svc||"-", summary, result:result||"-"}); if(DB.txlog.length>800) DB.txlog.pop(); }

// seed ~7 days of relay history (synthetic results, not calling SIMO)
function seedRelays(){
  for(let d=6; d>=0; d--){
    const base=Date.now()-d*86400000;
    const num=ri(6,16);
    for(let i=0;i<num;i++){
      const ts=base - ri(0, 9*3600*1000) + ri(0,3600*1000);
      const svc=rnd(API_CATALOG).code; const cat=CAT[svc];
      const count = cat.mode==="BATCH"?ri(40,420):ri(1,3);
      const bad = Math.random()<0.16; const rejectedCount = bad?ri(1,Math.max(1,Math.floor(count*0.1))):0;
      DB.seq.relay++;
      DB.relays.push({ id:"RLY"+pad(DB.seq.relay,4), ts, svc, mode:cat.mode, count,
        code: rejectedCount?"01":"00", success: !rejectedCount, accepted: count-rejectedCount, rejectedCount,
        maYeuCau:"IBKVN-"+dkey(ts).replace(/-/g,"")+"-"+pad(DB.seq.relay,4), seeded:true });
    }
  }
  DB.relays.sort((a,b)=>b.ts-a.ts);
}
seedRelays();

const REQUIRED=["Cif","SoID","LoaiID","TenKhachHang","NgaySinh","GioiTinh","SoTaiKhoan","TrangThaiHoatDongTaiKhoan","NgayMoTaiKhoan","QuocTich","DiaChiKiemSoatTruyCap"];
function validateRecord(r){
  for(const f of REQUIRED){ if(r[f]===undefined||r[f]===null||r[f]==="") return {field:f,code:"ERR_REQUIRED"}; }
  if(!/^\d{2}\/\d{2}\/\d{4}$/.test(r.NgaySinh)) return {field:"NgaySinh",code:"ERR_DATE_FORMAT"};
  if(![0,1,2].includes(Number(r.GioiTinh))) return {field:"GioiTinh",code:"ERR_ENUM"};
  return null;
}

// ============================ MOCK SIMO ============================
function mockSimo(req,res,parsed,body){
  const p=parsed.pathname;
  if(p==="/token" && req.method==="POST"){
    const m=/^Basic\s+(.+)$/.exec(req.headers["authorization"]||""); let ok=false;
    if(m) ok=Buffer.from(m[1],"base64").toString("utf8")===`${CRED.key}:${CRED.secret}`;
    const f=parseForm(body); if(!ok) return json(res,401,{error:"invalid_client"});
    if(f.grant_type==="password"&&(f.username!==CRED.user||f.password!==CRED.pass)) return json(res,401,{error:"invalid_grant"});
    const t="ey"+crypto.randomBytes(16).toString("hex"); const ttl=Number(process.env.TOKEN_TTL||3600);
    SIMO.tokens.set(t,{exp:Date.now()+ttl*1000}); return json(res,200,{access_token:t,token_type:"Bearer",expires_in:ttl});
  }
  if(p===REPORT_EP && req.method==="POST"){
    const bm=/^Bearer\s+(.+)$/.exec(req.headers["authorization"]||""); const ti=bm?SIMO.tokens.get(bm[1]):null;
    if(!ti) return json(res,401,{code:"99",success:false,message:"Token khong hop le"});
    if(!req.headers["mayeucau"]) return json(res,400,{code:"10",success:false,message:"Thieu maYeuCau"});
    let arr; try{ arr=JSON.parse(body); }catch(e){ return json(res,400,{code:"20",success:false,message:"Body khong phai JSON"}); }
    if(!Array.isArray(arr)) return json(res,400,{code:"21",success:false});
    const rejected=[]; let acc=0; arr.forEach((r,i)=>{ const e=validateRecord(r); if(e) rejected.push({index:i,account:r.SoTaiKhoan||null,field:e.field,code:e.code}); else acc++; });
    SIMO.received.push({maYeuCau:req.headers["mayeucau"],total:arr.length,accepted:acc,at:Date.now()});
    const allok=rejected.length===0;
    return json(res,200,{code:allok?"00":"01",success:allok,message:allok?"Tiep nhan thanh cong":"Mot so ban ghi bi tu choi",total:arr.length,accepted:acc,rejectedCount:rejected.length,rejected});
  }
  if(p==="/simo/blacklist/full" && req.method==="GET"){
    const items=SIMO.master.filter(e=>!e.removed).map(e=>({entryId:e.entryId,identifier:e.identifier,kind:e.kind,reason:e.reason,regAt:e.regAt}));
    return json(res,200,{version:Date.now(), count:items.length, items});
  }
  if(p==="/simo/check" && req.method==="POST"){
    let b={}; try{ b=JSON.parse(body); }catch(e){}
    const idn=(b.identifier||"").trim(); const hit=SIMO.master.find(e=>e.identifier===idn && !e.removed);
    return json(res,200,{identifier:idn, hit:!!hit, entry: hit?{entryId:hit.entryId,kind:hit.kind,reason:hit.reason,regAt:hit.regAt}:null});
  }
  return null;
}
function callSimo(method,pathname,headers,body){
  return new Promise((resolve,reject)=>{ const data=body!=null?(typeof body==="string"?body:JSON.stringify(body)):null;
    const h=Object.assign({},headers); if(data) h["content-length"]=Buffer.byteLength(data);
    const r=http.request({host:HOST,port:PORT,path:pathname,method,headers:h},res=>{ let s=""; res.on("data",d=>s+=d); res.on("end",()=>{ let j; try{j=JSON.parse(s);}catch(e){j=s;} resolve({status:res.statusCode,body:j}); }); });
    r.on("error",reject); if(data) r.write(data); r.end(); });
}
async function getToken(){ const basic=Buffer.from(`${CRED.key}:${CRED.secret}`).toString("base64");
  const r=await callSimo("POST","/token",{authorization:"Basic "+basic,"content-type":"application/x-www-form-urlencoded"},`grant_type=password&username=${CRED.user}&password=${encodeURIComponent(CRED.pass)}`); return r.body; }

// ============================ GATEWAY API ============================
function summarize(list){ const s={count:list.length,ok:0,partial:0,fail:0,records:0,accepted:0,rejected:0};
  list.forEach(r=>{ if(r.code==="00")s.ok++; else if(r.code==="01")s.partial++; else s.fail++; s.records+=r.count||0; s.accepted+=r.accepted||0; s.rejected+=r.rejectedCount||0; }); return s; }

async function gatewayApi(req,res,parsed,body){
  const p=parsed.pathname, q=parsed.query; const send=(c,o)=>json(res,c,o);

  if(p==="/api/connection" && req.method==="GET")
    return send(200,{extranet:true,cert:true,tokenActive:SIMO.tokens.size>0,lastSync:DB.suspectMeta.lastSync,simoHost:"mgsimo.sbv.gov.vn (mock)"});
  if(p==="/api/apis" && req.method==="GET") return send(200,{items:API_CATALOG});

  // today's status
  if(p==="/api/relay/today" && req.method==="GET"){
    const tk=todayKey(); const list=DB.relays.filter(r=>dkey(r.ts)===tk);
    const perApi={}; list.forEach(r=>{ const a=perApi[r.svc]||(perApi[r.svc]={svc:r.svc,count:0,ok:0,partial:0,fail:0,records:0}); a.count++; a.records+=r.count; if(r.code==="00")a.ok++; else if(r.code==="01")a.partial++; else a.fail++; });
    return send(200,{ date:tk, summary:summarize(list), perApi:Object.values(perApi),
      recent:list.slice(0,30).map(r=>({id:r.id,ts:r.ts,svc:r.svc,mode:r.mode,count:r.count,code:r.code,accepted:r.accepted,rejectedCount:r.rejectedCount})) });
  }
  // date-range summary (per day)
  if(p==="/api/relay/by-date" && req.method==="GET"){
    const to=q.to||todayKey(); const from=q.from|| dkey(Date.now()-6*86400000);
    let list=DB.relays.filter(r=>{ const k=dkey(r.ts); return k>=from && k<=to; });
    if(q.svc) list=list.filter(r=>r.svc===q.svc);
    const byDay={}; list.forEach(r=>{ const k=dkey(r.ts); (byDay[k]||(byDay[k]=[])).push(r); });
    const rows=Object.keys(byDay).sort().reverse().map(k=>({date:k, ...summarize(byDay[k])}));
    return send(200,{ from, to, svc:q.svc||null, total:summarize(list), rows });
  }
  // one day's detail (time-ordered, optional API filter)
  if(p==="/api/relay/by-date/detail" && req.method==="GET"){
    const date=q.date||todayKey(); let list=DB.relays.filter(r=>dkey(r.ts)===date); if(q.svc) list=list.filter(r=>r.svc===q.svc);
    list=list.sort((a,b)=>b.ts-a.ts);
    return send(200,{ date, svc:q.svc||null, summary:summarize(list),
      items:list.map(r=>({id:r.id,ts:r.ts,svc:r.svc,mode:r.mode,count:r.count,code:r.code,accepted:r.accepted,rejectedCount:r.rejectedCount,maYeuCau:r.maYeuCau})) });
  }
  if(/^\/api\/relay\/[A-Za-z0-9]+$/.test(p) && req.method==="GET" && p!=="/api/relay/today"){
    const id=p.split("/")[3]; const r=DB.relays.find(x=>x.id===id); if(!r) return send(404,{error:"not found"}); return send(200,r);
  }
  // manual demo relay (core -> GW -> SIMO), real HTTP to mock SIMO
  if(p==="/api/relay/report" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const svc=b.svc||rnd(EVENT_SVCS); const cat=CAT[svc]||{mode:"EVENT"};
    const count=Math.max(1,Math.min(2000,Number(b.count|| (cat.mode==="BATCH"?ri(40,300):ri(1,3)) )));
    const records=[]; for(let i=0;i<count;i++) records.push(coreRecord(svc, count>4 && i%9===4));
    DB.seq.relay++; const id="RLY"+pad(DB.seq.relay,4); const maYeuCau="IBKVN-"+todayKey().replace(/-/g,"")+"-"+pad(DB.seq.relay,4);
    const tk=await getToken();
    const resp=await callSimo("POST",REPORT_EP,{authorization:"Bearer "+tk.access_token,"content-type":"application/json",mayeucau:maYeuCau,kybaocao:"06/2026"},records);
    const r=resp.body||{};
    const rec={ id, ts:Date.now(), svc, mode:cat.mode, count, code:r.code, success:!!r.success, accepted:r.accepted??null, rejected:r.rejected||[], rejectedCount:r.rejectedCount||0, maYeuCau, reqPreview:records[0] };
    DB.relays.unshift(rec); if(DB.relays.length>2000) DB.relays.pop();
    tx("REPORT", svc, `중계 ${count}건 -> SIMO`, `code ${r.code} (수락 ${r.accepted}/${r.total})`);
    return send(200,{ id, svc, count, code:r.code, accepted:r.accepted, rejectedCount:r.rejectedCount });
  }

  // suspect list (SIMO -> GW -> core)
  if(p==="/api/suspect/status" && req.method==="GET")
    return send(200,{ lastSync:DB.suspectMeta.lastSync, version:DB.suspectMeta.version, size:DB.suspect.length });
  if(p==="/api/suspect/sync" && req.method==="POST"){
    const r=await callSimo("GET","/simo/blacklist/full",{});
    const now=Date.now();
    DB.suspect=(r.body.items||[]).map(it=>({ identifier:it.identifier, kind:it.kind, reason:it.reason, regAt:it.regAt, source:"SYNC" }));
    DB.suspectMeta={ lastSync:now, version:DB.suspectMeta.version+1 };
    tx("SUSPECT_SYNC","-",`전체 동기화 ${DB.suspect.length}건 -> 코어 전달`,`v${DB.suspectMeta.version}`);
    return send(200,{ lastSync:now, version:DB.suspectMeta.version, size:DB.suspect.length });
  }
  if(p==="/api/suspect/list" && req.method==="GET"){
    let list=DB.suspect; if(q.q){ const s=q.q.toLowerCase(); list=list.filter(x=>x.identifier.toLowerCase().includes(s)); }
    const page=Math.max(1,Number(q.page||1)), size=Math.min(100,Number(q.size||12));
    return send(200,{ total:list.length, page, size, lastSync:DB.suspectMeta.lastSync, version:DB.suspectMeta.version, items:list.slice((page-1)*size,page*size) });
  }
  if(p==="/api/suspect/check" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const idn=(b.identifier||"").trim();
    const r=await callSimo("POST","/simo/check",{"content-type":"application/json"},{identifier:idn}); const out=r.body||{};
    if(out.hit && !DB.suspect.find(x=>x.identifier===idn)) DB.suspect.unshift({identifier:idn, kind:out.entry.kind, reason:out.entry.reason, regAt:out.entry.regAt, source:"QUERY"});
    tx("SUSPECT_CHECK","-",`건별 SIMO 확인: ${idn}`, out.hit?("등록 "+out.entry.reason):"미등록");
    return send(200,{ identifier:idn, hit:!!out.hit, entry:out.entry||null, size:DB.suspect.length });
  }

  if(p==="/api/screen" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const a=(b.account||"").trim(); const hit=DB.suspect.find(x=>x.identifier===a);
    tx("SCREEN","-",`샘플 대조: ${a}`, hit?("일치 "+hit.reason):"미일치");
    return send(200,{ account:a, hit:!!hit, entry:hit||null, size:DB.suspect.length });
  }
  if(p==="/api/txlog" && req.method==="GET") return send(200,{items:DB.txlog.slice(0,120)});

  if(p==="/api/stats" && req.method==="GET"){
    const tk=todayKey(); const today=summarize(DB.relays.filter(r=>dkey(r.ts)===tk));
    const days=[]; for(let d=6; d>=0; d--){ const k=dkey(Date.now()-d*86400000); days.push(DB.relays.filter(r=>dkey(r.ts)===k).length); }
    return send(200,{ today, totalRelays:DB.relays.length, totalRecords:DB.relays.reduce((s,r)=>s+(r.count||0),0),
      suspect:DB.suspect.length, lastSync:DB.suspectMeta.lastSync, suspectVersion:DB.suspectMeta.version, trend:days });
  }
  return null;
}

// ============================ HTTP ============================
function json(res,code,obj){ const s=JSON.stringify(obj); res.writeHead(code,{"content-type":"application/json; charset=utf-8","content-length":Buffer.byteLength(s)}); res.end(s); return true; }
function parseForm(b){ const o={}; (b||"").split("&").forEach(kv=>{const[k,v]=kv.split("="); if(k)o[decodeURIComponent(k)]=decodeURIComponent(v||"");}); return o; }
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8"};
function serveStatic(req,res,parsed){
  let rel=parsed.pathname==="/"?"/index.html":parsed.pathname;
  if(rel!=="/index.html" && rel!=="/app.js"){ res.writeHead(404,{"content-type":"text/plain"}); return res.end("404"); }
  fs.readFile(path.join(__dirname, rel.replace(/^\//,"")),(e,d)=>{ if(e){res.writeHead(404);return res.end("404");} res.writeHead(200,{"content-type":MIME[path.extname(rel)]||"text/plain"}); res.end(d); });
}
function readBody(req){ return new Promise(r=>{ let b=""; req.on("data",d=>b+=d); req.on("end",()=>r(b)); }); }
const server=http.createServer(async (req,res)=>{
  const parsed=new URL(req.url,`http://${HOST}:${PORT}`); parsed.query=Object.fromEntries(parsed.searchParams.entries()); parsed.pathname=decodeURIComponent(parsed.pathname);
  try{ const body=(req.method==="POST"||req.method==="PUT")?await readBody(req):"";
    if(parsed.pathname==="/token"||parsed.pathname.startsWith("/simo/")){ if(mockSimo(req,res,parsed,body)!==null) return; }
    if(parsed.pathname.startsWith("/api/")){ const r=await gatewayApi(req,res,parsed,body); if(r) return; if(!res.writableEnded) return json(res,404,{error:"unknown api"}); return; }
    return serveStatic(req,res,parsed);
  }catch(e){ if(!res.writableEnded) json(res,500,{error:"server_error",message:String(e.message||e)}); }
});
server.listen(PORT,BIND,()=>console.log(`InfoPlus SIMO Relay GW v2 -> http://localhost:${PORT}`));
