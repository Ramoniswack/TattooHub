'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { updateUserProfile } from '@/lib/firebase/auth';
import { uploadArtistPhoto, validateImageFile, getImagePreview } from '@/lib/firebase/storage';
import { User } from '@/types';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setAvatarFile(file);
    try {
      const preview = await getImagePreview(file);
      setAvatarPreview(preview);
      setError('');
    } catch {
      setError('Failed to load image preview');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress('');

    try {
      let avatarUrl = user.avatar;

      // Upload new avatar if changed
      if (avatarFile) {
        setUploadProgress('Uploading photo...');
        avatarUrl = await uploadArtistPhoto(user.id, avatarFile, 'avatar');
      }

      // Prepare updates (only include defined values)
      setUploadProgress('Saving changes...');
      const updates: Partial<User> = { name };
      if (avatarUrl) updates.avatar = avatarUrl;

      // Update profile
      await updateUserProfile(user.id, updates);

      // Update local state
      setUser({
        ...user,
        ...updates,
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
      setUploadProgress('');
    }
  };

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} alt={name} />
                  <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <Label htmlFor="avatar">Profile Photo</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 200KB. Formats: JPG, PNG, WebP.
                  </p>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {uploadProgress && (
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadProgress}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
