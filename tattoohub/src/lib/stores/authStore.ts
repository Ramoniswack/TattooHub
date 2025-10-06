// Authentication store - ready for Firebase Auth implementation
// This file will contain authentication state management

import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'artist' | 'admin';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  updateUser: (userData) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null,
  })),
}));
