'use client';

import { useState } from 'react';
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
import { useAppStore } from '@/lib/stores/appStore';
import { useAuthStore } from '@/lib/stores/authStore';
import Header from '@/components/layout/Header';
import { format } from 'date-fns';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;
  const { artists, addBooking } = useAppStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const artist = artists.find(a => a.id === artistId);

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Artist not found</h2>
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
    const dayName = format(date, 'EEEE').toLowerCase();
    const availability = artist.availability[dayName];
    
    if (!availability || availability.length === 0) {
      return [];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !user) return;

    setIsSubmitting(true);

    try {
      addBooking({
        customerId: user.id,
        artistId: artist.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        duration: parseFloat(duration),
        description,
        status: 'pending',
        price: totalPrice
      });

      router.push('/customer/bookings?success=true');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                          const dayName = format(date, 'EEEE').toLowerCase();
                          const hasAvailability = artist.availability[dayName] && 
                                                artist.availability[dayName].length > 0;
                          return date < new Date() || !hasAvailability;
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
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {artist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{artist.name}</div>
                    <div className="text-sm text-gray-600">{artist.location}</div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3 pt-4 border-t">
                  {selectedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {format(selectedDate, 'PPP')}
                      </span>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{duration} hours</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-medium">${artist.hourlyRate}/hour</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">${totalPrice}</span>
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