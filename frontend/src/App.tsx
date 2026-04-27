import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { CartProvider } from '@/shared/contexts/CartContext';
import TableLoginPage from '@/customer/pages/TableLoginPage';
import MenuPage from '@/customer/pages/MenuPage';
import OrderConfirmPage from '@/customer/pages/OrderConfirmPage';
import OrderSuccessPage from '@/customer/pages/OrderSuccessPage';
import OrderHistoryPage from '@/customer/pages/OrderHistoryPage';
import AdminLoginPage from '@/admin/pages/AdminLoginPage';
import DashboardPage from '@/admin/pages/DashboardPage';
import TableManagementPage from '@/admin/pages/TableManagementPage';
import MenuManagementPage from '@/admin/pages/MenuManagementPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/customer/login" replace />} />
          <Route path="/customer/login" element={<TableLoginPage />} />
          <Route path="/customer/menu" element={<MenuPage />} />
          <Route path="/customer/order/confirm" element={<OrderConfirmPage />} />
          <Route path="/customer/order/success" element={<OrderSuccessPage />} />
          <Route path="/customer/orders" element={<OrderHistoryPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/tables" element={<TableManagementPage />} />
          <Route path="/admin/menu" element={<MenuManagementPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
