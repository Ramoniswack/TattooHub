'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Eye, Mail, Calendar } from 'lucide-react';
import { getAllCustomers, getAllBookings } from '@/lib/firebase/database';
import { Customer, Booking } from '@/types';
import CustomerDetailModal from './CustomerDetailModal';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allCustomers, allBookings] = await Promise.all([
        getAllCustomers(),
        getAllBookings()
      ]);
      setCustomers(allCustomers);
      setBookings(allBookings);
      console.log('Loaded customers:', allCustomers.length);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const getCustomerBookings = (customerId: string) => {
    return bookings.filter(b => b.customerId === customerId);
  };

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
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal-600">{customers.length}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">${bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredCustomers.map(customer => {
          const customerBookings = getCustomerBookings(customer.id);
          return (
            <Card key={customer.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-xl">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{customer.name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center"><Mail className="h-4 w-4 mr-1" />{customer.email}</div>
                        <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</div>
                        <div><span className="font-medium">{customerBookings.length}</span> bookings</div>
                        <div><span className="font-medium">${customerBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)}</span> spent</div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleViewDetails(customer)}>
                    <Eye className="h-4 w-4 mr-1" />View
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CustomerDetailModal customer={selectedCustomer} customerBookings={selectedCustomer ? getCustomerBookings(selectedCustomer.id) : []} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedCustomer(null); }} onUpdate={loadData} />
    </div>
  );
}
