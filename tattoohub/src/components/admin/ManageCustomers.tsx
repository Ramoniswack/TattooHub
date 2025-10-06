'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Mail, Calendar } from 'lucide-react';
import { getAllBookings } from '@/lib/firebase/database';
import { Booking } from '@/types';

interface CustomerInfo {
  id: string;
  name: string;
  bookingCount: number;
  firstBookingDate: string;
}

export default function ManageCustomers() {
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load bookings and extract customer info
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const allBookings = await getAllBookings();
        setBookings(allBookings);

        // Extract unique customers from bookings
        const customerMap = new Map<string, CustomerInfo>();
        
        allBookings.forEach(booking => {
          const existingCustomer = customerMap.get(booking.customerId);
          
          if (existingCustomer) {
            existingCustomer.bookingCount++;
            // Update first booking date if this one is earlier
            if (new Date(booking.date) < new Date(existingCustomer.firstBookingDate)) {
              existingCustomer.firstBookingDate = booking.date;
            }
          } else {
            customerMap.set(booking.customerId, {
              id: booking.customerId,
              name: booking.customerName || 'Unknown Customer',
              bookingCount: 1,
              firstBookingDate: booking.date
            });
          }
        });

        setCustomers(Array.from(customerMap.values()));
        console.log('✅ Extracted customers from bookings:', customerMap.size);
      } catch (error) {
        console.error('❌ Error loading customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading customers...</p>
      </div>
    );
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerBookings = (customerId: string) => {
    return bookings.filter(booking => booking.customerId === customerId);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => {
            const customerBookings = getCustomerBookings(customer.id);
            const totalSpent = customerBookings
              .filter(booking => booking.status === 'completed')
              .reduce((sum, booking) => sum + booking.price, 0);

            return (
              <Card key={customer.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-xl">
                          {customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{customer.name}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Customer ID: {customer.id.slice(0, 8)}...
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {customerBookings.length} booking{customerBookings.length !== 1 ? 's' : ''}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">First Booking:</span>
                            {new Date(customer.firstBookingDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Total Spent:</span>
                            ${totalSpent}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Member since: {new Date(customer.firstBookingDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled
                        title="Delete functionality requires full customer management system"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Customers will appear here once they make their first booking'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}