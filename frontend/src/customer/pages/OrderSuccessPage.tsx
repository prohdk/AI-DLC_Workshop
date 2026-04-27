import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/shared/contexts/CartContext';
import type { Order } from '@/types';

export default function OrderSuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { clear } = useCart();
  const [countdown, setCountdown] = useState(5);
  const order = (location.state as { order?: Order })?.order;

  useEffect(() => {
    clear();
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) navigate('/customer/menu');
  }, [countdown, navigate]);

  if (!order) { navigate('/customer/menu'); return null; }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-xl font-bold mb-2">{t('order.success')}</h1>
        <p className="text-gray-600 mb-4">{t('order.orderNumber')}: <span className="font-bold text-lg">#{order.id}</span></p>
        <div className="bg-gray-50 rounded p-3 mb-4 text-left space-y-1">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.menu_name} × {item.quantity}</span>
              <span>{(item.unit_price * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between font-bold">
            <span>{t('cart.total')}</span>
            <span>{order.total_amount.toLocaleString()}원</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{t('order.redirecting', { seconds: countdown })}</p>
      </div>
    </div>
  );
}
