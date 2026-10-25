import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as api from '../services/api.js';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const read = () => { try { return JSON.parse(localStorage.getItem('pg_user')); } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(read);

  const persist = (res) => {
    localStorage.setItem('pg_token', res.token);
    localStorage.setItem('pg_user', JSON.stringify(res.user));
    setUser(res.user);
  };
  const login = useCallback(async (c) => persist(await api.login(c)), []);
  const register = useCallback(async (d) => persist(await api.register(d)), []);
  const logout = useCallback(() => {
    localStorage.removeItem('pg_token'); localStorage.removeItem('pg_user'); setUser(null);
  }, []);
  const updateUser = useCallback((patch) => {
    setUser((u) => { const n = { ...u, ...patch }; localStorage.setItem('pg_user', JSON.stringify(n)); return n; });
  }, []);

  const value = useMemo(() => ({ user, login, register, logout, updateUser }), [user, login, register, logout, updateUser]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
