'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MessageCircle, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, Mail } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { getBookingsByArtist, updateBookingStatus as updateFirebaseBookingStatus } from '@/lib/firebase/database';
import { Booking } from '@/types';
import { format, parseISO } from 'date-fns';

export default function ArtistBookings() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookings from Firebase
  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.id || user.role !== 'artist') return;
      
      try {
        setIsLoading(true);
        const artistBookings = await getBookingsByArtist(user.id);
        setBookings(artistBookings);
        console.log('Artist loaded bookings from Firebase:', artistBookings.length);
      } catch (error) {
        console.error('Error loading artist bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user?.id, user?.role]);

  if (!user || user.role !== 'artist') return null;

  const handleBookingAction = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateFirebaseBookingStatus(bookingId, status);
      // Reload bookings to show updated status
      const updatedBookings = await getBookingsByArtist(user.id);
      setBookings(updatedBookings);
      console.log(`Booking ${bookingId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  const artistBookings = bookings
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (artistBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No bookings yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Bookings will appear here when customers book appointments with you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {artistBookings.map(booking => {
        // Use customer name from booking data (already saved in Firebase)
        const customerName = booking.customerName || 'Unknown Customer';
        const customerId = booking.customerId;

        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-xl">
                      {customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {customerName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Customer ID: {customerId}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(booking.status)}
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    ${booking.price}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.duration} hours
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {format(parseISO(booking.date), 'PPP')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{booking.time}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                  </div>
                </div>
              </div>

              {booking.description && (
                <div className="mb-4">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Tattoo Description</div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {booking.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Booked on {booking.createdAt ? format(new Date(booking.createdAt), 'PPp') : 'Recently'}
                </div>
                
                {booking.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookingAction(booking.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBookingAction(booking.id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                  </div>
                )}
                
                {booking.status === 'confirmed' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookingAction(booking.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBookingAction(booking.id, 'completed')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark Complete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}