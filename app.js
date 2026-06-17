/* InfoPlus SIMO Relay Gateway - Portal (vanilla JS, KO/EN/VI) */
"use strict";

const I18N = {
  ko:{
    subtitle:"SIMO 중계 게이트웨이","common.mockNote":"모의 SIMO","common.close":"닫기","common.page":"페이지","common.prev":"이전","common.next":"다음","common.loading":"불러오는 중…",
    "nav.dashboard":"대시보드","nav.relay":"보고 중계","nav.suspect":"의심목록","nav.sample":"샘플 테스트","nav.txlog":"거래 처리 로그",
    "dash.kRelays":"중계 건수","dash.kRecords":"중계 레코드","dash.kAccepted":"SIMO 수락","dash.kRejected":"반려","dash.kSuspect":"의심목록 보유","dash.kRecv":"수신 횟수",
    "dash.trend":"최근 7일 중계 건수","dash.conn":"연동 상태","dash.recent":"최근 거래 처리","dash.extranet":"Extranet 회선","dash.cert":"전자서명 인증서","dash.token":"토큰 세션","dash.recvRow":"의심목록 수신",
    "st.connected":"연결","st.valid":"유효","st.active":"활성","st.none":"미발급","st.idle":"대기","st.latest":"최신",
    "relay.title":"보고 중계 (코어 → GW → SIMO)","relay.flowCore":"코어뱅킹","relay.flowGw":"InfoPlus GW (중계·변환·전송)","relay.flowSimo":"SIMO",
    "relay.hint":"코어가 보낸 보고를 SIMO로 중계합니다. GW는 변환·전송·로깅만 하며 자체 판단·승인은 없습니다. 배치/건별은 API 성격에 따릅니다.",
    "relay.run":"보고 중계 실행","relay.svc":"대상 API","relay.count":"건수","relay.runBtn":"코어 보고 중계 →","relay.catalog":"SIMO API 카탈로그",
    "relay.cCode":"코드","relay.cGroup":"그룹","relay.cTarget":"대상","relay.cMode":"방식","relay.cPurpose":"업무 목적",
    "relay.log":"중계 로그","relay.logSvc":"API","relay.logMode":"방식","relay.logCount":"건수","relay.logResult":"결과","relay.logTime":"시각","relay.none":"중계 내역이 없습니다.","relay.all":"전체 API",
    "relay.resultTitle":"중계 결과","relay.accepted":"수락","relay.rejected":"반려","relay.preview":"중계 전문(코어→SIMO) 미리보기",
    "mode.EVENT":"건별","mode.BATCH":"배치",
    "suspect.title":"의심목록 (SIMO → GW → 코어)","suspect.caveat":"⚠ SIMO 수신 API는 아직 미정입니다. 본 데모는 표준(대량/델타 또는 건별) 수신을 가정합니다.",
    "suspect.flow":"GW가 SIMO에서 수신한 전체 목록을 보유·관리하고 코어로 전달합니다. 코어 건별 조회는 SIMO까지 중계해 결과를 목록에 반영합니다.",
    "suspect.recv":"SIMO 수신 → 코어 전달","suspect.delta":"델타 수신","suspect.full":"전량 수신","suspect.held":"보유 의심목록","suspect.recvHist":"수신 이력",
    "suspect.hMode":"방식","suspect.hRecv":"수신","suspect.hList":"보유","suspect.hTime":"시각",
    "suspect.query":"건별 조회 중계 (코어 → GW → SIMO)","suspect.queryHint":"코어가 특정 계좌의 SIMO 등록 여부를 요청하면 GW가 SIMO로 중계하고 결과를 목록에 반영합니다.","suspect.queryBtn":"SIMO 조회 중계",
    "suspect.entryId":"ID","suspect.identifier":"식별자","suspect.kind":"유형","suspect.reason":"사유","suspect.via":"경로","suspect.deliver":"코어 전달","suspect.none":"수신된 목록이 없습니다.",
    "suspect.qHit":"SIMO 등록 계좌","suspect.qClean":"미등록 계좌","suspect.viaSync":"동기화","suspect.viaQuery":"건별조회",
    "sample.title":"샘플 테스트 (대조 데모)","sample.hint":"실제 대조·경고는 코어(거래/채널)가 수행합니다. 본 화면은 GW가 전달한 의심목록으로 대조가 어떻게 동작하는지 보여주는 샘플입니다.",
    "sample.account":"조회 계좌번호","sample.check":"대조 실행","sample.examples":"예시","sample.hitTitle":"의심목록 일치","sample.hitBody":"입력한 계좌는 의심목록에 존재합니다.","sample.cleanTitle":"정상","sample.cleanBody":"의심목록에 없습니다.","sample.reason":"사유","sample.needList":"보유 의심목록이 없습니다. 먼저 ‘의심목록’ 탭에서 수신하세요.",
    "tx.title":"거래 처리 로그","tx.time":"시각","tx.type":"유형","tx.svc":"API","tx.summary":"내용","tx.result":"결과",
    "txt.REPORT":"보고 중계","txt.SUSPECT_RECV":"의심목록 수신","txt.SUSPECT_QUERY":"건별 조회","txt.SCREEN":"샘플 대조"
  },
  en:{
    subtitle:"SIMO Relay Gateway","common.mockNote":"Mock SIMO","common.close":"Close","common.page":"Page","common.prev":"Prev","common.next":"Next","common.loading":"Loading…",
    "nav.dashboard":"Dashboard","nav.relay":"Report Relay","nav.suspect":"Suspect List","nav.sample":"Sample Test","nav.txlog":"Transaction Log",
    "dash.kRelays":"Relays","dash.kRecords":"Relayed records","dash.kAccepted":"SIMO accepted","dash.kRejected":"Rejected","dash.kSuspect":"Suspect list held","dash.kRecv":"Receives",
    "dash.trend":"Relays, last 7 days","dash.conn":"Connection","dash.recent":"Recent transactions","dash.extranet":"Extranet link","dash.cert":"Digital certificate","dash.token":"Token session","dash.recvRow":"Suspect-list receive",
    "st.connected":"Connected","st.valid":"Valid","st.active":"Active","st.none":"None","st.idle":"Idle","st.latest":"Up to date",
    "relay.title":"Report Relay (Core → GW → SIMO)","relay.flowCore":"Core Banking","relay.flowGw":"InfoPlus GW (relay/transform/transmit)","relay.flowSimo":"SIMO",
    "relay.hint":"Relays reports sent by core to SIMO. The GW only transforms, transmits and logs — no own judgment or approval. Batch vs per-event depends on the API.",
    "relay.run":"Run relay","relay.svc":"Target API","relay.count":"Count","relay.runBtn":"Relay core report →","relay.catalog":"SIMO API catalog",
    "relay.cCode":"Code","relay.cGroup":"Group","relay.cTarget":"Target","relay.cMode":"Mode","relay.cPurpose":"Business purpose",
    "relay.log":"Relay log","relay.logSvc":"API","relay.logMode":"Mode","relay.logCount":"Count","relay.logResult":"Result","relay.logTime":"Time","relay.none":"No relays yet.","relay.all":"All APIs",
    "relay.resultTitle":"Relay result","relay.accepted":"Accepted","relay.rejected":"Rejected","relay.preview":"Relayed payload (core→SIMO) preview",
    "mode.EVENT":"Event","mode.BATCH":"Batch",
    "suspect.title":"Suspect List (SIMO → GW → Core)","suspect.caveat":"⚠ The SIMO receive API is not finalized. This demo assumes standard receive (bulk/delta or per-item).",
    "suspect.flow":"The GW holds the full list received from SIMO and forwards it to core. Per-item core queries are relayed to SIMO and reflected back into the list.",
    "suspect.recv":"Receive from SIMO → forward to core","suspect.delta":"Delta receive","suspect.full":"Full receive","suspect.held":"Held suspect list","suspect.recvHist":"Receive history",
    "suspect.hMode":"Mode","suspect.hRecv":"Recv","suspect.hList":"Held","suspect.hTime":"Time",
    "suspect.query":"Per-item query relay (Core → GW → SIMO)","suspect.queryHint":"When core asks whether an account is registered in SIMO, the GW relays to SIMO and reflects the result into the list.","suspect.queryBtn":"Relay SIMO query",
    "suspect.entryId":"ID","suspect.identifier":"Identifier","suspect.kind":"Kind","suspect.reason":"Reason","suspect.via":"Via","suspect.deliver":"To core","suspect.none":"No received list.",
    "suspect.qHit":"Registered in SIMO","suspect.qClean":"Not registered","suspect.viaSync":"Sync","suspect.viaQuery":"Query",
    "sample.title":"Sample Test (match demo)","sample.hint":"Actual matching and warning run in core (transaction/channel). This sample shows how matching works using the suspect list the GW delivered.",
    "sample.account":"Account number","sample.check":"Run match","sample.examples":"Examples","sample.hitTitle":"Suspect-list match","sample.hitBody":"The account is on the suspect list.","sample.cleanTitle":"Clean","sample.cleanBody":"Not on the suspect list.","sample.reason":"Reason","sample.needList":"No suspect list held. Receive it first on the ‘Suspect List’ tab.",
    "tx.title":"Transaction log","tx.time":"Time","tx.type":"Type","tx.svc":"API","tx.summary":"Detail","tx.result":"Result",
    "txt.REPORT":"Report relay","txt.SUSPECT_RECV":"Suspect receive","txt.SUSPECT_QUERY":"Per-item query","txt.SCREEN":"Sample match"
  },
  vi:{
    subtitle:"Cổng trung chuyển SIMO","common.mockNote":"SIMO mô phỏng","common.close":"Đóng","common.page":"Trang","common.prev":"Trước","common.next":"Sau","common.loading":"Đang tải…",
    "nav.dashboard":"Bảng điều khiển","nav.relay":"Trung chuyển báo cáo","nav.suspect":"Danh sách nghi ngờ","nav.sample":"Kiểm thử mẫu","nav.txlog":"Nhật ký giao dịch",
    "dash.kRelays":"Lượt chuyển","dash.kRecords":"Bản ghi chuyển","dash.kAccepted":"SIMO nhận","dash.kRejected":"Từ chối","dash.kSuspect":"DS nghi ngờ đang giữ","dash.kRecv":"Lượt nhận",
    "dash.trend":"Lượt chuyển 7 ngày","dash.conn":"Trạng thái","dash.recent":"Giao dịch gần đây","dash.extranet":"Đường Extranet","dash.cert":"Chứng thư số","dash.token":"Phiên token","dash.recvRow":"Nhận DS nghi ngờ",
    "st.connected":"Đã nối","st.valid":"Hợp lệ","st.active":"Hoạt động","st.none":"Chưa cấp","st.idle":"Chờ","st.latest":"Mới nhất",
    "relay.title":"Trung chuyển báo cáo (Core → GW → SIMO)","relay.flowCore":"Core Banking","relay.flowGw":"InfoPlus GW (chuyển/chuyển đổi/gửi)","relay.flowSimo":"SIMO",
    "relay.hint":"Chuyển báo cáo do core gửi đến SIMO. GW chỉ chuyển đổi, gửi và ghi log — không tự quyết định/duyệt. Theo lô hay theo sự kiện tùy API.",
    "relay.run":"Chạy trung chuyển","relay.svc":"API đích","relay.count":"Số lượng","relay.runBtn":"Chuyển báo cáo core →","relay.catalog":"Danh mục API SIMO",
    "relay.cCode":"Mã","relay.cGroup":"Nhóm","relay.cTarget":"Đối tượng","relay.cMode":"Kiểu","relay.cPurpose":"Mục đích nghiệp vụ",
    "relay.log":"Nhật ký trung chuyển","relay.logSvc":"API","relay.logMode":"Kiểu","relay.logCount":"SL","relay.logResult":"Kết quả","relay.logTime":"Thời gian","relay.none":"Chưa có giao dịch.","relay.all":"Tất cả API",
    "relay.resultTitle":"Kết quả trung chuyển","relay.accepted":"Nhận","relay.rejected":"Từ chối","relay.preview":"Xem trước gói tin chuyển (core→SIMO)",
    "mode.EVENT":"Sự kiện","mode.BATCH":"Lô",
    "suspect.title":"Danh sách nghi ngờ (SIMO → GW → Core)","suspect.caveat":"⚠ API nhận của SIMO chưa chốt. Bản demo giả định nhận chuẩn (hàng loạt/delta hoặc theo từng mục).",
    "suspect.flow":"GW giữ toàn bộ danh sách nhận từ SIMO và chuyển cho core. Truy vấn từng mục của core được chuyển đến SIMO và phản ánh vào danh sách.",
    "suspect.recv":"Nhận từ SIMO → chuyển core","suspect.delta":"Nhận delta","suspect.full":"Nhận toàn bộ","suspect.held":"DS nghi ngờ đang giữ","suspect.recvHist":"Lịch sử nhận",
    "suspect.hMode":"Kiểu","suspect.hRecv":"Nhận","suspect.hList":"Giữ","suspect.hTime":"Thời gian",
    "suspect.query":"Trung chuyển truy vấn từng mục (Core → GW → SIMO)","suspect.queryHint":"Khi core hỏi một tài khoản có trong SIMO không, GW chuyển đến SIMO và phản ánh kết quả vào danh sách.","suspect.queryBtn":"Chuyển truy vấn SIMO",
    "suspect.entryId":"ID","suspect.identifier":"Định danh","suspect.kind":"Loại","suspect.reason":"Lý do","suspect.via":"Nguồn","suspect.deliver":"Tới core","suspect.none":"Chưa có danh sách.",
    "suspect.qHit":"Có trong SIMO","suspect.qClean":"Không có","suspect.viaSync":"Đồng bộ","suspect.viaQuery":"Truy vấn",
    "sample.title":"Kiểm thử mẫu (demo đối chiếu)","sample.hint":"Đối chiếu và cảnh báo thực hiện tại core (giao dịch/kênh). Mẫu này minh họa đối chiếu bằng danh sách GW đã chuyển.",
    "sample.account":"Số tài khoản","sample.check":"Đối chiếu","sample.examples":"Ví dụ","sample.hitTitle":"Trùng danh sách nghi ngờ","sample.hitBody":"Tài khoản nằm trong danh sách nghi ngờ.","sample.cleanTitle":"Bình thường","sample.cleanBody":"Không có trong danh sách.","sample.reason":"Lý do","sample.needList":"Chưa có danh sách. Hãy nhận ở tab ‘Danh sách nghi ngờ’.",
    "tx.title":"Nhật ký giao dịch","tx.time":"Thời gian","tx.type":"Loại","tx.svc":"API","tx.summary":"Nội dung","tx.result":"Kết quả",
    "txt.REPORT":"Trung chuyển báo cáo","txt.SUSPECT_RECV":"Nhận nghi ngờ","txt.SUSPECT_QUERY":"Truy vấn mục","txt.SCREEN":"Đối chiếu mẫu"
  }
};
const REASON_I18N={
  ko:{FRAUD_SUSPECT:"사기 의심",MULE_ACCOUNT:"대포통장",REPORTED_POLICE:"수사기관 통보",ABNORMAL_FLOW:"이상 자금흐름"},
  en:{FRAUD_SUSPECT:"Fraud suspect",MULE_ACCOUNT:"Mule account",REPORTED_POLICE:"Reported by police",ABNORMAL_FLOW:"Abnormal flow"},
  vi:{FRAUD_SUSPECT:"Nghi gian lận",MULE_ACCOUNT:"TK trung gian",REPORTED_POLICE:"CA thông báo",ABNORMAL_FLOW:"Dòng tiền bất thường"}
};
const ERR_I18N={
  ko:{ERR_REQUIRED:"필수값 누락",ERR_DATE_FORMAT:"날짜형식 오류",ERR_ENUM:"허용값 아님"},
  en:{ERR_REQUIRED:"Missing required",ERR_DATE_FORMAT:"Bad date format",ERR_ENUM:"Invalid value"},
  vi:{ERR_REQUIRED:"Thiếu bắt buộc",ERR_DATE_FORMAT:"Sai định dạng ngày",ERR_ENUM:"Giá trị sai"}
};

let LANG="ko", CUR="dash";
const $=s=>document.querySelector(s);
const t=k=>(I18N[LANG][k]!==undefined?I18N[LANG][k]:(I18N.en[k]||k));
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rsn=c=>(REASON_I18N[LANG][c]||c);
const errt=c=>(ERR_I18N[LANG][c]||c);
const tt=ty=>(t("txt."+ty)||ty);
async function api(path,opts={}){ opts.headers=Object.assign({"content-type":"application/json"},opts.headers||{}); const r=await fetch(path,opts); return r.json(); }

function modal(html,cls){ $("#modal").className="modal"+(cls?" "+cls:""); $("#modal").innerHTML=html; $("#modalBg").classList.add("show"); }
function closeModal(){ $("#modalBg").classList.remove("show"); }
$("#modalBg").addEventListener("click",e=>{ if(e.target===$("#modalBg")) closeModal(); });
function box(ic,title,body){ return `<div class="ic">${ic}</div><h4 style="text-align:center">${esc(title)}</h4><div style="text-align:center;color:var(--gray);font-size:13px;line-height:1.6">${body}</div>`; }
function toast(msg){ modal(box("ℹ️","",msg)+`<div class="btnrow" style="justify-content:center;margin-top:8px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`); setTimeout(()=>{ if($("#modalBg").classList.contains("show")) closeModal(); },1600); }

const VIEW={};

VIEW.dash=async()=>{
  const v=$("#view"); v.innerHTML=`<div class="small">${t("common.loading")}</div>`;
  const [s,c,x]=await Promise.all([api("/api/stats"),api("/api/connection"),api("/api/txlog")]);
  const card=(k,val)=>`<div class="card"><div class="k">${t(k)}</div><div class="v">${val}</div></div>`;
  const max=Math.max(...s.trend,10);
  const bars=s.trend.map((n,i)=>`<div class="bar" style="height:${Math.round(n/max*100)}%"><span>${n}</span><em>${i===6?"●":("-"+(6-i))}</em></div>`).join("");
  const cs=(on,a,b)=>`<span class="pill ${on?'on':''}">${on?a:b}</span>`;
  const xl=x.items.slice(0,8).map(r=>`<div><span style="color:#6fa8d6">[${r.ts.slice(11,19)}]</span> <b>${tt(r.type)}</b> ${esc(r.summary)} <span style="color:#7fe3a6">${esc(r.result)}</span></div>`).join("")||"—";
  v.innerHTML=`
    <div class="cards">${card("dash.kRelays",s.relays)}${card("dash.kRecords",s.relayedRecords)}${card("dash.kAccepted",s.accepted)}${card("dash.kRejected",s.rejected)}${card("dash.kSuspect",s.suspect)}${card("dash.kRecv",s.recvCount)}</div>
    <div class="row">
      <div class="panel" style="flex:1.4"><h3>${t("dash.trend")}</h3><div class="chart">${bars}</div><div style="height:22px"></div></div>
      <div class="panel"><h3>${t("dash.conn")}</h3><table>
        <tr><td>${t("dash.extranet")}</td><td class="c">${cs(c.extranet,t("st.connected"),"-")}</td></tr>
        <tr><td>${t("dash.cert")}</td><td class="c">${cs(c.cert,t("st.valid"),"-")}</td></tr>
        <tr><td>${t("dash.token")}</td><td class="c">${cs(c.tokenActive,t("st.active"),t("st.none"))}</td></tr>
        <tr><td>${t("dash.recvRow")}</td><td class="c">${cs(!!c.lastRecv,t("st.latest"),t("st.idle"))}</td></tr>
      </table><p class="small" style="margin-top:10px">SIMO: <code class="k">${esc(c.simoHost)}</code></p></div>
    </div>
    <div class="panel"><h3>${t("dash.recent")}</h3><div class="log">${xl}</div></div>`;
};

VIEW.relay=async()=>{
  const v=$("#view");
  const [cat,log]=await Promise.all([api("/api/apis"),api("/api/relay/log")]);
  const opts=cat.items.map(a=>`<option value="${a.code}">${a.code} · ${esc(a.purpose)}</option>`).join("");
  const catRows=cat.items.map(a=>`<tr><td><code class="k">${a.code}</code></td><td>${a.group}</td><td>${a.target}</td><td class="c"><span class="tag ${a.mode==='BATCH'?'ba':'ev'}">${t("mode."+a.mode)}</span></td><td>${esc(a.purpose)}</td></tr>`).join("");
  v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("relay.title")}</h2>
    <div class="flow"><b>${t("relay.flowCore")}</b><span class="ar">──▶</span><b>${t("relay.flowGw")}</b><span class="ar">──▶</span><b>${t("relay.flowSimo")}</b></div>
    <div class="hint">${t("relay.hint")}</div>
    <div class="panel"><h3>${t("relay.run")}</h3>
      <div class="btnrow">
        <select class="ui2" id="rSvc" style="min-width:320px">${opts}</select>
        <span class="small">${t("relay.count")}</span><input class="ui" id="rCount" value="1" style="width:80px">
        <button class="btn blue" id="rGo">${t("relay.runBtn")}</button>
      </div>
    </div>
    <div class="panel"><h3>${t("relay.catalog")}</h3>
      <table><thead><tr><th>${t("relay.cCode")}</th><th>${t("relay.cGroup")}</th><th>${t("relay.cTarget")}</th><th class="c">${t("relay.cMode")}</th><th>${t("relay.cPurpose")}</th></tr></thead><tbody>${catRows}</tbody></table></div>
    <div class="panel"><h3>${t("relay.log")}</h3><div id="relayLog"></div></div>`;
  $("#rGo").onclick=async()=>{
    const svc=$("#rSvc").value, count=$("#rCount").value;
    const r=await api("/api/relay/report",{method:"POST",body:JSON.stringify({svc,count})});
    const ok=r.code==="00";
    const rej=(r.rejected||[]).slice(0,10).map(x=>`<tr><td class="c">${x.index}</td><td>${x.account||'-'}</td><td>${x.field}</td><td>${errt(x.code)}</td></tr>`).join("");
    const rejB=(r.rejected&&r.rejected.length)?`<table style="margin:8px 0"><thead><tr><th class="c">#</th><th>${t("suspect.identifier")}</th><th>field</th><th>${t("relay.rejected")}</th></tr></thead><tbody>${rej}</tbody></table>`:"";
    modal(box(ok?"✅":"⚠",t("relay.resultTitle")+" · code "+r.code,
      `${svc} · ${r.count} · <b>${r.accepted}</b> ${t("relay.accepted")} / <b>${r.rejectedCount||0}</b> ${t("relay.rejected")}`)
      +`<div style="margin-top:10px">${rejB}<div class="kv">${t("relay.preview")}</div><pre>${esc(JSON.stringify(r.reqPreview,null,2))}</pre></div>`
      +`<div class="btnrow" style="justify-content:center;margin-top:12px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`, ok?"":"warn");
    renderRelayLog();
  };
  renderRelayLog();
  async function renderRelayLog(){
    const d=await api("/api/relay/log");
    const rows=d.items.map(r=>`<tr><td>${r.id}</td><td><code class="k">${r.svc}</code></td><td class="c"><span class="tag ${r.mode==='BATCH'?'ba':'ev'}">${t("mode."+r.mode)}</span></td><td class="c">${r.count}</td><td class="c"><span class="tag ${r.code==='00'?'ok':(r.code==='01'?'warn':'bad')}">code ${r.code}</span></td><td class="c">${r.accepted}/${r.rejectedCount}</td><td class="small">${new Date(r.ts).toLocaleTimeString()}</td></tr>`).join("")||`<tr><td colspan="7" class="muted">${t("relay.none")}</td></tr>`;
    $("#relayLog").innerHTML=`<table><thead><tr><th>ID</th><th>${t("relay.logSvc")}</th><th class="c">${t("relay.logMode")}</th><th class="c">${t("relay.logCount")}</th><th class="c">${t("relay.logResult")}</th><th class="c">${t("relay.accepted")}/${t("relay.rejected")}</th><th>${t("relay.logTime")}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
};

VIEW.suspect=(()=>{ let page=1;
  return async()=>{
    const v=$("#view");
    const [bl,h]=await Promise.all([api("/api/suspect/list?page="+page+"&size=12"),api("/api/suspect/recv-history")]);
    const items=bl.items.map(x=>`<tr><td>${x.entryId}</td><td>${x.identifier}</td><td class="c">${x.kind}</td><td>${rsn(x.reason)}</td><td class="c"><span class="tag ${x.viaQuery?'warn':'ev'}">${x.viaQuery?t("suspect.viaQuery"):t("suspect.viaSync")}</span></td><td class="c"><span class="tag ok">✓</span></td></tr>`).join("")||`<tr><td colspan="6" class="muted">${t("suspect.none")}</td></tr>`;
    const hist=h.items.map(r=>`<tr><td>#${r.id}</td><td>${r.mode}</td><td class="c">${r.received}</td><td class="c">${r.listSize}</td><td class="small">${new Date(r.at).toLocaleTimeString()}</td></tr>`).join("")||`<tr><td colspan="5" class="muted">—</td></tr>`;
    const pages=Math.ceil(bl.total/bl.size)||1;
    v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("suspect.title")}</h2>
      <div class="hint warn">${t("suspect.caveat")}</div>
      <div class="hint">${t("suspect.flow")}</div>
      <div class="row">
        <div class="panel"><h3>${t("suspect.recv")}</h3>
          <div class="btnrow"><button class="btn blue" id="sFull">${t("suspect.full")}</button><button class="btn ghost" id="sDelta">${t("suspect.delta")}</button>
            <span class="small">${t("suspect.held")}: <b>${bl.total}</b></span></div>
          <h3 style="margin-top:14px">${t("suspect.recvHist")}</h3>
          <table><thead><tr><th>#</th><th>${t("suspect.hMode")}</th><th class="c">${t("suspect.hRecv")}</th><th class="c">${t("suspect.hList")}</th><th>${t("suspect.hTime")}</th></tr></thead><tbody>${hist}</tbody></table>
        </div>
        <div class="panel"><h3>${t("suspect.query")}</h3>
          <p class="small">${t("suspect.queryHint")}</p>
          <div class="btnrow"><input class="ui" id="qId" placeholder="9988776655" style="flex:1;min-width:180px"><button class="btn" id="qGo">${t("suspect.queryBtn")}</button></div>
          <div class="btnrow" style="margin-top:8px"><span class="small">${t("sample.examples")}:</span>
            <button class="btn ghost sm" onclick="document.querySelector('#qId').value='9988776655'">9988776655</button>
            <button class="btn ghost sm" onclick="document.querySelector('#qId').value='5551234567'">5551234567</button></div>
        </div>
      </div>
      <div class="panel"><h3>${t("suspect.held")} (${t("suspect.deliver")} ✓)</h3>
        <table><thead><tr><th>${t("suspect.entryId")}</th><th>${t("suspect.identifier")}</th><th class="c">${t("suspect.kind")}</th><th>${t("suspect.reason")}</th><th class="c">${t("suspect.via")}</th><th class="c">${t("suspect.deliver")}</th></tr></thead><tbody>${items}</tbody></table>
        <div class="pager"><button class="btn ghost sm" id="pp" ${page<=1?'disabled':''}>${t("common.prev")}</button><span>${t("common.page")} ${bl.page}/${pages}</span><button class="btn ghost sm" id="pn" ${page>=pages?'disabled':''}>${t("common.next")}</button><span class="small">· total ${bl.total}</span></div>
      </div>`;
    $("#sFull").onclick=async()=>{ const r=await api("/api/suspect/receive",{method:"POST",body:JSON.stringify({mode:"full"})}); toast(`full 수신 ${r.received} → ${t("suspect.deliver")} (${r.listSize})`); page=1; VIEW.suspect(); };
    $("#sDelta").onclick=async()=>{ const r=await api("/api/suspect/receive",{method:"POST",body:JSON.stringify({mode:"delta"})}); toast(`delta +${r.add} (${r.listSize})`); VIEW.suspect(); };
    $("#qGo").onclick=async()=>{ const idn=$("#qId").value.trim(); if(!idn) return; const r=await api("/api/suspect/query",{method:"POST",body:JSON.stringify({identifier:idn})});
      modal(box(r.hit?"⚠":"✅", r.hit?t("suspect.qHit"):t("suspect.qClean"), `<b>${esc(idn)}</b>`+(r.hit?` · ${t("suspect.reason")}: ${rsn(r.entry.reason)}`:""))+`<div class="btnrow" style="justify-content:center;margin-top:10px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`, r.hit?"warn":""); VIEW.suspect(); };
    $("#pp").onclick=()=>{ if(page>1){page--;VIEW.suspect();} };
    $("#pn").onclick=()=>{ if(page<pages){page++;VIEW.suspect();} };
  };
})();

VIEW.sample=async()=>{
  const v=$("#view");
  v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("sample.title")}</h2>
    <div class="hint">${t("sample.hint")}</div>
    <div class="panel" style="max-width:580px"><h3>${t("sample.account")}</h3>
      <div class="btnrow"><input class="ui" id="acc" placeholder="9988776655" style="flex:1;min-width:200px"><button class="btn" id="scGo">${t("sample.check")}</button></div>
      <div class="btnrow" style="margin-top:10px"><span class="small">${t("sample.examples")}:</span>
        <button class="btn ghost sm" onclick="document.querySelector('#acc').value='9988776655'">9988776655</button>
        <button class="btn ghost sm" onclick="document.querySelector('#acc').value='1234509876'">1234509876</button>
        <button class="btn ghost sm" onclick="document.querySelector('#acc').value='5551234567'">5551234567</button></div>
      <p class="small" id="scNote" style="margin-top:12px"></p></div>`;
  $("#scGo").onclick=async()=>{ const a=$("#acc").value.trim(); if(!a) return;
    const r=await api("/api/screen",{method:"POST",body:JSON.stringify({account:a})});
    if(r.listSize===0){ $("#scNote").innerHTML=`<span style="color:var(--amber)">${t("sample.needList")}</span>`; return; }
    if(r.hit){ modal(box("⚠",t("sample.hitTitle"),`<b>${esc(a)}</b> · ${t("sample.reason")}: ${rsn(r.entry.reason)}`)+`<div class="btnrow" style="justify-content:center;margin-top:10px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`,"warn"); $("#scNote").innerHTML=`<span style="color:var(--warn)">⚠ ${rsn(r.entry.reason)}</span>`; }
    else { modal(box("✅",t("sample.cleanTitle"),t("sample.cleanBody"))+`<div class="btnrow" style="justify-content:center;margin-top:10px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`); $("#scNote").innerHTML=`<span style="color:var(--ok)">clean</span>`; }
  };
};

VIEW.txlog=async()=>{
  const v=$("#view"); const d=await api("/api/txlog");
  const rows=d.items.map(r=>`<tr><td class="small">${r.ts.replace('T',' ').slice(0,19)}</td><td><b>${tt(r.type)}</b></td><td><code class="k">${r.svc}</code></td><td>${esc(r.summary)}</td><td>${esc(r.result)}</td></tr>`).join("")||`<tr><td colspan="5" class="muted">—</td></tr>`;
  v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("tx.title")}</h2>
    <div class="panel"><table><thead><tr><th>${t("tx.time")}</th><th>${t("tx.type")}</th><th>${t("tx.svc")}</th><th>${t("tx.summary")}</th><th>${t("tx.result")}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
};

function applyStatic(){ document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent=t(el.getAttribute("data-i18n")); }); $("#viewTitle").textContent=t("nav."+(CUR==="dash"?"dashboard":CUR)); document.documentElement.lang=LANG; }
function go(view){ CUR=view; document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view)); applyStatic(); VIEW[view](); }
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>go(b.dataset.view));
$("#langSel").onchange=e=>{ LANG=e.target.value; applyStatic(); VIEW[CUR](); };
window.closeModal=closeModal; window.go=go; window.api=api; window.VIEW=VIEW;
applyStatic(); VIEW.dash();
