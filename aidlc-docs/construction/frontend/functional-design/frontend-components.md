# Frontend Components — 상세 정의

## 라우팅 구조

```
/                        → 리다이렉트 (/customer/login 또는 /admin/login)
/customer/login          → TableLoginPage
/customer/menu           → MenuPage (기본 화면)
/customer/order/confirm  → OrderConfirmPage
/customer/order/success  → OrderSuccessPage
/customer/orders         → OrderHistoryPage
/admin/login             → AdminLoginPage
/admin/dashboard         → DashboardPage
/admin/tables            → TableManagementPage
/admin/menu              → MenuManagementPage
```

---

## CustomerApp 컴포넌트

### TableLoginPage
- **Props**: 없음
- **State**: storeIdentifier, tableNumber, password, error, isLoading
- **동작**: 저장된 자격 증명 확인 → 있으면 자동 로그인 시도 → 성공 시 /customer/menu 이동
- **UI**: 매장 식별자, 테이블 번호, 비밀번호 입력 폼
- **API**: POST /api/auth/table/login
- **localStorage**: `table_credentials` (storeIdentifier, tableNumber, password), `table_token`

### MenuPage
- **Props**: 없음
- **State**: categories[], menuItems[], activeCategory, isLoading
- **동작**: 카테고리 목록 + 메뉴 목록 로드 → 상단 탭 바로 카테고리 전환
- **UI**: 상단 카테고리 탭 바 (가로 스크롤) + 메뉴 카드 그리드 + 하단 장바구니 바
- **API**: GET /api/menu/categories, GET /api/menu/items
- **하위 컴포넌트**: CategoryTabBar, MenuCard, CartBottomBar

### CategoryTabBar
- **Props**: categories[], activeCategory, onSelect(categoryId)
- **UI**: 가로 스크롤 탭 바, 활성 카테고리 하이라이트

### MenuCard
- **Props**: menuItem (id, name, price, description, image_url)
- **동작**: 카드 클릭 또는 "추가" 버튼 → CartContext.addItem()
- **UI**: 이미지 + 메뉴명 + 가격 + 추가 버튼 (44x44px 이상)

### CartBottomBar
- **Props**: 없음 (CartContext 사용)
- **State**: isExpanded (슬라이드업 패널 열림/닫힘)
- **UI**: 하단 고정 바 (총 수량 + 총 금액 + "주문하기" 버튼) → 클릭 시 슬라이드업 패널
- **슬라이드업 패널**: 장바구니 항목 목록 (이름, 수량 +-버튼, 단가, 소계) + 삭제 버튼 + 비우기 버튼

### OrderConfirmPage
- **Props**: 없음 (CartContext 사용)
- **State**: isSubmitting, error
- **동작**: 장바구니 내용 최종 확인 → "주문 확정" 클릭 → API 호출 → 성공 시 OrderSuccessPage 이동
- **UI**: 주문 항목 목록 + 총 금액 + "주문 확정" 버튼 + "돌아가기" 버튼
- **API**: POST /api/orders

### OrderSuccessPage
- **Props**: 없음 (location.state로 주문 정보 수신)
- **State**: countdown (5→0)
- **동작**: 5초 카운트다운 → 0 시 /customer/menu 자동 이동 + 장바구니 비우기
- **UI**: 주문 번호 + 주문 항목 요약 + 총 금액 + 카운트다운 표시

### OrderHistoryPage
- **Props**: 없음
- **State**: orders[], isLoading
- **동작**: 현재 세션 주문 목록 로드
- **UI**: 주문 카드 목록 (주문 번호, 시각, 항목, 금액, 상태 배지)
- **API**: GET /api/orders/session

---

## AdminApp 컴포넌트

### AdminLoginPage
- **Props**: 없음
- **State**: storeIdentifier, username, password, error, isLoading
- **동작**: 로그인 → JWT 저장 → /admin/dashboard 이동
- **API**: POST /api/auth/admin/login
- **localStorage**: `admin_token`

### DashboardPage
- **Props**: 없음
- **State**: tables[], isLoading
- **동작**: 테이블 목록 + 요약 로드 → SSE 연결 → 실시간 업데이트
- **UI**: 반응형 그리드 (2~4열) 테이블 카드 + 신규 주문 강조 애니메이션
- **API**: GET /api/tables, GET /api/tables/{id}/summary, GET /api/orders/table/{id}
- **SSE**: GET /api/sse/orders
- **하위 컴포넌트**: TableCard, OrderDetailModal

### TableCard
- **Props**: table (id, tableNumber, totalAmount, orderCount, orders[])
- **State**: isNew (신규 주문 강조)
- **동작**: 카드 클릭 → OrderDetailModal 열기
- **UI**: 테이블 번호 + 총 주문액 + 최신 주문 미리보기 (최대 3개) + 상태 색상

### OrderDetailModal
- **Props**: tableId, orders[], onClose, onStatusChange, onDelete
- **UI**: 전체 주문 목록 + 각 주문별 상태 변경 버튼 + 삭제 버튼 + 이용 완료 버튼
- **API**: PATCH /api/orders/{id}/status, DELETE /api/orders/{id}, POST /api/tables/{id}/complete

### TableManagementPage
- **Props**: 없음
- **State**: tables[], isLoading
- **동작**: 테이블 목록 + 설정/이용 완료/과거 내역 관리
- **UI**: 테이블 목록 + "테이블 추가" 폼 + 각 테이블별 액션 버튼
- **API**: GET /api/tables, POST /api/tables, POST /api/tables/{id}/complete
- **하위 컴포넌트**: OrderHistoryModal

### OrderHistoryModal
- **Props**: tableId, onClose
- **State**: history[], dateFilter, isLoading
- **UI**: 날짜 필터 + 과거 주문 목록 (주문 번호, 시각, 항목, 금액, 아카이브 시각)
- **API**: GET /api/tables/{id}/history?date_filter=

### MenuManagementPage
- **Props**: 없음
- **State**: categories[], menuItems[], selectedCategory, isLoading
- **동작**: 카테고리/메뉴 CRUD + 드래그앤드롭 순서 변경 (dnd-kit)
- **UI**: 좌측 카테고리 목록 + 우측 메뉴 항목 목록 (드래그앤드롭) + CRUD 폼/모달
- **API**: 전체 menu admin API

---

## Shared 컴포넌트

### API Client (`shared/api/client.ts`)
- Axios 인스턴스, baseURL: `http://localhost:8000`
- 요청 인터셉터: localStorage에서 토큰 읽어 Authorization 헤더 추가
- 응답 인터셉터: 401 시 토큰 삭제 + 로그인 페이지 리다이렉트

### AuthContext
- **State**: token, isAuthenticated, role (admin/table)
- **Methods**: login(token), logout(), getToken()
- 토큰 localStorage 저장/복원

### CartContext
- **State**: items[] (menuItemId, name, price, quantity), totalAmount, totalCount
- **Methods**: addItem(menuItem), removeItem(menuItemId), updateQuantity(menuItemId, qty), clear()
- localStorage 저장/복원 (`cart_items`)

### useSSE Hook
- **Input**: url, token
- **Output**: lastEvent, isConnected
- **동작**: EventSource 연결 → 이벤트 타입별 콜백 → 연결 해제 시 자동 재연결

### 공통 UI
- Spinner: 로딩 스피너
- ErrorMessage: 인라인 에러 메시지
- ConfirmModal: 확인 팝업 (삭제, 이용 완료 등)
- Badge: 주문 상태 배지 (pending=노랑, preparing=파랑, completed=초록)
