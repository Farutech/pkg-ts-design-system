import { useState, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const STORAGE_USER_KEY = 'auth_user';
const STORAGE_TOKEN_KEY = 'auth_token';

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY) || localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Dirección de correo electrónico inválida.');
      }
      const authenticatedUser: User = {
        id: 'usr_' + Date.now().toString(36),
        name: email.split('@')[0],
        email: email.trim().toLowerCase(),
        role: 'admin',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authenticatedUser));
        localStorage.setItem(STORAGE_TOKEN_KEY, 'ft_' + Math.random().toString(36).substring(2));
      }
      setUser(authenticatedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Dirección de correo electrónico inválida.');
      }
      const newUser: User = {
        id: 'usr_' + Date.now().toString(36),
        name: name.trim() || email.split('@')[0],
        email: email.trim().toLowerCase(),
        role: 'user',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
        localStorage.setItem(STORAGE_TOKEN_KEY, 'ft_' + Math.random().toString(36).substring(2));
      }
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    }
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };
}

