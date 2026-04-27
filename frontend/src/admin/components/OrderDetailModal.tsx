import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateOrderStatus, deleteOrder } from '@/shared/api/orders';
import { completeSession } from '@/shared/api/tables';
import type { TableSummary, Order, OrderStatus } from '@/types';
import Badge from '@/shared/components/Badge';
import ConfirmModal from '@/shared/components/ConfirmModal';

interface Props {
  table: TableSummary & { orders: Order[] };
  onClose: () => void;
}

const nextStatus: Record<string, OrderStatus | null> = { pending: 'preparing', preparing: 'completed', completed: null };

export default function OrderDetailModal({ table, onClose }: Props) {
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState<{ type: 'delete' | 'complete'; id?: number } | null>(null);

  async function handleStatusChange(orderId: number, current: OrderStatus) {
    const next = nextStatus[current];
    if (!next) return;
    await updateOrderStatus(orderId, next);
    onClose();
  }

  async function handleDelete(orderId: number) {
    await deleteOrder(orderId);
    setConfirm(null); onClose();
  }

  async function handleComplete() {
    await completeSession(table.id);
    setConfirm(null); onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="order-detail-modal">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">{t('admin.tableNumber', { number: table.table_number })}</h2>
          <button onClick={onClose} className="text-gray-500 min-h-[44px] min-w-[44px]" data-testid="modal-close">✕</button>
        </div>
        <div className="p-4 space-y-4">
          {table.orders.length === 0 ? (
            <p className="text-gray-500 text-center">{t('order.noOrders')}</p>
          ) : (
            table.orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-3" data-testid={`modal-order-${order.id}`}>
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
                <div className="flex justify-between font-medium mt-1 pt-1 border-t">
                  <span>{t('cart.total')}</span>
                  <span>{order.total_amount.toLocaleString()}원</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {nextStatus[order.status] && (
                    <button onClick={() => handleStatusChange(order.id, order.status)}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm min-h-[44px]" data-testid={`status-btn-${order.id}`}>
                      → {t(`order.status.${nextStatus[order.status]}`)}
                    </button>
                  )}
                  <button onClick={() => setConfirm({ type: 'delete', id: order.id })}
                    className="px-3 py-1 border border-red-500 text-red-500 rounded text-sm min-h-[44px]" data-testid={`delete-btn-${order.id}`}>
                    {t('admin.deleteOrder')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {table.current_session_id && (
          <div className="p-4 border-t">
            <button onClick={() => setConfirm({ type: 'complete' })}
              className="w-full p-3 bg-red-500 text-white rounded font-medium min-h-[44px]" data-testid="complete-session-btn">
              {t('admin.completeSession')}
            </button>
          </div>
        )}
      </div>
      {confirm?.type === 'delete' && confirm.id && (
        <ConfirmModal message={t('admin.deleteOrderConfirm')} onConfirm={() => handleDelete(confirm.id!)} onCancel={() => setConfirm(null)} />
      )}
      {confirm?.type === 'complete' && (
        <ConfirmModal message={t('admin.completeConfirm')} onConfirm={handleComplete} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}
