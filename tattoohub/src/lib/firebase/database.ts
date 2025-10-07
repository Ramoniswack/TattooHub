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
import type { Review } from '@/types';

// ============================================
// BOOKING OPERATIONS
// ============================================

/**
 * Create a new booking in Firebase Realtime Database
 */
export async function createBooking(bookingData: Omit<Booking, 'id'>): Promise<string> {
  try {
    console.log('Creating booking with data:', bookingData);
    const bookingsRef = ref(database, 'bookings');
    const newBookingRef = push(bookingsRef);
    
    const booking: Booking = {
      ...bookingData,
      id: newBookingRef.key || '',
      createdAt: new Date(),
    };

    console.log('Saving booking to Firebase:', booking);
    await set(newBookingRef, booking);
    console.log('Booking created successfully with ID:', booking.id);
    return booking.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    const err = error as { code?: string; message?: string };
    if (err.code === 'PERMISSION_DENIED') {
      console.error('🔒 Firebase rules are blocking write access to /bookings');
    }
    throw error;
  }
}

/**
 * Get all bookings for a specific customer
 */
export async function getBookingsByCustomer(customerId: string): Promise<Booking[]> {
  try {
    console.log('🔍 Fetching bookings for customer:', customerId);
    const bookingsRef = ref(database, 'bookings');
    
    // Try indexed query first
    try {
      const customerQuery = query(bookingsRef, orderByChild('customerId'), equalTo(customerId));
      const snapshot = await get(customerQuery);
      
      if (snapshot.exists()) {
        const bookings: Booking[] = [];
        snapshot.forEach((childSnapshot) => {
          const booking = childSnapshot.val() as Booking;
          console.log('� Found booking (indexed):', booking.id, booking);
          bookings.push(booking);
        });
        
        // Sort by date (most recent first)
        bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log(`Found ${bookings.length} bookings for customer ${customerId} (indexed)`);
        return bookings;
      }
    } catch (indexError) {
      console.warn('Indexed query failed, falling back to full scan:', indexError);
    }
    
    // Fallback: Get all bookings and filter client-side
    console.log('Using fallback: getting all bookings and filtering...');
    const allSnapshot = await get(bookingsRef);
    
    if (!allSnapshot.exists()) {
      console.log('📭 No bookings found in database');
      return [];
    }

    const bookings: Booking[] = [];
    allSnapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val() as Booking;
      if (booking.customerId === customerId) {
        console.log('📋 Found booking (filtered):', booking.id, booking);
        bookings.push(booking);
      }
    });

    // Sort by date (most recent first)
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Found ${bookings.length} bookings for customer ${customerId} (filtered)`);
    return bookings;
  } catch (error) {
    console.error('Error getting customer bookings:', error);
    const err = error as { code?: string; message?: string };
    if (err.code === 'PERMISSION_DENIED') {
      console.error('🔒 Firebase rules are blocking read access to /bookings');
    }
    throw error;
  }
}

/**
 * Get all bookings for a specific artist
 */
export async function getBookingsByArtist(artistId: string): Promise<Booking[]> {
  try {
    console.log('🔍 Fetching bookings for artist:', artistId);
    const bookingsRef = ref(database, 'bookings');
    
    // Try indexed query first
    try {
      const artistQuery = query(bookingsRef, orderByChild('artistId'), equalTo(artistId));
      const snapshot = await get(artistQuery);
      
      if (snapshot.exists()) {
        const bookings: Booking[] = [];
        snapshot.forEach((childSnapshot) => {
          const booking = childSnapshot.val() as Booking;
          console.log('📋 Found booking (indexed):', booking.id, booking);
          bookings.push(booking);
        });
        
        // Sort by date (most recent first)
        bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log(`Found ${bookings.length} bookings for artist ${artistId} (indexed)`);
        return bookings;
      }
    } catch (indexError) {
      console.warn('Indexed query failed, falling back to full scan:', indexError);
    }
    
    // Fallback: Get all bookings and filter client-side
    console.log('Using fallback: getting all bookings and filtering...');
    const allSnapshot = await get(bookingsRef);
    
    if (!allSnapshot.exists()) {
      console.log('📭 No bookings found in database');
      return [];
    }

    const bookings: Booking[] = [];
    allSnapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val() as Booking;
      if (booking.artistId === artistId) {
        console.log('📋 Found booking (filtered):', booking.id, booking);
        bookings.push(booking);
      }
    });

    // Sort by date (most recent first)
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Found ${bookings.length} bookings for artist ${artistId} (filtered)`);
    return bookings;
  } catch (error) {
    console.error('Error getting artist bookings:', error);
    const err = error as { code?: string; message?: string };
    if (err.code === 'PERMISSION_DENIED') {
      console.error('🔒 Firebase rules are blocking read access to /bookings');
    }
    throw error;
  }
}

/**
 * Get all bookings (for admin)
 */
export async function getAllBookings(): Promise<Booking[]> {
  try {
    console.log('🔍 Fetching all bookings (admin)...');
    const bookingsRef = ref(database, 'bookings');
    const snapshot = await get(bookingsRef);
    
    if (!snapshot.exists()) {
      console.log('📭 No bookings found in database');
      return [];
    }

    const bookings: Booking[] = [];
    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val() as Booking;
      console.log('📋 Found booking:', booking.id, booking);
      bookings.push(booking);
    });

    // Sort by date (most recent first)
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Found ${bookings.length} total bookings`);
    return bookings;
  } catch (error) {
    console.error('Error getting all bookings:', error);
    const err = error as { code?: string; message?: string };
    if (err.code === 'PERMISSION_DENIED') {
      console.error('🔒 Firebase rules are blocking read access to /bookings');
    }
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
    console.log(`Booking ${bookingId} status updated to ${status}`);
  } catch (error) {
    console.error('Error updating booking status:', error);
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
    console.log(`Booking ${bookingId} deleted`);
  } catch (error) {
    console.error('Error deleting booking:', error);
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
    // Update Realtime Database
    const artistRef = ref(database, `artists/${artistId}`);
    await update(artistRef, artistData);
    console.log(`Artist ${artistId} profile updated in Realtime DB`);
    
    // Also update Firestore (for auth checks)
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('./config');
    const userDocRef = doc(db, 'users', artistId);
    await updateDoc(userDocRef, artistData as Record<string, unknown>);
    console.log(`Artist ${artistId} profile updated in Firestore`);
  } catch (error) {
    console.error('Error updating artist profile:', error);
    throw error;
  }
}

/**
 * Get artist by ID
 */
export async function getArtistById(artistId: string): Promise<Artist | null> {
  try {
    console.log('🔍 Fetching artist with ID:', artistId);
    const artistRef = ref(database, `artists/${artistId}`);
    const snapshot = await get(artistRef);
    
    if (!snapshot.exists()) {
      console.log('Artist not found in database:', artistId);
      return null;
    }

    const artistData = snapshot.val() as Artist;
    console.log('Artist found:', artistData.name);
    return artistData;
  } catch (error) {
    console.error('Error getting artist:', error);
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
    console.error('Error getting all artists:', error);
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
    console.log(`Artist ${artistData.id} created`);
  } catch (error) {
    console.error('Error creating artist:', error);
    throw error;
  }
}

/**
 * Delete artist
 */
/**
 * Update artist profile
 */
export async function updateArtist(artistId: string, updates: Partial<Artist>): Promise<void> {
  try {
    const artistRef = ref(database, `artists/${artistId}`);
    await update(artistRef, updates);
    console.log(`Artist ${artistId} updated`);
  } catch (error) {
    console.error('Error updating artist:', error);
    throw error;
  }
}

export async function deleteArtist(artistId: string): Promise<void> {
  try {
    const artistRef = ref(database, `artists/${artistId}`);
    await remove(artistRef);
    
    // Also delete from users node
    const userRef = ref(database, `users/${artistId}`);
    await remove(userRef);
    
    console.log(`Artist ${artistId} deleted`);
  } catch (error) {
    console.error('Error deleting artist:', error);
    throw error;
  }
}

/**
 * Approve artist - updates approved status to true
 */
export async function approveArtist(artistId: string): Promise<void> {
  try {
    const artistRef = ref(database, `artists/${artistId}`);
    const userRef = ref(database, `users/${artistId}`);
    
    await Promise.all([
      update(artistRef, { approved: true }),
      update(userRef, { approved: true })
    ]);
    
    console.log(`Artist ${artistId} approved`);
  } catch (error) {
    console.error('Error approving artist:', error);
    throw error;
  }
}

/**
 * Reject artist - updates approved status to false
 */
export async function rejectArtist(artistId: string): Promise<void> {
  try {
    const artistRef = ref(database, `artists/${artistId}`);
    const userRef = ref(database, `users/${artistId}`);
    
    await Promise.all([
      update(artistRef, { approved: false }),
      update(userRef, { approved: false })
    ]);
    
    console.log(`Artist ${artistId} rejected`);
  } catch (error) {
    console.error('Error rejecting artist:', error);
    throw error;
  }
}

/**
 * Get pending artists (not approved yet)
 */
export async function getPendingArtists(): Promise<Artist[]> {
  try {
    const artistsRef = ref(database, 'artists');
    const pendingQuery = query(artistsRef, orderByChild('approved'), equalTo(false));
    const snapshot = await get(pendingQuery);
    
    if (!snapshot.exists()) {
      return [];
    }

    const artists: Artist[] = [];
    snapshot.forEach((childSnapshot) => {
      artists.push(childSnapshot.val() as Artist);
    });

    return artists;
  } catch (error) {
    console.error('Error getting pending artists:', error);
    throw error;
  }
}

/**
 * Get approved artists
 */
export async function getApprovedArtists(): Promise<Artist[]> {
  try {
    const artistsRef = ref(database, 'artists');
    const approvedQuery = query(artistsRef, orderByChild('approved'), equalTo(true));
    const snapshot = await get(approvedQuery);
    
    if (!snapshot.exists()) {
      return [];
    }

    const artists: Artist[] = [];
    snapshot.forEach((childSnapshot) => {
      artists.push(childSnapshot.val() as Artist);
    });

    return artists;
  } catch (error) {
    console.error('Error getting approved artists:', error);
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
    console.log(`Customer ${customerId} profile updated`);
  } catch (error) {
    console.error('Error updating customer profile:', error);
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
    console.error('Error getting customer:', error);
    throw error;
  }
}

/**
 * Get all customers (for admin)
 */
export async function getAllCustomers(): Promise<Customer[]> {
  try {
    console.log('[getAllCustomers] Fetching customers from Realtime DB...');
    const customersRef = ref(database, 'customers');
    const snapshot = await get(customersRef);
    
    console.log('[getAllCustomers] Snapshot exists:', snapshot.exists());
    
    if (!snapshot.exists()) {
      console.log('[getAllCustomers] No customers found in database');
      return [];
    }

    const customers: Customer[] = [];
    snapshot.forEach((childSnapshot) => {
      const customer = childSnapshot.val() as Customer;
      console.log('[getAllCustomers] Found customer:', { id: customer.id, email: customer.email });
      customers.push(customer);
    });

    console.log('[getAllCustomers] Total customers found:', customers.length);
    return customers;
  } catch (error) {
    console.error('[getAllCustomers] Error getting all customers:', error);
    throw error;
  }
}

/**
 * Create new customer
 */
export async function createCustomer(customerData: Customer): Promise<void> {
  try {
    console.log('[createCustomer] Starting customer creation:', {
      id: customerData.id,
      email: customerData.email,
      name: customerData.name
    });
    
    // Save to both customers and users nodes
    const customerRef = ref(database, `customers/${customerData.id}`);
    const userRef = ref(database, `users/${customerData.id}`);
    
    console.log('[createCustomer] Saving to paths:', {
      customerPath: `customers/${customerData.id}`,
      userPath: `users/${customerData.id}`
    });
    
    await Promise.all([
      set(customerRef, customerData),
      set(userRef, customerData)
    ]);
    
    console.log(`[createCustomer] Customer ${customerData.id} created successfully`);
  } catch (error) {
    console.error('[createCustomer] Error creating customer:', error);
    throw error;
  }
}

/**
 * Update customer profile
 */
export async function updateCustomer(customerId: string, updates: Partial<Customer>): Promise<void> {
  try {
    const customerRef = ref(database, `customers/${customerId}`);
    await update(customerRef, updates);
    
    // Also update in users node
    const userRef = ref(database, `users/${customerId}`);
    await update(userRef, updates);
    
    console.log(`Customer ${customerId} updated`);
  } catch (error) {
    console.error('Error updating customer:', error);
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
    
    // Also delete from users node
    const userRef = ref(database, `users/${customerId}`);
    await remove(userRef);
    
    console.log(`Customer ${customerId} deleted`);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}

// ============================================
// REVIEW OPERATIONS
// ============================================

/**
 * Create a new review for a completed booking
 */
export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  try {
    console.log('Creating review:', reviewData);
    const reviewsRef = ref(database, 'reviews');
    const newReviewRef = push(reviewsRef);
    
    const review: Review = {
      ...reviewData,
      id: newReviewRef.key || '',
      createdAt: new Date(),
    };

    await set(newReviewRef, review);
    console.log('Review created:', review.id);

    // Mark booking as reviewed
    const bookingRef = ref(database, `bookings/${reviewData.bookingId}`);
    await update(bookingRef, { reviewed: true });
    console.log('Booking marked as reviewed');

    // Update artist's rating in background (don't block on errors)
    updateArtistRating(reviewData.artistId).catch(err => {
      console.warn('Failed to update artist rating (non-critical):', err);
    });
    
    return review.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

/**
 * Get all reviews for an artist
 */
export async function getArtistReviews(artistId: string): Promise<Review[]> {
  try {
    const reviewsRef = ref(database, 'reviews');
    const artistReviewsQuery = query(reviewsRef, orderByChild('artistId'), equalTo(artistId));
    const snapshot = await get(artistReviewsQuery);
    
    if (!snapshot.exists()) {
      return [];
    }

    const reviews: Review[] = [];
    snapshot.forEach((childSnapshot) => {
      reviews.push(childSnapshot.val() as Review);
    });

    // Sort by date (newest first)
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`Found ${reviews.length} reviews for artist ${artistId}`);
    return reviews;
  } catch (error) {
    console.error('Error getting artist reviews:', error);
    throw error;
  }
}

/**
 * Update artist's average rating based on all reviews
 */
async function updateArtistRating(artistId: string): Promise<void> {
  try {
    const reviews = await getArtistReviews(artistId);
    
    if (reviews.length === 0) {
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Number((totalRating / reviews.length).toFixed(1));

    // Update both artists and users collections
    const artistUpdates = {
      rating: averageRating,
      totalReviews: reviews.length,
    };

    const artistRef = ref(database, `artists/${artistId}`);
    await update(artistRef, artistUpdates);
    
    const userRef = ref(database, `users/${artistId}`);
    await update(userRef, artistUpdates);

    console.log(`Updated artist ${artistId} rating: ${averageRating} (${reviews.length} reviews)`);
  } catch (error) {
    console.error('Error updating artist rating:', error);
    throw error;
  }
}

/**
 * Check if a booking has been reviewed
 */
export async function isBookingReviewed(bookingId: string): Promise<boolean> {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    const snapshot = await get(bookingRef);
    
    if (!snapshot.exists()) {
      return false;
    }

    const booking = snapshot.val() as Booking;
    return booking.reviewed === true;
  } catch (error) {
    console.error('Error checking booking review status:', error);
    return false;
  }
}

/**
 * Get all reviews made by a customer
 */
export async function getCustomerReviews(customerId: string): Promise<Review[]> {
  try {
    const reviewsRef = ref(database, 'reviews');
    const snapshot = await get(reviewsRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const reviews: Review[] = [];
    snapshot.forEach((childSnapshot) => {
      const review = childSnapshot.val() as Review;
      if (review.customerId === customerId) {
        reviews.push(review);
      }
    });

    // Sort by date (newest first)
    reviews.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return reviews;
  } catch (error) {
    console.error('Error getting customer reviews:', error);
    throw error;
  }
}
