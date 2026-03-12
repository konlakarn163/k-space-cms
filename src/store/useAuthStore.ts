import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    role: 'member' | 'admin' | 'super_admin' | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setRole: (role: 'member' | 'admin' | 'super_admin' | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isLoading: true,
    setUser: (user) => set({ user, isLoading: false }),
    setRole: (role) => set({ role }),
    setLoading: (loading) => set({ isLoading: loading }),
}));