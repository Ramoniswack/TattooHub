'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, CalendarDays, Clock, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { getArtistById, createBooking } from '@/lib/firebase/database';
import { Artist } from '@/types';
import Header from '@/components/layout/Header';
import { format } from 'date-fns';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;
  const { user, isAuthenticated } = useAuthStore();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadArtist = async () => {
      try {
        setLoading(true);
        const fetchedArtist = await getArtistById(artistId);
        setArtist(fetchedArtist);
      } catch (error) {
        console.error('Error loading artist:', error);
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      loadArtist();
    }
  }, [artistId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Artist not found</h2>
            <Button asChild>
              <Link href="/customer/browse">Browse Artists</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  // Generate available time slots based on artist's availability
  const getAvailableTimeSlots = (date: Date) => {
    if (!artist.availability) {
      // Fallback: Generate default time slots if no availability is set
      console.log('No availability set, using default slots');
      const slots: string[] = [];
      for (let hour = 9; hour <= 17; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 17) {
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
      return slots;
    }
    
    const dayName = format(date, 'EEEE').toLowerCase();
    const availability = artist.availability[dayName];
    
    if (!availability || availability.length === 0) {
      console.log(`No availability for ${dayName}, using default slots`);
      // Fallback: Generate default time slots
      const slots: string[] = [];
      for (let hour = 9; hour <= 17; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 17) {
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
      return slots;
    }

    const slots: string[] = [];
    availability.forEach(slot => {
      const startHour = parseInt(slot.start.split(':')[0]);
      const endHour = parseInt(slot.end.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    });

    return slots;
  };

  const timeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];
  const totalPrice = parseFloat(duration) * artist.hourlyRate;

  // Debug logging
  console.log('📅 Selected Date:', selectedDate);
  console.log('🕐 Time Slots:', timeSlots);
  console.log('📋 Artist Availability:', artist.availability);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !user) return;

    setIsSubmitting(true);

    try {
      // Save to Firebase Realtime Database
      await createBooking({
        customerId: user.id,
        customerName: user.name,
        artistId: artist.id,
        artistName: artist.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        duration: parseFloat(duration),
        description,
        status: 'pending',
        price: totalPrice
      });

      console.log('Booking saved to Firebase!');
      router.push('/customer/bookings?success=true');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/customer/artist/${artist.id}`} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Book Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Select Date</Label>
                    <div className="border rounded-lg p-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => {
                          // Only disable past dates (allow booking even without availability)
                          return date < new Date();
                        }}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <Label htmlFor="time" className="text-base font-medium">Select Time</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.length > 0 ? (
                            timeSlots.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-slots" disabled>
                              No time slots available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {!artist.availability && (
                        <p className="text-xs text-gray-500 mt-1">
                          Default time slots (9 AM - 5 PM) - Artist will confirm availability
                        </p>
                      )}
                    </div>
                  )}

                  {/* Duration */}
                  <div>
                    <Label htmlFor="duration" className="text-base font-medium">Estimated Duration (hours)</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="1.5">1.5 hours</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-base font-medium">Tattoo Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your tattoo idea, size, placement, style preferences..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={!selectedDate || !selectedTime || !description || isSubmitting}
                  >
                    {isSubmitting ? 'Booking...' : `Book Appointment - $${totalPrice}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Artist Info */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                      {artist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{artist.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{artist.location}</div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3 pt-4 border-t">
                  {selectedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span className="font-medium">
                        {format(selectedDate, 'PPP')}
                      </span>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium">{duration} hours</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rate</span>
                    <span className="font-medium">${artist.hourlyRate}/hour</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-teal-600">${totalPrice}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 pt-4 border-t">
                  <p>* Final price may vary based on design complexity and actual time spent</p>
                  <p>* A deposit may be required to confirm booking</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}