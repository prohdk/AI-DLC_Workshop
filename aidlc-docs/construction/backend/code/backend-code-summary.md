# Backend Code Summary

## 생성된 파일 목록 (37개)

### Project Setup (3)
- `backend/requirements.txt` — 15개 의존성
- `backend/app/__init__.py`
- `backend/app/config.py` — Settings (DB URL, JWT, CORS, 로그인 제한)

### Database Module (4)
- `backend/app/database/__init__.py`
- `backend/app/database/connection.py` — SQLAlchemy async 엔진/세션
- `backend/app/database/models.py` — 10개 ORM 모델 + OrderStatus enum + ALLOWED_TRANSITIONS
- `backend/app/database/seed.py` — Store("store1") + Admin("admin"/"admin1234") 시드

### Auth Module (5)
- `backend/app/auth/__init__.py`
- `backend/app/auth/schemas.py` — AdminLoginRequest, TableLoginRequest, TokenResponse
- `backend/app/auth/service.py` — admin_login (인메모리 5회/15분 잠금), table_login, JWT 발급
- `backend/app/auth/dependencies.py` — get_current_admin, get_current_table (HTTPBearer)
- `backend/app/auth/router.py` — POST /api/auth/admin/login, POST /api/auth/table/login

### Menu Module (4)
- `backend/app/menu/__init__.py`
- `backend/app/menu/schemas.py` — Category/MenuItem CRUD 스키마
- `backend/app/menu/service.py` — CRUD, 카테고리 삭제 차단, 순서 일괄 변경
- `backend/app/menu/router.py` — 공개(table) + 관리자(admin) 엔드포인트

### Order Module (4)
- `backend/app/order/__init__.py`
- `backend/app/order/schemas.py` — OrderCreateRequest, OrderStatusUpdateRequest, OrderResponse
- `backend/app/order/service.py` — 주문 생성(자동 세션+가격 스냅샷), 상태 머신, 삭제, SSE 발행
- `backend/app/order/router.py` — POST/GET/PATCH/DELETE 엔드포인트

### Table Module (4)
- `backend/app/table/__init__.py`
- `backend/app/table/schemas.py` — TableSetup, TableSummary, OrderHistory 스키마
- `backend/app/table/service.py` — 설정, 이용 완료(이력 아카이빙), 과거 내역 조회
- `backend/app/table/router.py` — 테이블 CRUD + 세션 관리 엔드포인트

### SSE Module (3)
- `backend/app/sse/__init__.py`
- `backend/app/sse/service.py` — SSEManager (큐 기반 pub/sub, 다중 연결)
- `backend/app/sse/router.py` — GET /api/sse/orders (EventSourceResponse + 30초 ping)

### Main App (1)
- `backend/app/main.py` — FastAPI 앱 (lifespan, CORS, 라우터 등록, /health)

### Deployment (2)
- `backend/Dockerfile` — Python 3.12 slim
- `docker-compose.yml` — backend + PostgreSQL 16

### Tests (6)
- `backend/tests/__init__.py`
- `backend/tests/conftest.py` — SQLite async 테스트 DB, 픽스처
- `backend/tests/test_auth.py` — 관리자/테이블 로그인 성공/실패
- `backend/tests/test_menu.py` — 카테고리 생성, 삭제 차단
- `backend/tests/test_order.py` — 주문 생성, 상태 전이 유효/무효
- `backend/tests/test_table.py` — 테이블 설정, 세션 완료, 이력 확인

## API 엔드포인트 요약

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/admin/login | - | 관리자 로그인 |
| POST | /api/auth/table/login | - | 테이블 로그인 |
| GET | /api/menu/categories | table | 카테고리 목록 |
| GET | /api/menu/items | table | 메뉴 목록 |
| GET | /api/menu/admin/categories | admin | 카테고리 목록 (관리자) |
| POST | /api/menu/admin/categories | admin | 카테고리 생성 |
| PATCH | /api/menu/admin/categories/{id} | admin | 카테고리 수정 |
| DELETE | /api/menu/admin/categories/{id} | admin | 카테고리 삭제 |
| GET | /api/menu/admin/items | admin | 메뉴 목록 (관리자) |
| POST | /api/menu/admin/items | admin | 메뉴 생성 |
| PATCH | /api/menu/admin/items/{id} | admin | 메뉴 수정 |
| DELETE | /api/menu/admin/items/{id} | admin | 메뉴 삭제 |
| PUT | /api/menu/admin/items/order | admin | 메뉴 순서 변경 |
| POST | /api/orders | table | 주문 생성 |
| GET | /api/orders/session | table | 현재 세션 주문 조회 |
| GET | /api/orders/table/{id} | admin | 테이블별 주문 조회 |
| PATCH | /api/orders/{id}/status | admin | 주문 상태 변경 |
| DELETE | /api/orders/{id} | admin | 주문 삭제 |
| GET | /api/tables | admin | 테이블 목록 |
| POST | /api/tables | admin | 테이블 설정 |
| GET | /api/tables/{id}/summary | admin | 테이블 요약 |
| POST | /api/tables/{id}/complete | admin | 이용 완료 |
| GET | /api/tables/{id}/history | admin | 과거 내역 |
| GET | /api/sse/orders | admin | SSE 주문 스트림 |
| GET | /health | - | 헬스 체크 |
