# Render(onrender.com) 외부 배포 가이드

이 PoC는 의존성 0의 순수 Node라 Render 무료 웹 서비스로 외부 공개할 수 있습니다.
바인딩은 0.0.0.0, 포트는 Render가 주는 PORT 환경변수를 자동 사용합니다(코드 반영 완료).

## 사전 준비
- GitHub 계정, Render 계정(둘 다 무료, GitHub로 가입 가능)
- 로컬에 Git 설치

## 1단계 — GitHub 저장소에 코드 올리기
이 `SIMO-Gateway-PoC` 폴더에서:
```
git init
git add .
git commit -m "SIMO Gateway PoC"
git branch -M main
git remote add origin https://github.com/wzzongvn/simo-gateway-poc.git
git push -u origin main
```
(GitHub에서 빈 저장소 `simo-gateway-poc`를 먼저 생성)

## 2단계 — Render 배포 (둘 중 하나)

### 방법 A · Blueprint (render.yaml 자동 인식, 권장)
1. https://dashboard.render.com → New → **Blueprint**
2. 위 GitHub 저장소 연결 → Render가 `render.yaml`을 읽어 설정 자동 구성
3. **Apply** → 빌드·배포 시작

### 방법 B · 수동 Web Service
1. New → **Web Service** → 저장소 연결
2. 설정: Runtime **Node** · Build Command `npm install` · Start Command `node server.js` · Instance Type **Free**
3. **Create Web Service**

## 3단계 — 공개 URL
배포 완료 후 `https://simo-gateway-poc.onrender.com` 형태의 URL이 생성됩니다. 외부에서 바로 접속 가능.

## 참고 / 주의
- **무료 플랜 콜드 스타트:** 15분 미사용 시 슬립 → 첫 접속이 ~50초 걸릴 수 있음(시연 5분 전 미리 한 번 열어 두기 권장).
- **상태 공유·초기화:** 데이터는 메모리라 모든 접속자가 같은 인스턴스를 공유하고, 재배포·재시작 시 초기화됩니다(데모용으로 적합).
- **공개 안전성:** 전부 모의 데이터·모의 SIMO이며 실제 SBV 미연결이라 외부 공개에 민감정보 위험 없음. (원하면 Render 환경변수/Basic Auth로 접근 제한 추가 가능)
- 로컬 실행은 그대로 `node server.js` → http://localhost:8787
