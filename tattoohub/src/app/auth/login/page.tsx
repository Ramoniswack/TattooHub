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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}