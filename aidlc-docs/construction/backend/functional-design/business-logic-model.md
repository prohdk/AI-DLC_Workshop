# Business Logic Model — Backend

## 1. 인증 흐름

### 관리자 로그인
```
Input: store_identifier, username, password
1. 로그인 시도 제한 확인 (인메모리 카운터)
   - 해당 (store_identifier, username) 키로 실패 횟수 조회
   - 5회 이상 실패 && 마지막 실패로부터 15분 미경과 → 거부
2. Store 조회 (store_identifier)
   - 없으면 → 401 "잘못된 매장 식별자"
3. Admin 조회 (store_id, username)
   - 없으면 → 401 "잘못된 사용자명 또는 비밀번호"
4. bcrypt 비밀번호 검증
   - 불일치 → 실패 카운터 증가, 401 반환
   - 일치 → 실패 카운터 초기화
5. JWT 발급: {sub: admin.id, role: "admin", exp: now+16h}
```

### 테이블 로그인
```
Input: store_identifier, table_number, password
1. Store 조회 (store_identifier)
2. Table 조회 (store_id, table_number)
3. bcrypt 비밀번호 검증
4. JWT 발급: {sub: table.id, role: "table", exp: now+16h}
```

---

## 2. 주문 생성 흐름

```
Input: table_id (from JWT), items: [{menu_item_id, quantity}]
1. 테이블 활성 세션 확인
   - current_session_id가 NULL → 새 TableSession 생성, Table.current_session_id 업데이트
   - current_session_id가 NOT NULL → 기존 세션 사용
2. 각 OrderItem에 대해:
   - MenuItem 조회 (존재 여부, is_available 확인)
   - 없거나 비활성 → 400 에러
   - menu_name = MenuItem.name (스냅샷)
   - unit_price = MenuItem.price (스냅샷)
3. total_amount = SUM(unit_price * quantity)
4. Order 생성 (status='pending', auto-increment id = 주문 번호)
5. OrderItem 일괄 생성
6. SSE 이벤트 발행: {type: "new_order", data: {order_id, table_id, table_number, total_amount, items, created_at}}
7. 응답: Order 정보 + 주문 번호
```

---

## 3. 주문 상태 머신

```
허용된 전이:
  pending → preparing
  preparing → completed

금지된 전이 (400 에러):
  pending → completed (건너뛰기 불가)
  preparing → pending (역방향 불가)
  completed → * (완료 후 변경 불가)
```

### 상태 변경 흐름
```
Input: order_id, new_status (관리자 JWT 필수)
1. Order 조회
2. 현재 상태에서 new_status로 전이 가능 여부 확인
   - 불가 → 400 "허용되지 않는 상태 변경"
3. Order.status 업데이트
4. SSE 이벤트 발행: {type: "order_status_changed", data: {order_id, table_id, old_status, new_status}}
```

---

## 4. 주문 삭제 흐름 (관리자)

```
Input: order_id (관리자 JWT 필수)
1. Order 조회
2. OrderItem 삭제
3. Order 삭제
4. SSE 이벤트 발행: {type: "order_deleted", data: {order_id, table_id}}
```

---

## 5. 테이블 세션 완료 (이용 완료) 흐름

```
Input: table_id (관리자 JWT 필수)
1. Table 조회, current_session_id 확인
   - NULL → 400 "활성 세션 없음"
2. 해당 세션의 모든 Order 조회
3. 각 Order에 대해:
   a. OrderHistory 생성 (order_number, status, total_amount, created_at, archived_at=now)
   b. 각 OrderItem에 대해 OrderHistoryItem 생성 (menu_name, quantity, unit_price)
   c. OrderItem 삭제
   d. Order 삭제
4. TableSession.completed_at = now
5. Table.current_session_id = NULL
6. SSE 이벤트 발행: {type: "session_completed", data: {table_id, table_number, session_id}}
```

---

## 6. 메뉴 관리 흐름

### 카테고리 삭제
```
Input: category_id (관리자 JWT 필수)
1. Category 조회
2. 해당 카테고리의 MenuItem 수 확인
   - 1개 이상 → 400 "메뉴가 있는 카테고리는 삭제할 수 없습니다"
3. Category 삭제
```

### 메뉴 순서 변경
```
Input: items: [{menu_item_id, display_order}] (관리자 JWT 필수)
1. 각 항목에 대해 MenuItem.display_order 업데이트
2. 일괄 커밋
```

---

## 7. 과거 주문 내역 조회

```
Input: table_id, date_filter? (관리자 JWT 필수)
1. OrderHistory 조회 (table_id 기준)
2. date_filter 있으면 created_at 날짜 필터링
3. 각 OrderHistory에 대해 OrderHistoryItem 조회
4. 시간 역순 정렬
```

---

## 8. SSE 연결 관리

```
구독:
1. 관리자 JWT 검증
2. 연결 ID 생성 (UUID)
3. 인메모리 연결 목록에 추가
4. EventSourceResponse 반환 (keep-alive)

이벤트 발행:
1. 이벤트 타입 + 데이터 수신
2. 모든 활성 연결에 JSON 직렬화 후 전송
3. 전송 실패 연결은 목록에서 제거

연결 해제:
1. 클라이언트 연결 종료 감지
2. 연결 목록에서 제거
```
