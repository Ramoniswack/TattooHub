'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Booking } from '@/types';
import { updateBookingStatus } from '@/lib/firebase/database';
import { ref, update } from 'firebase/database';
import { database } from '@/lib/firebase/config';
import { Calendar, Clock, DollarSign, Edit2, X } from 'lucide-react';

interface EditBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditBookingModal({ booking, isOpen, onClose, onUpdate }: EditBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [description, setDescription] = useState('');

  // Update form when booking changes
  useEffect(() => {
    if (booking) {
      setDate(booking.date);
      setTime(booking.time);
      setDuration(booking.duration);
      setDescription(booking.description);
    }
  }, [booking]);

  if (!booking) return null;

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const bookingRef = ref(database, `bookings/${booking.id}`);
      
      const updates = {
        date,
        time,
        duration,
        description,
        price: booking.price, // Keep original price or recalculate if needed
      };

      await update(bookingRef, updates);
      alert('Booking updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setIsLoading(true);
      await updateBookingStatus(booking.id, 'cancelled');
      alert('Booking cancelled successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canEdit = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Booking
          </DialogTitle>
          <DialogDescription>
            Update your booking details or cancel the booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Artist:</span>
              <span className="font-medium">{booking.artistName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>

          {canEdit ? (
            <>
              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration (hours)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="12"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe what you want done..."
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-blue-900">Total Price:</span>
                  <span className="text-lg font-bold text-blue-900 flex items-center">
                    <DollarSign className="h-5 w-5" />
                    {booking.price}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  variant="destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel Booking
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Read-only view for completed/cancelled bookings */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{booking.date}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium">{booking.time}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium">{booking.duration} hours</span>
                </div>
                <div className="py-2">
                  <span className="text-gray-600 dark:text-gray-400 block mb-1">Description:</span>
                  <p className="text-gray-900 dark:text-gray-100">{booking.description}</p>
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="text-lg font-bold text-teal-600">${booking.price}</span>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                This booking cannot be edited because it is {booking.status}.
                {booking.status === 'cancelled' && ' Contact the artist if you need to rebook.'}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
