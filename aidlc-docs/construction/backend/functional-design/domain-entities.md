# Domain Entities — Backend

## Entity Relationship

```
Store 1──* Admin
Store 1──* Table
Store 1──* Category
Table 1──* TableSession
TableSession 1──* Order
Category 1──* MenuItem
Order 1──* OrderItem
OrderItem *──1 MenuItem
OrderHistory 1──* OrderHistoryItem
```

---

## Store (매장)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 매장 고유 ID |
| name | String(100) | NOT NULL | 매장명 |
| store_identifier | String(50) | NOT NULL, UNIQUE | 매장 식별자 (로그인용) |
| created_at | DateTime | NOT NULL, default=now | 생성 시각 |

## Admin (관리자)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 관리자 고유 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 소속 매장 |
| username | String(50) | NOT NULL | 사용자명 |
| password_hash | String(255) | NOT NULL | bcrypt 해시 비밀번호 |
| created_at | DateTime | NOT NULL, default=now | 생성 시각 |

**Unique Constraint**: (store_id, username)

## Table (테이블)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 테이블 고유 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 소속 매장 |
| table_number | Integer | NOT NULL | 테이블 번호 |
| password_hash | String(255) | NOT NULL | bcrypt 해시 비밀번호 |
| current_session_id | Integer | FK(TableSession.id), NULLABLE | 현재 활성 세션 |
| created_at | DateTime | NOT NULL, default=now | 생성 시각 |

**Unique Constraint**: (store_id, table_number)

## TableSession (테이블 세션)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 세션 고유 ID |
| table_id | Integer | FK(Table.id), NOT NULL | 테이블 |
| started_at | DateTime | NOT NULL, default=now | 세션 시작 시각 |
| completed_at | DateTime | NULLABLE | 이용 완료 시각 (NULL=활성) |

## Category (카테고리)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 카테고리 고유 ID |
| store_id | Integer | FK(Store.id), NOT NULL | 소속 매장 |
| name | String(50) | NOT NULL | 카테고리명 |
| display_order | Integer | NOT NULL, default=0 | 노출 순서 |

## MenuItem (메뉴 항목)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 메뉴 고유 ID |
| category_id | Integer | FK(Category.id), NOT NULL | 소속 카테고리 |
| name | String(100) | NOT NULL | 메뉴명 |
| price | Integer | NOT NULL, >= 0 | 가격 (원) |
| description | Text | NULLABLE | 메뉴 설명 |
| image_url | String(500) | NULLABLE | 이미지 URL |
| display_order | Integer | NOT NULL, default=0 | 노출 순서 |
| is_available | Boolean | NOT NULL, default=true | 판매 가능 여부 |

## Order (주문)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 주문 고유 ID (= 주문 번호) |
| table_id | Integer | FK(Table.id), NOT NULL | 테이블 |
| session_id | Integer | FK(TableSession.id), NOT NULL | 세션 |
| status | Enum | NOT NULL, default='pending' | 주문 상태 |
| total_amount | Integer | NOT NULL | 총 주문 금액 (원) |
| created_at | DateTime | NOT NULL, default=now | 주문 시각 |

**Order Status Enum**: `pending`(대기중), `preparing`(준비중), `completed`(완료)

## OrderItem (주문 항목)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 항목 고유 ID |
| order_id | Integer | FK(Order.id), NOT NULL | 소속 주문 |
| menu_item_id | Integer | FK(MenuItem.id), NOT NULL | 메뉴 참조 |
| menu_name | String(100) | NOT NULL | 주문 시점 메뉴명 (스냅샷) |
| quantity | Integer | NOT NULL, >= 1 | 수량 |
| unit_price | Integer | NOT NULL, >= 0 | 주문 시점 단가 (스냅샷) |

## OrderHistory (과거 주문 이력)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 이력 고유 ID |
| table_id | Integer | NOT NULL | 테이블 ID |
| session_id | Integer | NOT NULL | 세션 ID |
| order_number | Integer | NOT NULL | 원본 주문 번호 |
| status | String(20) | NOT NULL | 주문 상태 |
| total_amount | Integer | NOT NULL | 총 금액 |
| created_at | DateTime | NOT NULL | 원본 주문 시각 |
| archived_at | DateTime | NOT NULL, default=now | 이력 이동 시각 |

## OrderHistoryItem (과거 주문 항목 이력)

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK, auto-increment | 항목 고유 ID |
| order_history_id | Integer | FK(OrderHistory.id), NOT NULL | 소속 이력 |
| menu_name | String(100) | NOT NULL | 메뉴명 |
| quantity | Integer | NOT NULL | 수량 |
| unit_price | Integer | NOT NULL | 단가 |
