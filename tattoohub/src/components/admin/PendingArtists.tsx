'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, X, Mail, MapPin, Star } from 'lucide-react';
import { getPendingArtists, approveArtist } from '@/lib/firebase/database';
import { Artist } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function PendingArtists() {
  const [pendingArtists, setPendingArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load pending artists
  const loadPendingArtists = useCallback(async () => {
    try {
      setIsLoading(true);
      const artists = await getPendingArtists();
      setPendingArtists(artists);
      console.log('Loaded pending artists:', artists.length);
    } catch (error) {
      console.error('Error loading pending artists:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending artists',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPendingArtists();
  }, [loadPendingArtists]);

  const handleApprove = async (artistId: string) => {
    try {
      setProcessingId(artistId);
      await approveArtist(artistId);
      
      toast({
        title: 'Success',
        description: 'Artist approved successfully!',
      });

      // Refresh the list
      await loadPendingArtists();
    } catch (error) {
      console.error('Error approving artist:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve artist',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Artist Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pending artists...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Artist Approvals</CardTitle>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            {pendingArtists.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {pendingArtists.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending artist approvals at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingArtists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                    {artist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{artist.name}</h4>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                      Pending
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{artist.email}</span>
                    </div>
                    {artist.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{artist.location}</span>
                      </div>
                    )}
                  </div>

                  {artist.bio && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{artist.bio}</p>
                  )}

                  {artist.specialties && artist.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {artist.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {artist.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{artist.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="h-4 w-4" />
                    <span>Hourly Rate: ${artist.hourlyRate || 0}/hr</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(artist.id)}
                    disabled={processingId === artist.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingId === artist.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={processingId === artist.id}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
