import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, User } from '@/types';
import { mockArtists, mockCustomers } from '@/data/mockData';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string, role: User['role']) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        let user: User | null = null;

        // Check in mock data based on role
        if (role === 'artist') {
          user = mockArtists.find(artist => artist.email === email) || null;
        } else if (role === 'customer') {
          user = mockCustomers.find(customer => customer.email === email) || null;
        } else if (role === 'admin') {
          // Mock admin user
          if (email === 'admin@example.com' && password === 'admin123') {
            user = {
              id: 'admin',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin',
              createdAt: new Date()
            };
          }
        }

        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      signup: async (data) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: new Date()
        };

        set({ user: newUser, isAuthenticated: true });
        return true;
      }
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);