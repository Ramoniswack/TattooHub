'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { Artist } from '@/types';
import { useAppStore } from '@/lib/stores/appStore';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const setSelectedArtist = useAppStore(state => state.setSelectedArtist);
  
  // Use cover photo if available, otherwise use portfolio or avatar
  const coverImage = artist.coverPhoto || artist.portfolio?.[0] || artist.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=0D8ABC&color=fff&size=800`;
  const avatarImage = artist.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=0D8ABC&color=fff&size=200`;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-slate-200">
      {/* Cover Photo/Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <Image
          src={coverImage}
          alt={`${artist.name} cover`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!artist.approved && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Pending
          </div>
        )}
        {/* Avatar overlay on cover */}
        <div className="absolute -bottom-6 left-6">
          <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
            <AvatarImage src={avatarImage} alt={artist.name} />
            <AvatarFallback className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white font-bold text-xl">
              {artist.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardContent className="p-6 pt-8">
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900">{artist.name}</h3>
              <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{artist.rating}</span>
                  <span className="text-slate-400 ml-1">({artist.totalReviews})</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {artist.location}
                </div>
              </div>
            </div>
            <div className="flex items-center bg-teal-50 px-3 py-1 rounded-full">
              <DollarSign className="h-4 w-4 text-teal-700 mr-1" />
              <span className="font-bold text-teal-700">{artist.hourlyRate}/hr</span>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {artist.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {artist.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
              {specialty}
            </Badge>
          ))}
          {artist.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs border-slate-300">
              +{artist.specialties.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 border-slate-300 hover:bg-slate-100"
          >
            <Link
              href={`/customer/artist/${artist.id}`}
              onClick={() => setSelectedArtist(artist)}
            >
              View Profile
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            disabled={!artist.approved}
          >
            <Link
              href={`/customer/book/${artist.id}`}
              onClick={() => setSelectedArtist(artist)}
            >
              Book Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}