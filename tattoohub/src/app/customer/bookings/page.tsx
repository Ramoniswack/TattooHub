'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MessageCircle, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, Star } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { getBookingsByCustomer, updateBookingStatus as updateFirebaseBookingStatus } from '@/lib/firebase/database';
import { Booking } from '@/types';
import Header from '@/components/layout/Header';
import { format, parseISO } from 'date-fns';
import ReviewModal from '@/components/ReviewModal';

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const success = searchParams?.get('success');
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const { user } = useAuthStore();

  // Load bookings from Firebase
  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.id) {
        console.log('⚠️ No user ID, skipping booking load');
        return;
      }
      
      try {
        console.log('🔄 Loading bookings for customer:', user.id);
        setIsLoading(true);
        const bookings = await getBookingsByCustomer(user.id);
        setCustomerBookings(bookings);
        console.log('✅ Loaded bookings from Firebase:', bookings);
      } catch (error) {
        console.error('❌ Error loading bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user?.id]);

  // Refresh bookings function
  const refreshBookings = async () => {
    if (!user?.id) return;
    try {
      console.log('🔄 Manually refreshing bookings...');
      setIsLoading(true);
      const bookings = await getBookingsByCustomer(user.id);
      setCustomerBookings(bookings);
      console.log('✅ Bookings refreshed:', bookings);
    } catch (error) {
      console.error('❌ Error refreshing bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const reloadBookings = async () => {
      if (!user?.id) return;
      try {
        console.log('🔄 Reloading bookings after success...');
        const bookings = await getBookingsByCustomer(user.id);
        setCustomerBookings(bookings);
        console.log('✅ Bookings reloaded:', bookings);
      } catch (error) {
        console.error('❌ Error reloading bookings:', error);
      }
    };

    if (success === 'true') {
      setShowSuccess(true);
      // Reload bookings to show the new one
      reloadBookings();
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, user?.id]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateFirebaseBookingStatus(bookingId, 'cancelled');
      // Reload bookings to show updated status
      if (user?.id) {
        const bookings = await getBookingsByCustomer(user.id);
        setCustomerBookings(bookings);
      }
      console.log('✅ Booking cancelled');
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (!user || user.role !== 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in as a customer to view bookings.</p>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'default'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || 'secondary'}
        className={colors[status as keyof typeof colors]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Booking request submitted successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              The artist will review your request and confirm the appointment soon.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Track your tattoo appointments and booking history</p>
          </div>
          <Button 
            onClick={refreshBookings} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg 
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedBooking && (
          <ReviewModal
            booking={selectedBooking}
            onClose={() => {
              setShowReviewModal(false);
              setSelectedBooking(null);
            }}
            onReviewSubmitted={refreshBookings}
          />
        )}

        {/* Bookings List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        ) : customerBookings.length > 0 ? (
          <div className="space-y-6">
            {customerBookings.map(booking => {
              // Get artist avatar URL from booking or use generated one
              const artistAvatar = booking.artistName 
                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.artistName)}&background=0D8ABC&color=fff&size=200`
                : '';

              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={artistAvatar} alt={booking.artistName} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xl">
                            {booking.artistName?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {booking.artistName}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(booking.status)}
                            {getStatusBadge(booking.status)}
                          </div>
                          <Link 
                            href={`/customer/artist/${booking.artistId}`}
                            className="text-sm text-teal-600 hover:text-teal-700 underline"
                          >
                            View Artist Profile
                          </Link>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          ${booking.price}
                        </div>
                        <div className="text-sm text-gray-600">
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
                          <div className="text-sm text-gray-600">Date</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{booking.time}</div>
                          <div className="text-sm text-gray-600">Time</div>
                        </div>
                      </div>
                    </div>

                    {booking.description && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <MessageCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-medium mb-1">Description</div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {booking.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Booking for {format(parseISO(booking.date), 'PPP')}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/customer/artist/${booking.artistId}`}>
                            View Artist
                          </Link>
                        </Button>
                        {booking.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {booking.status === 'completed' && !booking.reviewed && (
                          <Button 
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowReviewModal(true);
                            }}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Leave Review
                          </Button>
                        )}
                        {booking.status === 'completed' && booking.reviewed && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">
                Start your tattoo journey by browsing our talented artists
              </p>
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/customer/browse">Browse Artists</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}