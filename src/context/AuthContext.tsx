import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ── Types ──
export type UserRole = 'admin' | 'passenger' | 'driver';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  initials: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
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
    },
  },
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

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem('fleetmark_user');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
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
