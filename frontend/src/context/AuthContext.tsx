import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { login as apiLogin, register as apiRegister } from '../api/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadStoredAuth = (): { user: User | null; token: string | null } => {
  try {
    const token = localStorage.getItem('meuflix_token');
    const userStr = localStorage.getItem('meuflix_user');
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stored = loadStoredAuth();
  const [user, setUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);

  const login = useCallback(async (username: string, password: string) => {
    const response = await apiLogin(username, password);
    localStorage.setItem('meuflix_token', response.token);
    localStorage.setItem('meuflix_user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const response = await apiRegister(username, email, password);
    localStorage.setItem('meuflix_token', response.token);
    localStorage.setItem('meuflix_user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('meuflix_token');
    localStorage.removeItem('meuflix_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
