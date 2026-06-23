# 할 일 앱 — 웹 프로토타입 (React)

기획 문서(`../요구사항정의서.md` 등)의 **MVP**를 동작하는 형태로 구현한 웹 프로토타입.
디자인은 **안 B(따뜻한 프렌들리)** 적용.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 프로덕션 빌드 (dist/)
npm run test:e2e # Playwright E2E 테스트 (10건)
```

## E2E 테스트 (Playwright)

`e2e/app.spec.js` — 모바일 뷰포트(Pixel 7)에서 핵심 사용자 스토리를 검증한다.

| 테스트 | 스토리 |
|--------|--------|
| 로그인 → 홈 진입 | US-1.1 |
| 빠른 추가 + 입력란 비움 / 빈 제목 무시 | US-2.1 |
| 완료 → 완료됨 섹션 + 되돌리기 | US-3.2 |
| 편집으로 우선순위 변경 | US-3.1/3.4 |
| 반복(매주) 신규 추가 | US-5.1 |
| 삭제 + 되돌리기 | US-3.3 |
| 마감 배너에서 바로 완료 | US-4.3 |
| 설정 → 로그아웃 | US-8.1/1.2 |
| 새로고침 후 영속화 | US-7.1 |

각 테스트는 격리된 컨텍스트(깨끗한 localStorage)에서 실행되며, 로그인 후 시드 4건이 생성된다.

- 데모/스크린샷용: `http://localhost:5173/?demo=1` → 로그인 건너뛰고 데모 데이터로 진입

## 기술 스택 (2026.6 기준 최신)

- Vite 8 · @vitejs/plugin-react 6 · React 19
- 상태 영속화: 브라우저 `localStorage` (오프라인 우선)

## 구조

```
src/
├─ lib/
│  ├─ tasks.js     # 도메인: Task 모델·정렬·반복 다음 회차 생성
│  ├─ storage.js   # localStorage 영속화 + 데모 시드 (Firebase 교체 지점)
│  ├─ notify.js    # 브라우저 알림 + 마감 도래 탐지
│  └─ format.js    # 한국어 날짜/시간/반복 표시
├─ hooks/
│  └─ useTasks.js  # 할 일 상태 + 영속화 + 되돌리기
├─ components/
│  ├─ Login.jsx       # S1 (소셜 로그인 목업)
│  ├─ Home.jsx        # S2 목록 + 빠른추가 + 완료됨
│  ├─ TaskRow.jsx     # 리스트 한 줄
│  ├─ EditSheet.jsx   # S3 추가/편집 바텀시트
│  ├─ Settings.jsx    # S4 설정
│  └─ DueBanner.jsx   # N1 알림(앱 내 완료/미루기)
├─ App.jsx         # 로그인 게이트 + 화면 라우팅 + 알림 폴링
├─ styles.css      # 디자인 토큰(안 B) + 컴포넌트 스타일
└─ main.jsx
```

## 구현된 사용자 스토리 (MVP)

- US-1.1/1.2 로그인·로그아웃 (인증은 목업)
- US-2.1 제목만으로 빠른 추가 / US-3.1~3.4 편집·완료·삭제·우선순위
- US-4.1~4.3 마감 설정·알림·알림에서 완료/미루기
- US-5.1/5.2 반복 설정·다음 회차 자동 생성
- US-6.1/6.2 목록·정렬 / US-7.1 오프라인(localStorage) / US-8.1 알림 설정

## 프로토타입 한계 (실제 Android 제품과 다름)

- **인증**: Google 로그인은 목업. 실제는 Firebase Auth.
- **알림**: 순수 웹은 *앱이 닫혀 있어도 도착하는 푸시*를 보장 못 함.
  여기서는 앱이 열려 있는 동안 마감 시각을 15초 간격으로 폴링해 알림을 띄움.
  실제 제품은 **FCM + WorkManager**로 백그라운드 푸시(US-4.2).
- **동기화**: 로컬 전용. 다중 기기 동기화(US-7.2) 미구현.
