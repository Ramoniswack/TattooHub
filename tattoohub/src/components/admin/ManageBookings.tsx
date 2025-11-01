'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Clock, DollarSign, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Booking } from '@/types';
import BookingDetailModal from './BookingDetailModal';

interface ManageBookingsProps {
  bookings: Booking[];
  isLoading?: boolean;
  onUpdate?: () => void;
}

export default function ManageBookings({ bookings, isLoading = false, onUpdate }: ManageBookingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
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

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-teal-600">{bookings.length}</div><div className="text-sm text-gray-600 dark:text-gray-400">Total</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</div><div className="text-sm text-gray-600 dark:text-gray-400">Pending</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</div><div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'completed').length}</div><div className="text-sm text-gray-600 dark:text-gray-400">Completed</div></CardContent></Card>
      </div>

      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(booking.status)}
                    {getStatusBadge(booking.status)}
                    {booking.reviewed && <Badge variant="outline" className="text-xs">Reviewed</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="font-medium text-gray-700 dark:text-gray-300">Customer:</span> {booking.customerName}</div>
                    <div><span className="font-medium text-gray-700 dark:text-gray-300">Artist:</span> {booking.artistName}</div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400"><Calendar className="h-4 w-4 mr-1" />{booking.date}</div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400"><Clock className="h-4 w-4 mr-1" />{booking.time} ({booking.duration}h)</div>
                    <div className="flex items-center text-teal-600 font-medium"><DollarSign className="h-4 w-4 mr-1" />${booking.price}</div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{booking.description}</p>
                </div>
                <Button size="sm" onClick={() => handleViewDetails(booking)}>
                  <Eye className="h-4 w-4 mr-1" />View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BookingDetailModal booking={selectedBooking} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedBooking(null); }} onUpdate={() => { onUpdate?.(); }} />
    </div>
  );
}
