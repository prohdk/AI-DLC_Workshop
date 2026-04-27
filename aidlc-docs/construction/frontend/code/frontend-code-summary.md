# Frontend Code Summary

## 생성된 파일 목록 (38개)

### Project Setup (8)
- `frontend/package.json` — React 18, Tailwind, dnd-kit, axios, i18next, react-router-dom
- `frontend/tsconfig.json` — TypeScript strict, path alias @/
- `frontend/vite.config.ts` — Vite + React plugin, /api proxy to backend
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/index.html`
- `frontend/src/main.tsx` — 진입점 (BrowserRouter, i18n)
- `frontend/src/index.css` — Tailwind directives

### Types (1)
- `frontend/src/types/index.ts` — Category, MenuItem, Order, OrderItem, Table, TableSummary, OrderHistory, CartItem, SSEEvent

### Shared API (5)
- `client.ts` — Axios 인스턴스 (JWT 인터셉터, 401 리다이렉트)
- `auth.ts` — adminLogin, tableLogin
- `menu.ts` — 카테고리/메뉴 CRUD + reorder
- `orders.ts` — 주문 CRUD + 상태 변경
- `tables.ts` — 테이블 설정/요약/완료/이력

### Shared Contexts (2)
- `AuthContext.tsx` — token, role, login/logout (localStorage)
- `CartContext.tsx` — items, addItem/removeItem/updateQuantity/clear (localStorage)

### Shared Hooks (1)
- `useSSE.ts` — EventSource 연결, 이벤트 타입별 콜백, 3초 자동 재연결

### Shared Components (5)
- `Spinner.tsx`, `ErrorMessage.tsx`, `ConfirmModal.tsx`, `Badge.tsx`, `LanguageSwitcher.tsx`

### i18n (3)
- `index.ts` — i18next 설정
- `ko.json` — 한국어 번역 (78 키)
- `en.json` — 영어 번역 (78 키)

### CustomerApp Pages (5)
- `TableLoginPage.tsx` — 자동 로그인 + 수동 로그인 폼
- `MenuPage.tsx` — 카테고리 탭 바 + 메뉴 카드 그리드
- `OrderConfirmPage.tsx` — 주문 확인 + 확정
- `OrderSuccessPage.tsx` — 주문 성공 (상세 정보 + 5초 카운트다운)
- `OrderHistoryPage.tsx` — 현재 세션 주문 내역

### CustomerApp Components (3)
- `CategoryTabBar.tsx` — 가로 스크롤 카테고리 탭
- `MenuCard.tsx` — 메뉴 카드 (이미지, 이름, 가격, 추가 버튼)
- `CartBottomBar.tsx` — 하단 고정 바 + 슬라이드업 장바구니 패널

### AdminApp Pages (4)
- `AdminLoginPage.tsx` — 관리자 로그인
- `DashboardPage.tsx` — 실시간 주문 모니터링 (SSE + 반응형 그리드)
- `TableManagementPage.tsx` — 테이블 설정/이용 완료/과거 내역
- `MenuManagementPage.tsx` — 메뉴 CRUD + dnd-kit 드래그앤드롭 순서 변경

### AdminApp Components (3)
- `TableCard.tsx` — 테이블 카드 (상태 표시, 최근 주문 미리보기)
- `OrderDetailModal.tsx` — 주문 상세 (상태 변경, 삭제, 이용 완료)
- `OrderHistoryModal.tsx` — 과거 주문 내역 (날짜 필터)

### App Router (1)
- `App.tsx` — 10개 라우트 (customer 5 + admin 4 + root redirect)

### Deployment (1)
- `frontend/Dockerfile` — Node 20 Alpine

## 라우트 구조

| Path | Component | Auth |
|---|---|---|
| / | → /customer/login | - |
| /customer/login | TableLoginPage | - |
| /customer/menu | MenuPage | table |
| /customer/order/confirm | OrderConfirmPage | table |
| /customer/order/success | OrderSuccessPage | table |
| /customer/orders | OrderHistoryPage | table |
| /admin/login | AdminLoginPage | - |
| /admin/dashboard | DashboardPage | admin |
| /admin/tables | TableManagementPage | admin |
| /admin/menu | MenuManagementPage | admin |
