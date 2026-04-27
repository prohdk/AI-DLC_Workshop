import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AuthState {
  token: string | null;
  role: 'admin' | 'table' | null;
  isAuthenticated: boolean;
  login: (token: string, role: 'admin' | 'table') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('admin_token') || localStorage.getItem('table_token'),
  );
  const [role, setRole] = useState<'admin' | 'table' | null>(() => {
    if (localStorage.getItem('admin_token')) return 'admin';
    if (localStorage.getItem('table_token')) return 'table';
    return null;
  });

  const login = useCallback((t: string, r: 'admin' | 'table') => {
    localStorage.setItem(r === 'admin' ? 'admin_token' : 'table_token', t);
    setToken(t);
    setRole(r);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('table_token');
    setToken(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
