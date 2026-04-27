import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/shared/contexts/CartContext';
import { createOrder } from '@/shared/api/orders';
import ErrorMessage from '@/shared/components/ErrorMessage';

export default function OrderConfirmPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalAmount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    setIsSubmitting(true);
    setError('');
    try {
      const { data } = await createOrder(items.map((i) => ({ menu_item_id: i.menuItemId, quantity: i.quantity })));
      navigate('/customer/order/success', { state: { order: data } });
    } catch {
      setError(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    navigate('/customer/menu');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-4">{t('order.confirm')}</h1>
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between" data-testid={`confirm-item-${item.menuItemId}`}>
            <span>{item.name} × {item.quantity}</span>
            <span className="font-medium">{(item.price * item.quantity).toLocaleString()}원</span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>{t('cart.total')}</span>
          <span>{totalAmount.toLocaleString()}원</span>
        </div>
      </div>
      <ErrorMessage message={error} />
      <div className="flex gap-3 mt-6">
        <button onClick={() => navigate(-1)} className="flex-1 p-3 border rounded min-h-[44px]" data-testid="order-confirm-back">
          {t('order.back')}
        </button>
        <button onClick={handleConfirm} disabled={isSubmitting}
          className="flex-1 p-3 bg-blue-600 text-white rounded font-medium min-h-[44px] disabled:opacity-50" data-testid="order-confirm-submit">
          {isSubmitting ? t('common.loading') : t('order.confirmButton')}
        </button>
      </div>
    </div>
  );
}
