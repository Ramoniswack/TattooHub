'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, DollarSign, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { getArtistById } from '@/lib/firebase/database';
import { Artist } from '@/types';
import Header from '@/components/layout/Header';

export default function ArtistDetailPage() {
  const params = useParams();
  const artistId = params.id as string;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadArtist = async () => {
      try {
        console.log('Loading artist with ID:', artistId);
        setLoading(true);
        setError('');
        const fetchedArtist = await getArtistById(artistId);
        console.log('Fetched artist:', fetchedArtist);
        setArtist(fetchedArtist);
      } catch (err) {
        console.error('Error loading artist:', err);
        const error = err as { message?: string };
        setError(error.message || 'Failed to load artist');
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading artist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Artist</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">Artist ID: {artistId}</p>
            <Button asChild>
              <Link href="/customer/browse">Browse Artists</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Artist not found</h2>
            <p className="text-gray-600 mb-4">The artist you&apos;re looking for doesn&apos;t exist in our database.</p>
            <p className="text-sm text-gray-500 mb-4">Artist ID: {artistId}</p>
            <Button asChild>
              <Link href="/customer/browse">Browse Artists</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get available days - handle missing availability
  const availableDays = artist.availability 
    ? Object.keys(artist.availability).map(day => 
        day.charAt(0).toUpperCase() + day.slice(1)
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/customer/browse" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Artist Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-2xl">
                      {artist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{artist.name}</h1>
                      {!artist.approved && (
                        <Badge variant="secondary">Pending Approval</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{artist.rating}</span>
                        <span className="ml-1">({artist.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{artist.location}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>${artist.hourlyRate}/hour</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {artist.specialties && artist.specialties.length > 0 ? (
                        artist.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No specialties listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{artist.bio}</p>
              </CardContent>
            </Card>

            {/* Portfolio */}
            {artist.portfolio && artist.portfolio.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artist.portfolio.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Now Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      ${artist.hourlyRate}/hour
                    </div>
                    <p className="text-sm text-gray-600">Starting rate</p>
                  </div>
                  <Separator />
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    asChild
                    disabled={!artist.approved}
                  >
                    <Link href={`/customer/book/${artist.id}`}>
                      Book Now
                    </Link>
                  </Button>
                  {!artist.approved && (
                    <p className="text-sm text-gray-500 text-center">
                      This artist is pending approval
                    </p>
                  )}
                </div>
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
                <div className="space-y-3">
                  {availableDays.length > 0 ? (
                    availableDays.map(day => {
                      const dayKey = day.toLowerCase();
                      const hours = artist.availability[dayKey];
                      return (
                        <div key={day} className="flex justify-between items-center">
                          <span className="font-medium">{day}</span>
                          <div className="text-sm text-gray-600">
                            {hours?.map((slot, index) => (
                              <div key={index}>
                                {slot.start} - {slot.end}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No availability set</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{artist.location}</span>
                  </div>
                  <p className="text-gray-500 mt-3">
                    Book an appointment to get contact details
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}