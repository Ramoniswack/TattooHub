/**
 * Migration utility to sync existing customers from Firestore to Realtime Database
 * Run this once to migrate existing customer data
 */

import { collection, getDocs } from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { db, database } from './config';
import { Customer } from '@/types';

export async function migrateCustomersToRealtimeDB(): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    console.log('Starting customer migration from Firestore to Realtime DB...');
    
    // Get all users from Firestore
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    console.log(`Found ${usersSnapshot.size} users in Firestore`);
    
    for (const docSnapshot of usersSnapshot.docs) {
      const userData = docSnapshot.data();
      
      // Only migrate customers
      if (userData.role === 'customer') {
        try {
          const customer: Customer = {
            id: docSnapshot.id,
            email: userData.email,
            name: userData.name,
            role: 'customer',
            createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date(),
            ...(userData.avatar && { avatar: userData.avatar }),
            ...(userData.phone && { phone: userData.phone }),
          };

          // Save to both customers and users nodes in Realtime DB
          const customerRef = ref(database, `customers/${customer.id}`);
          const userRef = ref(database, `users/${customer.id}`);
          
          await Promise.all([
            set(customerRef, customer),
            set(userRef, customer)
          ]);
          
          results.success++;
          console.log(`✓ Migrated customer: ${customer.name} (${customer.id})`);
        } catch (error) {
          results.failed++;
          const errorMsg = `Failed to migrate customer ${docSnapshot.id}: ${error}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
    }

    console.log('\nMigration Complete!');
    console.log(`✓ Success: ${results.success}`);
    console.log(`✗ Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach(err => console.error(`  - ${err}`));
    }

    return results;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Export a function that can be called from the browser console
if (typeof window !== 'undefined') {
  (window as { migrateCustomers?: typeof migrateCustomersToRealtimeDB }).migrateCustomers = migrateCustomersToRealtimeDB;
}
