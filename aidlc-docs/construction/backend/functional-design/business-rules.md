# Business Rules — Backend

## BR-1: 인증 규칙

| ID | 규칙 | 검증 시점 |
|---|---|---|
| BR-1.1 | 관리자 로그인: 동일 (store_identifier, username)에 대해 5회 연속 실패 시 15분 잠금 | 로그인 시도 시 |
| BR-1.2 | 로그인 성공 시 실패 카운터 초기화 | 로그인 성공 시 |
| BR-1.3 | JWT 만료 시간: 16시간 | 토큰 발급 시 |
| BR-1.4 | JWT 페이로드: sub(사용자 ID), role("admin" 또는 "table"), exp | 토큰 발급 시 |
| BR-1.5 | 비밀번호는 bcrypt로 해싱하여 저장 | 계정 생성/시드 시 |
| BR-1.6 | 관리자 API는 role="admin" JWT 필수 | 모든 관리자 API |
| BR-1.7 | 고객 API는 role="table" JWT 필수 | 모든 고객 API |

## BR-2: 주문 규칙

| ID | 규칙 | 검증 시점 |
|---|---|---|
| BR-2.1 | 주문 번호 = Order.id (자동 증가 정수) | 주문 생성 시 |
| BR-2.2 | OrderItem.unit_price = 주문 시점 MenuItem.price (스냅샷) | 주문 생성 시 |
| BR-2.3 | OrderItem.menu_name = 주문 시점 MenuItem.name (스냅샷) | 주문 생성 시 |
| BR-2.4 | Order.total_amount = SUM(OrderItem.unit_price * OrderItem.quantity) | 주문 생성 시 |
| BR-2.5 | 비활성(is_available=false) 메뉴는 주문 불가 | 주문 생성 시 |
| BR-2.6 | 존재하지 않는 menu_item_id는 주문 불가 | 주문 생성 시 |
| BR-2.7 | 주문 항목이 1개 이상이어야 함 | 주문 생성 시 |
| BR-2.8 | 수량(quantity)은 1 이상이어야 함 | 주문 생성 시 |

## BR-3: 주문 상태 전이 규칙

| ID | 규칙 | 검증 시점 |
|---|---|---|
| BR-3.1 | pending → preparing 허용 | 상태 변경 시 |
| BR-3.2 | preparing → completed 허용 | 상태 변경 시 |
| BR-3.3 | 그 외 모든 전이 금지 (역방향, 건너뛰기 포함) | 상태 변경 시 |
| BR-3.4 | 상태 변경은 관리자만 가능 | 상태 변경 시 |

## BR-4: 세션 규칙

| ID | 규칙 | 검증 시점 |
|---|---|---|
| BR-4.1 | 활성 세션이 없는 테이블에서 첫 주문 시 자동으로 새 세션 생성 | 주문 생성 시 |
| BR-4.2 | 이용 완료 시 활성 세션이 있어야 함 | 이용 완료 시 |
| BR-4.3 | 이용 완료 시 모든 활성 주문을 OrderHistory + OrderHistoryItem으로 복사 | 이용 완료 시 |
| BR-4.4 | 이용 완료 시 원본 Order + OrderItem 삭제 | 이용 완료 시 |
| BR-4.5 | 이용 완료 시 TableSession.completed_at 설정, Table.current_session_id = NULL | 이용 완료 시 |

## BR-5: 메뉴 관리 규칙

| ID | 규칙 | 검증 시점 |
|---|---|---|
| BR-5.1 | 메뉴명(name)은 필수 | 메뉴 생성/수정 시 |
| BR-5.2 | 가격(price)은 0 이상 정수 | 메뉴 생성/수정 시 |
| BR-5.3 | 카테고리에 메뉴가 있으면 카테고리 삭제 불가 | 카테고리 삭제 시 |
| BR-5.4 | display_order 일괄 업데이트: 전달된 모든 항목의 순서 값 동시 변경 | 순서 변경 시 |
| BR-5.5 | 카테고리명(name)은 필수 | 카테고리 생성/수정 시 |

## BR-6: SSE 규칙

| ID | 규칙 | 검증 시점 |
|---|---|---|
| BR-6.1 | SSE 구독은 관리자 JWT 필수 | SSE 연결 시 |
| BR-6.2 | 다중 관리자 세션 동시 지원 | SSE 연결 시 |
| BR-6.3 | 이벤트 타입: new_order, order_status_changed, order_deleted, session_completed | 이벤트 발행 시 |
| BR-6.4 | 전송 실패 연결은 자동 제거 | 이벤트 발행 시 |

## BR-7: 데이터 검증 규칙

| Field | Validation | Error Message |
|---|---|---|
| store_identifier | 필수, 1~50자 | "매장 식별자는 필수입니다" |
| username | 필수, 1~50자 | "사용자명은 필수입니다" |
| password | 필수, 1~100자 | "비밀번호는 필수입니다" |
| table_number | 필수, 1 이상 정수 | "테이블 번호는 1 이상이어야 합니다" |
| menu name | 필수, 1~100자 | "메뉴명은 필수입니다" |
| menu price | 필수, 0 이상 정수 | "가격은 0 이상이어야 합니다" |
| category name | 필수, 1~50자 | "카테고리명은 필수입니다" |
| quantity | 필수, 1 이상 정수 | "수량은 1 이상이어야 합니다" |
