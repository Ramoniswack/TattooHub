'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MapPin, DollarSign, Eye } from 'lucide-react';
import { getAllArtists } from '@/lib/firebase/database';
import { Artist } from '@/types';
import ArtistDetailModal from './ArtistDetailModal';

export default function ManageArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadArtists = async () => {
    try {
      setIsLoading(true);
      const allArtists = await getAllArtists();
      setArtists(allArtists);
      console.log('Loaded artists:', allArtists.length);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const handleViewDetails = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    loadArtists();
  };

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
                         artist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && artist.approved) ||
                         (statusFilter === 'pending' && !artist.approved);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal-600">{artists.length}</div>
            <div className="text-sm text-gray-600">Total Artists</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{artists.filter(a => a.approved).length}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{artists.filter(a => !a.approved).length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredArtists.map(artist => (
          <Card key={artist.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={artist.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{artist.name}</h3>
                      <Badge className={artist.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {artist.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                      <div><span className="font-medium">Email:</span> {artist.email}</div>
                      <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{artist.location || 'N/A'}</div>
                      <div className="flex items-center"><DollarSign className="h-4 w-4 mr-1" />${artist.hourlyRate}/hr</div>
                      <div className="flex items-center"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />{artist.rating?.toFixed(1) || '0.0'}</div>
                    </div>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleViewDetails(artist)}>
                  <Eye className="h-4 w-4 mr-1" />View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ArtistDetailModal artist={selectedArtist} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedArtist(null); }} onUpdate={handleUpdate} />
    </div>
  );
}
