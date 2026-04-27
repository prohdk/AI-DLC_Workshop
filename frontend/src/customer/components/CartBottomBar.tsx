import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/shared/contexts/CartContext';

export default function CartBottomBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalAmount, totalCount, updateQuantity, removeItem, clear } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  if (totalCount === 0) return null;

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsExpanded(false)} />
      )}
      {isExpanded && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 max-h-[70vh] overflow-y-auto p-4" data-testid="cart-panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{t('cart.title')}</h2>
            <button onClick={() => clear()} className="text-sm text-red-500 min-h-[44px]" data-testid="cart-clear">{t('cart.clearAll')}</button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex items-center justify-between" data-testid={`cart-item-${item.menuItemId}`}>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.price.toLocaleString()}원</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center min-h-[44px] min-w-[44px]" data-testid={`cart-minus-${item.menuItemId}`}>−</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center min-h-[44px] min-w-[44px]" data-testid={`cart-plus-${item.menuItemId}`}>+</button>
                  <button onClick={() => removeItem(item.menuItemId)}
                    className="ml-2 text-red-500 min-h-[44px] min-w-[44px]" data-testid={`cart-remove-${item.menuItemId}`}>✕</button>
                </div>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>{t('cart.total')}</span>
            <span>{totalAmount.toLocaleString()}원</span>
          </div>
          <button onClick={() => { setIsExpanded(false); navigate('/customer/order/confirm'); }}
            className="w-full p-3 bg-blue-600 text-white rounded font-medium min-h-[44px]" data-testid="cart-order-btn">
            {t('order.confirmButton')}
          </button>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30 px-4 py-3 flex items-center justify-between"
        onClick={() => setIsExpanded(true)} data-testid="cart-bottom-bar" role="button" tabIndex={0}>
        <span className="font-medium">{t('cart.items', { count: totalCount })}</span>
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">{totalAmount.toLocaleString()}원</span>
          <span className="bg-blue-600 text-white px-4 py-2 rounded min-h-[44px] flex items-center">{t('cart.orderButton')}</span>
        </div>
      </div>
    </>
  );
}
