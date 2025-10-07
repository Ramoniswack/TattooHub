'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Save, ArrowLeft, X } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { updateUserProfile } from '@/lib/firebase/auth';
import { uploadArtistPhoto, validateImageFile, getImagePreview } from '@/lib/firebase/storage';
import { User } from '@/types';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import Image from 'next/image';
import AvailabilityManager from '@/components/artist/AvailabilityManager';

export default function ArtistProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState(50);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [availability, setAvailability] = useState<{ [key: string]: { start: string; end: string }[] }>({});
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setLocation(user.location || '');
      setHourlyRate(user.hourlyRate || 50);
      setSpecialties(user.specialties || []);
      setAvailability(user.availability || {});
      if (user.avatar) setAvatarPreview(user.avatar);
      if (user.coverPhoto) setCoverPreview(user.coverPhoto);
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

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setCoverFile(file);
    try {
      const preview = await getImagePreview(file);
      setCoverPreview(preview);
      setError('');
    } catch {
      setError('Failed to load image preview');
    }
  };

  const addSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const startTime = Date.now();
    console.log('Starting profile update...');

    setIsLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress('');

    try {
      let avatarUrl = user.avatar;
      let coverUrl = user.coverPhoto;

      // Upload new photos if changed
      if (avatarFile) {
        console.log('Uploading avatar...');
        setUploadProgress('Uploading avatar...');
        const uploadStart = Date.now();
        avatarUrl = await uploadArtistPhoto(user.id, avatarFile, 'avatar');
        console.log(`Avatar uploaded in ${Date.now() - uploadStart}ms`);
      }
      if (coverFile) {
        console.log('Uploading cover...');
        setUploadProgress('Uploading cover photo...');
        const uploadStart = Date.now();
        coverUrl = await uploadArtistPhoto(user.id, coverFile, 'cover');
        console.log(`Cover uploaded in ${Date.now() - uploadStart}ms`);
      }

      // Prepare updates object (only include defined values)
      console.log('Saving to database...');
      setUploadProgress('Saving profile changes...');
      const dbStart = Date.now();
      
      const updates: Partial<User> = {
        name,
        bio,
        location,
        hourlyRate,
        specialties,
        availability,
      };

      // Only add photo URLs if they exist
      if (avatarUrl) updates.avatar = avatarUrl;
      if (coverUrl) updates.coverPhoto = coverUrl;

      // Update profile
      await updateUserProfile(user.id, updates);
      console.log(`Database updated in ${Date.now() - dbStart}ms`);

      // Update local state
      setUser({
        ...user,
        ...updates,
      });

      const totalTime = Date.now() - startTime;
      console.log(`Total profile update completed in ${totalTime}ms`);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
      setUploadProgress('');
    }
  };

  if (!user || user.role !== 'artist') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {/* Cover Photo */}
              <div>
                <Label htmlFor="cover">Cover Photo</Label>
                {coverPreview && (
                  <div className="relative w-full h-40 mt-2 rounded-lg overflow-hidden">
                    <Image
                      src={coverPreview}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <Input
                  id="cover"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1200x600px. Max 200KB. JPG, PNG, WebP.
                </p>
              </div>

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
                    Recommended: 400x400px. Max 200KB. JPG, PNG, WebP.
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

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="10"
                  max="500"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  required
                />
              </div>

              {/* Specialties */}
              <div>
                <Label htmlFor="specialties">Specialties</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    id="specialties"
                    type="text"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    placeholder="Add a specialty"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                  />
                  <Button type="button" onClick={addSpecialty}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability Manager */}
              <AvailabilityManager
                availability={availability}
                onUpdate={setAvailability}
              />

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
