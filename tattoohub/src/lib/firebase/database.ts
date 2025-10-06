// Firebase Realtime Database operations
import { database } from './config';
import { 
  ref, 
  push, 
  set, 
  get, 
  update, 
  remove,
  query,
  orderByChild,
  equalTo,
  onValue,
  off
} from 'firebase/database';
import { Booking, Artist, Customer } from '@/types';

// ============================================
// BOOKING OPERATIONS
// ============================================

/**
 * Create a new booking in Firebase Realtime Database
 */
export async function createBooking(bookingData: Omit<Booking, 'id'>): Promise<string> {
  try {
    const bookingsRef = ref(database, 'bookings');
    const newBookingRef = push(bookingsRef);
    
    const booking: Booking = {
      ...bookingData,
      id: newBookingRef.key || '',
      createdAt: new Date(),
    };

    await set(newBookingRef, booking);
    console.log('✅ Booking created:', booking.id);
    return booking.id;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }
}

/**
 * Get all bookings for a specific customer
 */
export async function getBookingsByCustomer(customerId: string): Promise<Booking[]> {
  try {
    const bookingsRef = ref(database, 'bookings');
    const customerQuery = query(bookingsRef, orderByChild('customerId'), equalTo(customerId));
    
    const snapshot = await get(customerQuery);
    
    if (!snapshot.exists()) {
      return [];
    }

    const bookings: Booking[] = [];
    snapshot.forEach((childSnapshot) => {
      bookings.push(childSnapshot.val() as Booking);
    });

    // Sort by date (most recent first)
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`✅ Found ${bookings.length} bookings for customer ${customerId}`);
    return bookings;
  } catch (error) {
    console.error('❌ Error getting customer bookings:', error);
    throw error;
  }
}

/**
 * Get all bookings for a specific artist
 */
export async function getBookingsByArtist(artistId: string): Promise<Booking[]> {
  try {
    const bookingsRef = ref(database, 'bookings');
    const artistQuery = query(bookingsRef, orderByChild('artistId'), equalTo(artistId));
    
    const snapshot = await get(artistQuery);
    
    if (!snapshot.exists()) {
      return [];
    }

    const bookings: Booking[] = [];
    snapshot.forEach((childSnapshot) => {
      bookings.push(childSnapshot.val() as Booking);
    });

    // Sort by date (most recent first)
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`✅ Found ${bookings.length} bookings for artist ${artistId}`);
    return bookings;
  } catch (error) {
    console.error('❌ Error getting artist bookings:', error);
    throw error;
  }
}

/**
 * Get all bookings (for admin)
 */
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const bookingsRef = ref(database, 'bookings');
    const snapshot = await get(bookingsRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const bookings: Booking[] = [];
    snapshot.forEach((childSnapshot) => {
      bookings.push(childSnapshot.val() as Booking);
    });

    // Sort by date (most recent first)
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`✅ Found ${bookings.length} total bookings`);
    return bookings;
  } catch (error) {
    console.error('❌ Error getting all bookings:', error);
    throw error;
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string, 
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<void> {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await update(bookingRef, { status });
    console.log(`✅ Booking ${bookingId} status updated to ${status}`);
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    throw error;
  }
}

/**
 * Delete a booking
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await remove(bookingRef);
    console.log(`✅ Booking ${bookingId} deleted`);
  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    throw error;
  }
}

/**
 * Listen to booking changes in real-time
 */
export function listenToBookings(
  customerId: string,
  callback: (bookings: Booking[]) => void
): () => void {
  const bookingsRef = ref(database, 'bookings');
  const customerQuery = query(bookingsRef, orderByChild('customerId'), equalTo(customerId));
  
  onValue(customerQuery, (snapshot) => {
    const bookings: Booking[] = [];
    snapshot.forEach((childSnapshot) => {
      bookings.push(childSnapshot.val() as Booking);
    });
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    callback(bookings);
  });

  // Return cleanup function
  return () => off(customerQuery);
}

// ============================================
// ARTIST OPERATIONS
// ============================================

/**
 * Save or update artist profile
 */
export async function saveArtistProfile(artistId: string, artistData: Partial<Artist>): Promise<void> {
  try {
    const artistRef = ref(database, `artists/${artistId}`);
    await update(artistRef, artistData);
    console.log(`✅ Artist ${artistId} profile updated`);
  } catch (error) {
    console.error('❌ Error updating artist profile:', error);
    throw error;
  }
}

/**
 * Get artist by ID
 */
export async function getArtistById(artistId: string): Promise<Artist | null> {
  try {
    const artistRef = ref(database, `artists/${artistId}`);
    const snapshot = await get(artistRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.val() as Artist;
  } catch (error) {
    console.error('❌ Error getting artist:', error);
    throw error;
  }
}

/**
 * Get all artists
 */
export async function getAllArtists(): Promise<Artist[]> {
  try {
    const artistsRef = ref(database, 'artists');
    const snapshot = await get(artistsRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const artists: Artist[] = [];
    snapshot.forEach((childSnapshot) => {
      artists.push(childSnapshot.val() as Artist);
    });

    return artists;
  } catch (error) {
    console.error('❌ Error getting all artists:', error);
    throw error;
  }
}

/**
 * Create new artist
 */
export async function createArtist(artistData: Artist): Promise<void> {
  try {
    const artistRef = ref(database, `artists/${artistData.id}`);
    await set(artistRef, artistData);
    console.log(`✅ Artist ${artistData.id} created`);
  } catch (error) {
    console.error('❌ Error creating artist:', error);
    throw error;
  }
}

/**
 * Delete artist
 */
export async function deleteArtist(artistId: string): Promise<void> {
  try {
    const artistRef = ref(database, `artists/${artistId}`);
    await remove(artistRef);
    console.log(`✅ Artist ${artistId} deleted`);
  } catch (error) {
    console.error('❌ Error deleting artist:', error);
    throw error;
  }
}

// ============================================
// CUSTOMER OPERATIONS
// ============================================

/**
 * Save or update customer profile
 */
export async function saveCustomerProfile(customerId: string, customerData: Partial<Customer>): Promise<void> {
  try {
    const customerRef = ref(database, `customers/${customerId}`);
    await update(customerRef, customerData);
    console.log(`✅ Customer ${customerId} profile updated`);
  } catch (error) {
    console.error('❌ Error updating customer profile:', error);
    throw error;
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(customerId: string): Promise<Customer | null> {
  try {
    const customerRef = ref(database, `customers/${customerId}`);
    const snapshot = await get(customerRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.val() as Customer;
  } catch (error) {
    console.error('❌ Error getting customer:', error);
    throw error;
  }
}

/**
 * Get all customers (for admin)
 */
export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const customersRef = ref(database, 'customers');
    const snapshot = await get(customersRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const customers: Customer[] = [];
    snapshot.forEach((childSnapshot) => {
      customers.push(childSnapshot.val() as Customer);
    });

    return customers;
  } catch (error) {
    console.error('❌ Error getting all customers:', error);
    throw error;
  }
}

/**
 * Create new customer
 */
export async function createCustomer(customerData: Customer): Promise<void> {
  try {
    const customerRef = ref(database, `customers/${customerData.id}`);
    await set(customerRef, customerData);
    console.log(`✅ Customer ${customerData.id} created`);
  } catch (error) {
    console.error('❌ Error creating customer:', error);
    throw error;
  }
}

/**
 * Delete customer
 */
export async function deleteCustomer(customerId: string): Promise<void> {
  try {
    const customerRef = ref(database, `customers/${customerId}`);
    await remove(customerRef);
    console.log(`✅ Customer ${customerId} deleted`);
  } catch (error) {
    console.error('❌ Error deleting customer:', error);
    throw error;
  }
}
