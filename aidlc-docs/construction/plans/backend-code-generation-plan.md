# Backend Code Generation Plan

## Unit Context
- **Unit**: Backend (Python + FastAPI)
- **Workspace Root**: /Users/prohdk/work/aidlc-workshop/table-order
- **Code Location**: `backend/` directory in workspace root
- **Dependencies**: PostgreSQL (Docker Compose)
- **Design Artifacts**: domain-entities.md, business-logic-model.md, business-rules.md

## Functional Requirements Coverage
- FR-1.1: 테이블 태블릿 자동 로그인 (auth 모듈)
- FR-1.2: 메뉴 조회 (menu 모듈)
- FR-1.4: 주문 생성 (order 모듈)
- FR-1.5: 주문 내역 조회 (order 모듈)
- FR-2.1: 매장 인증 (auth 모듈)
- FR-2.2: 실시간 주문 모니터링 (order + sse 모듈)
- FR-2.3: 테이블 관리 (table 모듈)
- FR-2.4: 메뉴 관리 (menu 모듈)

---

## Code Generation Steps

### Step 1: Project Setup
- [x] Create `backend/requirements.txt` with dependencies
- [x] Create `backend/app/__init__.py`
- [x] Create `backend/app/config.py` (설정: DB URL, JWT 시크릿, CORS 등)

### Step 2: Database Module
- [x] Create `backend/app/database/__init__.py`
- [x] Create `backend/app/database/connection.py` (SQLAlchemy async 엔진/세션)
- [x] Create `backend/app/database/models.py` (10개 ORM 모델)
- [x] Create `backend/app/database/seed.py` (Store, Admin 시드 데이터)

### Step 3: Auth Module
- [x] Create `backend/app/auth/__init__.py`
- [x] Create `backend/app/auth/schemas.py` (Pydantic 스키마)
- [x] Create `backend/app/auth/service.py` (로그인 로직, JWT 발급, 시도 제한)
- [x] Create `backend/app/auth/dependencies.py` (JWT 검증 의존성)
- [x] Create `backend/app/auth/router.py` (API 라우트)

### Step 4: Menu Module
- [x] Create `backend/app/menu/__init__.py`
- [x] Create `backend/app/menu/schemas.py`
- [x] Create `backend/app/menu/service.py` (CRUD, 순서 변경, 카테고리 삭제 차단)
- [x] Create `backend/app/menu/router.py`

### Step 5: Order Module
- [x] Create `backend/app/order/__init__.py`
- [x] Create `backend/app/order/schemas.py`
- [x] Create `backend/app/order/service.py` (주문 생성+자동 세션, 상태 머신, 삭제)
- [x] Create `backend/app/order/router.py`

### Step 6: Table Module
- [x] Create `backend/app/table/__init__.py`
- [x] Create `backend/app/table/schemas.py`
- [x] Create `backend/app/table/service.py` (설정, 이용 완료+이력 아카이빙, 과거 내역)
- [x] Create `backend/app/table/router.py`

### Step 7: SSE Module
- [x] Create `backend/app/sse/__init__.py`
- [x] Create `backend/app/sse/service.py` (연결 관리, 이벤트 브로드캐스트)
- [x] Create `backend/app/sse/router.py`

### Step 8: Main Application
- [x] Create `backend/app/main.py` (FastAPI 앱, 라우터 등록, CORS, startup/shutdown)

### Step 9: Deployment Artifacts
- [x] Create `backend/Dockerfile`
- [x] Create `docker-compose.yml` (backend + db, frontend는 Unit 2에서 추가)

### Step 10: Tests
- [x] Create `backend/tests/__init__.py`
- [x] Create `backend/tests/conftest.py` (테스트 DB 설정, 픽스처)
- [x] Create `backend/tests/test_auth.py`
- [x] Create `backend/tests/test_menu.py`
- [x] Create `backend/tests/test_order.py`
- [x] Create `backend/tests/test_table.py`

### Step 11: Documentation
- [x] Create `aidlc-docs/construction/backend/code/backend-code-summary.md`
