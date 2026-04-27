# Unit of Work — 기능 요구사항 매핑

## Unit 1: Backend — 기능 매핑

| 요구사항 ID | 기능 | Backend 모듈 | 주요 작업 |
|---|---|---|---|
| FR-1.1 | 테이블 태블릿 자동 로그인 | auth | table_login API, JWT 발급 |
| FR-1.2 | 메뉴 조회 및 탐색 | menu | list_categories, list_menu_items API |
| FR-1.3 | 장바구니 관리 | — | 클라이언트 전용 (Backend 작업 없음) |
| FR-1.4 | 주문 생성 | order | create_order API, SSE 이벤트 발행 |
| FR-1.5 | 주문 내역 조회 | order | get_orders_by_session API |
| FR-2.1 | 매장 인증 | auth | admin_login API, JWT 발급, 로그인 시도 제한 |
| FR-2.2 | 실시간 주문 모니터링 | order, sse | get_orders_by_table API, SSE subscribe |
| FR-2.3 | 테이블 관리 | table | setup_table, complete_session, delete_order, get_history API |
| FR-2.4 | 메뉴 관리 | menu | CRUD API, update_menu_order API |
| — | DB 스키마/모델 | database | 9개 엔티티 ORM 모델, 시드 데이터 |
| — | SSE 브로드캐스트 | sse | 이벤트 타입별 브로드캐스트 인프라 |

## Unit 2: Frontend — 기능 매핑

| 요구사항 ID | 기능 | Frontend 컴포넌트 | 주요 작업 |
|---|---|---|---|
| FR-1.1 | 테이블 태블릿 자동 로그인 | CustomerApp/TableLoginPage | 로그인 폼, 자격 증명 로컬 저장, 자동 로그인 |
| FR-1.2 | 메뉴 조회 및 탐색 | CustomerApp/MenuPage, MenuCard | 카테고리 탭, 카드 레이아웃, 터치 친화적 UI |
| FR-1.3 | 장바구니 관리 | CustomerApp/CartDrawer, CartContext | 추가/삭제/수량 조절, localStorage 저장 |
| FR-1.4 | 주문 생성 | CustomerApp/OrderConfirmPage, OrderSuccessPage | 주문 확인, 5초 리다이렉트 |
| FR-1.5 | 주문 내역 조회 | CustomerApp/OrderHistoryPage | 세션 주문 목록, 상태 표시 |
| FR-2.1 | 매장 인증 | AdminApp/AdminLoginPage, AdminAuthContext | 로그인 폼, JWT 저장, 세션 유지 |
| FR-2.2 | 실시간 주문 모니터링 | AdminApp/DashboardPage, TableCard, useSSE | SSE 연결, 그리드 레이아웃, 실시간 업데이트 |
| FR-2.3 | 테이블 관리 | AdminApp/TableManagementPage, OrderHistoryModal | 설정, 이용 완료, 주문 삭제, 과거 내역 |
| FR-2.4 | 메뉴 관리 | AdminApp/MenuManagementPage | CRUD 폼, 순서 조정 |
| — | 다국어 지원 | Shared/i18n | react-i18next, ko.json, en.json |
| — | API 통신 | Shared/api | Axios 클라이언트, 인터셉터 |

## 커버리지 검증

| 요구사항 | Backend | Frontend | 완전 커버 |
|---|---|---|---|
| FR-1.1 테이블 로그인 | ✅ | ✅ | ✅ |
| FR-1.2 메뉴 조회 | ✅ | ✅ | ✅ |
| FR-1.3 장바구니 | — (클라이언트 전용) | ✅ | ✅ |
| FR-1.4 주문 생성 | ✅ | ✅ | ✅ |
| FR-1.5 주문 내역 | ✅ | ✅ | ✅ |
| FR-2.1 매장 인증 | ✅ | ✅ | ✅ |
| FR-2.2 실시간 모니터링 | ✅ | ✅ | ✅ |
| FR-2.3 테이블 관리 | ✅ | ✅ | ✅ |
| FR-2.4 메뉴 관리 | ✅ | ✅ | ✅ |

**결과**: 모든 기능 요구사항이 2개 Unit에 완전히 매핑됨.
