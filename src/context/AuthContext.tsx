import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { USE_MOCK, STORAGE_KEYS } from '../config/api.config';
import * as authService from '../services/auth.service';
import { parseApiError } from '../lib/errorMapper';
import type { User } from '../types/api';

// ── Types ──
export type UserRole = 'admin' | 'passenger' | 'driver';
export type AuthProvider42 = 'email' | '42';

export interface AuthUser {
  id?: number;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  avatar: string;
  initials: string;
  login42?: string;
  campus?: string;
  authProvider: AuthProvider42;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
  needsRoleSelection: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  loginWith42: () => Promise<{ result: 'role-select' } | { result: 'dashboard'; path: string } | { result: 'error' }>;
  setUserRole: (role: UserRole) => void;
  logout: () => void;
  clearError: () => void;
  getDashboardPath: (role: UserRole) => string;
}

// ── Mock credentials (used when VITE_USE_MOCK=true) ──
const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin': {
    password: 'admin123',
    user: {
      id: 1,
      name: 'Adil Bourji',
      username: 'admin',
      email: 'admin@fleetmark.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Adil&backgroundColor=b6e3f4&top=shortHair',
      initials: 'AB',
      authProvider: 'email',
    },
  },
  'passenger': {
    password: 'pass123',
    user: {
      id: 2,
      name: 'Ahmed Benali',
      username: 'passenger',
      email: 'passenger@fleetmark.com',
      role: 'passenger',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmed&backgroundColor=b6e3f4&top=shortHair',
      initials: 'AB',
      authProvider: 'email',
    },
  },
  'driver': {
    password: 'driver123',
    user: {
      id: 3,
      name: 'Karim El Amrani',
      username: 'driver',
      email: 'driver@fleetmark.com',
      role: 'driver',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Karim&backgroundColor=c0aede&top=shortHair',
      initials: 'KA',
      authProvider: 'email',
    },
  },
};

// ── Mock 42 user (simulates data from 42 API) ──
const MOCK_42_USER: Omit<AuthUser, 'role'> & { role?: UserRole } = {
  name: 'Adil Bourji',
  email: 'abourji@student.1337.ma',
  avatar: 'https://cdn.intra.42.fr/users/abourji.jpg',
  initials: 'AB',
  login42: 'abourji',
  campus: '1337',
  authProvider: '42',
};

// ── Helpers ──
export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin': return '/admin/overview';
    case 'passenger': return '/passenger/overview';
    case 'driver': return '/driver/overview';
  }
};

function apiUserToAuthUser(u: User): AuthUser {
  const initials = u.username.slice(0, 2).toUpperCase();
  return {
    id: u.id,
    name: u.username,
    username: u.username,
    email: u.email,
    role: u.role as UserRole,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${u.username}&backgroundColor=b6e3f4&top=shortHair`,
    initials,
    authProvider: 'email',
  };
}

// ── Context ──
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  // ── Session restore on mount ──
  useEffect(() => {
    (async () => {
      try {
        if (USE_MOCK) {
          const stored = localStorage.getItem(STORAGE_KEYS.USER);
          if (stored) setUser(JSON.parse(stored));
        } else {
          const apiUser = await authService.restoreSession();
          if (apiUser) setUser(apiUserToAuthUser(apiUser));
        }
      } catch {
        // Silent fail — user stays logged out
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []);

  // ── Login (username + password) ──
  const login = useCallback(async (username: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (USE_MOCK) {
      // Mock auth path
      await new Promise((resolve) => setTimeout(resolve, 800));
      const entry = MOCK_USERS[username.toLowerCase()];
      if (entry && entry.password === password && entry.user.role === role) {
        setUser(entry.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(entry.user));
        setIsLoading(false);
        return true;
      }
      setError('Invalid username or password. Please try again.');
      setIsLoading(false);
      return false;
    }

    // Real API auth path
    try {
      const { user: apiUser } = await authService.login(username, password);

      // Verify role matches what user selected
      if (apiUser.role !== role) {
        authService.clearSession();
        setError(`Your account has the "${apiUser.role}" role, but you selected "${role}".`);
        setIsLoading(false);
        return false;
      }

      setUser(apiUserToAuthUser(apiUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.status === 401
        ? 'Invalid username or password. Please try again.'
        : parsed.message
      );
      setIsLoading(false);
      return false;
    }
  }, []);

  // ── 42 OAuth (still mock — would need real 42 OAuth integration) ──
  const loginWith42 = useCallback(async (): Promise<{ result: 'role-select' } | { result: 'dashboard'; path: string } | { result: 'error' }> => {
    setIsLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const storedUser = localStorage.getItem('fleetmark_42_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as AuthUser;
      setUser(parsed);
      localStorage.setItem(STORAGE_KEYS.USER, storedUser);
      setIsLoading(false);
      setNeedsRoleSelection(false);
      return { result: 'dashboard', path: getDashboardPath(parsed.role) };
    }

    const partialUser: AuthUser = {
      ...MOCK_42_USER,
      role: 'passenger',
    } as AuthUser;
    setUser(partialUser);
    setNeedsRoleSelection(true);
    setIsLoading(false);
    return { result: 'role-select' };
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, role };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      localStorage.setItem('fleetmark_42_user', JSON.stringify(updated));
      return updated;
    });
    setNeedsRoleSelection(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    setNeedsRoleSelection(false);
    authService.clearSession();
    localStorage.removeItem('fleetmark_42_user');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Show loading spinner while restoring session
  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isRestoring,
        error,
        needsRoleSelection,
        login,
        loginWith42,
        setUserRole,
        logout,
        clearError,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
