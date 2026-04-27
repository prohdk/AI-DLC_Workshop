# Application Design — 통합 설계 문서

## 설계 결정 요약

| 항목 | 결정 |
|---|---|
| 백엔드 API 구조 | 도메인별 모듈 분리 (auth, menu, order, table, sse, database) |
| 프론트엔드 상태 관리 | React Context API |
| 앱 구성 | 단일 React 앱 내 라우팅 분리 (/customer/*, /admin/*) |
| 주문 상태 관리 | 상태 머신 패턴 (대기중→준비중→완료) |
| SSE 이벤트 구조 | 이벤트 타입별 분리 (new_order, order_status_changed, order_deleted, session_completed) |
| DB 액세스 | SQLAlchemy ORM |
| 세션 종료 이력 | 별도 OrderHistory 테이블로 복사 후 원본 삭제 |
| API 통신 | Axios |
| 다국어 | react-i18next (ko, en) |

---

## 시스템 아키텍처

```
+-----------------------------------------------------------+
|                    Docker Compose                          |
|                                                           |
|  +------------------+  +------------------+  +----------+ |
|  |   Frontend       |  |   Backend        |  |PostgreSQL| |
|  |   (React+TS)     |  |   (FastAPI)      |  |          | |
|  |                  |  |                  |  |          | |
|  |  /customer/*    +-->+  /api/auth/*     +->+  Store   | |
|  |  /admin/*       |  |  /api/menu/*     |  |  Admin   | |
|  |                  |  |  /api/orders/*   |  |  Table   | |
|  |  Axios (HTTP)   +-->+  /api/tables/*   |  |  Order   | |
|  |  SSE (EventSrc) +<-+  /api/sse/*      |  |  etc.    | |
|  +------------------+  +------------------+  +----------+ |
+-----------------------------------------------------------+
```

---

## Backend 컴포넌트 (6개 모듈)

| 모듈 | 책임 | 주요 메서드 |
|---|---|---|
| **auth** | 관리자/테이블 인증, JWT | admin_login, table_login, verify_token |
| **menu** | 메뉴/카테고리 CRUD | list_categories, create/update/delete_menu_item |
| **order** | 주문 생성/조회/상태 관리 | create_order, update_order_status, delete_order |
| **table** | 테이블 설정/세션 관리 | setup_table, complete_table_session, get_order_history |
| **sse** | 실시간 이벤트 브로드캐스트 | subscribe, publish_event |
| **database** | ORM 모델/DB 연결 | SQLAlchemy 엔진, 모델 정의, 시드 데이터 |

---

## Frontend 컴포넌트

### CustomerApp (/customer/*)
| 컴포넌트 | 역할 |
|---|---|
| TableLoginPage | 테이블 자동 로그인 |
| MenuPage | 카테고리별 메뉴 조회 (기본 화면) |
| CartDrawer | 장바구니 관리 |
| OrderConfirmPage | 주문 확인/확정 |
| OrderHistoryPage | 현재 세션 주문 내역 |

### AdminApp (/admin/*)
| 컴포넌트 | 역할 |
|---|---|
| AdminLoginPage | 관리자 로그인 |
| DashboardPage | 실시간 주문 모니터링 그리드 |
| TableManagementPage | 테이블 관리 |
| MenuManagementPage | 메뉴 CRUD |

### Shared
| 항목 | 역할 |
|---|---|
| API Client (Axios) | HTTP 통신, JWT 인터셉터 |
| Auth Context | 인증 상태 관리 |
| Cart Context | 장바구니 상태 (localStorage) |
| i18n (react-i18next) | 한국어/영어 전환 |

---

## 서비스 오케스트레이션

### 주문 생성 흐름
1. 고객: 장바구니 확정 → `POST /api/orders`
2. OrderService: 메뉴 유효성 확인 → DB 저장
3. SSEService: `new_order` 이벤트 브로드캐스트
4. 관리자 대시보드: 실시간 업데이트

### 주문 상태 변경 흐름
1. 관리자: 상태 변경 → `PATCH /api/orders/{id}/status`
2. OrderService: 상태 머신 전이 검증 (대기중→준비중→완료)
3. SSEService: `order_status_changed` 이벤트 브로드캐스트

### 이용 완료 흐름
1. 관리자: 이용 완료 → `POST /api/tables/{id}/complete`
2. TableService: 활성 주문 → OrderHistory 복사 → 원본 삭제 → 세션 종료
3. SSEService: `session_completed` 이벤트 브로드캐스트

---

## 데이터 모델

| 엔티티 | 주요 필드 |
|---|---|
| Store | id, name, store_identifier |
| Admin | id, store_id, username, password_hash |
| Table | id, store_id, table_number, password_hash, current_session_id |
| TableSession | id, table_id, started_at, completed_at |
| Category | id, store_id, name, display_order |
| MenuItem | id, category_id, name, price, description, image_url, display_order |
| Order | id, table_id, session_id, order_number, status, total_amount, created_at |
| OrderItem | id, order_id, menu_item_id, menu_name, quantity, unit_price |
| OrderHistory | id, table_id, session_id, order_number, total_amount, items_json, created_at, archived_at |

---

## 상세 설계 참조
- 컴포넌트 상세: [components.md](components.md)
- 메서드 시그니처: [component-methods.md](component-methods.md)
- 서비스 레이어: [services.md](services.md)
- 의존성 관계: [component-dependency.md](component-dependency.md)
