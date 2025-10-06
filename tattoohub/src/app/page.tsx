import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, CircleCheck as CheckCircle, Users, Calendar, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Tattoo Artist
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with talented tattoo artists, book appointments, and bring your ink dreams to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/30">
                <Link href="/customer/browse">Browse Artists</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-slate-300 text-white hover:bg-white hover:text-slate-900">
                <Link href="/auth/signup?role=artist">Join as Artist</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose TattooHub?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We make finding and booking tattoo artists simple, safe, and convenient.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-10 hover:shadow-xl transition-all duration-300 border-slate-200 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Vetted Artists</h3>
              <p className="text-slate-600 leading-relaxed">
                All our artists are carefully reviewed and verified to ensure quality and professionalism.
              </p>
            </Card>

            <Card className="text-center p-10 hover:shadow-xl transition-all duration-300 border-slate-200 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Easy Booking</h3>
              <p className="text-slate-600 leading-relaxed">
                Book appointments with your favorite artists in just a few clicks, with real-time availability.
              </p>
            </Card>

            <Card className="text-center p-10 hover:shadow-xl transition-all duration-300 border-slate-200 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Safe & Secure</h3>
              <p className="text-slate-600 leading-relaxed">
                Your personal information and payments are protected with enterprise-grade security.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Featured Artists
            </h2>
            <p className="text-xl text-slate-600">
              Discover some of our top-rated tattoo artists
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Artist 1 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group">
              <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Mike Rodriguez"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">Mike Rodriguez</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700">4.8</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">New York, NY</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Realistic</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Portraits</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Black & Gray</Badge>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800" asChild>
                  <Link href="/customer/browse">View Profile</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Artist 2 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group">
              <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Sarah Chen"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">Sarah Chen</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700">4.9</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Los Angeles, CA</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Traditional</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Color Work</Badge>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800" asChild>
                  <Link href="/customer/browse">View Profile</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Artist 3 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group">
              <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Alex Thompson"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">Alex Thompson</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700">4.7</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Chicago, IL</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Minimalist</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Fine Line</Badge>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800" asChild>
                  <Link href="/customer/browse">View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Join thousands of satisfied customers and artists using TattooHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/30">
              <Link href="/auth/signup">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-slate-300 text-white hover:bg-white hover:text-slate-900">
              <Link href="/customer/browse">Browse Artists</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl">TattooHub</span>
            </div>
            <p className="text-slate-400 mb-8 text-lg">
              Connecting tattoo artists and enthusiasts worldwide
            </p>
            <div className="flex justify-center space-x-8 text-sm text-slate-400">
              <Link href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
