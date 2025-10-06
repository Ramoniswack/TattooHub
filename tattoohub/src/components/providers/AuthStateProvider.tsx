'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { onAuthStateChange } from '@/lib/firebase/auth';

export default function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        logout();
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, logout]);

  return <>{children}</>;
}
