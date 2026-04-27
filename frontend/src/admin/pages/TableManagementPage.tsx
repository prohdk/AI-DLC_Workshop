import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTables, setupTable, completeSession } from '@/shared/api/tables';
import type { Table } from '@/types';
import Spinner from '@/shared/components/Spinner';
import ErrorMessage from '@/shared/components/ErrorMessage';
import ConfirmModal from '@/shared/components/ConfirmModal';
import OrderHistoryModal from '../components/OrderHistoryModal';

export default function TableManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNumber, setNewNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [historyId, setHistoryId] = useState<number | null>(null);

  const load = () => { getTables().then((r) => setTables(r.data)).finally(() => setIsLoading(false)); };
  useEffect(load, []);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await setupTable(parseInt(newNumber), newPassword);
      setNewNumber(''); setNewPassword('');
      load();
    } catch { setError(t('common.error')); }
  }

  async function handleComplete(tableId: number) {
    try { await completeSession(tableId); setConfirmId(null); load(); }
    catch { setError(t('common.error')); }
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('admin.tables')}</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="px-3 py-1 text-sm border rounded min-h-[44px]" data-testid="back-dashboard">{t('admin.dashboard')}</button>
      </header>
      <div className="p-4">
        <form onSubmit={handleSetup} className="bg-white rounded-lg shadow p-4 mb-4 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-600">{t('auth.tableNumber')}</label>
            <input type="number" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} min={1} required
              className="w-full p-2 border rounded min-h-[44px]" data-testid="setup-table-number" />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600">{t('auth.password')}</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
              className="w-full p-2 border rounded min-h-[44px]" data-testid="setup-table-password" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded min-h-[44px]" data-testid="setup-table-submit">{t('admin.setupTable')}</button>
        </form>
        <ErrorMessage message={error} />
        <div className="space-y-2">
          {tables.map((tbl) => (
            <div key={tbl.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between" data-testid={`table-row-${tbl.id}`}>
              <span className="font-medium">{t('admin.tableNumber', { number: tbl.table_number })}</span>
              <div className="flex gap-2">
                <button onClick={() => setHistoryId(tbl.id)} className="px-3 py-1 text-sm border rounded min-h-[44px]" data-testid={`table-history-${tbl.id}`}>{t('admin.orderHistory')}</button>
                {tbl.current_session_id ? (
                  <button onClick={() => setConfirmId(tbl.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded min-h-[44px]" data-testid={`table-complete-${tbl.id}`}>{t('admin.completeSession')}</button>
                ) : (
                  <span className="text-sm text-gray-400 py-1">{t('admin.noActiveSession')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {confirmId && <ConfirmModal message={t('admin.completeConfirm')} onConfirm={() => handleComplete(confirmId)} onCancel={() => setConfirmId(null)} />}
      {historyId && <OrderHistoryModal tableId={historyId} onClose={() => setHistoryId(null)} />}
    </div>
  );
}
