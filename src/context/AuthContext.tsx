import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ── Types ──
export type UserRole = 'admin' | 'passenger' | 'driver';
export type AuthProvider42 = 'email' | '42';

export interface AuthUser {
  name: string;
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
  error: string | null;
  needsRoleSelection: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWith42: () => Promise<{ result: 'role-select' } | { result: 'dashboard'; path: string } | { result: 'error' }>;
  setUserRole: (role: UserRole) => void;
  logout: () => void;
  clearError: () => void;
  getDashboardPath: (role: UserRole) => string;
}

// ── Mock credentials ──
const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@fleetmark.com': {
    password: 'admin123',
    user: {
      name: 'Adil Bourji',
      email: 'admin@fleetmark.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Adil&backgroundColor=b6e3f4&top=shortHair',
      initials: 'AB',
      authProvider: 'email',
    },
  },
  'passenger@fleetmark.com': {
    password: 'pass123',
    user: {
      name: 'Ahmed Benali',
      email: 'passenger@fleetmark.com',
      role: 'passenger',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmed&backgroundColor=b6e3f4&top=shortHair',
      initials: 'AB',
      authProvider: 'email',
    },
  },
  'driver@fleetmark.com': {
    password: 'driver123',
    user: {
      name: 'Karim El Amrani',
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

// ── Helper ──
export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin': return '/admin/overview';
    case 'passenger': return '/passenger/overview';
    case 'driver': return '/driver/overview';
  }
};

// ── Context ──
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('fleetmark_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const entry = MOCK_USERS[email.toLowerCase()];
    if (entry && entry.password === password && entry.user.role === role) {
      setUser(entry.user);
      localStorage.setItem('fleetmark_user', JSON.stringify(entry.user));
      setIsLoading(false);
      return true;
    }

    setError('Invalid email or password. Please try again.');
    setIsLoading(false);
    return false;
  }, []);

  const loginWith42 = useCallback(async (): Promise<{ result: 'role-select' } | { result: 'dashboard'; path: string } | { result: 'error' }> => {
    setIsLoading(true);
    setError(null);

    // Mock: simulate 42 OAuth API delay (would normally redirect to 42 then callback)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if user already has a role stored from a previous 42 login
    const storedUser = localStorage.getItem('fleetmark_42_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as AuthUser;
      setUser(parsed);
      localStorage.setItem('fleetmark_user', storedUser);
      setIsLoading(false);
      setNeedsRoleSelection(false);
      return { result: 'dashboard', path: getDashboardPath(parsed.role) };
    }

    // First-time 42 user → no role yet, needs role selection
    const partialUser: AuthUser = {
      ...MOCK_42_USER,
      role: 'passenger', // temporary default — will be overwritten by role selection
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
      localStorage.setItem('fleetmark_user', JSON.stringify(updated));
      localStorage.setItem('fleetmark_42_user', JSON.stringify(updated));
      return updated;
    });
    setNeedsRoleSelection(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    setNeedsRoleSelection(false);
    localStorage.removeItem('fleetmark_user');
    localStorage.removeItem('fleetmark_42_user');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
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
