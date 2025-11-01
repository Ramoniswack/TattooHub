'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Booking } from '@/types';
import { updateBookingStatus, deleteBooking } from '@/lib/firebase/database';
import { Calendar, Clock, DollarSign, User, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BookingDetailModal({ booking, isOpen, onClose, onUpdate }: BookingDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<Booking['status']>(booking?.status || 'pending');

  if (!booking) return null;

  const handleUpdateStatus = async () => {
    if (newStatus === booking.status) {
      alert('Please select a different status');
      return;
    }

    try {
      setIsLoading(true);
      await updateBookingStatus(booking.id, newStatus);
      alert('Booking status updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    try {
      setIsLoading(true);
      await deleteBooking(booking.id);
      alert('Booking deleted successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            View and manage booking information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(booking.status)}
              <span className="font-medium">Status:</span>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          {/* Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>Customer</span>
              </div>
              <div className="font-medium">{booking.customerName}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ID: {booking.customerId.substring(0, 8)}...</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>Artist</span>
              </div>
              <div className="font-medium">{booking.artistName}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ID: {booking.artistId.substring(0, 8)}...</div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                <div className="font-medium">{booking.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time & Duration</div>
                <div className="font-medium">{booking.time} ({booking.duration} hours)</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Price</div>
                <div className="font-medium text-lg text-teal-600">${booking.price}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
              {booking.description || 'No description provided'}
            </div>
          </div>

          {/* Metadata */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span className="font-mono">{booking.id}</span>
            </div>
            {booking.createdAt && (
              <div className="flex justify-between mt-1">
                <span>Created:</span>
                <span>{new Date(booking.createdAt).toLocaleString()}</span>
              </div>
            )}
            {booking.reviewed && (
              <div className="flex justify-between mt-1">
                <span>Reviewed:</span>
                <span className="text-green-600">✓ Yes</span>
              </div>
            )}
          </div>

          {/* Update Status */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium min-w-[120px]">Update Status:</label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Booking['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateStatus} 
                disabled={isLoading || newStatus === booking.status}
                className="flex-1"
              >
                Update Status
              </Button>
              <Button 
                onClick={handleDelete} 
                disabled={isLoading}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
