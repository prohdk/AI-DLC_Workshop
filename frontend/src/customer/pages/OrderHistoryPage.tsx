import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSessionOrders } from '@/shared/api/orders';
import type { Order } from '@/types';
import Spinner from '@/shared/components/Spinner';
import Badge from '@/shared/components/Badge';

export default function OrderHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSessionOrders().then((r) => setOrders(r.data)).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{t('order.history')}</h1>
        <button onClick={() => navigate('/customer/menu')} className="px-3 py-1 border rounded min-h-[44px]" data-testid="history-back-btn">
          {t('menu.title')}
        </button>
      </div>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">{t('order.noOrders')}</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4" data-testid={`order-card-${order.id}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">#{order.id}</span>
                <Badge status={order.status} />
              </div>
              <p className="text-xs text-gray-500 mb-2">{new Date(order.created_at).toLocaleString()}</p>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.menu_name} × {item.quantity}</span>
                  <span>{(item.unit_price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span>{t('cart.total')}</span>
                <span>{order.total_amount.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
