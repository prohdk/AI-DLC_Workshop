import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getOrderHistory } from '@/shared/api/tables';
import type { OrderHistory } from '@/types';
import Spinner from '@/shared/components/Spinner';

interface Props { tableId: number; onClose: () => void; }

export default function OrderHistoryModal({ tableId, onClose }: Props) {
  const { t } = useTranslation();
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getOrderHistory(tableId, dateFilter || undefined).then((r) => setHistory(r.data)).finally(() => setIsLoading(false));
  }, [tableId, dateFilter]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="history-modal">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">{t('admin.orderHistory')}</h2>
          <button onClick={onClose} className="text-gray-500 min-h-[44px] min-w-[44px]" data-testid="history-modal-close">✕</button>
        </div>
        <div className="p-4">
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
            className="w-full p-2 border rounded mb-4 min-h-[44px]" data-testid="history-date-filter" />
          {isLoading ? <Spinner /> : history.length === 0 ? (
            <p className="text-gray-500 text-center">{t('admin.noHistory')}</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="border rounded-lg p-3" data-testid={`history-item-${h.id}`}>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">#{h.order_number}</span>
                    <span className="text-xs text-gray-500">{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                  {h.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.menu_name} × {item.quantity}</span>
                      <span>{(item.unit_price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium mt-1 pt-1 border-t">
                    <span>{t('cart.total')}</span>
                    <span>{h.total_amount.toLocaleString()}원</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Archived: {new Date(h.archived_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
