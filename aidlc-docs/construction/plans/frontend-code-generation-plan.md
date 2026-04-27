# Frontend Code Generation Plan

## Unit Context
- **Unit**: Frontend (React + TypeScript)
- **Workspace Root**: /Users/prohdk/work/aidlc-workshop/table-order
- **Code Location**: `frontend/` directory in workspace root
- **Dependencies**: Backend API (http://localhost:8000)
- **Design Artifacts**: frontend-components.md, business-logic-model.md, business-rules.md

---

## Code Generation Steps

### Step 1: Project Setup
- [x] Create `frontend/package.json`
- [x] Create `frontend/tsconfig.json`
- [x] Create `frontend/vite.config.ts`
- [x] Create `frontend/tailwind.config.js`
- [x] Create `frontend/postcss.config.js`
- [x] Create `frontend/index.html`
- [x] Create `frontend/src/main.tsx`
- [x] Create `frontend/src/index.css` (Tailwind directives)

### Step 2: Shared Layer — API & Contexts
- [x] Create `frontend/src/shared/api/client.ts`
- [x] Create `frontend/src/shared/api/auth.ts`
- [x] Create `frontend/src/shared/api/menu.ts`
- [x] Create `frontend/src/shared/api/orders.ts`
- [x] Create `frontend/src/shared/api/tables.ts`
- [x] Create `frontend/src/shared/contexts/AuthContext.tsx`
- [x] Create `frontend/src/shared/contexts/CartContext.tsx`
- [x] Create `frontend/src/shared/hooks/useSSE.ts`
- [x] Create `frontend/src/shared/components/Spinner.tsx`
- [x] Create `frontend/src/shared/components/ErrorMessage.tsx`
- [x] Create `frontend/src/shared/components/ConfirmModal.tsx`
- [x] Create `frontend/src/shared/components/Badge.tsx`
- [x] Create `frontend/src/shared/components/LanguageSwitcher.tsx`

### Step 3: i18n Setup
- [x] Create `frontend/src/shared/i18n/index.ts`
- [x] Create `frontend/src/shared/i18n/ko.json`
- [x] Create `frontend/src/shared/i18n/en.json`

### Step 4: Types
- [x] Create `frontend/src/types/index.ts`

### Step 5: CustomerApp Pages
- [x] Create `frontend/src/customer/pages/TableLoginPage.tsx`
- [x] Create `frontend/src/customer/pages/MenuPage.tsx`
- [x] Create `frontend/src/customer/pages/OrderConfirmPage.tsx`
- [x] Create `frontend/src/customer/pages/OrderSuccessPage.tsx`
- [x] Create `frontend/src/customer/pages/OrderHistoryPage.tsx`

### Step 6: CustomerApp Components
- [x] Create `frontend/src/customer/components/CategoryTabBar.tsx`
- [x] Create `frontend/src/customer/components/MenuCard.tsx`
- [x] Create `frontend/src/customer/components/CartBottomBar.tsx`

### Step 7: AdminApp Pages
- [x] Create `frontend/src/admin/pages/AdminLoginPage.tsx`
- [x] Create `frontend/src/admin/pages/DashboardPage.tsx`
- [x] Create `frontend/src/admin/pages/TableManagementPage.tsx`
- [x] Create `frontend/src/admin/pages/MenuManagementPage.tsx`

### Step 8: AdminApp Components
- [x] Create `frontend/src/admin/components/TableCard.tsx`
- [x] Create `frontend/src/admin/components/OrderDetailModal.tsx`
- [x] Create `frontend/src/admin/components/OrderHistoryModal.tsx`

### Step 9: App Router
- [x] Create `frontend/src/App.tsx`

### Step 10: Deployment
- [x] Create `frontend/Dockerfile`
- [x] Update `docker-compose.yml` (add frontend service)

### Step 11: Documentation
- [x] Create `aidlc-docs/construction/frontend/code/frontend-code-summary.md`
