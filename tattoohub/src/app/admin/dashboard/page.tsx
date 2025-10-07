'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Calendar, TrendingUp, UserPlus, Database } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { getAllBookings, getAllArtists, getPendingArtists, getAllCustomers } from '@/lib/firebase/database';
import { migrateCustomersToRealtimeDB } from '@/lib/firebase/migrate-customers';
import { Booking, Artist, Customer } from '@/types';
import Header from '@/components/layout/Header';
import ManageArtists from '@/components/admin/ManageArtists';
import ManageCustomers from '@/components/admin/ManageCustomers';
import ManageBookings from '@/components/admin/ManageBookings';
import PendingArtists from '@/components/admin/PendingArtists';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pendingArtistsCount, setPendingArtistsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMigrating, setIsMigrating] = useState(false);

  // Load bookings, artists, and customers from Firebase
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allBookings, allArtists, allCustomers, pending] = await Promise.all([
        getAllBookings(),
        getAllArtists(),
        getAllCustomers(),
        getPendingArtists()
      ]);
      setBookings(allBookings);
      setArtists(allArtists);
      setCustomers(allCustomers);
      setPendingArtistsCount(pending.length);
      console.log('Admin loaded data from Firebase:', {
        bookings: allBookings.length,
        artists: allArtists.length,
        customers: allCustomers.length,
        pending: pending.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateCustomers = async () => {
    if (!confirm('This will migrate all existing customers from Firestore to Realtime Database. Continue?')) {
      return;
    }
    
    try {
      setIsMigrating(true);
      const results = await migrateCustomersToRealtimeDB();
      alert(`Migration complete!\nSuccess: ${results.success}\nFailed: ${results.failed}`);
      await loadData(); // Reload data to show new customers
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed. Check console for details.');
    } finally {
      setIsMigrating(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user?.role]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?role=admin');
      return;
    }
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [user, isAuthenticated, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalArtists: artists.length,
    approvedArtists: artists.filter(a => a.approved).length,
    pendingArtists: pendingArtistsCount,
    totalCustomers: customers.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage artists, customers, and bookings</p>
          </div>
          <Button asChild>
            <Link href="/admin/add-admin">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalArtists}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.approvedArtists} approved, {stats.pendingArtists} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">Active users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingBookings} pending, {stats.confirmedBookings} confirmed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedBookings}</div>
                  <p className="text-xs text-muted-foreground">Total completed bookings</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Overview */}
            <div className="grid gap-6 md:grid-cols-1">
              <PendingArtists />

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-blue-600">{stats.pendingBookings}</span> pending bookings
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-green-600">{stats.confirmedBookings}</span> confirmed bookings
                    </p>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      View all bookings →
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Migration Utility */}
              {stats.totalCustomers === 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-900">Customer Data Migration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-yellow-800 mb-4">
                      No customers found in the database. If you have existing customer accounts, run the migration to sync them.
                    </p>
                    <Button 
                      onClick={handleMigrateCustomers} 
                      disabled={isMigrating}
                      variant="outline"
                      className="border-yellow-600 text-yellow-900 hover:bg-yellow-100"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      {isMigrating ? 'Migrating...' : 'Migrate Customers'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <ManageArtists />
          </TabsContent>

          <TabsContent value="customers">
            <ManageCustomers />
          </TabsContent>

          <TabsContent value="bookings">
            <ManageBookings bookings={bookings} isLoading={isLoading} onUpdate={loadData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
