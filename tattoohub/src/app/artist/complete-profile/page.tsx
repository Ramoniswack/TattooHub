'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { saveArtistProfile } from '@/lib/firebase/database';

export default function CompleteProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [currentSpecialty, setCurrentSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not logged in or not an artist
    if (!user) {
      router.push('/auth/login');
    } else if (user.role !== 'artist') {
      router.push('/customer/browse');
    }
  }, [user, router]);

  const addSpecialty = () => {
    if (currentSpecialty.trim() && !specialties.includes(currentSpecialty.trim())) {
      setSpecialties([...specialties, currentSpecialty.trim()]);
      setCurrentSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bio.trim()) {
      setError('Please add a bio about your tattoo work');
      return;
    }
    
    if (!location.trim()) {
      setError('Please add your location');
      return;
    }
    
    if (specialties.length === 0) {
      setError('Please add at least one specialty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (!user) throw new Error('Not authenticated');

      // Save to Firebase (both Realtime DB and Firestore)
      await saveArtistProfile(user.id, {
        bio: bio.trim(),
        location: location.trim(),
        specialties,
        hourlyRate,
      });

      // Update local user state
      setUser({
        ...user,
        bio: bio.trim(),
        location: location.trim(),
        specialties,
        hourlyRate,
      });

      console.log('Profile completed successfully');
      
      // Navigate to artist dashboard
      router.push('/artist/dashboard');
    } catch (err) {
      console.error('Error completing profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'artist') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
      
      <Card className="w-full max-w-2xl relative z-10 border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-100">Complete Your Artist Profile</CardTitle>
          <CardDescription className="text-slate-300">
            Help clients find you by completing your profile information
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-md">
                {error}
              </div>
            )}

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-slate-200">
                About You <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell clients about your tattoo style, experience, and what makes your work unique..."
                className="resize-none bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 min-h-[120px]"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-200">
                Location <span className="text-red-400">*</span>
              </Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State (e.g., Los Angeles, CA)"
                className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                required
              />
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="text-slate-200">
                Hourly Rate ($) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
                className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                required
              />
              <p className="text-xs text-slate-400">You can update this later in your profile settings</p>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label className="text-slate-200">
                Specialties <span className="text-red-400">*</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  value={currentSpecialty}
                  onChange={(e) => setCurrentSpecialty(e.target.value)}
                  placeholder="e.g., Realistic, Traditional, Watercolor"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialty();
                    }
                  }}
                  className="bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addSpecialty}
                  className="border-slate-600 text-slate-200 bg-slate-700 hover:bg-slate-600 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {specialties.map((specialty, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-teal-600/20 text-teal-300 border-teal-600/30"
                    >
                      {specialty}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-teal-100" 
                        onClick={() => removeSpecialty(specialty)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              {specialties.length === 0 && (
                <p className="text-xs text-slate-400">Add at least one specialty that describes your tattoo style</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !bio || !location || specialties.length === 0}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                'Complete Profile & Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
