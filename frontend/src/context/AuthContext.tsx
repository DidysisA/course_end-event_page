import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  user: { _id: string; name: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<AuthContextType['user']>(null);

    useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
        setToken(stored);
        api.get('/auth/me').then(res => setUser(res.data));
    }
    }, []);

    const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    const me = await api.get('/auth/me');
    setUser(me.data);
    };

    const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
