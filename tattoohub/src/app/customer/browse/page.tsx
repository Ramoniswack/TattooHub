'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin } from 'lucide-react';
import { getApprovedArtists } from '@/lib/firebase/database';
import { Artist } from '@/types';
import ArtistCard from '@/components/customer/ArtistCard';
import Header from '@/components/layout/Header';
import { mockArtists } from '@/data/mockData';

export default function BrowseArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [minRating, setMinRating] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Load artists from Firebase
  useEffect(() => {
    const loadArtists = async () => {
      try {
        console.log('Loading artists...');
        setLoading(true);
        setError('');
        const fetchedArtists = await getApprovedArtists();
        console.log('Fetched artists:', fetchedArtists);
        
        // If no artists in Firebase, use mock data
        if (fetchedArtists.length === 0) {
          console.log('No artists in Firebase, using mock data');
          setArtists(mockArtists.filter(a => a.approved));
        } else {
          setArtists(fetchedArtists);
        }
      } catch (error) {
        console.error('Error loading artists:', error);
        // On error, fallback to mock data
        console.log('Error fetching from Firebase, using mock data');
        setArtists(mockArtists.filter(a => a.approved));
        setError('Using demo data. Firebase connection issue.');
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  // Get unique locations and specialties for filters
  const locations = Array.from(new Set(artists.map(artist => artist.location)));
  const specialties = Array.from(new Set(artists.flatMap(artist => artist.specialties)));

  // Filter and sort artists
  const filteredArtists = artists
    .filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artist.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'all' || artist.location === locationFilter;
      const matchesSpecialty = specialtyFilter === 'all' || artist.specialties.includes(specialtyFilter);
      const matchesRating = minRating === 'all' || artist.rating >= parseFloat(minRating);
      
      return matchesSearch && matchesLocation && matchesSpecialty && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.hourlyRate - b.hourlyRate;
        case 'price-high':
          return b.hourlyRate - a.hourlyRate;
        case 'reviews':
          return b.totalReviews - a.totalReviews;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setSpecialtyFilter('all');
    setMinRating('all');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-800">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-gray-100 mb-3">Browse Artists</h1>
          <p className="text-xl text-slate-600 dark:text-gray-400">Find the perfect tattoo artist for your next ink</p>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-gray-400 text-lg">Loading artists...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
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

            {/* Location Filter */}
            <div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialty Filter */}
            <div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Min Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                  <SelectItem value="4.0">4.0+</SelectItem>
                  <SelectItem value="3.5">3.5+</SelectItem>
                  <SelectItem value="3.0">3.0+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || locationFilter !== 'all' || specialtyFilter !== 'all' || minRating !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                </Badge>
              )}
              {locationFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {locationFilter}
                </Badge>
              )}
              {specialtyFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {specialtyFilter}
                </Badge>
              )}
              {minRating !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Rating: {minRating}+
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-8">
          <p className="text-slate-700 dark:text-gray-300 font-medium text-lg">
            Showing {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Artists Grid */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700">
            <div className="text-slate-300 mb-4">
              <Filter className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-2">No artists found</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-6 text-lg">
              Try adjusting your filters or search terms
            </p>
            <Button variant="outline" onClick={clearFilters} className="border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:bg-gray-800">
              Clear filters
            </Button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}