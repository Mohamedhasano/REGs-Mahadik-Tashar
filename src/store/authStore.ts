import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'trader' | 'admin' | 'shariah_board' | 'support' | 'project';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected' | 'under_review';
  kycLevel?: number;
  twoFactorEnabled?: boolean;
  referralCode?: string;
  referralEarnings?: number;
  referralCount?: number;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

