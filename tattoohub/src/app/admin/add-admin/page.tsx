'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { auth, database, db } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function AddAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create authentication account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Create admin data
      const adminData = {
        id: userId,
        email,
        name,
        role: 'admin',
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=random`,
      };

      // Save to Realtime Database
      await set(ref(database, `users/${userId}`), adminData);

      // Save to Firestore
      await setDoc(doc(db, 'users', userId), adminData);

      setSuccess(`Admin account created successfully for ${email}`);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      console.error('Error creating admin:', err);
      const error = err as { code?: string };
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Failed to create admin account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/admin/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <UserPlus className="mr-2 h-4 w-4" />
                Create Admin Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Admin Privileges</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Review and approve artist registrations</li>
            <li>• Manage all bookings across the platform</li>
            <li>• Create additional admin accounts</li>
            <li>• Access comprehensive analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
