import { useTranslation } from 'react-i18next';
import type { TableSummary, Order } from '@/types';
import Badge from '@/shared/components/Badge';

interface Props {
  table: TableSummary & { orders: Order[] };
  onClick: () => void;
}

export default function TableCard({ table, onClick }: Props) {
  const { t } = useTranslation();
  const recentOrders = table.orders.slice(-3);

  return (
    <div onClick={onClick} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow" data-testid={`table-card-${table.id}`} role="button" tabIndex={0}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{t('admin.tableNumber', { number: table.table_number })}</h3>
        {table.current_session_id ? (
          <span className="w-3 h-3 rounded-full bg-green-500" />
        ) : (
          <span className="w-3 h-3 rounded-full bg-gray-300" />
        )}
      </div>
      <p className="text-sm text-gray-600">{t('admin.totalAmount')}: <span className="font-medium">{table.total_amount.toLocaleString()}원</span></p>
      <p className="text-sm text-gray-600 mb-2">{t('admin.orderCount')}: {table.order_count}</p>
      {recentOrders.length > 0 && (
        <div className="border-t pt-2 space-y-1">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex justify-between items-center text-xs">
              <span>#{order.id}</span>
              <Badge status={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
