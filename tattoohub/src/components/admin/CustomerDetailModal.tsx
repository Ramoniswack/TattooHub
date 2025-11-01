'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Customer, Booking, Review } from '@/types';
import { updateCustomer, deleteCustomer, getCustomerReviews } from '@/lib/firebase/database';
import { Mail, Calendar, Trash2, Edit2, User, Star } from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer | null;
  customerBookings: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function CustomerDetailModal({ 
  customer, 
  customerBookings,
  isOpen, 
  onClose, 
  onUpdate 
}: CustomerDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>(customer || {});
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      if (customer?.id) {
        try {
          const customerReviews = await getCustomerReviews(customer.id);
          setReviews(customerReviews);
        } catch (error) {
          console.error('Error loading customer reviews:', error);
        }
      }
    };
    
    if (isOpen) {
      loadReviews();
    }
  }, [customer?.id, isOpen]);

  if (!customer) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateCustomer(customer.id, formData);
      alert('Customer updated successfully!');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;
    try {
      setIsLoading(true);
      await deleteCustomer(customer.id);
      alert('Customer deleted successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSpent = customerBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Customer Details</span>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            View and manage customer information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback className="text-2xl">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{customer.name}</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{customerBookings.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {customerBookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{reviews.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">${totalSpent}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
            </div>
          </div>

          {/* Editable Fields */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading}>
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(customer);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Booking History */}
              <div>
                <Label>Recent Bookings</Label>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {customerBookings.length > 0 ? (
                    customerBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{booking.artistName}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div>{booking.date} at {booking.time}</div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">${booking.price}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No bookings yet</p>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <Label>Reviews Given ({reviews.length})</Label>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {reviews.length > 0 ? (
                    reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{review.artistName}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No reviews yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isEditing && (
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleDelete} 
                disabled={isLoading}
                variant="destructive"
                className="ml-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Customer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
