/* InfoPlus - SIMO Relay Gateway (PoC) v3 - operator console. Pure Node. node server.js -> :8787 */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8787;
const HOST = "127.0.0.1";
const BIND = "0.0.0.0";
const TZ = 7 * 3600 * 1000;

const CRED = { key:"IBKVN_DEMO_KEY", secret:"IBKVN_DEMO_SECRET", user:"ibkvn_simo", pass:"demo#1234" };
const REPORT_EP = "/simo/tktt/1.0/upload-bao-cao-danh-sach-tktt-api";
const MAX_BATCH = 10000;

const API_CATALOG = [
  { code:"simo_001", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"BATCH", op:"PERIODIC", purpose:"개인 결제계좌 정기 수집(월간 신규)" },
  { code:"simo_002", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"EVENT", op:"SUSPECT", purpose:"개인 의심계좌 보고" },
  { code:"simo_003", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"EVENT", op:"SUSPECT_UPD", purpose:"개인 의심계좌 KYC 재점검 갱신" },
  { code:"simo_004", group:"TKTT-CN", target:"ACCOUNT_IND", mode:"EVENT", op:"INFO_UPD", purpose:"개인 계좌개설 고객정보 갱신" },
  { code:"simo_018", group:"TKTT-TC", target:"ACCOUNT_ORG", mode:"BATCH", op:"PERIODIC", purpose:"법인 결제계좌 정기 수집" },
  { code:"simo_019", group:"TKTT-TC", target:"ACCOUNT_ORG", mode:"EVENT", op:"SUSPECT", purpose:"법인 의심계좌 보고" },
  { code:"simo_007", group:"VDT",     target:"EWALLET",     mode:"EVENT", op:"SUSPECT", purpose:"의심 전자지갑 보고 (TGTT)" },
  { code:"simo_028", group:"DVCNTT",  target:"MERCHANT",    mode:"EVENT", op:"SUSPECT", purpose:"의심 가맹점 보고" }
];
const CAT = Object.fromEntries(API_CATALOG.map(a=>[a.code,a]));
const EVENT_SVCS = API_CATALOG.filter(a=>a.mode==="EVENT").map(a=>a.code);

const ACCOUNT_LAYOUT=[
 {no:1,name:"Cif",type:"String(36)",req:true,desc:"고객번호(CIF)"},
 {no:2,name:"SoID",type:"String(15)",req:true,desc:"신분증 번호"},
 {no:3,name:"LoaiID",type:"Integer",req:true,desc:"신분증 종류(1.시민카드 3.주민증 4.여권)"},
 {no:4,name:"TenKhachHang",type:"String(150)",req:true,desc:"고객명"},
 {no:5,name:"NgaySinh",type:"String(10)",req:true,desc:"생년월일 dd/MM/YYYY"},
 {no:6,name:"GioiTinh",type:"Integer",req:true,desc:"성별(0.여 1.남 2.기타)"},
 {no:7,name:"MaSoThue",type:"String(10/13)",req:false,desc:"납세자번호"},
 {no:8,name:"SoDienThoaiDangKyDichVu",type:"String(15)",req:true,desc:"모바일뱅킹 등록 전화"},
 {no:9,name:"DiaChi",type:"String(300)",req:false,desc:"상주 등록 주소"},
 {no:10,name:"DiaChiKiemSoatTruyCap",type:"String(60)",req:true,desc:"단말 MAC 주소"},
 {no:11,name:"MaSoNhanDangThietBiDiDong",type:"String(36)",req:false,desc:"단말 IMEI"},
 {no:12,name:"SoTaiKhoan",type:"String(36)",req:true,desc:"계좌번호"},
 {no:13,name:"LoaiTaiKhoan",type:"Integer",req:false,desc:"계좌종류(1.VND 2.외화)"},
 {no:14,name:"TrangThaiHoatDongTaiKhoan",type:"Integer",req:true,desc:"계좌상태(1.정상 3.잠금 4.동결 5.해지)"},
 {no:15,name:"NgayMoTaiKhoan",type:"String(10)",req:true,desc:"계좌개설일 dd/MM/YYYY"},
 {no:16,name:"PhuongThucMoTaiKhoan",type:"Integer",req:false,desc:"개설방식(1.창구 2.eKYC)"},
 {no:17,name:"NgayXacThucTaiQuay",type:"String(10)",req:false,desc:"창구 대면 인증일"},
 {no:18,name:"QuocTich",type:"String(36)",req:true,desc:"국적"}
];
const NGHINGO_FIELD={no:19,name:"NghiNgo",type:"Integer",req:true,desc:"사기의심 플래그(1)"};
function layoutFor(svc){ const op=CAT[svc]?CAT[svc].op:""; const l=ACCOUNT_LAYOUT.slice(); if(/SUSPECT/.test(op)) l.push(NGHINGO_FIELD); return l; }
const SUSPECT_LAYOUT=[
 {name:"identifier",desc:"계좌·지갑번호 (식별자/대조 키)"},
 {name:"kind",desc:"유형 (ACCOUNT 계좌 / EWALLET 전자지갑 / CARD 카드)"},
 {name:"TenKhachHang",desc:"명의(있을 경우)"},
 {name:"reason",desc:"등록 사유 코드"},
 {name:"regAt",desc:"SIMO 등록일"},
 {name:"source",desc:"확보 경로 (SYNC 동기화 / QUERY 건별 확인)"}
];

const HO=["Nguyen","Tran","Le","Pham","Hoang","Vu","Dang","Bui","Do","Ho"];
const DEM=["Van","Thi","Hoang","Minh","Thu","Quang","Hai","Ngoc","Duc","Anh"];
const TEN=["An","Binh","Cuong","Dung","Ha","Khoa","Lan","Minh","Nam","Phuc","Quan","Son"];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pad=(n,l)=>String(n).padStart(l,"0");
const dkey=ts=>new Date(ts+TZ).toISOString().slice(0,10);
const todayKey=()=>dkey(Date.now());
const vname=()=>rnd(HO)+" "+rnd(DEM)+" "+rnd(TEN);
// deterministic PRNG so a relay's full record set regenerates identically on every detail/page/search call
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function hseed(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
const rndR=(g,a)=>a[Math.floor(g()*a.length)];
const riR=(g,a,b)=>a+Math.floor(g()*(b-a+1));
const vnameR=g=>rndR(g,HO)+" "+rndR(g,DEM)+" "+rndR(g,TEN);

const REASONS=["FRAUD_SUSPECT","MULE_ACCOUNT","REPORTED_POLICE","ABNORMAL_FLOW"];
function coreRecord(svc, defect, g){ g=g||Math.random;
  const op=CAT[svc]?CAT[svc].op:""; const sus=/SUSPECT/.test(op);
  const r={ Cif:"CIF"+pad(riR(g,1,99999),5), SoID:pad(riR(g,100000000000,999999999999),12), LoaiID:rndR(g,[1,1,3,4]),
    TenKhachHang:vnameR(g), NgaySinh:pad(riR(g,1,28),2)+"/"+pad(riR(g,1,12),2)+"/"+riR(g,1975,2004), GioiTinh:rndR(g,[0,1]),
    MaSoThue: g()<0.5? pad(riR(g,1000000000,9999999999),10):"",
    SoDienThoaiDangKyDichVu:"09"+pad(riR(g,0,99999999),8),
    DiaChi: g()<0.7? rndR(g,["Q1, TP.HCM","Cau Giay, Ha Noi","Hai Chau, Da Nang"]) : "",
    DiaChiKiemSoatTruyCap:"AC:DE:"+pad(riR(g,0,9999),4)+":"+pad(riR(g,0,99),2),
    MaSoNhanDangThietBiDiDong: g()<0.6? pad(riR(g,100000000000000,999999999999999),15):"",
    SoTaiKhoan:"19"+pad(riR(g,100000000,999999999),8), LoaiTaiKhoan:rndR(g,[1,1,2]),
    TrangThaiHoatDongTaiKhoan: sus?rndR(g,[3,4]):1, NgayMoTaiKhoan:pad(riR(g,1,28),2)+"/06/2026",
    PhuongThucMoTaiKhoan:rndR(g,[1,2]), NgayXacThucTaiQuay:"", QuocTich:"VN" };
  if(sus) r.NghiNgo=1;
  if(defect){ if(g()<0.5) r.NgaySinh="1990-01-01"; else r.SoTaiKhoan=""; }
  return r;
}
// per-relay deterministic record + defect injection (regenerable from stored relay meta)
function isDefect(relay,i){ if(relay.count<=4) return false; return mulberry32(hseed(relay.id+":d:"+i))() < 0.02; }
function genRecord(relay,i){ return coreRecord(relay.svc, isDefect(relay,i), mulberry32(hseed(relay.id+":"+i))); }
function relayRejects(relay){ const rej=[]; for(let i=0;i<relay.count;i++){ const r=genRecord(relay,i); const e=validateRecord(r); if(e) rej.push({index:i,account:r.SoTaiKhoan||null,field:e.field,code:e.code}); } return rej; }
const DEMO_BL=[
  {entryId:"S-DEMO01", identifier:"9988776655", kind:"ACCOUNT", reason:"FRAUD_SUSPECT", TenKhachHang:"Le Van Mule"},
  {entryId:"S-DEMO02", identifier:"1234509876", kind:"ACCOUNT", reason:"REPORTED_POLICE", TenKhachHang:"Tran Thi Scam"},
  {entryId:"S-DEMO03", identifier:"VDT8830021", kind:"EWALLET", reason:"MULE_ACCOUNT", TenKhachHang:""},
  {entryId:"S-DEMO04", identifier:"9704061234567890", kind:"CARD", reason:"FRAUD_SUSPECT", TenKhachHang:""}
];
function genMaster(n){
  const o=DEMO_BL.map(x=>Object.assign({}, x, {version:1, removed:false, regAt:Date.now()-ri(1,90)*86400000, status:"ACTIVE"}));
  for(let i=0;i<n;i++){ const k=rnd(["ACCOUNT","ACCOUNT","ACCOUNT","EWALLET","CARD"]);
    const idn=k==="EWALLET"?("VDT"+pad(ri(1000000000,9999999999),10)):k==="CARD"?("9704"+pad(ri(0,999999999999),12)):("19"+pad(ri(100000000,999999999),8));
    o.push({entryId:"S-"+pad(i+100,6), identifier:idn, kind:k, reason:rnd(REASONS), TenKhachHang:k==="ACCOUNT"?vname():"", version:1, removed:false, regAt:Date.now()-ri(1,90)*86400000, status:"ACTIVE"}); }
  return o;
}

const DB = { relays:[], suspect:[], suspectMeta:{lastSync:null,version:0,lastRecv:0,lastDeliver:0}, recvHist:[], txlog:[], seq:{relay:0,tx:0,recv:0} };
const SIMO = { received:[], master:genMaster(80), tokens:new Map() };
function tx(type, svc, summary, result){ DB.seq.tx++; DB.txlog.unshift({id:DB.seq.tx, ts:new Date().toISOString(), type, svc:svc||"-", summary, result:result||"-"}); if(DB.txlog.length>800) DB.txlog.pop(); }

const REQUIRED=["Cif","SoID","LoaiID","TenKhachHang","NgaySinh","GioiTinh","SoTaiKhoan","TrangThaiHoatDongTaiKhoan","NgayMoTaiKhoan","QuocTich","DiaChiKiemSoatTruyCap"];
function validateRecord(r){
  for(let i=0;i<REQUIRED.length;i++){ const f=REQUIRED[i]; if(r[f]===undefined||r[f]===null||r[f]==="") return {field:f,code:"ERR_REQUIRED"}; }
  if(!/^\d{2}\/\d{2}\/\d{4}$/.test(r.NgaySinh)) return {field:"NgaySinh",code:"ERR_DATE_FORMAT"};
  if([0,1,2].indexOf(Number(r.GioiTinh))<0) return {field:"GioiTinh",code:"ERR_ENUM"};
  return null;
}
function makeRelay(svc, count, ts){
  const cat=CAT[svc]||{mode:"EVENT"};
  DB.seq.relay++; const id="RLY"+pad(DB.seq.relay,4);
  const r={ id, ts, svc, mode:cat.mode, count,
    maYeuCau:"IBKVN-"+dkey(ts).replace(/-/g,"")+"-"+pad(DB.seq.relay,4), kyBaoCao:"06/2026" };
  const rej=relayRejects(r);                       // full set generated deterministically; counts are exact
  r.rejected=rej; r.rejectedCount=rej.length; r.accepted=count-rej.length;
  r.code=rej.length?"01":"00"; r.success=!rej.length;
  return r;
}
(function seed(){ for(let d=6;d>=0;d--){ const base=Date.now()-d*86400000; const num=ri(6,16);
  for(let i=0;i<num;i++){ const ts=base-ri(0,9*3600*1000)+ri(0,3600*1000); const svc=rnd(API_CATALOG).code;
    const count=CAT[svc].mode==="BATCH"?ri(40,420):ri(1,3); DB.relays.push(makeRelay(svc,count,ts)); } }
  DB.relays.sort((a,b)=>b.ts-a.ts); })();

function mockSimo(req,res,parsed,body){
  const p=parsed.pathname;
  if(p==="/token" && req.method==="POST"){
    const m=/^Basic\s+(.+)$/.exec(req.headers["authorization"]||""); let ok=false;
    if(m) ok=Buffer.from(m[1],"base64").toString("utf8")===(CRED.key+":"+CRED.secret);
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
    const rejected=[]; let acc=0; arr.forEach(function(r,i){ const e=validateRecord(r); if(e) rejected.push({index:i,account:r.SoTaiKhoan||null,field:e.field,code:e.code}); else acc++; });
    SIMO.received.push({maYeuCau:req.headers["mayeucau"],total:arr.length,accepted:acc,at:Date.now()});
    const allok=rejected.length===0;
    return json(res,200,{code:allok?"00":"01",success:allok,message:allok?"Tiep nhan thanh cong":"Mot so ban ghi bi tu choi",total:arr.length,accepted:acc,rejectedCount:rejected.length,rejected:rejected});
  }
  if(p==="/simo/blacklist/full" && req.method==="GET"){
    const items=SIMO.master.filter(e=>!e.removed).map(e=>({entryId:e.entryId,identifier:e.identifier,kind:e.kind,reason:e.reason,TenKhachHang:e.TenKhachHang,regAt:e.regAt,status:e.status}));
    return json(res,200,{version:Date.now(), count:items.length, items:items});
  }
  if(p==="/simo/check" && req.method==="POST"){
    let b={}; try{ b=JSON.parse(body); }catch(e){}
    const idn=(b.identifier||"").trim(); const hit=SIMO.master.find(e=>e.identifier===idn && !e.removed);
    return json(res,200,{identifier:idn, hit:!!hit, entry: hit?{entryId:hit.entryId,kind:hit.kind,reason:hit.reason,TenKhachHang:hit.TenKhachHang,regAt:hit.regAt,status:hit.status}:null});
  }
  return null;
}
function callSimo(method,pathname,headers,body){
  return new Promise(function(resolve,reject){ const data=body!=null?(typeof body==="string"?body:JSON.stringify(body)):null;
    const h=Object.assign({},headers); if(data) h["content-length"]=Buffer.byteLength(data);
    const r=http.request({host:HOST,port:PORT,path:pathname,method:method,headers:h},function(res){ let s=""; res.on("data",d=>s+=d); res.on("end",function(){ let j; try{j=JSON.parse(s);}catch(e){j=s;} resolve({status:res.statusCode,body:j}); }); });
    r.on("error",reject); if(data) r.write(data); r.end(); });
}
async function getToken(){ const basic=Buffer.from(CRED.key+":"+CRED.secret).toString("base64");
  const r=await callSimo("POST","/token",{authorization:"Basic "+basic,"content-type":"application/x-www-form-urlencoded"},"grant_type=password&username="+CRED.user+"&password="+encodeURIComponent(CRED.pass)); return r.body; }

function summarize(list){ const s={count:list.length,ok:0,partial:0,fail:0,records:0,accepted:0,rejected:0};
  list.forEach(function(r){ if(r.code==="00")s.ok++; else if(r.code==="01")s.partial++; else s.fail++; s.records+=r.count||0; s.accepted+=r.accepted||0; s.rejected+=r.rejectedCount||0; }); return s; }

async function gatewayApi(req,res,parsed,body){
  const p=parsed.pathname, q=parsed.query; const send=(c,o)=>json(res,c,o);
  if(p==="/api/connection" && req.method==="GET")
    return send(200,{extranet:true,cert:true,tokenActive:SIMO.tokens.size>0,lastSync:DB.suspectMeta.lastSync,simoHost:"mgsimo.sbv.gov.vn (mock)"});
  if(p==="/api/apis" && req.method==="GET") return send(200,{items:API_CATALOG});
  if(p==="/api/layout" && req.method==="GET") return send(200,{svc:q.svc||"simo_001", endpoint:REPORT_EP, fields:layoutFor(q.svc||"simo_001")});
  if(p==="/api/relay/today" && req.method==="GET"){
    const tk=todayKey(); const list=DB.relays.filter(r=>dkey(r.ts)===tk);
    const perApi={}; list.forEach(function(r){ const a=perApi[r.svc]||(perApi[r.svc]={svc:r.svc,count:0,ok:0,partial:0,fail:0,records:0}); a.count++; a.records+=r.count; if(r.code==="00")a.ok++; else if(r.code==="01")a.partial++; else a.fail++; });
    let recent=list; if(q.svc) recent=recent.filter(r=>r.svc===q.svc);
    return send(200,{ date:tk, summary:summarize(list), perApi:Object.values(perApi), filter:q.svc||null,
      recent:recent.slice(0,40).map(r=>({id:r.id,ts:r.ts,svc:r.svc,mode:r.mode,count:r.count,code:r.code,accepted:r.accepted,rejectedCount:r.rejectedCount})) });
  }
  if(p==="/api/relay/by-date" && req.method==="GET"){
    const to=q.to||todayKey(); const from=q.from||dkey(Date.now()-6*86400000);
    let list=DB.relays.filter(function(r){ const k=dkey(r.ts); return k>=from && k<=to; }); if(q.svc) list=list.filter(r=>r.svc===q.svc);
    const byDay={}; list.forEach(function(r){ const k=dkey(r.ts); (byDay[k]||(byDay[k]=[])).push(r); });
    const rows=Object.keys(byDay).sort().reverse().map(k=>Object.assign({date:k}, summarize(byDay[k])));
    return send(200,{ from:from, to:to, svc:q.svc||null, total:summarize(list), rows:rows });
  }
  if(p==="/api/relay/by-date/detail" && req.method==="GET"){
    const date=q.date||todayKey(); let list=DB.relays.filter(r=>dkey(r.ts)===date); if(q.svc) list=list.filter(r=>r.svc===q.svc);
    list=list.sort((a,b)=>b.ts-a.ts);
    return send(200,{ date:date, svc:q.svc||null, summary:summarize(list),
      items:list.map(r=>({id:r.id,ts:r.ts,svc:r.svc,mode:r.mode,count:r.count,code:r.code,accepted:r.accepted,rejectedCount:r.rejectedCount})) });
  }
  if(/^\/api\/relay\/RLY[0-9]+$/.test(p) && req.method==="GET"){
    const id=p.split("/")[3]; const r=DB.relays.find(x=>x.id===id); if(!r) return send(404,{error:"not found"});
    const rejSet={}; (r.rejected||[]).forEach(x=>{ rejSet[x.index]={field:x.field,code:x.code}; });
    let recs=[]; for(let i=0;i<r.count;i++){ const o=genRecord(r,i); o.__i=i; if(rejSet[i]) o.__rej=rejSet[i]; recs.push(o); }   // full target set, regenerated
    const qq=(q.q||"").trim().toLowerCase();
    if(qq) recs=recs.filter(function(o){ for(const k in o){ if(k.charAt(0)==="_")continue; const v=o[k]; if(v!=null && String(v).toLowerCase().indexOf(qq)>=0) return true; } return false; });
    if(q.all==="1"||q.all==="true"){   // full (filtered) set for Excel export, no pagination
      return send(200,{ id:r.id, ts:r.ts, svc:r.svc, mode:r.mode, count:r.count, code:r.code, success:r.success, accepted:r.accepted, rejectedCount:r.rejectedCount, rejected:r.rejected||[],
        endpoint:REPORT_EP, maYeuCau:r.maYeuCau, kyBaoCao:r.kyBaoCao, layout:layoutFor(r.svc), q:q.q||"", total:recs.length, records:recs }); }
    const total=recs.length; const page=Math.max(1,Number(q.page||1)); const size=Math.min(100,Math.max(1,Number(q.size||15)));
    const pages=Math.max(1,Math.ceil(total/size)); const pg=Math.min(page,pages);
    return send(200,{ id:r.id, ts:r.ts, svc:r.svc, mode:r.mode, count:r.count, code:r.code, success:r.success, accepted:r.accepted, rejectedCount:r.rejectedCount, rejected:r.rejected||[],
      endpoint:REPORT_EP, maYeuCau:r.maYeuCau, kyBaoCao:r.kyBaoCao, layout:layoutFor(r.svc),
      q:q.q||"", total:total, page:pg, pages:pages, size:size, records:recs.slice((pg-1)*size,pg*size) });
  }
  if(p==="/api/relay/report" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const svc=b.svc||rnd(EVENT_SVCS); const cat=CAT[svc]||{mode:"EVENT"};
    const count=Math.max(1,Math.min(2000,Number(b.count||(cat.mode==="BATCH"?ri(40,300):ri(1,3)))));
    DB.seq.relay++; const id="RLY"+pad(DB.seq.relay,4); const maYeuCau="IBKVN-"+todayKey().replace(/-/g,"")+"-"+pad(DB.seq.relay,4);
    const rec={ id:id, ts:Date.now(), svc:svc, mode:cat.mode, count:count, maYeuCau:maYeuCau, kyBaoCao:"06/2026" };
    const records=[]; for(let i=0;i<count;i++) records.push(genRecord(rec,i));   // deterministic -> detail regenerates the same set
    const tk=await getToken();
    const resp=await callSimo("POST",REPORT_EP,{authorization:"Bearer "+tk.access_token,"content-type":"application/json",mayeucau:maYeuCau,kybaocao:"06/2026"},records);
    const r=resp.body||{};
    rec.code=r.code; rec.success=!!r.success; rec.rejected=r.rejected||[]; rec.rejectedCount=r.rejectedCount||0;
    rec.accepted=(r.accepted==null)?(count-rec.rejectedCount):r.accepted;
    DB.relays.unshift(rec); if(DB.relays.length>2000) DB.relays.pop();
    tx("REPORT", svc, "중계 "+count+"건 -> SIMO", "code "+r.code+" (수신 "+rec.accepted+"/반려 "+rec.rejectedCount+")");
    return send(200,{ id:id, svc:svc, count:count, code:r.code, accepted:rec.accepted, rejectedCount:rec.rejectedCount });
  }
  if(p==="/api/suspect/status" && req.method==="GET")
    return send(200,{ lastSync:DB.suspectMeta.lastSync, version:DB.suspectMeta.version, size:DB.suspect.length, lastRecv:DB.suspectMeta.lastRecv, lastDeliver:DB.suspectMeta.lastDeliver });
  if(p==="/api/suspect/sync" && req.method==="POST"){
    const r=await callSimo("GET","/simo/blacklist/full",{}); const now=Date.now(); const items=(r.body.items||[]);
    DB.suspect=items.map(it=>({ identifier:it.identifier, kind:it.kind, reason:it.reason, TenKhachHang:it.TenKhachHang||"", regAt:it.regAt, status:it.status||"ACTIVE", source:"SYNC" }));
    const received=items.length; const delivered=DB.suspect.length;
    DB.suspectMeta={ lastSync:now, version:DB.suspectMeta.version+1, lastRecv:received, lastDeliver:delivered };
    DB.seq.recv++; DB.recvHist.unshift({id:DB.seq.recv, at:now, mode:"FULL", received:received, delivered:delivered, match:received===delivered, version:DB.suspectMeta.version});
    if(DB.recvHist.length>50) DB.recvHist.pop();
    tx("SUSPECT_SYNC","-","SIMO 수신 "+received+" → 코어 전송 "+delivered, received===delivered?"일치 ✓":"불일치 ✗");
    return send(200,{ lastSync:now, version:DB.suspectMeta.version, received:received, delivered:delivered, match:received===delivered, size:DB.suspect.length });
  }
  if(p==="/api/suspect/recv-history" && req.method==="GET") return send(200,{items:DB.recvHist});
  if(p==="/api/suspect/list" && req.method==="GET"){
    let list=DB.suspect; if(q.q){ const s=q.q.toLowerCase(); list=list.filter(x=>x.identifier.toLowerCase().indexOf(s)>=0||(x.TenKhachHang||"").toLowerCase().indexOf(s)>=0); }
    const page=Math.max(1,Number(q.page||1)), size=Math.min(100,Number(q.size||12));
    return send(200,{ total:list.length, page:page, size:size, lastSync:DB.suspectMeta.lastSync, version:DB.suspectMeta.version, layout:SUSPECT_LAYOUT, items:list.slice((page-1)*size,page*size) });
  }
  if(p==="/api/suspect/check" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const idn=(b.identifier||"").trim();
    const r=await callSimo("POST","/simo/check",{"content-type":"application/json"},{identifier:idn}); const out=r.body||{};
    if(out.hit && !DB.suspect.find(x=>x.identifier===idn)) DB.suspect.unshift({identifier:idn, kind:out.entry.kind, reason:out.entry.reason, TenKhachHang:out.entry.TenKhachHang||"", regAt:out.entry.regAt, status:out.entry.status||"ACTIVE", source:"QUERY"});
    tx("SUSPECT_CHECK","-","건별 SIMO 확인: "+idn, out.hit?("등록 "+out.entry.reason):"미등록");
    return send(200,{ identifier:idn, hit:!!out.hit, entry:out.entry||null, size:DB.suspect.length });
  }
  if(p==="/api/screen" && req.method==="POST"){
    const b=JSON.parse(body||"{}"); const a=(b.account||"").trim(); const hit=DB.suspect.find(x=>x.identifier===a);
    tx("SCREEN","-","샘플 대조: "+a, hit?("일치 "+hit.reason):"미일치");
    return send(200,{ account:a, hit:!!hit, entry:hit||null, size:DB.suspect.length });
  }
  if(p==="/api/txlog" && req.method==="GET") return send(200,{items:DB.txlog.slice(0,120)});
  if(p==="/api/stats" && req.method==="GET"){
    const tk=todayKey(); const today=summarize(DB.relays.filter(r=>dkey(r.ts)===tk));
    const days=[]; for(let d=6;d>=0;d--){ const k=dkey(Date.now()-d*86400000); days.push(DB.relays.filter(r=>dkey(r.ts)===k).length); }
    return send(200,{ today:today, totalRelays:DB.relays.length, totalRecords:DB.relays.reduce((s,r)=>s+(r.count||0),0), suspect:DB.suspect.length, lastSync:DB.suspectMeta.lastSync, trend:days });
  }
  return null;
}

function json(res,code,obj){ const s=JSON.stringify(obj); res.writeHead(code,{"content-type":"application/json; charset=utf-8","content-length":Buffer.byteLength(s)}); res.end(s); return true; }
function parseForm(b){ const o={}; (b||"").split("&").forEach(function(kv){const a=kv.split("="); if(a[0])o[decodeURIComponent(a[0])]=decodeURIComponent(a[1]||"");}); return o; }
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8"};
function serveStatic(req,res,parsed){
  let rel=parsed.pathname==="/"?"/index.html":parsed.pathname;
  if(rel!=="/index.html" && rel!=="/app.js"){ res.writeHead(404,{"content-type":"text/plain"}); return res.end("404"); }
  fs.readFile(path.join(__dirname, rel.replace(/^\//,"")),function(e,d){ if(e){res.writeHead(404);return res.end("404");} res.writeHead(200,{"content-type":MIME[path.extname(rel)]||"text/plain"}); res.end(d); });
}
function readBody(req){ return new Promise(function(r){ let b=""; req.on("data",d=>b+=d); req.on("end",()=>r(b)); }); }
const server=http.createServer(async function(req,res){
  const parsed=new URL(req.url,"http://"+HOST+":"+PORT); parsed.query=Object.fromEntries(parsed.searchParams.entries()); parsed.pathname=decodeURIComponent(parsed.pathname);
  try{ const body=(req.method==="POST"||req.method==="PUT")?await readBody(req):"";
    if(parsed.pathname==="/token"||parsed.pathname.indexOf("/simo/")===0){ if(mockSimo(req,res,parsed,body)!==null) return; }
    if(parsed.pathname.indexOf("/api/")===0){ const r=await gatewayApi(req,res,parsed,body); if(r) return; if(!res.writableEnded) return json(res,404,{error:"unknown api"}); return; }
    return serveStatic(req,res,parsed);
  }catch(e){ if(!res.writableEnded) json(res,500,{error:"server_error",message:String(e.message||e)}); }
});
server.listen(PORT,BIND,()=>console.log("InfoPlus SIMO Relay GW v3 -> http://localhost:"+PORT));
