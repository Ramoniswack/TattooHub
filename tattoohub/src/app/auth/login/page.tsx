'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { User } from '@/types';

function LoginContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as User['role'] || 'customer';

  return <AuthForm mode="login" defaultRole={role} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}