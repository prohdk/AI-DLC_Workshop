import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tableLogin } from '@/shared/api/auth';
import { useAuth } from '@/shared/contexts/AuthContext';
import ErrorMessage from '@/shared/components/ErrorMessage';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';

export default function TableLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [storeId, setStoreId] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('table_credentials');
    if (saved) {
      try {
        const creds = JSON.parse(saved);
        autoLogin(creds.storeIdentifier, creds.tableNumber, creds.password);
      } catch { /* ignore */ }
    }
  }, []);

  async function autoLogin(sid: string, tn: number, pw: string) {
    try {
      const { data } = await tableLogin(sid, tn, pw);
      login(data.access_token, 'table');
      navigate('/customer/menu');
    } catch {
      localStorage.removeItem('table_credentials');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const tn = parseInt(tableNumber);
      const { data } = await tableLogin(storeId, tn, password);
      localStorage.setItem('table_credentials', JSON.stringify({ storeIdentifier: storeId, tableNumber: tn, password }));
      login(data.access_token, 'table');
      navigate('/customer/menu');
    } catch {
      setError(t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4"><LanguageSwitcher /></div>
        <h1 className="text-2xl font-bold text-center mb-6">{t('auth.login')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder={t('auth.storeId')}
            className="w-full p-3 border rounded min-h-[44px]" required data-testid="table-login-store-id" />
          <input type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder={t('auth.tableNumber')}
            className="w-full p-3 border rounded min-h-[44px]" required min={1} data-testid="table-login-table-number" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password')}
            className="w-full p-3 border rounded min-h-[44px]" required data-testid="table-login-password" />
          <ErrorMessage message={error} />
          <button type="submit" disabled={isLoading}
            className="w-full p-3 bg-blue-600 text-white rounded font-medium min-h-[44px] disabled:opacity-50" data-testid="table-login-submit">
            {isLoading ? t('common.loading') : t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
}
