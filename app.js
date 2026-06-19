/* InfoPlus SIMO Relay Gateway - Portal v3 (operator console, KO/EN/VI) */
"use strict";
const I18N={
 ko:{
  subtitle:"SIMO 중계 게이트웨이","common.mockNote":"모의 SIMO","common.close":"닫기","common.page":"페이지","common.prev":"이전","common.next":"다음","common.loading":"불러오는 중…","common.detail":"상세","common.query":"조회","common.all":"전체","common.clear":"필터 해제",
  "nav.dashboard":"대시보드","nav.out":"은행 → SIMO","nav.suspect":"SIMO → 은행","nav.txlog":"처리 로그","nav.sample":"샘플 테스트",
  "dash.kToday":"오늘 보고","dash.kRate":"오늘 성공률","dash.kTotal":"누적 보고","dash.kRecords":"누적 대상건수","dash.kSuspect":"의심목록 보유","dash.kSync":"최종 동기화",
  "dash.trend":"최근 7일 보고 건수","dash.conn":"연동 상태","dash.recent":"최근 처리","dash.extranet":"Extranet 회선","dash.cert":"전자서명 인증서","dash.token":"토큰 세션","dash.syncRow":"의심목록 동기화",
  "st.connected":"연결","st.valid":"유효","st.active":"활성","st.none":"미발급","st.idle":"미수신","st.latest":"최신","st.never":"미동기화",
  "out.title":"은행 → SIMO (보고 현황)","out.flowCore":"코어뱅킹","out.flowGw":"InfoPlus GW (중계·로깅)","out.flowSimo":"SIMO",
  "out.segToday":"실시간 현황(오늘)","out.segDate":"일자별 조회","out.perApi":"API별 오늘 요약","out.recent":"최근 거래","out.gen":"데모 거래 생성",
  "out.cCount":"건수","out.cOk":"성공","out.cPartial":"부분","out.cFail":"실패","out.cTarget":"대상건수","out.cApi":"API","out.cMode":"방식","out.cTime":"시각","out.cResult":"결과","out.none":"거래 없음","out.filtered":"API 필터",
  "out.from":"시작일","out.to":"종료일","out.api":"API","out.dailySum":"일자별 요약","out.cDate":"일자","out.dayDetail":"일자 상세 (시간별)",
  "out.dTitle":"거래 상세 (SIMO 전송 전문)","out.req":"요청","out.res":"응답","out.recvN":"SIMO 수신","out.rejN":"반려","out.rejList":"반려 내역","out.body":"전문 본문 (표본)","out.map":"레이아웃 매핑","out.raw":"원문(JSON)","out.rec":"표본","out.fNo":"No","out.fName":"필드","out.fType":"타입","out.fReq":"필수","out.fDesc":"설명","out.fVal":"값","out.allRecs":"전체 대상 레코드","out.search":"계좌·고객명·CIF·전화 검색","out.cAcc":"계좌번호","out.cDob":"생년월일","out.cStatus":"상태","out.statusOK":"정상","out.noMatch":"검색 결과가 없습니다","out.showing":"표시","out.excel":"Excel 다운로드","out.exporting":"내보내는 중…",
  "mode.BATCH":"배치","mode.EVENT":"건별",
  "in.title":"SIMO → 은행 (의심목록)","in.lastSync":"최종 동기화","in.version":"목록 버전","in.size":"보유 건수","in.syncNow":"지금 동기화",
  "in.hint":"SIMO 의심목록은 모든 은행 공통(글로벌)입니다. ‘지금 동기화’는 전체 스냅샷을 받아 코어로 전달합니다. (증분 갱신은 전송량만 줄이는 내부 최적화로 결과는 동일.)",
  "in.recon":"수신 ↔ 전송 상호 체크","in.rRecv":"SIMO 수신","in.rDeliver":"코어 전송","in.rMatch":"일치","in.rTime":"시각",
  "in.list":"전체 의심목록","in.cIdent":"계좌·지갑번호","in.cName":"고객명","in.cKind":"유형","in.cReason":"사유","in.cReg":"등록일","in.cSource":"출처","in.none":"의심목록이 없습니다. ‘지금 동기화’를 누르세요.",
  "in.check":"건별 SIMO 데이터 확인 및 수신","in.checkHint":"특정 계좌·지갑번호의 SIMO 등록 여부를 직접 조회하고, 등록 시 목록에 수신·반영합니다.","in.checkBtn":"SIMO 확인","in.idHelp":"계좌·지갑번호 = 수취 대상(결제계좌·전자지갑·카드)의 식별 키",
  "in.dTitle":"의심 항목 상세 (SIMO 포맷)","kind.ACCOUNT":"계좌","kind.EWALLET":"전자지갑","kind.CARD":"카드","src.SYNC":"동기화","src.QUERY":"건별확인",
  "in.qHit":"SIMO 등록 계좌","in.qClean":"SIMO 미등록","examples":"예시",
  "sample.title":"샘플 테스트 (로컬 대조 데모)","sample.hint":"실제 대조·경고는 코어(거래/채널)가 수행합니다. 본 화면은 보유 목록과의 로컬 대조 샘플입니다(SIMO 직접 조회는 ‘SIMO → 은행’의 건별 확인).",
  "sample.acc":"조회 계좌번호","sample.check":"대조 실행","sample.hit":"의심목록 일치","sample.clean":"정상(미일치)","sample.reason":"사유","sample.need":"보유 의심목록이 없습니다. 먼저 ‘SIMO → 은행’에서 동기화하세요.",
  "tx.title":"처리 로그","tx.time":"시각","tx.type":"유형","tx.svc":"API","tx.summary":"내용","tx.result":"결과",
  "txt.REPORT":"보고 중계","txt.SUSPECT_SYNC":"의심목록 동기화","txt.SUSPECT_CHECK":"건별 확인","txt.SCREEN":"샘플 대조"
 },
 en:{
  subtitle:"SIMO Relay Gateway","common.mockNote":"Mock SIMO","common.close":"Close","common.page":"Page","common.prev":"Prev","common.next":"Next","common.loading":"Loading…","common.detail":"Detail","common.query":"Search","common.all":"All","common.clear":"Clear filter",
  "nav.dashboard":"Dashboard","nav.out":"Bank → SIMO","nav.suspect":"SIMO → Bank","nav.txlog":"Transaction Log","nav.sample":"Sample Test",
  "dash.kToday":"Today reports","dash.kRate":"Today success","dash.kTotal":"Total reports","dash.kRecords":"Total target recs","dash.kSuspect":"Suspect held","dash.kSync":"Last sync",
  "dash.trend":"Reports, last 7 days","dash.conn":"Connection","dash.recent":"Recent processing","dash.extranet":"Extranet link","dash.cert":"Digital certificate","dash.token":"Token session","dash.syncRow":"Suspect-list sync",
  "st.connected":"Connected","st.valid":"Valid","st.active":"Active","st.none":"None","st.idle":"Not synced","st.latest":"Up to date","st.never":"Never",
  "out.title":"Bank → SIMO (reporting status)","out.flowCore":"Core Banking","out.flowGw":"InfoPlus GW (relay/log)","out.flowSimo":"SIMO",
  "out.segToday":"Live (today)","out.segDate":"By date","out.perApi":"Per-API today","out.recent":"Recent transactions","out.gen":"Generate demo tx",
  "out.cCount":"Count","out.cOk":"OK","out.cPartial":"Partial","out.cFail":"Fail","out.cTarget":"Target recs","out.cApi":"API","out.cMode":"Mode","out.cTime":"Time","out.cResult":"Result","out.none":"No transactions","out.filtered":"API filter",
  "out.from":"From","out.to":"To","out.api":"API","out.dailySum":"Daily summary","out.cDate":"Date","out.dayDetail":"Day detail (by time)",
  "out.dTitle":"Transaction detail (SIMO message)","out.req":"Request","out.res":"Response","out.recvN":"SIMO accepted","out.rejN":"Rejected","out.rejList":"Rejected records","out.body":"Message body (sample)","out.map":"Layout mapping","out.raw":"Raw (JSON)","out.rec":"Sample","out.fNo":"No","out.fName":"Field","out.fType":"Type","out.fReq":"Req","out.fDesc":"Description","out.fVal":"Value","out.allRecs":"All target records","out.search":"Search account / name / CIF","out.cAcc":"Account no.","out.cDob":"DOB","out.cStatus":"Status","out.statusOK":"OK","out.noMatch":"No matching records","out.showing":"Showing","out.excel":"Download Excel","out.exporting":"Exporting…",
  "mode.BATCH":"Batch","mode.EVENT":"Event",
  "in.title":"SIMO → Bank (suspect list)","in.lastSync":"Last sync","in.version":"List version","in.size":"Held","in.syncNow":"Sync now",
  "in.hint":"The SIMO suspect list is global (identical for all banks). ‘Sync now’ pulls the full snapshot and forwards it to core. (Incremental is just a transfer optimization — same result.)",
  "in.recon":"Receive ↔ Forward reconciliation","in.rRecv":"SIMO received","in.rDeliver":"Forwarded to core","in.rMatch":"Match","in.rTime":"Time",
  "in.list":"Full suspect list","in.cIdent":"Account/Wallet no.","in.cName":"Name","in.cKind":"Kind","in.cReason":"Reason","in.cReg":"Registered","in.cSource":"Source","in.none":"Empty. Click ‘Sync now’.",
  "in.check":"Per-item SIMO check & receive","in.checkHint":"Directly query whether an account/wallet is in SIMO; if registered, receive it into the list.","in.checkBtn":"Check SIMO","in.idHelp":"Account/Wallet no. = identifier key of the recipient (account / e-wallet / card)",
  "in.dTitle":"Suspect item detail (SIMO format)","kind.ACCOUNT":"Account","kind.EWALLET":"E-wallet","kind.CARD":"Card","src.SYNC":"Sync","src.QUERY":"Check",
  "in.qHit":"Registered in SIMO","in.qClean":"Not in SIMO","examples":"Examples",
  "sample.title":"Sample Test (local match demo)","sample.hint":"Actual matching/warning runs in core. This is a local match against the held list (direct SIMO query is under ‘SIMO → Bank’).",
  "sample.acc":"Account number","sample.check":"Run match","sample.hit":"Suspect-list match","sample.clean":"Clean (no match)","sample.reason":"Reason","sample.need":"No suspect list held. Sync first under ‘SIMO → Bank’.",
  "tx.title":"Transaction log","tx.time":"Time","tx.type":"Type","tx.svc":"API","tx.summary":"Detail","tx.result":"Result",
  "txt.REPORT":"Report relay","txt.SUSPECT_SYNC":"Suspect sync","txt.SUSPECT_CHECK":"Per-item check","txt.SCREEN":"Sample match"
 },
 vi:{
  subtitle:"Cổng trung chuyển SIMO","common.mockNote":"SIMO mô phỏng","common.close":"Đóng","common.page":"Trang","common.prev":"Trước","common.next":"Sau","common.loading":"Đang tải…","common.detail":"Chi tiết","common.query":"Tra cứu","common.all":"Tất cả","common.clear":"Bỏ lọc",
  "nav.dashboard":"Bảng điều khiển","nav.out":"Ngân hàng → SIMO","nav.suspect":"SIMO → Ngân hàng","nav.txlog":"Nhật ký xử lý","nav.sample":"Kiểm thử mẫu",
  "dash.kToday":"Báo cáo hôm nay","dash.kRate":"Tỷ lệ thành công","dash.kTotal":"Tổng báo cáo","dash.kRecords":"Tổng bản ghi","dash.kSuspect":"DS nghi ngờ","dash.kSync":"Đồng bộ cuối",
  "dash.trend":"Báo cáo 7 ngày","dash.conn":"Kết nối","dash.recent":"Xử lý gần đây","dash.extranet":"Đường Extranet","dash.cert":"Chứng thư số","dash.token":"Phiên token","dash.syncRow":"Đồng bộ DS",
  "st.connected":"Đã nối","st.valid":"Hợp lệ","st.active":"Hoạt động","st.none":"Chưa cấp","st.idle":"Chưa đồng bộ","st.latest":"Mới nhất","st.never":"Chưa",
  "out.title":"Ngân hàng → SIMO (tình trạng báo cáo)","out.flowCore":"Core Banking","out.flowGw":"InfoPlus GW (trung chuyển/log)","out.flowSimo":"SIMO",
  "out.segToday":"Trực tiếp (hôm nay)","out.segDate":"Theo ngày","out.perApi":"Theo API hôm nay","out.recent":"Giao dịch gần đây","out.gen":"Tạo giao dịch demo",
  "out.cCount":"Số","out.cOk":"OK","out.cPartial":"Một phần","out.cFail":"Lỗi","out.cTarget":"Bản ghi","out.cApi":"API","out.cMode":"Kiểu","out.cTime":"Thời gian","out.cResult":"Kết quả","out.none":"Không có","out.filtered":"Lọc API",
  "out.from":"Từ ngày","out.to":"Đến ngày","out.api":"API","out.dailySum":"Tóm tắt theo ngày","out.cDate":"Ngày","out.dayDetail":"Chi tiết ngày (theo giờ)",
  "out.dTitle":"Chi tiết giao dịch (gói tin SIMO)","out.req":"Yêu cầu","out.res":"Phản hồi","out.recvN":"SIMO nhận","out.rejN":"Từ chối","out.rejList":"Bản ghi bị từ chối","out.body":"Nội dung (mẫu)","out.map":"Ánh xạ layout","out.raw":"Gốc (JSON)","out.rec":"Mẫu","out.fNo":"No","out.fName":"Trường","out.fType":"Kiểu","out.fReq":"BB","out.fDesc":"Mô tả","out.fVal":"Giá trị","out.allRecs":"Toàn bộ bản ghi","out.search":"Tìm TK / tên / CIF","out.cAcc":"Số TK","out.cDob":"Ngày sinh","out.cStatus":"Trạng thái","out.statusOK":"OK","out.noMatch":"Không có kết quả","out.showing":"Hiển thị","out.excel":"Tải Excel","out.exporting":"Đang xuất…",
  "mode.BATCH":"Lô","mode.EVENT":"Sự kiện",
  "in.title":"SIMO → Ngân hàng (danh sách nghi ngờ)","in.lastSync":"Đồng bộ cuối","in.version":"Phiên bản","in.size":"Đang giữ","in.syncNow":"Đồng bộ ngay",
  "in.hint":"Danh sách nghi ngờ SIMO là chung cho mọi ngân hàng. ‘Đồng bộ ngay’ lấy toàn bộ snapshot và chuyển cho core. (Tăng dần chỉ tối ưu truyền — kết quả như nhau.)",
  "in.recon":"Đối soát Nhận ↔ Chuyển","in.rRecv":"SIMO nhận","in.rDeliver":"Chuyển core","in.rMatch":"Khớp","in.rTime":"Thời gian",
  "in.list":"Toàn bộ danh sách nghi ngờ","in.cIdent":"Số TK/Ví","in.cName":"Tên KH","in.cKind":"Loại","in.cReason":"Lý do","in.cReg":"Ngày ĐK","in.cSource":"Nguồn","in.none":"Trống. Hãy bấm ‘Đồng bộ ngay’.",
  "in.check":"Kiểm tra & nhận theo mục từ SIMO","in.checkHint":"Truy vấn trực tiếp một TK/ví có trong SIMO không; nếu có thì nhận vào danh sách.","in.checkBtn":"Kiểm tra SIMO","in.idHelp":"Số TK/Ví = khóa định danh của bên nhận (TK/ví/thẻ)",
  "in.dTitle":"Chi tiết mục nghi ngờ (định dạng SIMO)","kind.ACCOUNT":"Tài khoản","kind.EWALLET":"Ví điện tử","kind.CARD":"Thẻ","src.SYNC":"Đồng bộ","src.QUERY":"Kiểm tra",
  "in.qHit":"Có trong SIMO","in.qClean":"Không có trong SIMO","examples":"Ví dụ",
  "sample.title":"Kiểm thử mẫu (đối chiếu cục bộ)","sample.hint":"Đối chiếu/cảnh báo thực hiện tại core. Đây là đối chiếu cục bộ với danh sách đang giữ.","sample.acc":"Số tài khoản","sample.check":"Đối chiếu","sample.hit":"Trùng danh sách","sample.clean":"Bình thường","sample.reason":"Lý do","sample.need":"Chưa có danh sách. Hãy đồng bộ ở ‘SIMO → Ngân hàng’.",
  "tx.title":"Nhật ký xử lý","tx.time":"Thời gian","tx.type":"Loại","tx.svc":"API","tx.summary":"Nội dung","tx.result":"Kết quả",
  "txt.REPORT":"Trung chuyển báo cáo","txt.SUSPECT_SYNC":"Đồng bộ DS","txt.SUSPECT_CHECK":"Kiểm tra mục","txt.SCREEN":"Đối chiếu mẫu"
 }
};
const REASON_I18N={ ko:{FRAUD_SUSPECT:"사기 의심",MULE_ACCOUNT:"대포통장",REPORTED_POLICE:"수사기관 통보",ABNORMAL_FLOW:"이상 자금흐름"},
 en:{FRAUD_SUSPECT:"Fraud suspect",MULE_ACCOUNT:"Mule account",REPORTED_POLICE:"Reported by police",ABNORMAL_FLOW:"Abnormal flow"},
 vi:{FRAUD_SUSPECT:"Nghi gian lận",MULE_ACCOUNT:"TK trung gian",REPORTED_POLICE:"CA thông báo",ABNORMAL_FLOW:"Dòng tiền bất thường"} };
const ERR_I18N={ ko:{ERR_REQUIRED:"필수값 누락",ERR_DATE_FORMAT:"날짜형식 오류",ERR_ENUM:"허용값 아님"},
 en:{ERR_REQUIRED:"Missing required",ERR_DATE_FORMAT:"Bad date format",ERR_ENUM:"Invalid value"},
 vi:{ERR_REQUIRED:"Thiếu bắt buộc",ERR_DATE_FORMAT:"Sai định dạng",ERR_ENUM:"Giá trị sai"} };

let LANG="ko", CUR="dash";
const $=s=>document.querySelector(s);
const t=k=>(I18N[LANG][k]!==undefined?I18N[LANG][k]:(I18N.en[k]||k));
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rsn=c=>(REASON_I18N[LANG][c]||c); const errt=c=>(ERR_I18N[LANG][c]||c); const tt=ty=>(t("txt."+ty)||ty);
const kindL=k=>(t("kind."+k)||k); const srcL=s=>(t("src."+s)||s);
const hhmmss=ts=>new Date(ts).toLocaleTimeString(); const ymd=ts=>new Date(ts).toISOString().slice(0,10);
const codeTag=c=>'<span class="tag '+(c==='00'?'ok':(c==='01'?'warn':'bad'))+'">code '+c+'</span>';
async function api(p,o){ o=o||{}; o.headers=Object.assign({"content-type":"application/json"},o.headers||{}); return (await fetch(p,o)).json(); }
function modal(html,cls){ $("#modal").className="modal"+(cls?" "+cls:""); $("#modal").innerHTML=html; $("#modalBg").classList.add("show"); }
function closeModal(){ $("#modalBg").classList.remove("show"); }
$("#modalBg").addEventListener("click",e=>{ if(e.target===$("#modalBg")) closeModal(); });
function box(ic,title,body){ return '<div class="ic">'+ic+'</div><h4 style="text-align:center">'+esc(title)+'</h4><div style="text-align:center;color:var(--gray);font-size:13px;line-height:1.6">'+body+'</div>'; }
function toast(msg){ modal(box("ℹ️","",msg)+'<div class="btnrow" style="justify-content:center;margin-top:8px"><button class="btn" onclick="closeModal()">'+t("common.close")+'</button></div>'); setTimeout(()=>{ if($("#modalBg").classList.contains("show")) closeModal(); },1600); }
const VIEW={};

VIEW.dash=async()=>{
  const v=$("#view"); v.innerHTML='<div class="small">'+t("common.loading")+'</div>';
  const a=await Promise.all([api("/api/stats"),api("/api/connection"),api("/api/txlog")]); const s=a[0],c=a[1],x=a[2];
  const rate=s.today.count?Math.round((s.today.ok/s.today.count)*100):0;
  const card=(k,val)=>'<div class="card"><div class="k">'+t(k)+'</div><div class="v">'+val+'</div></div>';
  const mx=Math.max.apply(null,s.trend.concat([5])); const bars=s.trend.map((n,i)=>'<div class="bar" style="height:'+Math.round(n/mx*100)+'%"><span>'+n+'</span><em>'+(i===6?"●":("-"+(6-i)))+'</em></div>').join("");
  const cs=(on,aa,bb)=>'<span class="pill '+(on?'on':'')+'">'+(on?aa:bb)+'</span>';
  const sync=s.lastSync?hhmmss(s.lastSync):t("st.never");
  const xl=x.items.slice(0,8).map(r=>'<div><span style="color:#6fa8d6">['+r.ts.slice(11,19)+']</span> <b>'+tt(r.type)+'</b> '+esc(r.summary)+' <span style="color:#7fe3a6">'+esc(r.result)+'</span></div>').join("")||"—";
  v.innerHTML='<div class="cards">'+card("dash.kToday",s.today.count)+card("dash.kRate",rate+'<small>%</small>')+card("dash.kTotal",s.totalRelays)+card("dash.kRecords",s.totalRecords.toLocaleString())+card("dash.kSuspect",s.suspect)+card("dash.kSync",'<small>'+sync+'</small>')+'</div>'+
   '<div class="row"><div class="panel" style="flex:1.4"><h3>'+t("dash.trend")+'</h3><div class="chart">'+bars+'</div><div style="height:22px"></div></div>'+
   '<div class="panel"><h3>'+t("dash.conn")+'</h3><table>'+
   '<tr><td>'+t("dash.extranet")+'</td><td class="c">'+cs(c.extranet,t("st.connected"),"-")+'</td></tr>'+
   '<tr><td>'+t("dash.cert")+'</td><td class="c">'+cs(c.cert,t("st.valid"),"-")+'</td></tr>'+
   '<tr><td>'+t("dash.token")+'</td><td class="c">'+cs(c.tokenActive,t("st.active"),t("st.none"))+'</td></tr>'+
   '<tr><td>'+t("dash.syncRow")+'</td><td class="c">'+cs(!!c.lastSync,t("st.latest"),t("st.idle"))+'</td></tr></table>'+
   '<p class="small" style="margin-top:10px">SIMO: <code class="k">'+esc(c.simoHost)+'</code></p></div></div>'+
   '<div class="panel"><h3>'+t("dash.recent")+'</h3><div class="log">'+xl+'</div></div>';
};

// ---- shared transaction detail (SIMO message + full target records + layout mapping) ----
let CURDET=null, DET={id:null,page:1,q:"",size:15};
async function showRelay(id){ DET={id:id,page:1,q:"",size:15}; await loadRelay(); }
async function loadRelay(){
  const r=await api("/api/relay/"+DET.id+"?page="+DET.page+"&size="+DET.size+"&q="+encodeURIComponent(DET.q)); CURDET=r;
  const rej=(r.rejected||[]).slice(0,12).map(x=>'<tr><td class="c">'+(x.index+1)+'</td><td>'+(x.account||'-')+'</td><td>'+x.field+'</td><td>'+errt(x.code)+'</td></tr>').join("");
  const rejB=(r.rejected&&r.rejected.length)?'<div class="kv" style="margin-top:8px;color:var(--warn)">'+t("out.rejList")+' ('+r.rejected.length+')</div><table><thead><tr><th class="c">#</th><th>'+t("in.cIdent")+'</th><th>field</th><th>'+t("out.cResult")+'</th></tr></thead><tbody>'+rej+'</tbody></table>':"";
  const trows=(r.records||[]).map(rec=>{ const rj=rec.__rej;
    return '<tr class="clickable" onclick="__mapRec('+rec.__i+')"><td class="c tnum">'+(rec.__i+1)+'</td><td><code class="k">'+esc(rec.Cif)+'</code></td><td>'+esc(rec.TenKhachHang)+'</td><td class="tnum">'+esc(rec.SoTaiKhoan||'-')+'</td><td class="c tnum">'+esc(rec.NgaySinh)+'</td><td class="c">'+(rj?'<span class="tag bad">'+t("out.rejN")+'</span>':'<span class="tag ok">'+t("out.statusOK")+'</span>')+'</td></tr>';
  }).join("")||'<tr><td colspan="6" class="muted">'+t("out.noMatch")+'</td></tr>';
  const from=r.total?((r.page-1)*r.size+1):0, to=Math.min(r.page*r.size,r.total);
  modal('<div class="kv">'+r.id+' · <code class="k">'+r.svc+'</code> · <span class="tag '+(r.mode==='BATCH'?'ba':'ev')+'">'+t("mode."+r.mode)+'</span> · '+codeTag(r.code)+' · '+hhmmss(r.ts)+'</div>'+
    '<div class="panel" style="margin:8px 0;padding:12px"><div class="kv">'+t("out.req")+'</div><pre>POST '+esc(r.endpoint)+'\nHost: mgsimo.sbv.gov.vn\nAuthorization: Bearer ***\nmaYeuCau: '+esc(r.maYeuCau)+'\nkyBaoCao: '+esc(r.kyBaoCao)+'\n('+t("out.cTarget")+': '+r.count.toLocaleString()+')</pre>'+
    '<div class="kv" style="margin-top:8px">'+t("out.res")+'</div><div class="small">'+codeTag(r.code)+' · '+t("out.recvN")+' <b>'+r.accepted+'</b> / '+t("out.rejN")+' <b>'+(r.rejectedCount||0)+'</b></div>'+rejB+'</div>'+
    '<div class="kv">'+t("out.allRecs")+' · '+t("out.cTarget")+' <b>'+r.count.toLocaleString()+'</b></div>'+
    '<div class="searchbar"><input class="ui" id="dq" placeholder="'+t("out.search")+'" value="'+esc(DET.q)+'"><button class="btn blue sm" id="dqGo">'+t("common.query")+'</button>'+(DET.q?(' <button class="btn ghost sm" id="dqClr">'+t("common.clear")+'</button>'):'')+' <button class="btn ghost sm" id="dxls">'+t("out.excel")+'</button></div>'+
    '<table><thead><tr><th class="c">'+t("out.fNo")+'</th><th>CIF</th><th>'+t("in.cName")+'</th><th>'+t("out.cAcc")+'</th><th class="c">'+t("out.cDob")+'</th><th class="c">'+t("out.cStatus")+'</th></tr></thead><tbody>'+trows+'</tbody></table>'+
    '<div class="pager"><button class="btn ghost sm" id="dpp"'+(r.page<=1?' disabled':'')+'>'+t("common.prev")+'</button><span>'+t("common.page")+' '+r.page+'/'+r.pages+'</span><button class="btn ghost sm" id="dpn"'+(r.page>=r.pages?' disabled':'')+'>'+t("common.next")+'</button><span class="small">· '+t("out.showing")+' '+from+'–'+to+' / '+r.total.toLocaleString()+'</span></div>'+
    '<div class="kv" style="margin-top:12px">'+t("out.map")+' <span class="small muted">('+t("common.detail")+': '+t("out.fName")+' 클릭)</span></div><div id="mapBox"></div>'+
    '<div class="btnrow" style="justify-content:flex-end;margin-top:12px"><button class="btn" onclick="closeModal()">'+t("common.close")+'</button></div>', "wide");
  const dq=$("#dq"); if(dq) dq.onkeydown=function(e){ if(e.key==="Enter"){ DET.q=dq.value.trim(); DET.page=1; loadRelay(); } };
  if($("#dqGo")) $("#dqGo").onclick=function(){ DET.q=$("#dq").value.trim(); DET.page=1; loadRelay(); };
  if($("#dqClr")) $("#dqClr").onclick=function(){ DET.q=""; DET.page=1; loadRelay(); };
  if($("#dxls")) $("#dxls").onclick=exportRelay;
  if($("#dpp")) $("#dpp").onclick=function(){ if(DET.page>1){ DET.page--; loadRelay(); } };
  if($("#dpn")) $("#dpn").onclick=function(){ if(DET.page<r.pages){ DET.page++; loadRelay(); } };
  if(r.records&&r.records.length) __mapRec(r.records[0].__i);
}
function __mapRec(gi){ if(!CURDET||!CURDET.records) return; const rec=CURDET.records.find(x=>x.__i===gi); if(!rec) return;
  const rows=CURDET.layout.map(f=>{ const val=rec[f.name]; const has=val!==undefined&&val!==null&&val!=="";
    return '<tr><td class="c">'+f.no+'</td><td><code class="k">'+f.name+'</code></td><td class="small">'+f.type+'</td><td class="c">'+(f.req?'<b style="color:var(--warn)">x</b>':'-')+'</td><td class="small">'+esc(f.desc)+'</td><td>'+(has?esc(val):'<span class="muted">-</span>')+'</td></tr>'; }).join("");
  $("#mapBox").innerHTML='<div class="small" style="margin-bottom:5px">#'+(rec.__i+1)+' · <code class="k">'+esc(rec.SoTaiKhoan||rec.Cif)+'</code> '+(rec.__rej?('<span class="tag bad">'+errt(rec.__rej.code)+'</span>'):'')+' <a href="#" onclick="__rawRec('+rec.__i+');return false" style="color:var(--blue)">'+t("out.raw")+'</a></div>'+
    '<table><thead><tr><th class="c">'+t("out.fNo")+'</th><th>'+t("out.fName")+'</th><th>'+t("out.fType")+'</th><th class="c">'+t("out.fReq")+'</th><th>'+t("out.fDesc")+'</th><th>'+t("out.fVal")+'</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function __rawRec(gi){ if(!CURDET||!CURDET.records) return; const rec=CURDET.records.find(x=>x.__i===gi)||CURDET.records[0]; const o=Object.assign({},rec); delete o.__i; delete o.__rej; $("#mapBox").innerHTML='<pre>'+esc(JSON.stringify(o,null,2))+'</pre>'; }
window.__showRelay=showRelay; window.__mapRec=__mapRec; window.__rawRec=__rawRec;

VIEW.out=(()=>{ let seg="today", st={from:null,to:null,svc:"",detailDate:null,filter:""};
  async function renderToday(){
    const d=await api("/api/relay/today?svc="+(st.filter||"")); const s=d.summary;
    const cards='<div class="cards" style="grid-template-columns:repeat(5,1fr)">'+
      '<div class="card"><div class="k">'+t("out.cCount")+'</div><div class="v">'+s.count+'</div></div>'+
      '<div class="card"><div class="k">'+t("out.cOk")+'</div><div class="v" style="color:var(--ok)">'+s.ok+'</div></div>'+
      '<div class="card"><div class="k">'+t("out.cPartial")+'</div><div class="v" style="color:var(--amber)">'+s.partial+'</div></div>'+
      '<div class="card"><div class="k">'+t("out.cFail")+'</div><div class="v" style="color:var(--warn)">'+s.fail+'</div></div>'+
      '<div class="card"><div class="k">'+t("out.cTarget")+'</div><div class="v">'+s.records.toLocaleString()+'</div></div></div>';
    const apiRows=d.perApi.map(a=>'<tr class="clickable" onclick="__outFilter(\''+a.svc+'\')"><td><code class="k">'+a.svc+'</code></td><td class="c">'+a.count+'</td><td class="c">'+a.ok+'</td><td class="c">'+a.partial+'</td><td class="c">'+a.fail+'</td><td class="c">'+a.records+'</td></tr>').join("")||'<tr><td colspan="6" class="muted">'+t("out.none")+'</td></tr>';
    const rec=d.recent.map(r=>'<tr class="clickable" onclick="__showRelay(\''+r.id+'\')"><td>'+hhmmss(r.ts)+'</td><td><code class="k">'+r.svc+'</code></td><td class="c"><span class="tag '+(r.mode==='BATCH'?'ba':'ev')+'">'+t("mode."+r.mode)+'</span></td><td class="c">'+r.count+'</td><td class="c">'+codeTag(r.code)+'</td></tr>').join("")||'<tr><td colspan="5" class="muted">'+t("out.none")+'</td></tr>';
    const fchip=st.filter?'<span class="pill" style="background:#e5f0f8;color:var(--blue)">'+t("out.filtered")+': '+st.filter+' <a href="#" onclick="__outFilter(\'\');return false" style="color:var(--blue)">✕</a></span>':"";
    $("#outBody").innerHTML='<div class="btnrow" style="justify-content:space-between;margin-bottom:8px"><div>'+fchip+'</div><button class="btn ghost sm" id="genTx">+ '+t("out.gen")+'</button></div>'+cards+
      '<div class="panel"><h3>'+t("out.perApi")+' <span class="small">('+t("common.detail")+': '+t("out.api")+' 클릭)</span></h3><table><thead><tr><th>'+t("out.cApi")+'</th><th class="c">'+t("out.cCount")+'</th><th class="c">'+t("out.cOk")+'</th><th class="c">'+t("out.cPartial")+'</th><th class="c">'+t("out.cFail")+'</th><th class="c">'+t("out.cTarget")+'</th></tr></thead><tbody>'+apiRows+'</tbody></table></div>'+
      '<div class="panel"><h3>'+t("out.recent")+' ('+d.date+')'+(st.filter?(' · '+st.filter):'')+'</h3><table><thead><tr><th>'+t("out.cTime")+'</th><th>'+t("out.cApi")+'</th><th class="c">'+t("out.cMode")+'</th><th class="c">'+t("out.cTarget")+'</th><th class="c">'+t("out.cResult")+'</th></tr></thead><tbody>'+rec+'</tbody></table></div>';
    $("#genTx").onclick=async()=>{ await api("/api/relay/report",{method:"POST",body:JSON.stringify({})}); renderToday(); };
  }
  window.__outFilter=(svc)=>{ st.filter=svc; renderToday(); };
  async function renderByDate(){
    const d=await api("/api/relay/by-date?from="+(st.from||"")+"&to="+(st.to||"")+"&svc="+(st.svc||""));
    if(!st.from){ st.from=d.from; st.to=d.to; }
    const cat=await api("/api/apis"); const opts='<option value="">'+t("common.all")+'</option>'+cat.items.map(a=>'<option value="'+a.code+'"'+(st.svc===a.code?' selected':'')+'>'+a.code+'</option>').join("");
    const rows=d.rows.map(r=>'<tr class="clickable" onclick="__dayDetail(\''+r.date+'\')"><td>'+r.date+'</td><td class="c">'+r.count+'</td><td class="c">'+r.ok+'</td><td class="c">'+r.partial+'</td><td class="c">'+r.fail+'</td><td class="c">'+r.records+'</td><td class="c"><button class="btn ghost sm">'+t("common.detail")+'</button></td></tr>').join("")||'<tr><td colspan="7" class="muted">'+t("out.none")+'</td></tr>';
    $("#outBody").innerHTML='<div class="panel"><div class="btnrow"><span class="small">'+t("out.from")+'</span><input type="date" class="ui" id="qFrom" value="'+st.from+'"><span class="small">'+t("out.to")+'</span><input type="date" class="ui" id="qTo" value="'+st.to+'"><span class="small">'+t("out.api")+'</span><select class="ui" id="qSvc">'+opts+'</select><button class="btn blue" id="qGo">'+t("common.query")+'</button></div></div>'+
      '<div class="panel"><h3>'+t("out.dailySum")+' ('+d.from+' ~ '+d.to+')</h3><table><thead><tr><th>'+t("out.cDate")+'</th><th class="c">'+t("out.cCount")+'</th><th class="c">'+t("out.cOk")+'</th><th class="c">'+t("out.cPartial")+'</th><th class="c">'+t("out.cFail")+'</th><th class="c">'+t("out.cTarget")+'</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div><div id="dayDetail"></div>';
    $("#qGo").onclick=()=>{ st.from=$("#qFrom").value; st.to=$("#qTo").value; st.svc=$("#qSvc").value; renderByDate(); };
    if(st.detailDate) dayDetail(st.detailDate);
  }
  async function dayDetail(date){ st.detailDate=date;
    const d=await api("/api/relay/by-date/detail?date="+date+"&svc="+(st.svc||""));
    const rows=d.items.map(r=>'<tr class="clickable" onclick="__showRelay(\''+r.id+'\')"><td>'+hhmmss(r.ts)+'</td><td><code class="k">'+r.svc+'</code></td><td class="c"><span class="tag '+(r.mode==='BATCH'?'ba':'ev')+'">'+t("mode."+r.mode)+'</span></td><td class="c">'+r.count+'</td><td class="c">'+codeTag(r.code)+'</td></tr>').join("")||'<tr><td colspan="5" class="muted">'+t("out.none")+'</td></tr>';
    const el=$("#dayDetail"); if(el) el.innerHTML='<div class="panel"><h3>'+t("out.dayDetail")+' · '+date+' ('+d.items.length+')</h3><table><thead><tr><th>'+t("out.cTime")+'</th><th>'+t("out.cApi")+'</th><th class="c">'+t("out.cMode")+'</th><th class="c">'+t("out.cTarget")+'</th><th class="c">'+t("out.cResult")+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  }
  window.__dayDetail=dayDetail;
  return async()=>{
    $("#view").innerHTML='<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>'+t("out.title")+'</h2>'+
      '<div class="flow"><b>'+t("out.flowCore")+'</b><span class="ar">──▶</span><b>'+t("out.flowGw")+'</b><span class="ar">──▶</span><b>'+t("out.flowSimo")+'</b></div>'+
      '<div class="seg"><button id="segT" class="'+(seg==='today'?'on':'')+'">'+t("out.segToday")+'</button><button id="segD" class="'+(seg==='date'?'on':'')+'">'+t("out.segDate")+'</button></div><div id="outBody"></div>';
    $("#segT").onclick=()=>{ seg="today"; VIEW.out(); }; $("#segD").onclick=()=>{ seg="date"; VIEW.out(); };
    if(seg==="today") renderToday(); else renderByDate();
  };
})();

VIEW.suspect=(()=>{ let page=1, LIST=[], LAYOUT=[];
  function detail(i){ const e=LIST[i]; if(!e) return;
    const rows=LAYOUT.map(f=>{ const val=e[f.name]; const has=val!==undefined&&val!==null&&val!==""; let disp=has?val:'-';
      if(f.name==="kind"&&has)disp=kindL(val); if(f.name==="reason"&&has)disp=rsn(val); if(f.name==="source"&&has)disp=srcL(val); if(f.name==="regAt"&&has)disp=ymd(val);
      return '<tr><td><code class="k">'+f.name+'</code></td><td class="small">'+esc(f.desc)+'</td><td>'+esc(disp)+'</td></tr>'; }).join("");
    modal('<div class="kv">'+t("in.dTitle")+'</div><table><thead><tr><th>'+t("out.fName")+'</th><th>'+t("out.fDesc")+'</th><th>'+t("out.fVal")+'</th></tr></thead><tbody>'+rows+'</tbody></table><div class="btnrow" style="justify-content:flex-end;margin-top:12px"><button class="btn" onclick="closeModal()">'+t("common.close")+'</button></div>');
  }
  window.__suspectDetail=detail;
  return async()=>{
    const bl=await api("/api/suspect/list?page="+page+"&size=12"); LIST=bl.items; LAYOUT=bl.layout||[];
    const rh=await api("/api/suspect/recv-history");
    const sync=bl.lastSync?new Date(bl.lastSync).toLocaleString():t("st.never");
    const rrows=rh.items.slice(0,6).map(h=>'<tr><td>#'+h.id+'</td><td class="c">'+h.received+'</td><td class="c">'+h.delivered+'</td><td class="c">'+(h.match?'<span class="tag ok">✓</span>':'<span class="tag bad">✗</span>')+'</td><td class="small">'+hhmmss(h.at)+'</td></tr>').join("")||'<tr><td colspan="5" class="muted">—</td></tr>';
    const rows=bl.items.map((x,i)=>'<tr class="clickable" onclick="__suspectDetail('+i+')"><td>'+x.identifier+'</td><td>'+esc(x.TenKhachHang||'-')+'</td><td class="c"><span class="tag ev">'+kindL(x.kind)+'</span></td><td>'+rsn(x.reason)+'</td><td class="c">'+(x.regAt?ymd(x.regAt):'-')+'</td><td class="c"><span class="tag '+(x.source==='QUERY'?'warn':'ba')+'">'+srcL(x.source)+'</span></td></tr>').join("")||'<tr><td colspan="6" class="muted">'+t("in.none")+'</td></tr>';
    const pages=Math.ceil(bl.total/bl.size)||1;
    $("#view").innerHTML='<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>'+t("in.title")+'</h2>'+
      '<div class="statusbar"><div>'+t("in.lastSync")+': <b>'+sync+'</b></div><div>'+t("in.version")+': <b>v'+bl.version+'</b></div><div>'+t("in.size")+': <b>'+bl.total+'</b></div><button class="btn blue sm" id="syncNow">'+t("in.syncNow")+'</button></div>'+
      '<div class="hint">'+t("in.hint")+'</div>'+
      '<div class="row"><div class="panel"><h3>'+t("in.recon")+'</h3><table><thead><tr><th>#</th><th class="c">'+t("in.rRecv")+'</th><th class="c">'+t("in.rDeliver")+'</th><th class="c">'+t("in.rMatch")+'</th><th>'+t("in.rTime")+'</th></tr></thead><tbody>'+rrows+'</tbody></table></div>'+
      '<div class="panel"><h3>'+t("in.check")+'</h3><p class="small">'+t("in.checkHint")+' <span class="muted">('+t("in.idHelp")+')</span></p><div class="btnrow"><input class="ui" id="cId" placeholder="9988776655" style="flex:1;min-width:160px"><button class="btn" id="cGo">'+t("in.checkBtn")+'</button></div>'+
      '<div class="btnrow" style="margin-top:8px"><span class="small">'+t("examples")+':</span><button class="btn ghost sm" onclick="document.querySelector(\'#cId\').value=\'9988776655\'">9988776655</button><button class="btn ghost sm" onclick="document.querySelector(\'#cId\').value=\'5551234567\'">5551234567</button></div></div></div>'+
      '<div class="panel"><h3>'+t("in.list")+' <span class="small">('+t("common.detail")+': '+t("in.cIdent")+' 클릭)</span></h3><table><thead><tr><th>'+t("in.cIdent")+'</th><th>'+t("in.cName")+'</th><th class="c">'+t("in.cKind")+'</th><th>'+t("in.cReason")+'</th><th class="c">'+t("in.cReg")+'</th><th class="c">'+t("in.cSource")+'</th></tr></thead><tbody>'+rows+'</tbody></table>'+
      '<div class="pager"><button class="btn ghost sm" id="pp"'+(page<=1?' disabled':'')+'>'+t("common.prev")+'</button><span>'+t("common.page")+' '+bl.page+'/'+pages+'</span><button class="btn ghost sm" id="pn"'+(page>=pages?' disabled':'')+'>'+t("common.next")+'</button><span class="small">· total '+bl.total+'</span></div></div>';
    $("#syncNow").onclick=async()=>{ const r=await api("/api/suspect/sync",{method:"POST"}); toast(t("in.rRecv")+' '+r.received+' → '+t("in.rDeliver")+' '+r.delivered+' · '+(r.match?'✓':'✗')); page=1; VIEW.suspect(); };
    $("#cGo").onclick=async()=>{ const idn=$("#cId").value.trim(); if(!idn) return; const r=await api("/api/suspect/check",{method:"POST",body:JSON.stringify({identifier:idn})});
      modal(box(r.hit?"⚠":"✅", r.hit?t("in.qHit"):t("in.qClean"), '<b>'+esc(idn)+'</b>'+(r.hit?' · '+kindL(r.entry.kind)+' · '+rsn(r.entry.reason):""))+'<div class="btnrow" style="justify-content:center;margin-top:10px"><button class="btn" onclick="closeModal()">'+t("common.close")+'</button></div>', r.hit?"warn":""); VIEW.suspect(); };
    $("#pp").onclick=()=>{ if(page>1){page--;VIEW.suspect();} }; $("#pn").onclick=()=>{ if(page<pages){page++;VIEW.suspect();} };
  };
})();

VIEW.txlog=async()=>{ const d=await api("/api/txlog");
  const rows=d.items.map(r=>'<tr><td class="small">'+r.ts.replace('T',' ').slice(0,19)+'</td><td><b>'+tt(r.type)+'</b></td><td><code class="k">'+r.svc+'</code></td><td>'+esc(r.summary)+'</td><td>'+esc(r.result)+'</td></tr>').join("")||'<tr><td colspan="5" class="muted">—</td></tr>';
  $("#view").innerHTML='<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>'+t("tx.title")+'</h2><div class="panel"><table><thead><tr><th>'+t("tx.time")+'</th><th>'+t("tx.type")+'</th><th>'+t("tx.svc")+'</th><th>'+t("tx.summary")+'</th><th>'+t("tx.result")+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
};

VIEW.sample=async()=>{
  $("#view").innerHTML='<h2 class="sec"><span class="sq" style="background:var(--navy)"></span><span class="sq" style="background:var(--sky)"></span>'+t("sample.title")+'</h2><div class="hint">'+t("sample.hint")+'</div>'+
    '<div class="panel" style="max-width:580px"><h3>'+t("sample.acc")+'</h3><div class="btnrow"><input class="ui" id="acc" placeholder="9988776655" style="flex:1;min-width:200px"><button class="btn" id="scGo">'+t("sample.check")+'</button></div>'+
    '<div class="btnrow" style="margin-top:10px"><span class="small">'+t("examples")+':</span><button class="btn ghost sm" onclick="document.querySelector(\'#acc\').value=\'9988776655\'">9988776655</button><button class="btn ghost sm" onclick="document.querySelector(\'#acc\').value=\'5551234567\'">5551234567</button></div><p class="small" id="scNote" style="margin-top:12px"></p></div>';
  $("#scGo").onclick=async()=>{ const a=$("#acc").value.trim(); if(!a) return; const r=await api("/api/screen",{method:"POST",body:JSON.stringify({account:a})});
    if(r.size===0){ $("#scNote").innerHTML='<span style="color:var(--amber)">'+t("sample.need")+'</span>'; return; }
    if(r.hit){ modal(box("⚠",t("sample.hit"),'<b>'+esc(a)+'</b> · '+kindL(r.entry.kind)+' · '+rsn(r.entry.reason))+'<div class="btnrow" style="justify-content:center;margin-top:10px"><button class="btn" onclick="closeModal()">'+t("common.close")+'</button></div>',"warn"); $("#scNote").innerHTML='<span style="color:var(--warn)">⚠ '+rsn(r.entry.reason)+'</span>'; }
    else { modal(box("✅",t("sample.clean"),"")+'<div class="btnrow" style="justify-content:center;margin-top:10px"><button class="btn" onclick="closeModal()">'+t("common.close")+'</button></div>'); $("#scNote").innerHTML='<span style="color:var(--ok)">clean</span>'; }
  };
};

function applyStatic(){ document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent=t(el.getAttribute("data-i18n")); }); $("#viewTitle").textContent=t("nav."+(CUR==="dash"?"dashboard":CUR)); document.documentElement.lang=LANG; }
function go(view){ CUR=view; document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view)); applyStatic(); VIEW[view](); }
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>go(b.dataset.view));
$("#langSel").onchange=e=>{ LANG=e.target.value; applyStatic(); VIEW[CUR](); };
window.closeModal=closeModal; window.go=go; window.api=api; window.VIEW=VIEW;
applyStatic(); VIEW.dash();

/* ---- client-side .xlsx export (no deps): zip(store)+CRC32, all cells inlineStr=text ---- */
const _CRC=(function(){const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function _crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=_CRC[(c^b[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function _sb(s){return new TextEncoder().encode(s);}
function _zipStore(files){
  const chunks=[],central=[];let off=0;
  const u16=n=>[n&255,(n>>8)&255],u32=n=>[n&255,(n>>8)&255,(n>>16)&255,(n>>24)&255];
  files.forEach(f=>{const nm=_sb(f.name),d=f.data,crc=_crc32(d);
    const lh=[].concat([80,75,3,4],u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(d.length),u32(d.length),u16(nm.length),u16(0));
    chunks.push(Uint8Array.from(lh),nm,d);
    const ch=[].concat([80,75,1,2],u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(d.length),u32(d.length),u16(nm.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(off));
    central.push({hdr:Uint8Array.from(ch),nm});
    off+=lh.length+nm.length+d.length;});
  const cdStart=off;let cdSize=0;
  central.forEach(c=>{chunks.push(c.hdr,c.nm);cdSize+=c.hdr.length+c.nm.length;});
  chunks.push(Uint8Array.from([].concat([80,75,5,6],u16(0),u16(0),u16(files.length),u16(files.length),u32(cdSize),u32(cdStart),u16(0))));
  let tot=0;chunks.forEach(c=>tot+=c.length);const out=new Uint8Array(tot);let p=0;chunks.forEach(c=>{out.set(c,p);p+=c.length;});
  return out;
}
function _colName(i){let s="";i++;while(i>0){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26);}return s;}
function buildXlsx(headers,rows){
  const xe=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const cell=(ci,ri,v)=>'<c r="'+_colName(ci)+ri+'" t="inlineStr"><is><t xml:space="preserve">'+xe(v)+'</t></is></c>';
  let sd='<row r="1">'+headers.map((h,ci)=>cell(ci,1,h)).join('')+'</row>';
  rows.forEach((row,ix)=>{const r=ix+2;sd+='<row r="'+r+'">'+row.map((v,ci)=>cell(ci,r,v)).join('')+'</row>';});
  const sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+sd+'</sheetData></worksheet>';
  const CT='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>';
  const RELS='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  const WB='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="SIMO" sheetId="1" r:id="rId1"/></sheets></workbook>';
  const WBR='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>';
  return _zipStore([
    {name:'[Content_Types].xml',data:_sb(CT)},
    {name:'_rels/.rels',data:_sb(RELS)},
    {name:'xl/workbook.xml',data:_sb(WB)},
    {name:'xl/_rels/workbook.xml.rels',data:_sb(WBR)},
    {name:'xl/worksheets/sheet1.xml',data:_sb(sheet)}
  ]);
}
function downloadBlob(bytes,fname){const blob=new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fname;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1500);}
async function exportRelay(){
  const btn=document.getElementById('dxls'); if(btn){btn.disabled=true;btn.textContent=t("out.exporting");}
  try{
    const r=await api("/api/relay/"+DET.id+"?all=1&q="+encodeURIComponent(DET.q));
    const L=r.layout||[];
    const headers=["No"].concat(L.map(f=>f.name)).concat(["status","reject_code","maYeuCau"]);
    const rows=(r.records||[]).map(rec=>[String(rec.__i+1)]
      .concat(L.map(f=>rec[f.name]==null?"":String(rec[f.name])))
      .concat([rec.__rej?"REJECT":"OK", rec.__rej?rec.__rej.code:"", r.maYeuCau||""]));
    const fn=(r.svc+"_"+r.id+(DET.q?"_filtered":"")+"_"+(r.total)+".xlsx").replace(/[^\w.\-]+/g,"_");
    downloadBlob(buildXlsx(headers,rows), fn);
  }finally{ if(btn){btn.disabled=false;btn.textContent=t("out.excel");} }
}
window.__exportRelay=exportRelay; window.buildXlsx=buildXlsx;
