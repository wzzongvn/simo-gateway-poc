# InfoPlus — SIMO Reporting Gateway (PoC)

베트남 SBV **SIMO** 연동 게이트웨이의 실동작 PoC. 순수 Node.js(외부 패키지 0)로
**모의 SIMO 서버 + 게이트웨이 백엔드 + 다국어 Portal**을 한 프로세스에서 구동합니다.
실제 HTTP·OAuth 토큰·전문 검증으로 동작하며, SBV 연결은 필요 없습니다(모의).

## 실행
    node server.js
브라우저에서 http://localhost:8787 접속. (Node.js 18+ 필요 · 포트 변경: PORT=9000 node server.js)

## 화면 / 기능
- 대시보드 — 보고 KPI, 7일 추이, 연동 상태(Extranet·인증서·토큰·동기화), 감사 활동
- 행내 데이터 — 480건 시드, 페이지네이션·검색·정기/의심 필터
- 보고 ① (은행→SIMO) — 보고 생성 → maker-checker 결재 → 토큰 발급(/token) → 전송
  → 응답(code 00/01) · 부분 반려(필드 검증) · 교정·재시도
- 의심목록 ② (SIMO→은행) — 델타/전량 동기화, 동기화 이력, 행내 전달본 목록
- 고객 경고 — 수취 계좌를 의심목록과 대조해 경고(행내 영역 시연)
- 감사 로그 — 모든 동작 기록(역할·시각·상세)
- 다국어 — 우측 상단에서 한국어 / English / Tiếng Việt 전환
- 역할 — maker / checker / admin (결재 권한·업무분리 maker≠checker)

## 권장 시연 동선
1. 보고 ① 탭: simo_002(의심) 보고 생성 → (역할 checker로 변경) 결재 → 토큰·전송
   → 부분 반려 확인 → 교정·재시도 → SENT
2. 의심목록 ② 탭: 전량/델타 동기화 → 행내 전달본·이력 확인
3. 고객 경고 탭: 9988776655 입력 → 경고 / 5551234567 → 정상
4. 대시보드·감사 로그로 지표·이력 확인
5. 언어 토글로 KO/EN/VI 전환

## 모의 연동 정보 (데모용)
- SIMO host: mgsimo.sbv.gov.vn (mock) · 보고 EP: /simo/tktt/1.0/upload-bao-cao-danh-sach-tktt-api
- consumer-key/secret·서비스 계정은 server.js 상단 CRED에 데모값으로 내장
- 토큰: POST /token (Basic→Bearer, expires_in, refresh) — 실제 OAuth 흐름

## 구조
- server.js          모의 SIMO(/token,/simo/*) + 게이트웨이(/api/*) + 정적 서빙
- public/index.html  Portal 셸 + 스타일(InfoPlus 브랜드)
- public/app.js      Portal 로직 + i18n(KO/EN/VI)

## 주의
- 모든 데이터는 모의·메모리(재시작 시 초기화). 실제 SBV SIMO 미연결.
- 수신(②) 방향의 정확한 연동 규격은 SBV 확인 전이며, 본 PoC는 표준 주기 동기화(델타/전량)를 가정합니다.
- 보고(①) 규격은 SBV 공식 API 가이드(v1.0.4)에 근거.
