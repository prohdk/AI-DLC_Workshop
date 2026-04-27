import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminLogin } from '@/shared/api/auth';
import { useAuth } from '@/shared/contexts/AuthContext';
import ErrorMessage from '@/shared/components/ErrorMessage';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();
  const [storeId, setStoreId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && role === 'admin') navigate('/admin/dashboard');
  }, [isAuthenticated, role, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await adminLogin(storeId, username, password);
      login(data.access_token, 'admin');
      navigate('/admin/dashboard');
    } catch {
      setError(t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4"><LanguageSwitcher /></div>
        <h1 className="text-2xl font-bold text-center mb-6">{t('admin.dashboard')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <input type="text" value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder={t('auth.storeId')}
            className="w-full p-3 border rounded min-h-[44px]" required data-testid="admin-login-store-id" />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('auth.username')}
            className="w-full p-3 border rounded min-h-[44px]" required data-testid="admin-login-username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password')}
            className="w-full p-3 border rounded min-h-[44px]" required data-testid="admin-login-password" />
          <ErrorMessage message={error} />
          <button type="submit" disabled={isLoading}
            className="w-full p-3 bg-blue-600 text-white rounded font-medium min-h-[44px] disabled:opacity-50" data-testid="admin-login-submit">
            {isLoading ? t('common.loading') : t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
}
