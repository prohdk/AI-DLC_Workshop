# Business Logic Model — Frontend

## 1. 테이블 자동 로그인 흐름

```
1. 앱 로드 시 localStorage에서 table_credentials 확인
2. 있으면 → 자동 로그인 API 호출
   - 성공 → token 저장, /customer/menu 이동
   - 실패 → credentials 삭제, 로그인 폼 표시
3. 없으면 → 로그인 폼 표시
4. 수동 로그인 성공 → credentials + token 저장, /customer/menu 이동
```

## 2. 장바구니 관리 흐름

```
addItem(menuItem):
  1. 기존 항목 확인 (menuItemId 기준)
  2. 있으면 → quantity + 1
  3. 없으면 → {menuItemId, name, price, quantity: 1} 추가
  4. totalAmount, totalCount 재계산
  5. localStorage 저장

updateQuantity(menuItemId, qty):
  1. qty < 1 → 항목 제거
  2. qty >= 1 → quantity 업데이트
  3. 재계산 + localStorage 저장

removeItem(menuItemId):
  1. 항목 제거
  2. 재계산 + localStorage 저장

clear():
  1. items = []
  2. localStorage 삭제
```

## 3. 주문 생성 흐름

```
1. OrderConfirmPage에서 장바구니 내용 표시
2. "주문 확정" 클릭
3. POST /api/orders (items: [{menu_item_id, quantity}])
4. 성공 → OrderSuccessPage로 이동 (주문 정보 전달)
5. 실패 → 에러 메시지 표시, 장바구니 유지
```

## 4. 주문 성공 + 리다이렉트 흐름

```
1. 주문 번호 + 항목 요약 + 총 금액 표시
2. 5초 카운트다운 시작 (setInterval)
3. 카운트다운 0 → CartContext.clear() + navigate(/customer/menu)
4. 사용자가 먼저 클릭해도 동일 동작
```

## 5. SSE 실시간 업데이트 흐름 (관리자)

```
1. DashboardPage 마운트 → useSSE 연결
2. 이벤트 수신 시 타입별 처리:
   - new_order → 해당 테이블 카드에 주문 추가 + 강조 애니메이션
   - order_status_changed → 해당 주문 상태 업데이트
   - order_deleted → 해당 주문 제거 + 총액 재계산
   - session_completed → 해당 테이블 카드 리셋
3. 연결 끊김 → 3초 후 자동 재연결
```

## 6. 관리자 인증 흐름

```
1. 앱 로드 시 localStorage에서 admin_token 확인
2. 있으면 → 토큰 유효성 확인 (만료 체크)
   - 유효 → /admin/dashboard 이동
   - 만료 → 토큰 삭제, 로그인 폼 표시
3. 없으면 → 로그인 폼 표시
4. 로그인 성공 → token 저장, /admin/dashboard 이동
5. API 401 응답 → 토큰 삭제, /admin/login 리다이렉트
```

## 7. 메뉴 드래그앤드롭 순서 변경 흐름

```
1. dnd-kit DndContext로 메뉴 목록 래핑
2. 드래그 종료 시 → 로컬 상태에서 순서 변경
3. 변경된 순서 → PUT /api/menu/admin/items/order 호출
4. 성공 → 상태 유지
5. 실패 → 이전 순서로 롤백 + 에러 표시
```

## 8. 이용 완료 흐름 (관리자)

```
1. 테이블 카드 또는 상세 모달에서 "이용 완료" 클릭
2. ConfirmModal 표시 ("정말 이용 완료 처리하시겠습니까?")
3. 확인 → POST /api/tables/{id}/complete
4. 성공 → 테이블 카드 리셋 (SSE로도 수신)
5. 실패 → 에러 메시지 표시
```
