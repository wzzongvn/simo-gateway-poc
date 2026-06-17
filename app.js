/* InfoPlus SIMO Gateway — Portal (vanilla JS, KO/EN/VI) */
"use strict";

// ============================ i18n ============================
const I18N = {
  ko:{
    subtitle:"SIMO 연동 게이트웨이", "common.mockNote":"모의 SIMO (SBV 미연결)","common.close":"닫기","common.page":"페이지","common.prev":"이전","common.next":"다음","common.loading":"불러오는 중…",
    "role.label":"역할",
    "nav.dashboard":"대시보드","nav.accounts":"행내 데이터","nav.reports":"보고 ①","nav.sync":"의심목록 ②","nav.screening":"고객 경고","nav.audit":"감사 로그",
    "dash.kAccounts":"행내 계좌","dash.kSuspect":"의심 계좌","dash.kReports":"보고 배치","dash.kAccepted":"SIMO 수락","dash.kRejected":"반려","dash.kBlacklist":"의심목록 보유",
    "dash.trend":"최근 7일 SIMO 수락(건)","dash.conn":"연동 상태","dash.recent":"최근 활동(감사)","dash.extranet":"Extranet 회선","dash.cert":"전자서명 인증서","dash.token":"토큰 세션","dash.syncRow":"의심목록 동기화",
    "st.connected":"연결","st.valid":"유효","st.active":"활성","st.inactive":"미발급","st.waiting":"대기","st.latest":"최신",
    "acc.title":"행내 데이터 / 보고 후보","acc.all":"전체","acc.regular":"정기","acc.suspect":"의심","acc.search":"이름/계좌/CIF 검색","acc.cif":"CIF","acc.name":"고객명","acc.acct":"계좌번호","acc.status":"상태","acc.type":"구분",
    "rep.title":"보고 ① (은행 → SIMO)","rep.build":"보고 생성","rep.service":"서비스","rep.period":"기준월","rep.buildBtn":"보고 생성 →","rep.list":"보고 배치 목록","rep.id":"ID","rep.count":"건수","rep.status":"상태","rep.maker":"작성","rep.checker":"결재","rep.code":"응답","rep.accepted":"수락","rep.rejected":"반려","rep.retries":"재시도","rep.actions":"작업","rep.approve":"결재","rep.send":"토큰·전송","rep.retry":"교정·재시도","rep.detail":"상세","rep.preview":"전송 전문 미리보기","rep.rejTitle":"반려 레코드","rep.idx":"순번","rep.field":"필드","rep.reason":"사유","rep.none":"보고 배치가 없습니다.","rep.built":"보고 생성 완료","rep.needChecker":"결재는 checker 권한이 필요합니다. 우측 상단에서 역할을 checker로 변경하세요.","rep.segregation":"작성자와 결재자는 같을 수 없습니다(maker≠checker).",
    "sync.title":"의심목록 ② (SIMO → 은행)","sync.caveat":"⚠ 수신(②) 방향의 정확한 규격은 SBV 확인 전입니다. 본 데모는 표준 주기 동기화(델타/전량)를 가정합니다.","sync.delta":"델타 동기화","sync.full":"전량 동기화","sync.listSize":"보유 의심목록","sync.history":"동기화 이력","sync.mode":"방식","sync.received":"수신","sync.add":"추가","sync.upd":"수정","sync.del":"삭제","sync.list":"수신 의심목록(행내 전달본)","sync.entryId":"ID","sync.identifier":"식별자","sync.kind":"유형","sync.reason":"사유","sync.deliveredHint":"보관·거래 스크리닝·경고 표출은 행내 영역입니다. → ‘고객 경고’ 탭에서 대조를 시연합니다.",
    "scr.title":"고객 경고 시뮬레이션 (행내 영역)","scr.hint":"실제 대조·경고는 행내(코어/채널)가 수행합니다. 게이트웨이가 전달한 의심목록으로 거래 시 경고를 시연합니다.","scr.recipient":"수취 계좌번호","scr.check":"송금하기","scr.examples":"예시","scr.hitTitle":"사기 의심 계좌 경고","scr.hitBody":"수취 계좌가 SIMO 의심목록에 등록되어 있습니다.","scr.continue":"계속 송금","scr.cancel":"송금 취소","scr.cleanTitle":"정상 계좌","scr.cleanBody":"의심목록에 없습니다. 송금을 진행합니다.","scr.reason":"사유","scr.needList":"행내에 의심목록이 없습니다. 먼저 ‘의심목록 ②’ 탭에서 동기화하세요.",
    "aud.title":"감사 로그","aud.time":"시각","aud.role":"역할","aud.action":"동작","aud.detail":"상세"
  },
  en:{
    subtitle:"SIMO Reporting Gateway","common.mockNote":"Mock SIMO (no SBV link)","common.close":"Close","common.page":"Page","common.prev":"Prev","common.next":"Next","common.loading":"Loading…",
    "role.label":"Role",
    "nav.dashboard":"Dashboard","nav.accounts":"In-bank Data","nav.reports":"Reporting ①","nav.sync":"Suspect List ②","nav.screening":"Screening","nav.audit":"Audit Log",
    "dash.kAccounts":"Accounts","dash.kSuspect":"Suspect","dash.kReports":"Report batches","dash.kAccepted":"SIMO accepted","dash.kRejected":"Rejected","dash.kBlacklist":"Suspect list held",
    "dash.trend":"SIMO accepted, last 7 days","dash.conn":"Connection","dash.recent":"Recent activity (audit)","dash.extranet":"Extranet link","dash.cert":"Digital certificate","dash.token":"Token session","dash.syncRow":"Suspect-list sync",
    "st.connected":"Connected","st.valid":"Valid","st.active":"Active","st.inactive":"None","st.waiting":"Idle","st.latest":"Up to date",
    "acc.title":"In-bank data / report candidates","acc.all":"All","acc.regular":"Regular","acc.suspect":"Suspect","acc.search":"Search name/account/CIF","acc.cif":"CIF","acc.name":"Customer","acc.acct":"Account","acc.status":"Status","acc.type":"Type",
    "rep.title":"Reporting ① (Bank → SIMO)","rep.build":"Build report","rep.service":"Service","rep.period":"Period","rep.buildBtn":"Build report →","rep.list":"Report batches","rep.id":"ID","rep.count":"Recs","rep.status":"Status","rep.maker":"Maker","rep.checker":"Checker","rep.code":"Resp","rep.accepted":"Acc.","rep.rejected":"Rej.","rep.retries":"Retry","rep.actions":"Actions","rep.approve":"Approve","rep.send":"Token·Send","rep.retry":"Fix·Retry","rep.detail":"Detail","rep.preview":"Outgoing payload preview","rep.rejTitle":"Rejected records","rep.idx":"Idx","rep.field":"Field","rep.reason":"Reason","rep.none":"No report batches.","rep.built":"Report built","rep.needChecker":"Approval requires the checker role. Switch role to checker (top right).","rep.segregation":"Maker and checker must differ (maker≠checker).",
    "sync.title":"Suspect list ② (SIMO → Bank)","sync.caveat":"⚠ The exact spec for the receive (②) direction is pending SBV confirmation. This demo assumes standard periodic sync (delta/full).","sync.delta":"Delta sync","sync.full":"Full sync","sync.listSize":"Suspect list held","sync.history":"Sync history","sync.mode":"Mode","sync.received":"Recv","sync.add":"Add","sync.upd":"Upd","sync.del":"Del","sync.list":"Received suspect list (delivered to core)","sync.entryId":"ID","sync.identifier":"Identifier","sync.kind":"Kind","sync.reason":"Reason","sync.deliveredHint":"Storage, transaction screening and warning display are the in-bank domain. → See the ‘Screening’ tab for the match demo.",
    "scr.title":"Customer-warning simulation (in-bank domain)","scr.hint":"Actual matching and warning run in-bank (core/channel). This shows how a warning fires at transaction time using the suspect list delivered by the gateway.","scr.recipient":"Recipient account","scr.check":"Transfer","scr.examples":"Examples","scr.hitTitle":"Fraud-suspect account warning","scr.hitBody":"The recipient account is on the SIMO suspect list.","scr.continue":"Continue transfer","scr.cancel":"Cancel transfer","scr.cleanTitle":"Clean account","scr.cleanBody":"Not on the suspect list. Proceeding with transfer.","scr.reason":"Reason","scr.needList":"No suspect list in-bank yet. Sync first on the ‘Suspect List ②’ tab.",
    "aud.title":"Audit log","aud.time":"Time","aud.role":"Role","aud.action":"Action","aud.detail":"Detail"
  },
  vi:{
    subtitle:"Cổng kết nối báo cáo SIMO","common.mockNote":"SIMO mô phỏng (chưa nối SBV)","common.close":"Đóng","common.page":"Trang","common.prev":"Trước","common.next":"Sau","common.loading":"Đang tải…",
    "role.label":"Vai trò",
    "nav.dashboard":"Bảng điều khiển","nav.accounts":"Dữ liệu nội bộ","nav.reports":"Báo cáo ①","nav.sync":"Danh sách nghi ngờ ②","nav.screening":"Cảnh báo","nav.audit":"Nhật ký",
    "dash.kAccounts":"Tài khoản","dash.kSuspect":"Nghi ngờ","dash.kReports":"Lô báo cáo","dash.kAccepted":"SIMO tiếp nhận","dash.kRejected":"Bị từ chối","dash.kBlacklist":"DS nghi ngờ đang giữ",
    "dash.trend":"SIMO tiếp nhận, 7 ngày qua","dash.conn":"Trạng thái kết nối","dash.recent":"Hoạt động gần đây","dash.extranet":"Đường Extranet","dash.cert":"Chứng thư số","dash.token":"Phiên token","dash.syncRow":"Đồng bộ DS nghi ngờ",
    "st.connected":"Đã nối","st.valid":"Hợp lệ","st.active":"Hoạt động","st.inactive":"Chưa cấp","st.waiting":"Chờ","st.latest":"Mới nhất",
    "acc.title":"Dữ liệu nội bộ / ứng viên báo cáo","acc.all":"Tất cả","acc.regular":"Định kỳ","acc.suspect":"Nghi ngờ","acc.search":"Tìm tên/tài khoản/CIF","acc.cif":"CIF","acc.name":"Khách hàng","acc.acct":"Số TK","acc.status":"Trạng thái","acc.type":"Loại",
    "rep.title":"Báo cáo ① (Ngân hàng → SIMO)","rep.build":"Tạo báo cáo","rep.service":"Dịch vụ","rep.period":"Kỳ","rep.buildBtn":"Tạo báo cáo →","rep.list":"Lô báo cáo","rep.id":"ID","rep.count":"Bản ghi","rep.status":"Trạng thái","rep.maker":"Người tạo","rep.checker":"Người duyệt","rep.code":"Mã","rep.accepted":"Nhận","rep.rejected":"Từ chối","rep.retries":"Thử lại","rep.actions":"Thao tác","rep.approve":"Duyệt","rep.send":"Token·Gửi","rep.retry":"Sửa·Gửi lại","rep.detail":"Chi tiết","rep.preview":"Xem trước gói tin gửi","rep.rejTitle":"Bản ghi bị từ chối","rep.idx":"STT","rep.field":"Trường","rep.reason":"Lý do","rep.none":"Chưa có lô báo cáo.","rep.built":"Đã tạo báo cáo","rep.needChecker":"Duyệt cần vai trò checker. Đổi vai trò sang checker (góc phải).","rep.segregation":"Người tạo và người duyệt phải khác nhau (maker≠checker).",
    "sync.title":"Danh sách nghi ngờ ② (SIMO → Ngân hàng)","sync.caveat":"⚠ Quy cách chiều nhận (②) đang chờ SBV xác nhận. Bản demo giả định đồng bộ định kỳ chuẩn (delta/toàn bộ).","sync.delta":"Đồng bộ delta","sync.full":"Đồng bộ toàn bộ","sync.listSize":"DS nghi ngờ đang giữ","sync.history":"Lịch sử đồng bộ","sync.mode":"Kiểu","sync.received":"Nhận","sync.add":"Thêm","sync.upd":"Sửa","sync.del":"Xóa","sync.list":"DS nghi ngờ đã nhận (chuyển nội bộ)","sync.entryId":"ID","sync.identifier":"Định danh","sync.kind":"Loại","sync.reason":"Lý do","sync.deliveredHint":"Lưu trữ, đối chiếu giao dịch và hiển thị cảnh báo là phần nội bộ ngân hàng. → Xem tab ‘Cảnh báo’.",
    "scr.title":"Mô phỏng cảnh báo khách hàng (nội bộ)","scr.hint":"Đối chiếu và cảnh báo thực hiện tại nội bộ (core/kênh). Đây là mô phỏng cảnh báo khi giao dịch bằng DS do gateway chuyển về.","scr.recipient":"Số TK người nhận","scr.check":"Chuyển tiền","scr.examples":"Ví dụ","scr.hitTitle":"Cảnh báo tài khoản nghi ngờ gian lận","scr.hitBody":"Tài khoản người nhận nằm trong DS nghi ngờ của SIMO.","scr.continue":"Vẫn chuyển","scr.cancel":"Hủy chuyển","scr.cleanTitle":"Tài khoản bình thường","scr.cleanBody":"Không có trong DS nghi ngờ. Tiến hành chuyển tiền.","scr.reason":"Lý do","scr.needList":"Chưa có DS nghi ngờ nội bộ. Hãy đồng bộ ở tab ‘Danh sách nghi ngờ ②’.",
    "aud.title":"Nhật ký kiểm toán","aud.time":"Thời gian","aud.role":"Vai trò","aud.action":"Hành động","aud.detail":"Chi tiết"
  }
};
const REASON_I18N = {
  ko:{FRAUD_SUSPECT:"사기 의심",MULE_ACCOUNT:"대포통장",REPORTED_POLICE:"수사기관 통보",ABNORMAL_FLOW:"이상 자금흐름",REMOVED:"해제"},
  en:{FRAUD_SUSPECT:"Fraud suspect",MULE_ACCOUNT:"Mule account",REPORTED_POLICE:"Reported by police",ABNORMAL_FLOW:"Abnormal flow",REMOVED:"Removed"},
  vi:{FRAUD_SUSPECT:"Nghi gian lận",MULE_ACCOUNT:"Tài khoản trung gian",REPORTED_POLICE:"Cơ quan CA báo",ABNORMAL_FLOW:"Dòng tiền bất thường",REMOVED:"Đã gỡ"}
};
const ERR_I18N = {
  ko:{ERR_REQUIRED:"필수값 누락",ERR_DATE_FORMAT:"날짜 형식 오류(dd/MM/yyyy)",ERR_ENUM:"허용값 아님",ERR_LEN:"길이 초과"},
  en:{ERR_REQUIRED:"Missing required",ERR_DATE_FORMAT:"Bad date format (dd/MM/yyyy)",ERR_ENUM:"Invalid enum value",ERR_LEN:"Too long"},
  vi:{ERR_REQUIRED:"Thiếu bắt buộc",ERR_DATE_FORMAT:"Sai định dạng ngày",ERR_ENUM:"Giá trị không hợp lệ",ERR_LEN:"Quá dài"}
};
const STATUS_I18N = {
  ko:["","활동","전자뱅킹중지","일시잠금","동결","해지"],
  en:["","Active","E-bank susp.","Locked","Frozen","Closed"],
  vi:["","Hoạt động","Tạm dừng eBank","Tạm khóa","Phong tỏa","Đã đóng"]
};

// ============================ state & helpers ============================
let LANG = "ko", ROLE = "maker";
const $ = s => document.querySelector(s);
const t = k => (I18N[LANG][k] !== undefined ? I18N[LANG][k] : (I18N.en[k]||k));
const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rsn = c => (REASON_I18N[LANG][c]||c);
const errt = c => (ERR_I18N[LANG][c]||c);
async function api(path, opts={}){
  opts.headers = Object.assign({ "x-role":ROLE, "content-type":"application/json" }, opts.headers||{});
  const r = await fetch(path, opts);
  return r.json();
}

// ============================ modal ============================
function modal(html, cls){
  $("#modal").className = "modal"+(cls?" "+cls:"");
  $("#modal").innerHTML = html;
  $("#modalBg").classList.add("show");
}
function closeModal(){ $("#modalBg").classList.remove("show"); }
$("#modalBg").addEventListener("click", e=>{ if(e.target===$("#modalBg")) closeModal(); });

// ============================ views ============================
const VIEW = {};

VIEW.dash = async ()=>{
  const v=$("#view"); v.innerHTML = `<div class="small">${t("common.loading")}</div>`;
  const [s,c,a] = await Promise.all([api("/api/stats"), api("/api/connection"), api("/api/audit")]);
  const card=(k,val)=>`<div class="card"><div class="k">${t(k)}</div><div class="v">${val}</div></div>`;
  const max=Math.max(...s.trend,10);
  const lbl=["-6","-5","-4","-3","-2","-1","="+t("st.latest").slice(0,2)];
  const bars=s.trend.map((x,i)=>`<div class="bar" style="height:${Math.round(x/max*100)}%"><span>${x}</span><em>${i===6?"●":lbl[i]}</em></div>`).join("");
  const cs=(on,onTxt,offTxt)=>`<span class="pill ${on?'on':''}">${on?onTxt:offTxt}</span>`;
  const aud=a.items.slice(0,8).map(x=>`<div><span style="color:#6fa8d6">[${x.ts.slice(11,19)}]</span> <b>${x.role}</b> ${x.action} — ${esc(x.detail)}</div>`).join("")||"—";
  v.innerHTML = `
    <div class="cards">
      ${card("dash.kAccounts",s.accounts)}${card("dash.kSuspect",s.suspect)}${card("dash.kReports",s.reports)}
      ${card("dash.kAccepted",s.accepted)}${card("dash.kRejected",s.rejected)}${card("dash.kBlacklist",s.blacklist)}
    </div>
    <div class="row">
      <div class="panel" style="flex:1.4"><h3>${t("dash.trend")}</h3><div class="chart">${bars}</div><div style="height:22px"></div></div>
      <div class="panel"><h3>${t("dash.conn")}</h3><table>
        <tr><td>${t("dash.extranet")}</td><td class="c">${cs(c.extranet,t("st.connected"),"-")}</td></tr>
        <tr><td>${t("dash.cert")}</td><td class="c">${cs(c.cert,t("st.valid"),"-")}</td></tr>
        <tr><td>${t("dash.token")}</td><td class="c">${cs(c.tokenActive,t("st.active"),t("st.inactive"))}</td></tr>
        <tr><td>${t("dash.syncRow")}</td><td class="c">${cs(!!c.lastSync,t("st.latest"),t("st.waiting"))}</td></tr>
      </table><p class="small" style="margin-top:10px">SIMO: <code class="k">${esc(c.simoHost)}</code></p></div>
    </div>
    <div class="panel"><h3>${t("dash.recent")}</h3><div class="log">${aud}</div></div>`;
};

VIEW.accounts = (()=>{ let page=1,type="",q="";
  return async ()=>{
    const v=$("#view");
    const d=await api(`/api/accounts?page=${page}&size=10&type=${type}&q=${encodeURIComponent(q)}`);
    const stMap=STATUS_I18N[LANG];
    const rows=d.items.map(a=>`<tr><td>${a.Cif}</td><td>${esc(a.TenKhachHang)}</td><td>${a.SoTaiKhoan||'<span class="tag sus">'+errt("ERR_REQUIRED")+'</span>'}</td>
      <td class="c">${stMap[a.TrangThaiHoatDongTaiKhoan]||a.TrangThaiHoatDongTaiKhoan}</td>
      <td class="c"><span class="tag ${a._type==='SUSPECT'?'sus':'reg'}">${a._type==='SUSPECT'?t("acc.suspect"):t("acc.regular")}</span></td></tr>`).join("");
    const pages=Math.ceil(d.total/d.size);
    v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("acc.title")}</h2>
      <div class="panel">
        <div class="btnrow" style="margin-bottom:12px">
          <select class="ui2" id="fType"><option value="">${t("acc.all")} (${d.regular+d.suspect})</option><option value="REGULAR">${t("acc.regular")} (${d.regular})</option><option value="SUSPECT">${t("acc.suspect")} (${d.suspect})</option></select>
          <input class="ui" id="fQ" placeholder="${t("acc.search")}" value="${esc(q)}" style="min-width:220px">
          <button class="btn ghost sm" id="fGo">🔍</button>
        </div>
        <table><thead><tr><th>${t("acc.cif")}</th><th>${t("acc.name")}</th><th>${t("acc.acct")}</th><th class="c">${t("acc.status")}</th><th class="c">${t("acc.type")}</th></tr></thead><tbody>${rows}</tbody></table>
        <div class="pager"><button class="btn ghost sm" id="pPrev" ${page<=1?'disabled':''}>${t("common.prev")}</button>
          <span>${t("common.page")} ${d.page} / ${pages}</span>
          <button class="btn ghost sm" id="pNext" ${page>=pages?'disabled':''}>${t("common.next")}</button>
          <span class="small">· total ${d.total}</span></div>
      </div>`;
    $("#fType").value=type; $("#fType").onchange=e=>{type=e.target.value;page=1;VIEW.accounts();};
    $("#fGo").onclick=()=>{q=$("#fQ").value;page=1;VIEW.accounts();};
    $("#fQ").addEventListener("keydown",e=>{if(e.key==="Enter"){q=$("#fQ").value;page=1;VIEW.accounts();}});
    $("#pPrev").onclick=()=>{if(page>1){page--;VIEW.accounts();}};
    $("#pNext").onclick=()=>{if(page<pages){page++;VIEW.accounts();}};
  };
})();

VIEW.reports = async ()=>{
  const v=$("#view");
  const d=await api("/api/reports");
  const opt=`<option value="simo_001">simo_001 · ${t("acc.regular")} (TKTT)</option><option value="simo_002">simo_002 · ${t("acc.suspect")} (TKTT)</option><option value="simo_004">simo_004 · KYC update</option>`;
  const badge=s=>`<span class="tag ${s}">${s}</span>`;
  const rows=d.items.map(r=>{
    let act=`<button class="btn ghost sm" onclick="showReport('${r.id}')">${t("rep.detail")}</button> `;
    if(r.status==="DRAFT") act+=`<button class="btn sm" onclick="approveRep('${r.id}')">${t("rep.approve")}</button>`;
    else if(r.status==="APPROVED") act+=`<button class="btn blue sm" onclick="sendRep('${r.id}')">${t("rep.send")}</button>`;
    else if(r.status==="PARTIAL"||r.status==="FAILED") act+=`<button class="btn sm" onclick="retryRep('${r.id}')">${t("rep.retry")}</button>`;
    return `<tr><td>${r.id}</td><td>${r.svc}</td><td class="c">${r.count}</td><td class="c">${badge(r.status)}</td>
      <td class="c">${r.maker||'-'}/${r.checker||'-'}</td><td class="c">${r.code?('code '+r.code):'-'}</td>
      <td class="c">${r.accepted??'-'}/${r.rejectedCount||0}</td><td class="c">${r.retries}</td><td>${act}</td></tr>`;
  }).join("") || `<tr><td colspan="9" class="muted">${t("rep.none")}</td></tr>`;
  v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("rep.title")}</h2>
    <div class="panel"><h3>${t("rep.build")}</h3>
      <div class="btnrow">
        <select class="ui2" id="bSvc">${opt}</select>
        <input class="ui" id="bKy" value="06/2026" style="width:110px">
        <button class="btn" id="bGo">${t("rep.buildBtn")}</button>
        <span class="small">maker=${ROLE}</span>
      </div>
    </div>
    <div class="panel"><h3>${t("rep.list")}</h3>
      <table><thead><tr><th>${t("rep.id")}</th><th>${t("rep.service")}</th><th class="c">${t("rep.count")}</th><th class="c">${t("rep.status")}</th>
        <th class="c">${t("rep.maker")}/${t("rep.checker")}</th><th class="c">${t("rep.code")}</th><th class="c">${t("rep.accepted")}/${t("rep.rejected")}</th><th class="c">${t("rep.retries")}</th><th>${t("rep.actions")}</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  $("#bGo").onclick=async()=>{
    const r=await api("/api/reports/build",{method:"POST",body:JSON.stringify({svc:$("#bSvc").value,ky:$("#bKy").value})});
    toast(`${t("rep.built")}: ${r.id} · ${r.count} · ${r.maYeuCau}`); VIEW.reports();
  };
};

window.approveRep = async id=>{
  const r=await api(`/api/reports/${id}/approve`,{method:"POST"});
  if(r.error==="NEED_CHECKER") return modal(box("🔒",t("rep.approve"),t("rep.needChecker")));
  if(r.error==="SEGREGATION") return modal(box("🔒",t("rep.approve"),t("rep.segregation")));
  VIEW.reports();
};
window.sendRep = async id=>{
  const r=await api(`/api/reports/${id}/send`,{method:"POST"});
  const resp=r.response||{};
  const ok=resp.code==="00";
  modal(box(ok?"✅":"⚠", "code "+resp.code+(ok?" · success":" · partial"),
    `${esc(resp.message||"")}<br><br><b>${resp.accepted??0}</b> ${t("rep.accepted")} / <b>${resp.rejectedCount||0}</b> ${t("rep.rejected")} (total ${resp.total||0})`),
    ok?"":"warn");
  VIEW.reports();
};
window.retryRep = async id=>{ await api(`/api/reports/${id}/retry`,{method:"POST"}); toast("records corrected → "+t("rep.send")); VIEW.reports(); };
window.showReport = async id=>{
  const r=await api(`/api/reports/${id}`);
  const rej=(r.rejected||[]).slice(0,20).map(x=>`<tr><td class="c">${x.index}</td><td>${x.account||'-'}</td><td>${x.field}</td><td>${errt(x.code)}</td></tr>`).join("");
  const rejBlock=(r.rejected&&r.rejected.length)?`<h4 style="color:var(--warn);font-size:13px">${t("rep.rejTitle")} (${r.rejected.length})</h4>
    <table><thead><tr><th class="c">${t("rep.idx")}</th><th>${t("acc.acct")}</th><th>${t("rep.field")}</th><th>${t("rep.reason")}</th></tr></thead><tbody>${rej}</tbody></table><br>`:"";
  const hdr=`POST ${"/simo/tktt/1.0/upload-bao-cao-danh-sach-tktt-api"}\nHost: mgsimo.sbv.gov.vn\nAuthorization: Bearer {token}\nmaYeuCau: ${r.maYeuCau}\nkyBaoCao: ${r.ky}\n\n`;
  modal(`<div class="kv">${r.id} · ${r.svc} · ${r.count} recs · <span class="tag ${r.status}">${r.status}</span></div>
    ${rejBlock}<h4 style="font-size:13px">${t("rep.preview")}</h4>
    <pre>${esc(hdr+JSON.stringify(r.records.slice(0,3),null,2))}\n... (${r.count} ${t("rep.count")})${r.response?("\n\n// response\n"+JSON.stringify(r.response,null,2).slice(0,800)):""}</pre>
    <div class="btnrow" style="justify-content:flex-end;margin-top:14px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`);
};

VIEW.sync = async ()=>{
  const v=$("#view");
  const [bl,h]=await Promise.all([api("/api/blacklist?size=12"),api("/api/sync-history")]);
  const hist=h.items.map(x=>`<tr><td>#${x.id}</td><td>${x.mode}</td><td class="c">${x.received}</td><td class="c">+${x.add}</td><td class="c">~${x.upd}</td><td class="c">-${x.del}</td><td class="c">${x.listSize}</td><td class="small">${new Date(x.at).toLocaleTimeString()}</td></tr>`).join("")||`<tr><td colspan="8" class="muted">—</td></tr>`;
  const items=bl.items.map(x=>`<tr><td>${x.entryId}</td><td>${x.identifier}</td><td class="c">${x.kind}</td><td>${rsn(x.reason)}</td></tr>`).join("")||`<tr><td colspan="4" class="muted">—</td></tr>`;
  v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("sync.title")}</h2>
    <div class="hint warn">${t("sync.caveat")}</div>
    <div class="panel"><div class="btnrow">
        <button class="btn blue" id="sDelta">${t("sync.delta")}</button>
        <button class="btn ghost" id="sFull">${t("sync.full")}</button>
        <span class="small">${t("sync.listSize")}: <b>${bl.total}</b></span></div>
      <div class="hint" style="margin-top:12px">${t("sync.deliveredHint")}</div></div>
    <div class="row">
      <div class="panel" style="flex:1.2"><h3>${t("sync.list")}</h3>
        <table><thead><tr><th>${t("sync.entryId")}</th><th>${t("sync.identifier")}</th><th class="c">${t("sync.kind")}</th><th>${t("sync.reason")}</th></tr></thead><tbody>${items}</tbody></table>
        <p class="small" style="margin-top:8px">total ${bl.total}</p></div>
      <div class="panel"><h3>${t("sync.history")}</h3>
        <table><thead><tr><th>#</th><th>${t("sync.mode")}</th><th class="c">${t("sync.received")}</th><th class="c">${t("sync.add")}</th><th class="c">${t("sync.upd")}</th><th class="c">${t("sync.del")}</th><th class="c">list</th><th></th></tr></thead><tbody>${hist}</tbody></table></div>
    </div>`;
  $("#sDelta").onclick=async()=>{const r=await api("/api/sync",{method:"POST",body:JSON.stringify({mode:"delta"})});toast(`delta +${r.add}/~${r.upd}/-${r.del} → list ${r.listSize}`);VIEW.sync();};
  $("#sFull").onclick=async()=>{const r=await api("/api/sync",{method:"POST",body:JSON.stringify({mode:"full"})});toast(`full → list ${r.listSize}`);VIEW.sync();};
};

VIEW.screening = async ()=>{
  const v=$("#view");
  v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("scr.title")}</h2>
    <div class="hint">${t("scr.hint")}</div>
    <div class="panel" style="max-width:580px"><h3>${t("scr.recipient")}</h3>
      <div class="btnrow"><input class="ui" id="rcv" placeholder="9988776655" style="flex:1;min-width:220px"><button class="btn" id="scrGo">${t("scr.check")}</button></div>
      <div class="btnrow" style="margin-top:10px"><span class="small">${t("scr.examples")}:</span>
        <button class="btn ghost sm" onclick="document.querySelector('#rcv').value='9988776655'">9988776655</button>
        <button class="btn ghost sm" onclick="document.querySelector('#rcv').value='1234509876'">1234509876</button>
        <button class="btn ghost sm" onclick="document.querySelector('#rcv').value='5551234567'">5551234567</button></div>
      <p class="small" id="scrNote" style="margin-top:12px"></p></div>`;
  $("#scrGo").onclick=async()=>{
    const acct=$("#rcv").value.trim(); if(!acct) return;
    const r=await api("/api/screen",{method:"POST",body:JSON.stringify({account:acct})});
    if(r.listSize===0){ $("#scrNote").innerHTML=`<span style="color:var(--amber)">${t("scr.needList")}</span>`; return; }
    if(r.hit){
      modal(box("⚠",t("scr.hitTitle"),`${t("scr.hitBody")}<br><b>${esc(acct)}</b> · ${t("scr.reason")}: ${rsn(r.entry.reason)}`)+
        `<div class="btnrow" style="justify-content:center;margin-top:8px"><button class="btn ghost" onclick="closeModal()">${t("scr.cancel")}</button><button class="btn" onclick="closeModal()">${t("scr.continue")}</button></div>`,"warn");
      $("#scrNote").innerHTML=`<span style="color:var(--warn)">⚠ HIT — ${rsn(r.entry.reason)}</span>`;
    } else {
      modal(box("✅",t("scr.cleanTitle"),t("scr.cleanBody"))+`<div class="btnrow" style="justify-content:center;margin-top:8px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`);
      $("#scrNote").innerHTML=`<span style="color:var(--ok)">clean</span>`;
    }
  };
};

VIEW.audit = async ()=>{
  const v=$("#view"); const d=await api("/api/audit");
  const rows=d.items.map(x=>`<tr><td class="small">${x.ts.replace('T',' ').slice(0,19)}</td><td><b>${x.role}</b></td><td>${x.action}</td><td>${esc(x.detail)}</td></tr>`).join("")||`<tr><td colspan="4" class="muted">—</td></tr>`;
  v.innerHTML=`<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>${t("aud.title")}</h2>
    <div class="panel"><table><thead><tr><th>${t("aud.time")}</th><th>${t("aud.role")}</th><th>${t("aud.action")}</th><th>${t("aud.detail")}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
};

function box(ic,title,body){ return `<div class="ic">${ic}</div><h4 style="text-align:center">${esc(title)}</h4><p style="text-align:center;color:var(--gray);font-size:13px;line-height:1.6">${body}</p>`; }
function toast(msg){ modal(box("ℹ️","",msg)+`<div class="btnrow" style="justify-content:center;margin-top:6px"><button class="btn" onclick="closeModal()">${t("common.close")}</button></div>`); setTimeout(()=>{ if($("#modalBg").classList.contains("show")) closeModal(); },1500); }

// ============================ shell wiring ============================
let CUR="dash";
function applyStatic(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{ const k=el.getAttribute("data-i18n"); el.textContent=t(k); });
  $("#viewTitle").textContent = t("nav."+(CUR==="dash"?"dashboard":CUR));
  document.documentElement.lang = LANG;
}
function go(view){ CUR=view; document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  applyStatic(); VIEW[view](); }
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>go(b.dataset.view));
$("#langSel").onchange=e=>{ LANG=e.target.value; applyStatic(); VIEW[CUR](); };
$("#roleSel").onchange=e=>{ ROLE=e.target.value; if(CUR==="reports"||CUR==="audit") VIEW[CUR](); };
window.closeModal=closeModal;
window.go=go; window.api=api; window.VIEW=VIEW;
applyStatic(); VIEW.dash();
