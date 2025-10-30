'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Star, DollarSign, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import Header from '@/components/layout/Header';
import ArtistProfile from '@/components/artist/ArtistProfile';
import ArtistBookings from '@/components/artist/ArtistBooking';
import ReviewsList from '@/components/ReviewsList';
import { getBookingsByArtist } from '@/lib/firebase/database';
import { Booking } from '@/types';

export default function ArtistDashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const artistBookings = await getBookingsByArtist(user.id);
        setBookings(artistBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user?.id]);

  if (!user || user.role !== 'artist') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in as an artist to access the dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  const pending = bookings.filter(b => b.status === 'pending');
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const completed = bookings.filter(b => b.status === 'completed');
  const revenue = completed.reduce((sum, b) => sum + b.price, 0);
  const rating = user.rating || 0;
  const reviews = user.totalReviews || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Artist Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your profile, bookings, and schedule</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Bookings</p>
                      <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed Bookings</p>
                      <p className="text-3xl font-bold text-green-600">{confirmed.length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <p className="text-3xl font-bold text-purple-600">${revenue}</p>
                      <p className="text-xs text-gray-500 mt-1">{completed.length} completed</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-yellow-500">{rating.toFixed(1)}</p>
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{reviews} {reviews === 1 ? 'review' : 'reviews'}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList>
                <TabsTrigger value="bookings">
                  <Calendar className="h-4 w-4 mr-2" />
                  Bookings
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="h-4 w-4 mr-2" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings">
                <ArtistBookings />
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReviewsList artistId={user.id} artistName={user.name} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <ArtistProfile />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
