'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, getDocs } from 'firebase/firestore';
import { ref, get, set } from 'firebase/database';
import { db, database } from '@/lib/firebase/config';
import { Customer } from '@/types';
import Header from '@/components/layout/Header';

export default function DebugCustomersPage() {
  const [firestoreCustomers, setFirestoreCustomers] = useState<Customer[]>([]);
  const [realtimeCustomers, setRealtimeCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const checkFirestore = async () => {
    try {
      setLoading(true);
      setMessage('Checking Firestore...');
      
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const customers = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Customer))
        .filter((user) => user.role === 'customer');
      
      setFirestoreCustomers(customers);
      setMessage(`Found ${customers.length} customers in Firestore`);
    } catch (error) {
      console.error('Error checking Firestore:', error);
      setMessage('Error checking Firestore: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const checkRealtimeDB = async () => {
    try {
      setLoading(true);
      setMessage('Checking Realtime Database...');
      
      const customersRef = ref(database, 'customers');
      const snapshot = await get(customersRef);
      
      if (!snapshot.exists()) {
        setRealtimeCustomers([]);
        setMessage('No customers found in Realtime Database');
        return;
      }

      const customers: Customer[] = [];
      snapshot.forEach((childSnapshot) => {
        customers.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      
      setRealtimeCustomers(customers);
      setMessage(`Found ${customers.length} customers in Realtime Database`);
    } catch (error) {
      console.error('Error checking Realtime DB:', error);
      setMessage('Error checking Realtime DB: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const migrateCustomers = async () => {
    try {
      setLoading(true);
      setMessage('Starting migration...');
      
      let migrated = 0;
      for (const customer of firestoreCustomers) {
        try {
          const customerData: Customer = {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            role: 'customer',
            avatar: customer.avatar,
            createdAt: customer.createdAt instanceof Date ? customer.createdAt : new Date(),
            ...(customer.phone && { phone: customer.phone }),
          };

          const customerRef = ref(database, `customers/${customer.id}`);
          const userRef = ref(database, `users/${customer.id}`);
          
          await Promise.all([
            set(customerRef, customerData),
            set(userRef, customerData)
          ]);
          
          migrated++;
          setMessage(`Migrated ${migrated}/${firestoreCustomers.length} customers...`);
        } catch (error) {
          console.error(`Failed to migrate customer ${customer.id}:`, error);
        }
      }
      
      setMessage(`Migration complete! Migrated ${migrated} customers.`);
      await checkRealtimeDB(); // Refresh the list
    } catch (error) {
      console.error('Migration error:', error);
      setMessage('Migration failed: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Customer Database Debug Tool</h1>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Firestore (Primary DB)</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={checkFirestore} disabled={loading}>
                Check Firestore
              </Button>
              <p className="mt-4 text-sm">
                Found: <strong>{firestoreCustomers.length}</strong> customers
              </p>
              <div className="mt-4 max-h-60 overflow-y-auto">
                {firestoreCustomers.map(c => (
                  <div key={c.id} className="text-xs p-2 border-b">
                    {c.name} ({c.email})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Realtime DB (Admin View)</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={checkRealtimeDB} disabled={loading}>
                Check Realtime DB
              </Button>
              <p className="mt-4 text-sm">
                Found: <strong>{realtimeCustomers.length}</strong> customers
              </p>
              <div className="mt-4 max-h-60 overflow-y-auto">
                {realtimeCustomers.map(c => (
                  <div key={c.id} className="text-xs p-2 border-b">
                    {c.name} ({c.email})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Migration Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button 
                onClick={migrateCustomers} 
                disabled={loading || firestoreCustomers.length === 0}
                className="w-full"
              >
                Migrate Firestore → Realtime DB
              </Button>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                This will copy all customers from Firestore to Realtime Database
              </p>
            </div>
          </CardContent>
        </Card>

        {message && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-mono">{message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
