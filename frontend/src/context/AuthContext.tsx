// frontend/src/context/AuthContext.tsx
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(null);

  // On app start or when `token` changes, fetch the user profile
  useEffect(() => {
    if (!token) return;       // *only* if we actually have a token
    api
      .get<User>('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        // invalid or expired token: clean up
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const login = async (email: string, password: string) => {
    // 1) authenticate & store token
    const res = await api.post<{ token: string }>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);

    // 2) immediately fetch & store user
    const me = await api.get<User>('/auth/me');
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
