'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Calendar, Clock, MessageCircle, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ArrowRight } from 'lucide-react';
import { Booking } from '@/types';
import { format, parseISO } from 'date-fns';

interface ManageBookingsProps {
  bookings: Booking[];
  isLoading?: boolean;
}

export default function ManageBookings({ bookings, isLoading = false }: ManageBookingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by date (booking date, not createdAt since it might be undefined)
      const dateA = new Date(a.date + ' ' + a.time).getTime();
      const dateB = new Date(b.date + ' ' + b.time).getTime();
      return dateB - dateA;
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
                  placeholder="Search bookings..."
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
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => {
            // Use artist and customer names from booking data
            const artistName = booking.artistName || 'Unknown Artist';
            const customerName = booking.customerName || 'Unknown Customer';

            return (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(booking.status)}
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        ${booking.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.duration} hours
                      </div>
                    </div>
                  </div>

                  {/* Customer and Artist */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                          {customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customerName}</div>
                        <div className="text-sm text-gray-600">Customer</div>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-gray-400" />

                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {artistName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{artistName}</div>
                        <div className="text-sm text-gray-600">Artist</div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {format(parseISO(booking.date), 'PPP')}
                        </div>
                        <div className="text-sm text-gray-600">Date</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{booking.time}</div>
                        <div className="text-sm text-gray-600">Time</div>
                      </div>
                    </div>
                  </div>

                  {booking.description && (
                    <div className="mb-4">
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Description</div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {booking.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Booking ID: {booking.id}</span>
                      <span>Booking for {format(parseISO(booking.date), 'PPP')}</span>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No bookings have been made yet'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}