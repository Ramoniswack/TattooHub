'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Eye, EyeOff, X, ArrowLeftIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
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
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [currentSpecialty, setCurrentSpecialty] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const success = await login(email, password, role);
        if (success) {
          const dashboardRoute = 
            role === 'admin' ? '/admin/dashboard' :
            role === 'artist' ? '/artist/dashboard' :
            '/customer/browse';
          router.push(dashboardRoute);
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        const success = await signup({
          email,
          password,
          name,
          role,
          bio: role === 'artist' ? bio : undefined,
          location: role === 'artist' ? location : undefined,
          specialties: role === 'artist' ? specialties : undefined
        });
        
        if (success) {
          const dashboardRoute = 
            role === 'artist' ? '/artist/dashboard' :
            '/customer/browse';
          router.push(dashboardRoute);
        } else {
          setError('Signup failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
                  className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
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
                className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
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
                  className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
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
                    className="resize-none bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
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
                    className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Specialties</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={currentSpecialty}
                      onChange={(e) => setCurrentSpecialty(e.target.value)}
                      placeholder="e.g., Realistic, Traditional"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                      className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addSpecialty}
                      className="border-slate-600 text-slate-200 hover:bg-slate-700"
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
              <div className="text-xs text-slate-500 space-y-1">
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