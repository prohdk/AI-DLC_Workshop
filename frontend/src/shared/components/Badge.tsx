import { useTranslation } from 'react-i18next';
import type { OrderStatus } from '@/types';

const colors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export default function Badge({ status }: { status: OrderStatus }) {
  const { t } = useTranslation();
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`} data-testid={`badge-${status}`}>
      {t(`order.status.${status}`)}
    </span>
  );
}
