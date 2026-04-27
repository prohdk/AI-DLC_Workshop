import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTables, getTableSummary } from '@/shared/api/tables';
import { getTableOrders } from '@/shared/api/orders';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useSSE } from '@/shared/hooks/useSSE';
import type { TableSummary, Order } from '@/types';
import Spinner from '@/shared/components/Spinner';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import TableCard from '../components/TableCard';
import OrderDetailModal from '../components/OrderDetailModal';

interface TableData extends TableSummary { orders: Order[]; isNew?: boolean; }

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const loadData = async () => {
    try {
      const { data: tableList } = await getTables();
      const results = await Promise.all(
        tableList.map(async (tbl) => {
          const [summary, orders] = await Promise.all([
            getTableSummary(tbl.id), getTableOrders(tbl.id),
          ]);
          return { ...summary.data, orders: orders.data } as TableData;
        }),
      );
      setTables(results);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSSE = useCallback((event: string, _data: unknown) => {
    // Reload data on any SSE event for simplicity
    if (['new_order', 'order_status_changed', 'order_deleted', 'session_completed'].includes(event)) {
      loadData();
    }
  }, []);

  useSSE({ url: '/api/sse/orders', token, onEvent: handleSSE });

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('admin.dashboard')}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/tables')} className="px-3 py-1 text-sm border rounded min-h-[44px]" data-testid="nav-tables">{t('admin.tables')}</button>
          <button onClick={() => navigate('/admin/menu')} className="px-3 py-1 text-sm border rounded min-h-[44px]" data-testid="nav-menu">{t('admin.menuManagement')}</button>
          <LanguageSwitcher />
          <button onClick={logout} className="px-3 py-1 text-sm border rounded text-red-500 min-h-[44px]" data-testid="admin-logout">{t('auth.logout')}</button>
        </div>
      </header>
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((tbl) => (
          <TableCard key={tbl.id} table={tbl} onClick={() => setSelectedTable(tbl)} />
        ))}
      </div>
      {selectedTable && (
        <OrderDetailModal table={selectedTable} onClose={() => { setSelectedTable(null); loadData(); }} />
      )}
    </div>
  );
}
