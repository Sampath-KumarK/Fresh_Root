import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';
import { api, getApiErrorMessage } from '../config/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'freshroots_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const response = await api.post<AuthUser>('/auth/login', { email, password, role });
      const authData = response.data;
      setUser(authData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authData));
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Login failed. Please check your credentials.');
      throw new Error(msg);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    role: UserRole;
  }) => {
    try {
      await api.post('/auth/register', data);
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Registration failed. Please check your information.');
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
