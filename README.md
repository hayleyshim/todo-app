# 할 일 관리 앱 (todo-app)

"적어두면 제때 알려주는" 모바일 할 일 관리 앱. **기획 → 설계 → 구현 → 테스트 → CI** 전 과정을
문서와 동작하는 프로토타입으로 담은 저장소입니다.

[![CI](https://github.com/hayleyshim/todo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/hayleyshim/todo-app/actions)

---

## 핵심가치
고객 발견 인터뷰에서 도출한 3가지 가치가 모든 기능·화면을 지배합니다.

1. **놓치지 않게 챙겨준다** — 다시 안 봐도 앱이 먼저 알린다 (능동 알림)
2. **적는 게 일이 되지 않는다** — 제목만으로 3초 등록 (빠른 입력)
3. **머릿속을 비워 안심시킨다** — 적어두면 잊어도 된다 (peace of mind)

> 자세한 배경은 [`요구사항정의서.md`](./요구사항정의서.md) 2~3장 참고.

---

## 저장소 구조

### 📄 기획·설계 문서 (상류 → 하류 사슬)
| 파일 | 내용 |
|------|------|
| [`요구사항정의서.md`](./요구사항정의서.md) | 문제 정의 · 핵심가치 · 기능(MVP/2차/보류 등급) |
| [`사용자스토리.md`](./사용자스토리.md) | 에픽/스토리 + Given/When/Then 수락조건 |
| [`화면흐름설계.md`](./화면흐름설계.md) | 화면 간 이동 흐름도 · 시나리오 |
| [`화면구성설계.md`](./화면구성설계.md) | 화면별 레이아웃·컴포넌트 + 스토리 매핑 |
| [`wireframe.html`](./wireframe.html) | UX 와이어프레임 (디자인 배제, 구조만) |
| [`design-guide.html`](./design-guide.html) | 디자인 3개 안 비교 (채택: 안 B 따뜻한 프렌들리) |
| [`usecase.puml`](./usecase.puml) / [`usecase.png`](./usecase.png) | 유스케이스 다이어그램 |
| [`CLAUDE.md`](./CLAUDE.md) | 저장소 작업 가이드 (문서 사슬·핵심가치) |

### 💻 구현 (`app/`)
React 19 + Vite 8 웹 프로토타입. 디자인 안 B 적용. 자세한 내용은 [`app/README.md`](./app/README.md).

```bash
cd app
npm install
npm run dev        # http://localhost:5173  (데모: /?demo=1)
npm run build      # 프로덕션 빌드
npm run test:e2e   # Playwright E2E 10건
```

### ✅ 테스트 · CI
- **E2E**: `app/e2e/app.spec.js` — 사용자 스토리 기반 10개 시나리오 (모바일 뷰포트)
- **CI**: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — push/PR마다 빌드 + E2E 자동 실행

---

## 구현 범위 (MVP)
빠른 입력 · 우선순위 · 마감 알림(완료/미루기) · 반복 할 일 · 오프라인(localStorage) · 소셜 로그인(목업)

## 기술 스택
| 영역 | 사용 |
|------|------|
| UI | React 19 · Vite 8 |
| 상태/영속화 | localStorage (오프라인 우선, 추후 Firebase 교체 대비) |
| 테스트 | Playwright |
| CI | GitHub Actions |

## 프로토타입 한계
웹 프로토타입이라 실제 Android 제품과 다릅니다 — 인증은 목업(실제: Firebase Auth),
알림은 앱이 열린 동안만 폴링(실제: FCM + WorkManager). 자세한 내용은 [`app/README.md`](./app/README.md).
