import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { STORAGE_KEYS } from '../config/api.config';
import * as authService from '../services/auth.service';
import type { AuthCallbackResponse } from '../types/api';

// ── Types ──
export type UserRole = 'admin' | 'passenger';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  initials: string;
  login42?: string;
  campus?: string;
  home_stop?: string | null;
  is_new_user?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
  loginWith42: (code: string) => Promise<
    | { result: 'dashboard'; path: string }
    | { result: 'onboarding' }
    | { result: 'error'; message?: string }
  >;
  logout: () => void;
  clearError: () => void;
  getDashboardPath: (role: UserRole) => string;
  setUser: (user: AuthUser) => void;
}

// ── Helpers ──
export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/overview';
    case 'passenger':
      return '/student/overview';
    default:
      return '/student/overview';
  }
};

/** Convert 42 callback response to AuthUser */
function callbackToAuthUser(u: AuthCallbackResponse['user']): AuthUser {
  const initials = u.username.slice(0, 2).toUpperCase();
  return {
    id: u.id,
    name: u.username,
    username: u.username,
    email: '',
    role: u.role as UserRole,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${u.username}&backgroundColor=b6e3f4&top=shortHair`,
    initials,
    login42: u.username,
    campus: '1337',
    home_stop: u.home_stop,
    is_new_user: u.is_new_user,
  };
}

// ── DEV_BYPASS — auto-login without 42 for local dev ──
const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

const DEV_USER: AuthUser = {
  id: 1,
  name: 'Dev User',
  username: 'devuser',
  email: 'dev@1337.ma',
  role: 'passenger',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=DevUser&backgroundColor=b6e3f4&top=shortHair',
  initials: 'DU',
  login42: 'devuser',
  campus: '1337',
  home_stop: null,
};

// ── Context ──
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Session restore on mount ──
  useEffect(() => {
    try {
      // DEV bypass: auto-login
      if (DEV_BYPASS) {
        const cached = localStorage.getItem(STORAGE_KEYS.USER);
        if (cached) {
          setUserState(JSON.parse(cached));
        } else {
          setUserState(DEV_USER);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEV_USER));
        }
        setIsRestoring(false);
        return;
      }

      // Normal: restore from localStorage
      const access = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const cached = localStorage.getItem(STORAGE_KEYS.USER);

      if (access && cached && !authService.isTokenExpired(access)) {
        setUserState(JSON.parse(cached));
      } else if (access && authService.isTokenExpired(access)) {
        // Try refresh
        const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refresh) {
          authService.refreshAccessToken().then(() => {
            const u = localStorage.getItem(STORAGE_KEYS.USER);
            if (u) setUserState(JSON.parse(u));
          }).catch(() => {
            authService.clearSession();
          });
        } else {
          authService.clearSession();
        }
      }
    } catch {
      // Silent fail
    } finally {
      setIsRestoring(false);
    }
  }, []);

  // ── 42 OAuth callback ──
  const loginWith42 = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.loginWith42Code(code);
      const authUser = callbackToAuthUser(data.user);
      setUserState(authUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));

      // New student without home_stop → onboarding
      if (data.user.role === 'passenger' && data.user.is_new_user && !data.user.home_stop) {
        setIsLoading(false);
        return { result: 'onboarding' as const };
      }

      setIsLoading(false);
      return { result: 'dashboard' as const, path: getDashboardPath(authUser.role) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
      setIsLoading(false);
      return { result: 'error' as const, message: msg };
    }
  }, []);

  const setUser = useCallback((u: AuthUser) => {
    setUserState(u);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    setError(null);
    authService.clearSession();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Show loading spinner while restoring session
  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
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
        loginWith42,
        logout,
        clearError,
        getDashboardPath,
        setUser,
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
