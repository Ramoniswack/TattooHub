'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { User } from '@/types';

function SignupContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as User['role'] || 'customer';

  return <AuthForm mode="signup" defaultRole={role} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}