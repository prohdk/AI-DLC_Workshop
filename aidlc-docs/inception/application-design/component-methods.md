# Component Methods

> **Note**: 상세 비즈니스 규칙은 Functional Design (CONSTRUCTION) 단계에서 정의됩니다.

## Backend — auth 모듈

| Method | Input | Output | Purpose |
|---|---|---|---|
| `admin_login(store_id, username, password)` | LoginRequest | JWT TokenResponse | 관리자 로그인 |
| `table_login(store_id, table_number, password)` | TableLoginRequest | JWT TokenResponse | 테이블 태블릿 로그인 |
| `verify_token(token)` | str | TokenPayload | JWT 토큰 검증 |
| `get_current_admin(token)` | Depends | Admin | 현재 관리자 정보 |
| `get_current_table(token)` | Depends | Table | 현재 테이블 정보 |

## Backend — menu 모듈

| Method | Input | Output | Purpose |
|---|---|---|---|
| `list_categories()` | - | list[Category] | 카테고리 목록 조회 |
| `create_category(data)` | CategoryCreate | Category | 카테고리 생성 |
| `update_category(id, data)` | int, CategoryUpdate | Category | 카테고리 수정 |
| `delete_category(id)` | int | None | 카테고리 삭제 |
| `list_menu_items(category_id?)` | int (optional) | list[MenuItem] | 메뉴 목록 조회 |
| `create_menu_item(data)` | MenuItemCreate | MenuItem | 메뉴 등록 |
| `update_menu_item(id, data)` | int, MenuItemUpdate | MenuItem | 메뉴 수정 |
| `delete_menu_item(id)` | int | None | 메뉴 삭제 |
| `update_menu_order(items)` | list[MenuOrderUpdate] | None | 메뉴 노출 순서 변경 |

## Backend — order 모듈

| Method | Input | Output | Purpose |
|---|---|---|---|
| `create_order(table_id, session_id, items)` | OrderCreate | Order | 주문 생성 |
| `get_orders_by_session(session_id)` | int | list[Order] | 세션별 주문 조회 |
| `get_orders_by_table(table_id)` | int | list[Order] | 테이블별 활성 주문 조회 |
| `update_order_status(order_id, status)` | int, OrderStatus | Order | 주문 상태 변경 (상태 머신) |
| `delete_order(order_id)` | int | None | 주문 삭제 (관리자) |

## Backend — table 모듈

| Method | Input | Output | Purpose |
|---|---|---|---|
| `list_tables()` | - | list[Table] | 테이블 목록 조회 |
| `setup_table(data)` | TableSetup | Table | 테이블 초기 설정 |
| `get_table_summary(table_id)` | int | TableSummary | 테이블 요약 (총 주문액, 주문 수) |
| `complete_table_session(table_id)` | int | None | 이용 완료 (이력 이동, 리셋) |
| `get_order_history(table_id, date_filter?)` | int, date (optional) | list[OrderHistory] | 과거 주문 내역 조회 |

## Backend — sse 모듈

| Method | Input | Output | Purpose |
|---|---|---|---|
| `subscribe(store_id)` | int | EventSourceResponse | SSE 연결 구독 |
| `publish_event(event_type, data)` | str, dict | None | 이벤트 브로드캐스트 |
| `remove_connection(connection_id)` | str | None | 연결 해제 |

**SSE 이벤트 타입**:
- `new_order`: 신규 주문 생성
- `order_status_changed`: 주문 상태 변경
- `order_deleted`: 주문 삭제
- `session_completed`: 테이블 세션 종료

---

## Frontend — CustomerApp

| Component/Hook | Purpose |
|---|---|
| `TableLoginPage` | 테이블 초기 설정 / 자동 로그인 |
| `MenuPage` | 카테고리별 메뉴 조회 (기본 화면) |
| `MenuCard` | 개별 메뉴 카드 (이미지, 이름, 가격, 추가 버튼) |
| `CartDrawer` | 장바구니 슬라이드 패널 |
| `OrderConfirmPage` | 주문 확인 및 확정 |
| `OrderSuccessPage` | 주문 성공 (5초 후 리다이렉트) |
| `OrderHistoryPage` | 현재 세션 주문 내역 |
| `useCart()` | 장바구니 Context (로컬 저장) |
| `useAuth()` | 테이블 인증 Context |

## Frontend — AdminApp

| Component/Hook | Purpose |
|---|---|
| `AdminLoginPage` | 관리자 로그인 |
| `DashboardPage` | 실시간 주문 모니터링 그리드 |
| `TableCard` | 테이블별 주문 요약 카드 |
| `OrderDetailModal` | 주문 상세 보기 모달 |
| `TableManagementPage` | 테이블 관리 (설정, 이용 완료) |
| `OrderHistoryModal` | 과거 주문 내역 모달 |
| `MenuManagementPage` | 메뉴 CRUD 관리 |
| `useSSE()` | SSE 연결 및 이벤트 처리 Hook |
| `useAdminAuth()` | 관리자 인증 Context |
