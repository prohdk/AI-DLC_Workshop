# Unit of Work 정의

## 분해 전략
- **기준**: 계층별 분해 (Backend / Frontend)
- **개발 순서**: Backend 먼저 → Frontend
- **Functional Design**: 모든 Unit에 대해 수행
- **배포 모델**: 단일 Docker Compose (모놀리스)

---

## Unit 1: Backend (Python + FastAPI)

### 개요
| 항목 | 내용 |
|---|---|
| **Unit 이름** | backend |
| **기술 스택** | Python, FastAPI, SQLAlchemy, PostgreSQL |
| **개발 순서** | 1st (먼저 개발) |
| **Functional Design** | 수행 |

### 책임
- DB 스키마 및 ORM 모델 정의 (9개 엔티티)
- 시드 데이터 초기화 (Store, Admin)
- REST API 전체 (auth, menu, order, table)
- SSE 실시간 이벤트 브로드캐스트
- JWT 인증/인가
- 주문 상태 머신 (대기중→준비중→완료)
- 테이블 세션 관리 및 이력 처리

### 포함 모듈
- `auth/` — 관리자/테이블 인증, JWT
- `menu/` — 메뉴/카테고리 CRUD
- `order/` — 주문 생성/조회/상태 관리
- `table/` — 테이블 설정/세션 관리
- `sse/` — SSE 연결 및 이벤트 브로드캐스트
- `database/` — SQLAlchemy 모델, DB 연결, 시드 데이터

### 코드 구조
```
backend/
├── app/
│   ├── main.py              # FastAPI 앱 진입점
│   ├── config.py             # 설정 (DB URL, JWT 시크릿 등)
│   ├── database/
│   │   ├── connection.py     # SQLAlchemy 엔진/세션
│   │   ├── models.py         # ORM 모델 정의
│   │   └── seed.py           # 시드 데이터
│   ├── auth/
│   │   ├── router.py         # API 라우트
│   │   ├── service.py        # 비즈니스 로직
│   │   ├── schemas.py        # Pydantic 스키마
│   │   └── dependencies.py   # 인증 의존성
│   ├── menu/
│   │   ├── router.py
│   │   ├── service.py
│   │   └── schemas.py
│   ├── order/
│   │   ├── router.py
│   │   ├── service.py
│   │   └── schemas.py
│   ├── table/
│   │   ├── router.py
│   │   ├── service.py
│   │   └── schemas.py
│   └── sse/
│       ├── router.py
│       └── service.py
├── requirements.txt
├── Dockerfile
└── tests/
```

---

## Unit 2: Frontend (React + TypeScript)

### 개요
| 항목 | 내용 |
|---|---|
| **Unit 이름** | frontend |
| **기술 스택** | React, TypeScript, Axios, react-i18next |
| **개발 순서** | 2nd (Backend 완료 후) |
| **Functional Design** | 수행 |

### 책임
- 고객용 인터페이스 (메뉴 조회, 장바구니, 주문, 주문 내역)
- 관리자용 인터페이스 (로그인, 대시보드, 테이블 관리, 메뉴 관리)
- 테이블 자동 로그인 / 관리자 인증 (JWT 토큰 관리)
- 장바구니 로컬 저장 (localStorage)
- SSE 연결 및 실시간 업데이트
- 한국어/영어 다국어 지원

### 포함 컴포넌트
- `CustomerApp` — 고객용 페이지 (Login, Menu, Cart, Order, History)
- `AdminApp` — 관리자용 페이지 (Login, Dashboard, Table, Menu Management)
- `Shared` — API 클라이언트, Auth Context, Cart Context, i18n, 공통 UI

### 코드 구조
```
frontend/
├── src/
│   ├── App.tsx               # 라우팅 설정
│   ├── main.tsx              # 진입점
│   ├── shared/
│   │   ├── api/
│   │   │   ├── client.ts     # Axios 인스턴스
│   │   │   ├── auth.ts       # 인증 API
│   │   │   ├── menu.ts       # 메뉴 API
│   │   │   ├── orders.ts     # 주문 API
│   │   │   └── tables.ts     # 테이블 API
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── hooks/
│   │   │   └── useSSE.ts
│   │   ├── components/       # 공통 UI
│   │   └── i18n/
│   │       ├── index.ts
│   │       ├── ko.json
│   │       └── en.json
│   ├── customer/
│   │   ├── pages/
│   │   │   ├── TableLoginPage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   ├── OrderConfirmPage.tsx
│   │   │   ├── OrderSuccessPage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   └── components/
│   │       ├── MenuCard.tsx
│   │       └── CartDrawer.tsx
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TableManagementPage.tsx
│   │   │   └── MenuManagementPage.tsx
│   │   └── components/
│   │       ├── TableCard.tsx
│   │       ├── OrderDetailModal.tsx
│   │       └── OrderHistoryModal.tsx
│   └── types/                # 공통 타입 정의
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── index.html
```

---

## Docker Compose 구조
```
docker-compose.yml
├── backend   (FastAPI, port 8000)
├── frontend  (React dev/nginx, port 3000)
└── db        (PostgreSQL, port 5432)
```
