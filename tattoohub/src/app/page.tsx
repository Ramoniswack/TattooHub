'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Calendar, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockArtists } from '@/data/mockData';

export default function HomePage() {
  // Get top 3 featured artists (highest rated and approved)
  const featuredArtists = mockArtists
    .filter(artist => artist.approved)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/30 dark:from-teal-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-900/20 dark:from-cyan-900/10 via-transparent to-transparent"></div>
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="mb-6 inline-block">
              <Badge className="bg-teal-500/10 dark:bg-teal-500/20 text-teal-300 dark:text-teal-400 border-teal-500/20 dark:border-teal-500/30 hover:bg-teal-500/20 dark:hover:bg-teal-500/30 text-sm px-4 py-1">
                Connect with Top Tattoo Artists
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient">
                Tattoo Artist
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with talented tattoo artists, book appointments, and bring your ink dreams to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-2xl shadow-teal-600/50 hover:shadow-teal-600/70 transition-all duration-300 text-lg px-8 py-6 hover:scale-105">
                <Link href="/customer/browse">
                  Browse Artists
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 border-slate-400 dark:border-gray-600 text-white hover:bg-white bg-slate-700 dark:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-900 transition-all duration-300 text-lg px-8 py-6 hover:scale-105">
                <Link href="/auth/signup?role=artist">Join as Artist</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 pt-12 border-t border-slate-700/50 dark:border-gray-700/50">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">{mockArtists.length}+</div>
                <div className="text-slate-400 dark:text-gray-500 text-sm md:text-base">Verified Artists</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">500+</div>
                <div className="text-slate-400 dark:text-gray-500 text-sm md:text-base">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">1000+</div>
                <div className="text-slate-400 dark:text-gray-500 text-sm md:text-base">Bookings Made</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/50 mb-4">
              Why TattooHub
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-gray-100 mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We make finding and booking tattoo artists simple, safe, and convenient.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-12 hover:shadow-2xl transition-all duration-500 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 group-hover:scale-110 transition-all duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-gray-100">Vetted Artists</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg">
                All our artists are carefully reviewed and verified to ensure quality and professionalism.
              </p>
            </Card>

            <Card className="text-center p-12 hover:shadow-2xl transition-all duration-500 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-gray-100">Easy Booking</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg">
                Book appointments with your favorite artists in just a few clicks, with real-time availability.
              </p>
            </Card>

            <Card className="text-center p-12 hover:shadow-2xl transition-all duration-500 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-gray-100">Safe & Secure</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg">
                Your personal information and payments are protected with enterprise-grade security.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/50 mb-4">
              Our Community
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-gray-100 mb-6">
              Featured Artists
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover some of our top-rated tattoo artists
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredArtists.map((artist) => {
              const artistImage = artist.portfolio?.[0] || artist.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=0D8ABC&color=fff&size=400`;
              return (
              <Card key={artist.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-slate-200 dark:border-gray-700 group hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700">
                  <Image
                    src={artistImage}
                    alt={`${artist.name} portfolio`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-gray-100">{artist.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6 dark:bg-gray-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-3">{artist.name}</h3>
                  <div className="flex items-center text-slate-600 dark:text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm">{artist.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {artist.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-teal-600 dark:to-cyan-600 hover:from-slate-800 hover:to-slate-600 dark:hover:from-teal-700 dark:hover:to-cyan-700 group-hover:shadow-lg transition-all duration-300" asChild>
                    <Link href="/customer/browse">
                      View Profile
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
            })}
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-600/30 px-8">
              <Link href="/customer/browse">
                View All Artists
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-900/30 dark:from-teal-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 dark:from-cyan-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="bg-teal-500/10 dark:bg-teal-500/20 text-teal-300 dark:text-teal-400 border-teal-500/20 dark:border-teal-500/30 hover:bg-teal-500/20 dark:hover:bg-teal-500/30 mb-6">
            Join TattooHub Today
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 dark:text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join thousands of satisfied customers and artists using TattooHub to connect and create amazing body art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-2xl shadow-teal-600/50 hover:shadow-teal-600/70 transition-all duration-300 text-lg px-8 py-6 hover:scale-105">
              <Link href="/auth/signup">
                Sign Up Now
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 border-slate-400 dark:border-gray-600 text-white hover:bg-white hover:text-slate-900 dark:hover:text-gray-900 transition-all duration-300 text-lg px-8 py-6 hover:scale-105 bg-slate-700 dark:bg-gray-800">
              <Link href="/customer/browse">Browse Artists</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 dark:bg-gray-950 text-white py-20 border-t border-slate-800 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:shadow-teal-600/40 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-white to-slate-300 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">TattooHub</span>
            </div>
            <p className="text-slate-400 dark:text-gray-500 mb-10 text-lg max-w-2xl mx-auto">
              Connecting tattoo artists and enthusiasts worldwide. Your journey to incredible body art starts here.
            </p>
            <div className="flex justify-center space-x-8 mb-10">
              <Link href="#" className="text-slate-400 dark:text-gray-500 hover:text-teal-400 dark:hover:text-teal-400 transition-colors text-base font-medium">
                Privacy Policy
              </Link>
              <Link href="#" className="text-slate-400 dark:text-gray-500 hover:text-teal-400 dark:hover:text-teal-400 transition-colors text-base font-medium">
                Terms of Service
              </Link>
              <Link href="#" className="text-slate-400 dark:text-gray-500 hover:text-teal-400 dark:hover:text-teal-400 transition-colors text-base font-medium">
                Contact Us
              </Link>
            </div>
            <div className="border-t border-slate-800 dark:border-gray-800 pt-8">
              <p className="text-slate-500 dark:text-gray-600 text-sm">
                © {new Date().getFullYear()} TattooHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
