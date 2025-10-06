'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trash2, Star, MapPin, DollarSign } from 'lucide-react';
import { getAllBookings } from '@/lib/firebase/database';
import { Booking } from '@/types';

interface ArtistInfo {
  id: string;
  name: string;
  bookingCount: number;
  totalEarnings: number;
  firstBookingDate: string;
}

export default function ManageArtists() {
  const [artists, setArtists] = useState<ArtistInfo[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load bookings and extract artist info
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const allBookings = await getAllBookings();
        setBookings(allBookings);

        // Extract unique artists from bookings
        const artistMap = new Map<string, ArtistInfo>();
        
        allBookings.forEach(booking => {
          const existingArtist = artistMap.get(booking.artistId);
          
          if (existingArtist) {
            existingArtist.bookingCount++;
            if (booking.status === 'completed') {
              existingArtist.totalEarnings += booking.price;
            }
            // Update first booking date if this one is earlier
            if (new Date(booking.date) < new Date(existingArtist.firstBookingDate)) {
              existingArtist.firstBookingDate = booking.date;
            }
          } else {
            artistMap.set(booking.artistId, {
              id: booking.artistId,
              name: booking.artistName || 'Unknown Artist',
              bookingCount: 1,
              totalEarnings: booking.status === 'completed' ? booking.price : 0,
              firstBookingDate: booking.date
            });
          }
        });

        setArtists(Array.from(artistMap.values()));
        console.log('✅ Extracted artists from bookings:', artistMap.size);
      } catch (error) {
        console.error('❌ Error loading artists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading artists...</p>
      </div>
    );
  }

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Since we don't have approval status in bookings, show all for now
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Artists</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artists List */}
      <div className="space-y-4">
        {filteredArtists.length > 0 ? (
          filteredArtists.map(artist => {
            const artistBookings = bookings.filter(b => b.artistId === artist.id);
            const completedBookings = artistBookings.filter(b => b.status === 'completed').length;
            
            return (
              <Card key={artist.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                          {artist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{artist.name}</h3>
                          <Badge 
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            Active
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Artist ID:</span>
                            {artist.id.slice(0, 8)}...
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {artist.bookingCount} total bookings
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${artist.totalEarnings} earned
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {completedBookings} completed
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          First booking: {new Date(artist.firstBookingDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled
                        title="Delete functionality requires full artist management system"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Artists will appear here once they receive their first booking'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}