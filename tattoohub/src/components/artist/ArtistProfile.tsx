'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, MapPin, DollarSign, Clock, X, Plus, Star } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';

export default function ArtistProfile() {
  const { user, setUser } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    hourlyRate: user?.hourlyRate || 100,
    specialties: user?.specialties || [],
    availability: user?.availability || {}
  });
  const [currentSpecialty, setCurrentSpecialty] = useState('');

  if (!user || user.role !== 'artist') {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">Please complete your artist profile to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSave = () => {
    // Update user profile in Firebase here if needed
    setUser({
      ...user,
      ...profileData
    });
    setIsEditing(false);
  };

  const addSpecialty = () => {
    if (currentSpecialty.trim() && !profileData.specialties.includes(currentSpecialty.trim())) {
      setProfileData({
        ...profileData,
        specialties: [...profileData.specialties, currentSpecialty.trim()]
      });
      setCurrentSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfileData({
      ...profileData,
      specialties: profileData.specialties.filter(s => s !== specialty)
    });
  };

  const updateAvailability = (day: string, enabled: boolean) => {
    const newAvailability = { ...profileData.availability };
    if (enabled) {
      newAvailability[day] = [{ start: '09:00', end: '17:00' }];
    } else {
      delete newAvailability[day];
    }
    setProfileData({ ...profileData, availability: newAvailability });
  };

  const updateAvailabilityTime = (day: string, field: 'start' | 'end', value: string) => {
    const newAvailability = { ...profileData.availability };
    if (newAvailability[day] && newAvailability[day][0]) {
      newAvailability[day][0][field] = value;
      setProfileData({ ...profileData, availability: newAvailability });
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={isEditing ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl">
                {user.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{user.name || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, State"
                    />
                  ) : (
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location || 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                placeholder="Tell clients about your experience and style..."
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{user.bio || 'Not set'}</p>
            )}
          </div>

          {/* Hourly Rate */}
          <div>
            <Label htmlFor="rate">Hourly Rate ($)</Label>
            {isEditing ? (
              <Input
                id="rate"
                type="number"
                value={profileData.hourlyRate}
                onChange={(e) => setProfileData({ ...profileData, hourlyRate: parseInt(e.target.value) || 0 })}
                min="0"
              />
            ) : (
              <p className="flex items-center text-lg font-semibold">
                <DollarSign className="h-4 w-4 mr-1" />
                {user.hourlyRate || 0}/hour
              </p>
            )}
          </div>

          {/* Specialties */}
          <div>
            <Label>Specialties</Label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={currentSpecialty}
                    onChange={(e) => setCurrentSpecialty(e.target.value)}
                    placeholder="e.g., Realistic, Traditional"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                  />
                  <Button type="button" variant="outline" onClick={addSpecialty}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {specialty}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSpecialty(specialty)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(user.specialties || []).map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Statistics */}
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-2xl font-bold">{user.rating || 0}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.totalReviews || 0}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reviews</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {user.approved ? 'Approved' : 'Pending'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {days.map(day => {
              const dayData = profileData.availability[day];
              const isAvailable = Boolean(dayData && dayData.length > 0);
              
              return (
                <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20">
                      <span className="font-medium capitalize">{day}</span>
                    </div>
                    {isEditing && (
                      <Switch
                        checked={isAvailable}
                        onCheckedChange={(checked) => updateAvailability(day, checked)}
                      />
                    )}
                  </div>
                  
                  {isAvailable && (
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <Select
                            value={dayData[0]?.start || '09:00'}
                            onValueChange={(value) => updateAvailabilityTime(day, 'start', value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span>to</span>
                          <Select
                            value={dayData[0]?.end || '17:00'}
                            onValueChange={(value) => updateAvailabilityTime(day, 'end', value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">
                          {dayData[0]?.start} - {dayData[0]?.end}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {!isAvailable && !isEditing && (
                    <span className="text-gray-400">Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}