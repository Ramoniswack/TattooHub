'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Eye, EyeOff, X, ArrowLeftIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/firebase/auth';
import { uploadArtistPhoto, getImagePreview, validateImageFile } from '@/lib/firebase/storage';
import { User } from '@/types';

interface AuthFormProps {
  mode: 'login' | 'signup';
  defaultRole?: User['role'];
}

export default function AuthForm({ mode, defaultRole = 'customer' }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<User['role']>(defaultRole);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [currentSpecialty, setCurrentSpecialty] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Set file and generate preview
    setAvatarFile(file);
    try {
      const preview = await getImagePreview(file);
      setAvatarPreview(preview);
      setError(''); // Clear any previous errors
    } catch {
      setError('Failed to load image preview');
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Set file and generate preview
    setCoverFile(file);
    try {
      const preview = await getImagePreview(file);
      setCoverPreview(preview);
      setError(''); // Clear any previous errors
    } catch {
      setError('Failed to load cover image preview');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        // Firebase email/password login
        const user = await signInWithEmail(email, password);
        setUser(user);
        
        const dashboardRoute = 
          user.role === 'admin' ? '/admin/dashboard' :
          user.role === 'artist' ? '/artist/dashboard' :
          '/customer/browse';
        router.push(dashboardRoute);
      } else {
        // Firebase email/password signup
        // First, upload images if provided
        setUploadingImage(true);
        let avatarUrl = '';
        let coverUrl = '';
        
        try {
          // Generate a temporary ID for file uploads before user creation
          const tempId = `temp_${Date.now()}`;
          
          if (role === 'artist' && avatarFile) {
            console.log('Uploading avatar...');
            avatarUrl = await uploadArtistPhoto(tempId, avatarFile, 'avatar');
            console.log('Avatar uploaded:', avatarUrl);
          }
          
          if (role === 'artist' && coverFile) {
            console.log('Uploading cover photo...');
            coverUrl = await uploadArtistPhoto(tempId, coverFile, 'cover');
            console.log('Cover photo uploaded:', coverUrl);
          }
        } catch (uploadError) {
          console.error('Failed to upload images:', uploadError);
          setError('Failed to upload images. Please try again.');
          setIsLoading(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
        
        // Now create the user account with image URLs
        const user = await signUpWithEmail(email, password, {
          name,
          role,
          bio: role === 'artist' ? bio : undefined,
          location: role === 'artist' ? location : undefined,
          specialties: role === 'artist' ? specialties : undefined,
          hourlyRate: role === 'artist' ? hourlyRate : undefined,
          avatar: avatarUrl || undefined,
          coverPhoto: coverUrl || undefined,
        });
        
        setUser(user);
        
        const dashboardRoute = 
          role === 'admin' ? '/admin/dashboard' :
          role === 'artist' ? '/artist/dashboard' :
          '/customer/browse';
        router.push(dashboardRoute);
      }
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const user = await signInWithGoogle(role);
      
      // Update auth store with Firebase user
      setUser(user);
      
      // Check if artist needs to complete profile
      if (user.role === 'artist') {
        // Type guard to check if user has Artist properties
        const artistUser = user as { bio?: string; location?: string; specialties?: string[] };
        const needsCompletion = !artistUser.bio || !artistUser.location || !artistUser.specialties || artistUser.specialties.length === 0;
        
        if (needsCompletion) {
          router.push('/artist/complete-profile');
          return;
        }
      }
      
      // Navigate based on role
      const dashboardRoute = 
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'artist' ? '/artist/dashboard' :
        '/customer/browse';
      
      router.push(dashboardRoute);
    } catch (err) {
      const error = err as { code?: string; message?: string };
      
      // Handle popup closed by user - this is not an error, just user cancellation
      if (error.code === 'auth/popup-closed-by-user') {
        // Silently ignore - user intentionally closed the popup
        return;
      }
      
      // Handle other auth errors
      if (error.code === 'auth/cancelled-popup-request') {
        // Another popup was opened, ignore this one
        return;
      }
      
      setError(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addSpecialty = () => {
    if (currentSpecialty.trim() && !specialties.includes(currentSpecialty.trim())) {
      setSpecialties([...specialties, currentSpecialty.trim()]);
      setCurrentSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
      
      <Card className="w-full max-w-md relative z-10 border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Back"
          className="absolute right-4 top-4 bg-slate-600 border-slate-600 text-white hover:bg-slate-800 hover:text-white cursor-pointer z-10"
          asChild
        >
          <Link href="/">
            <ArrowLeftIcon />
          </Link>
        </Button>
      
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <CardTitle className="text-2xl text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {mode === 'login' 
              ? 'Sign in to your account to continue'
              : 'Sign up to start your tattoo journey'
            }
          </CardDescription>
     
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-md">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-200">I am a</Label>
              <Select value={role} onValueChange={(value: User['role']) => setRole(value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-slate-200 hover:bg-slate-900/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-slate-200 hover:text-white focus:text-white" value="customer">Customer</SelectItem>
                  <SelectItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-slate-200 hover:text-white focus:text-white" value="artist">Artist</SelectItem>
                  {mode === 'login' && <SelectItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-slate-200 hover:text-white focus:text-white" value="admin">Admin</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {/* Name (for signup) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 dark:text-gray-500"
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 dark:text-gray-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 dark:text-gray-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Artist-specific fields */}
            {mode === 'signup' && role === 'artist' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-200">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your tattoo style and experience..."
                    className="resize-none bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 dark:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-200">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 dark:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-slate-200">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="10"
                    max="500"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value) || 50)}
                    placeholder="e.g., 100"
                    className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 dark:text-gray-500"
                  />
                  <p className="text-xs text-slate-400">
                    Your hourly rate for tattoo sessions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-slate-200">Profile Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        className="bg-slate-900/50 border-slate-600 text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                      />
                    </div>
                    {avatarPreview && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600">
                        <Image 
                          src={avatarPreview} 
                          alt="Avatar Preview" 
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Square profile photo. Max 5MB. Formats: JPG, PNG, WebP.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover" className="text-slate-200">Cover Photo (Optional)</Label>
                  <div className="space-y-2">
                    <Input
                      id="cover"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleCoverChange}
                      className="bg-slate-900/50 border-slate-600 text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                    />
                    {coverPreview && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-slate-600">
                        <Image 
                          src={coverPreview} 
                          alt="Cover Preview" 
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Wide banner image for your profile. Max 5MB. Formats: JPG, PNG, WebP.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Specialties</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={currentSpecialty}
                      onChange={(e) => setCurrentSpecialty(e.target.value)}
                      placeholder="e.g., Realistic, Traditional"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                      className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 dark:text-gray-500"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addSpecialty}
                      className="border-slate-600 text-slate-200 bg-slate-500 hover:bg-slate-700 hover:text-white"
                    >
                      Add
                    </Button>
                  </div>
                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-teal-600/20 text-teal-300 border-teal-600/30">
                          {specialty}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeSpecialty(specialty)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-600/30"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border-slate-600 dark:border-gray-600"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign {mode === 'login' ? 'in' : 'up'} with Google
            </Button>

            <div className="text-center text-sm text-slate-400">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="text-teal-400 hover:text-teal-300 hover:underline">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-teal-400 hover:text-teal-300 hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </div>

            {mode === 'login' && (
              <div className="text-xs text-slate-500 dark:text-gray-500 space-y-1">
                <div>Demo credentials:</div>
                <div>Customer: john@example.com / password123</div>
                <div>Artist: mike@example.com / password123</div>
                <div>Admin: admin@example.com / admin123</div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}