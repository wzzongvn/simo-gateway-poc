/* =====================================================================
 * InfoPlus — SIMO Reporting Gateway · PoC server
 * Pure Node.js (no external packages). Run:  node server.js
 * Then open http://localhost:8787
 *
 * One process hosts BOTH:
 *   (A) Mock SBV SIMO    — /token, /simo/...   (real OAuth + validation)
 *   (B) Gateway backend  — /api/...            (calls A over real HTTP)
 *   (C) Static Portal    — /                   (public/)
 * State is in-memory (resets on restart) + seeded.
 * ===================================================================== */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8787;
const HOST = "127.0.0.1";
const BIND = "0.0.0.0";

// ---- credentials (as if issued by NHNN via Mau 01) ----
const CRED = { key: "IBKVN_DEMO_KEY", secret: "IBKVN_DEMO_SECRET", user: "ibkvn_simo", pass: "demo#1234" };
const REPORT_EP = "/simo/tktt/1.0/upload-bao-cao-danh-sach-tktt-api";
const MAX_BATCH = 10000;

// ============================ SEED DATA ============================
const HO = ["Nguyen","Tran","Le","Pham","Hoang","Vu","Dang","Bui","Do","Ho","Ngo","Duong","Ly","Phan","Vo"];
const DEM = ["Van","Thi","Hoang","Minh","Thu","Quang","Hai","Ngoc","Duc","Anh","Thanh","Gia","Khanh","Bao"];
const TEN = ["An","Binh","Cuong","Dung","Duc","Ha","Huong","Khoa","Lan","Minh","Nam","Oanh","Phuc","Quan","Son","Trang","Uyen","Vy","Yen","Tu"];
function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
function pad(n,l){ return String(n).padStart(l,"0"); }

function genAccounts(n){
  const out=[];
  for(let i=0;i<n;i++){
    const susp = Math.random()<0.14;
    const broken = susp && Math.random()<0.25;        // some suspicious rows have data issues -> reject demo
    const acct = "19" + pad(Math.floor(Math.random()*900000000)+100000000,8);
    const y = 1975 + Math.floor(Math.random()*30);
    const rec = {
      Cif: "CIF" + pad(i+1,5),
      SoID: pad(Math.floor(Math.random()*900000000000)+100000000000,12),
      LoaiID: rnd([1,1,1,3,4,6]),
      TenKhachHang: `${rnd(HO)} ${rnd(DEM)} ${rnd(TEN)}`,
      NgaySinh: `${pad(1+Math.floor(Math.random()*28),2)}/${pad(1+Math.floor(Math.random()*12),2)}/${y}`,
      GioiTinh: rnd([0,1,1]),
      SoDienThoaiDangKyDichVu: "09" + pad(Math.floor(Math.random()*90000000),8),
      DiaChiKiemSoatTruyCap: "AC:DE:" + pad(Math.floor(Math.random()*9999),4) + ":" + pad(Math.floor(Math.random()*99),2),
      SoTaiKhoan: acct,
      LoaiTaiKhoan: rnd([1,1,2]),
      TrangThaiHoatDongTaiKhoan: susp ? rnd([3,4]) : 1,
      NgayMoTaiKhoan: `${pad(1+Math.floor(Math.random()*28),2)}/06/2026`,
      PhuongThucMoTaiKhoan: rnd([1,2]),
      QuocTich: "VN",
      _type: susp ? "SUSPECT" : "REGULAR"
    };
    if(broken){ // introduce a validation defect
      if(Math.random()<0.5){ rec.NgaySinh = "1990-01-01"; rec._defect="DATE"; }
      else { rec.SoTaiKhoan = ""; rec._defect="ACCT"; }
    }
    out.push(rec);
  }
  return out;
}

const REASONS = ["FRAUD_SUSPECT","MULE_ACCOUNT","REPORTED_POLICE","ABNORMAL_FLOW"];
function genMasterBlacklist(n){
  const out=[];
  for(let i=0;i<n;i++){
    const isAcct = Math.random()<0.85;
    out.push({ entryId:"S-"+pad(i+1,6), identifier:(isAcct?"":"VDT")+pad(Math.floor(Math.random()*9000000000)+1000000000,10),
      kind: isAcct?"ACCOUNT":"EWALLET", reason: rnd(REASONS), version:1, removed:false, ts: Date.now() });
  }
  return out;
}

// known demo accounts guaranteed on blacklist (for the warning sim)
const DEMO_BL = [
  { entryId:"S-DEMO01", identifier:"9988776655", kind:"ACCOUNT", reason:"FRAUD_SUSPECT", version:1, removed:false, ts:Date.now() },
  { entryId:"S-DEMO02", identifier:"1234509876", kind:"ACCOUNT", reason:"REPORTED_POLICE", version:1, removed:false, ts:Date.now() },
  { entryId:"S-DEMO03", identifier:"VDT8830021", kind:"EWALLET", reason:"MULE_ACCOUNT", version:1, removed:false, ts:Date.now() }
];

// ============================ STATE ============================
const DB = {
  accounts: genAccounts(480),
  reports: [],          // gateway-side report batches
  blacklist: [],        // gateway-side synced suspicious list (delivered to "core")
  syncHistory: [],
  audit: [],
  seq: { report:0, sync:0, audit:0 }
};
const SIMO = {
  received: [],                         // batches accepted by mock SIMO
  master: [...DEMO_BL, ...genMasterBlacklist(60)],   // SIMO master suspicious list
  tokens: new Map(),                    // access_token -> {exp}
  refresh: new Map()                    // refresh_token -> consumer
};

function audit(role, action, detail){
  DB.seq.audit++;
  DB.audit.unshift({ id:DB.seq.audit, ts:new Date().toISOString(), role, action, detail });
  if(DB.audit.length>500) DB.audit.pop();
}

// ============================ VALIDATION ============================
const REQUIRED = ["Cif","SoID","LoaiID","TenKhachHang","NgaySinh","GioiTinh","SoTaiKhoan","TrangThaiHoatDongTaiKhoan","NgayMoTaiKhoan","QuocTich","DiaChiKiemSoatTruyCap"];
function validateRecord(r){
  for(const f of REQUIRED){ if(r[f]===undefined||r[f]===null||r[f]==="") return {field:f, code:"ERR_REQUIRED"}; }
  if(!/^\d{2}\/\d{2}\/\d{4}$/.test(r.NgaySinh)) return {field:"NgaySinh", code:"ERR_DATE_FORMAT"};
  if(!/^\d{2}\/\d{2}\/\d{4}$/.test(r.NgayMoTaiKhoan)) return {field:"NgayMoTaiKhoan", code:"ERR_DATE_FORMAT"};
  if(![0,1,2].includes(Number(r.GioiTinh))) return {field:"GioiTinh", code:"ERR_ENUM"};
  if(![1,2,3,4,5].includes(Number(r.TrangThaiHoatDongTaiKhoan))) return {field:"TrangThaiHoatDongTaiKhoan", code:"ERR_ENUM"};
  if(String(r.SoTaiKhoan).length>36) return {field:"SoTaiKhoan", code:"ERR_LEN"};
  return null;
}

// ============================ MOCK SIMO (B calls this over HTTP) ============================
function mockSimo(req,res,parsed,body){
  const p = parsed.pathname;
  // ---- token ----
  if(p==="/token" && req.method==="POST"){
    const auth = req.headers["authorization"]||"";
    const m = /^Basic\s+(.+)$/.exec(auth);
    let okBasic=false;
    if(m){ const dec=Buffer.from(m[1],"base64").toString("utf8"); okBasic = dec===`${CRED.key}:${CRED.secret}`; }
    const form = parseForm(body);
    if(!okBasic) return json(res,401,{error:"invalid_client", error_description:"consumer-key/secret mismatch"});
    if(form.grant_type==="password"){
      if(form.username!==CRED.user || form.password!==CRED.pass) return json(res,401,{error:"invalid_grant"});
    } else if(form.grant_type==="refresh_token"){
      if(!SIMO.refresh.has(form.refresh_token)) return json(res,401,{error:"invalid_grant", error_description:"bad refresh_token"});
    } else return json(res,400,{error:"unsupported_grant_type"});
    const tok = "ey" + crypto.randomBytes(18).toString("hex");
    const rtok = "rt" + crypto.randomBytes(14).toString("hex");
    const expires_in = Number(process.env.TOKEN_TTL||3600);
    SIMO.tokens.set(tok, { exp: Date.now()+expires_in*1000 });
    SIMO.refresh.set(rtok, CRED.user);
    return json(res,200,{ access_token:tok, refresh_token:rtok, token_type:"Bearer", scope:"simo.report", expires_in });
  }
  // ---- report upload ----
  if(p===REPORT_EP && req.method==="POST"){
    const auth = req.headers["authorization"]||"";
    const bm = /^Bearer\s+(.+)$/.exec(auth);
    const tokenInfo = bm ? SIMO.tokens.get(bm[1]) : null;
    if(!tokenInfo) return json(res,401,{code:"99", success:false, message:"Token khong hop le"});
    if(Date.now()>tokenInfo.exp){ SIMO.tokens.delete(bm[1]); return json(res,401,{code:"98", success:false, message:"Token da het han"}); }
    if(!req.headers["mayeucau"]) return json(res,400,{code:"10", success:false, message:"Thieu header maYeuCau"});
    if(!req.headers["kybaocao"]) return json(res,400,{code:"11", success:false, message:"Thieu header kyBaoCao"});
    let arr; try{ arr=JSON.parse(body); }catch(e){ return json(res,400,{code:"20", success:false, message:"Body khong phai JSON"}); }
    if(!Array.isArray(arr)) return json(res,400,{code:"21", success:false, message:"Body phai la JSON array"});
    if(arr.length>MAX_BATCH) return json(res,400,{code:"22", success:false, message:`Vuot qua ${MAX_BATCH} ban ghi`});
    const rejected=[]; let accepted=0;
    arr.forEach((r,i)=>{ const e=validateRecord(r); if(e){ rejected.push({index:i, account:r.SoTaiKhoan||null, field:e.field, code:e.code}); } else accepted++; });
    SIMO.received.push({ maYeuCau:req.headers["mayeucau"], kyBaoCao:req.headers["kybaocao"], total:arr.length, accepted, at:Date.now() });
    const allOk = rejected.length===0;
    return json(res, 200, { code: allOk?"00":"01", success: allOk, message: allOk?"Tiep nhan thanh cong":"Mot so ban ghi bi tu choi", total:arr.length, accepted, rejectedCount:rejected.length, rejected });
  }
  // ---- blacklist delta ----
  if(p==="/simo/blacklist/delta" && req.method==="GET"){
    const since = Number(parsed.query.since||0);
    const delta = SIMO.master.filter(e=> e.ts>since).map(e=>({ entryId:e.entryId, identifier:e.identifier, kind:e.kind, reason:e.reason, op: e.removed?"DELETE":(e.version>1?"UPDATE":"ADD") }));
    return json(res,200,{ cursor: Date.now(), count: delta.length, items: delta });
  }
  if(p==="/simo/blacklist/full" && req.method==="GET"){
    const items = SIMO.master.filter(e=>!e.removed).map(e=>({ entryId:e.entryId, identifier:e.identifier, kind:e.kind, reason:e.reason, op:"ADD" }));
    return json(res,200,{ cursor: Date.now(), count: items.length, items });
  }
  return null; // not a SIMO route
}

// helper: gateway -> mock SIMO real HTTP call
function callSimo(method, pathname, headers, body){
  return new Promise((resolve,reject)=>{
    const data = body!==undefined && body!==null ? (typeof body==="string"?body:JSON.stringify(body)) : null;
    const h = Object.assign({}, headers);
    if(data) h["content-length"] = Buffer.byteLength(data);
    const req = http.request({ host:HOST, port:PORT, path:pathname, method, headers:h }, r=>{
      let buf=""; r.on("data",d=>buf+=d); r.on("end",()=>{ let j; try{j=JSON.parse(buf);}catch(e){j=buf;} resolve({status:r.statusCode, body:j}); });
    });
    req.on("error",reject);
    if(data) req.write(data);
    req.end();
  });
}
async function getToken(){
  const basic = Buffer.from(`${CRED.key}:${CRED.secret}`).toString("base64");
  const r = await callSimo("POST","/token",{ "authorization":"Basic "+basic, "content-type":"application/x-www-form-urlencoded" },
    `grant_type=password&username=${CRED.user}&password=${encodeURIComponent(CRED.pass)}`);
  return r.body;
}

// ============================ GATEWAY API ============================
async function gatewayApi(req,res,parsed,body){
  const p = parsed.pathname; const q = parsed.query; const role = req.headers["x-role"]||"maker";
  const send = (code,obj)=>json(res,code,obj);

  if(p==="/api/connection" && req.method==="GET"){
    return send(200,{ extranet:true, cert:true, tokenActive: SIMO.tokens.size>0, lastSync: DB.syncHistory[0]?.at||null, simoHost:"mgsimo.sbv.gov.vn (mock)" });
  }
  if(p==="/api/accounts" && req.method==="GET"){
    let list = DB.accounts;
    if(q.type==="SUSPECT"||q.type==="REGULAR") list=list.filter(a=>a._type===q.type);
    if(q.q){ const s=q.q.toLowerCase(); list=list.filter(a=>a.TenKhachHang.toLowerCase().includes(s)||a.SoTaiKhoan.includes(q.q)||a.Cif.toLowerCase().includes(s)); }
    const page=Math.max(1,Number(q.page||1)), size=Math.min(100,Number(q.size||10));
    const total=list.length, items=list.slice((page-1)*size, page*size);
    return send(200,{ total, page, size, regular:DB.accounts.filter(a=>a._type==="REGULAR").length, suspect:DB.accounts.filter(a=>a._type==="SUSPECT").length, items });
  }
  if(p==="/api/reports/build" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const svc=b.svc||"simo_001"; const ky=b.ky||"06/2026";
    let rows = DB.accounts;
    if(svc==="simo_002") rows=rows.filter(a=>a._type==="SUSPECT");
    rows = rows.slice(0, b.limit||rows.length);
    DB.seq.report++;
    const id="RPT"+pad(DB.seq.report,4);
    const maYeuCau = "IBKVN-"+new Date().toISOString().slice(0,10).replace(/-/g,"")+"-"+pad(DB.seq.report,4);
    const records = rows.map(stripRecord);
    DB.reports.unshift({ id, svc, ky, maYeuCau, count:records.length, records, status:"DRAFT", maker:role, checker:null, response:null, rejected:[], retries:0, createdAt:Date.now() });
    audit(role,"BUILD",`${id} ${svc} ${records.length} recs`);
    return send(200,{ id, svc, ky, maYeuCau, count:records.length, sample:records.slice(0,3) });
  }
  if(/^\/api\/reports\/[^/]+\/approve$/.test(p) && req.method==="POST"){
    const id=p.split("/")[3]; const r=DB.reports.find(x=>x.id===id); if(!r) return send(404,{error:"not found"});
    if(role!=="checker"&&role!=="admin") return send(403,{error:"NEED_CHECKER", message:"approve requires checker role"});
    if(r.maker===role && role!=="admin") return send(403,{error:"SEGREGATION", message:"maker and checker must differ"});
    r.status="APPROVED"; r.checker=role; audit(role,"APPROVE",id);
    return send(200,{ id, status:r.status, checker:role });
  }
  if(/^\/api\/reports\/[^/]+\/send$/.test(p) && req.method==="POST"){
    const id=p.split("/")[3]; const r=DB.reports.find(x=>x.id===id); if(!r) return send(404,{error:"not found"});
    if(r.status!=="APPROVED"&&r.status!=="FAILED"&&r.status!=="PARTIAL") return send(409,{error:"NOT_APPROVED", message:"approve before send"});
    const tk = await getToken(); audit(role,"TOKEN","issued");
    const resp = await callSimo("POST", REPORT_EP,
      { "authorization":"Bearer "+tk.access_token, "content-type":"application/json", "mayeucau":r.maYeuCau, "kybaocao":r.ky }, r.records);
    r.response=resp.body;
    if(resp.body.code==="00"){ r.status="SENT"; r.rejected=[]; }
    else if(resp.body.code==="01"){ r.status="PARTIAL"; r.rejected=resp.body.rejected||[]; }
    else { r.status="FAILED"; }
    r.sentAt=Date.now();
    audit(role,"SEND",`${id} -> code ${resp.body.code} (accepted ${resp.body.accepted}/${resp.body.total})`);
    return send(200,{ id, status:r.status, response:resp.body });
  }
  if(/^\/api\/reports\/[^/]+\/retry$/.test(p) && req.method==="POST"){
    const id=p.split("/")[3]; const r=DB.reports.find(x=>x.id===id); if(!r) return send(404,{error:"not found"});
    r.records = r.records.map(fixRecord); r.retries++; r.status="APPROVED";
    audit(role,"RETRY",`${id} retry#${r.retries} (records corrected)`);
    return send(200,{ id, retries:r.retries, status:r.status, note:"records corrected; ready to resend" });
  }
  if(p==="/api/reports" && req.method==="GET"){
    const items = DB.reports.map(r=>({ id:r.id, svc:r.svc, ky:r.ky, maYeuCau:r.maYeuCau, count:r.count, status:r.status, maker:r.maker, checker:r.checker, retries:r.retries,
      code:r.response?.code||null, accepted:r.response?.accepted??null, rejectedCount:r.rejected?.length||0, createdAt:r.createdAt, sentAt:r.sentAt||null }));
    return send(200,{ total:items.length, items });
  }
  if(/^\/api\/reports\/[^/]+$/.test(p) && req.method==="GET"){
    const id=p.split("/")[3]; const r=DB.reports.find(x=>x.id===id); if(!r) return send(404,{error:"not found"});
    return send(200,r);
  }
  if(p==="/api/sync" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const mode=b.mode||"delta";
    const since = mode==="full"?0:(DB.syncHistory[0]?.cursor||0);
    const r = await callSimo("GET", mode==="full"?"/simo/blacklist/full":`/simo/blacklist/delta?since=${since}`, {});
    let add=0,upd=0,del=0;
    (r.body.items||[]).forEach(it=>{
      const idx=DB.blacklist.findIndex(x=>x.identifier===it.identifier);
      if(it.op==="DELETE"){ if(idx>=0){ DB.blacklist.splice(idx,1); del++; } }
      else if(idx>=0){ DB.blacklist[idx]=it; upd++; } else { DB.blacklist.push(it); add++; }
    });
    DB.seq.sync++;
    const h={ id:DB.seq.sync, mode, at:Date.now(), cursor:r.body.cursor, received:(r.body.items||[]).length, add, upd, del, delivered:true, listSize:DB.blacklist.length };
    DB.syncHistory.unshift(h); audit(role,"SYNC",`${mode} +${add}/~${upd}/-${del} (list ${DB.blacklist.length})`);
    return send(200,h);
  }
  if(p==="/api/blacklist" && req.method==="GET"){
    const page=Math.max(1,Number(q.page||1)), size=Math.min(100,Number(q.size||10));
    const total=DB.blacklist.length, items=DB.blacklist.slice((page-1)*size,page*size);
    return send(200,{ total, page, size, items });
  }
  if(p==="/api/sync-history" && req.method==="GET"){ return send(200,{ items:DB.syncHistory }); }
  if(p==="/api/screen" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const acct=(b.account||"").trim();
    const hit = DB.blacklist.find(x=>x.identifier===acct);
    audit(role,"SCREEN",`${acct} -> ${hit?"HIT":"clean"}`);
    return send(200,{ account:acct, hit: !!hit, entry: hit||null, listSize:DB.blacklist.length });
  }
  if(p==="/api/stats" && req.method==="GET"){
    const byStatus={}; DB.reports.forEach(r=>byStatus[r.status]=(byStatus[r.status]||0)+1);
    const sent=DB.reports.filter(r=>r.status==="SENT"||r.status==="PARTIAL");
    const accepted=sent.reduce((s,r)=>s+(r.response?.accepted||0),0);
    const rejected=DB.reports.reduce((s,r)=>s+(r.rejected?.length||0),0);
    const seed=[8,14,11,19,9,22]; const trend=[...seed, accepted];
    return send(200,{ reports:DB.reports.length, byStatus, accepted, rejected, blacklist:DB.blacklist.length,
      accounts:DB.accounts.length, suspect:DB.accounts.filter(a=>a._type==="SUSPECT").length, trend });
  }
  if(p==="/api/audit" && req.method==="GET"){ return send(200,{ items: DB.audit.slice(0,80) }); }
  return null;
}
function stripRecord(a){ const o={...a}; delete o._type; delete o._defect; return o; }
function fixRecord(r){ const o={...r}; if(!/^\d{2}\/\d{2}\/\d{4}$/.test(o.NgaySinh)) o.NgaySinh="01/01/1990"; if(!o.SoTaiKhoan) o.SoTaiKhoan="19"+pad(Math.floor(Math.random()*90000000),8); return o; }

// ============================ HTTP PLUMBING ============================
function json(res,code,obj){ const s=JSON.stringify(obj); res.writeHead(code,{ "content-type":"application/json; charset=utf-8", "content-length":Buffer.byteLength(s) }); res.end(s); return true; }
function parseForm(b){ const o={}; (b||"").split("&").forEach(kv=>{ const [k,v]=kv.split("="); if(k) o[decodeURIComponent(k)]=decodeURIComponent(v||""); }); return o; }
const MIME={ ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json", ".png":"image/png", ".svg":"image/svg+xml" };
function serveStatic(req,res,parsed){
  let rel = parsed.pathname==="/" ? "/index.html" : parsed.pathname;
  const fp = path.join(__dirname,path.normalize(rel).replace(/^(\.\.[/\\])+/,""));
  fs.readFile(fp,(err,data)=>{ if(err){ res.writeHead(404,{"content-type":"text/plain"}); return res.end("404"); }
    res.writeHead(200,{ "content-type": MIME[path.extname(fp)]||"application/octet-stream" }); res.end(data); });
}
function readBody(req){ return new Promise(r=>{ let b=""; req.on("data",d=>b+=d); req.on("end",()=>r(b)); }); }

const server = http.createServer(async (req,res)=>{
  const parsed = new URL(req.url, `http://${HOST}:${PORT}`);
  parsed.query = Object.fromEntries(parsed.searchParams.entries());
  parsed.pathname = decodeURIComponent(parsed.pathname);
  try{
    const body = (req.method==="POST"||req.method==="PUT") ? await readBody(req) : "";
    if(parsed.pathname==="/token" || parsed.pathname.startsWith("/simo/")){ if(mockSimo(req,res,parsed,body)!==null) return; }
    if(parsed.pathname.startsWith("/api/")){ const r=await gatewayApi(req,res,parsed,body); if(r) return; if(!res.writableEnded) return json(res,404,{error:"unknown api"}); return; }
    return serveStatic(req,res,parsed);
  }catch(e){ if(!res.writableEnded) json(res,500,{error:"server_error", message:String(e.message||e)}); }
});
server.listen(PORT,BIND,()=>{ console.log(`InfoPlus SIMO Gateway PoC running -> http://localhost:${PORT}`); });
