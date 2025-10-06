// Firestore database operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Artist, Customer, Booking } from '@/types';

// Get all artists
export const getAllArtists = async (onlyApproved = false): Promise<Artist[]> => {
  try {
    const usersRef = collection(db, 'users');
    let q = query(usersRef, where('role', '==', 'artist'));
    
    if (onlyApproved) {
      q = query(q, where('approved', '==', true));
    }

    const querySnapshot = await getDocs(q);
    const artists: Artist[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      artists.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Artist);
    });

    return artists;
  } catch (error) {
    console.error('Error getting artists:', error);
    throw new Error('Failed to fetch artists');
  }
};

// Get artist by ID
export const getArtistById = async (artistId: string): Promise<Artist | null> => {
  try {
    const artistDocRef = doc(db, 'users', artistId);
    const artistDocSnap = await getDoc(artistDocRef);

    if (!artistDocSnap.exists()) {
      return null;
    }

    const data = artistDocSnap.data();
    return {
      ...data,
      id: artistDocSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Artist;
  } catch (error) {
    console.error('Error getting artist:', error);
    throw new Error('Failed to fetch artist');
  }
};

// Update artist profile
export const updateArtistProfile = async (
  artistId: string,
  updates: Partial<Artist>
): Promise<void> => {
  try {
    const artistDocRef = doc(db, 'users', artistId);
    await updateDoc(artistDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating artist:', error);
    throw new Error('Failed to update artist profile');
  }
};

// Approve artist (admin only)
export const approveArtist = async (artistId: string): Promise<void> => {
  try {
    await updateArtistProfile(artistId, { approved: true });
  } catch (error) {
    console.error('Error approving artist:', error);
    throw new Error('Failed to approve artist');
  }
};

// Create new booking
export const createBooking = async (
  bookingData: Omit<Booking, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const newBookingRef = doc(bookingsRef);

    const booking = {
      ...bookingData,
      createdAt: serverTimestamp(),
      status: bookingData.status || 'pending',
    };

    await setDoc(newBookingRef, booking);
    return newBookingRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

// Get bookings by customer
export const getBookingsByCustomer = async (
  customerId: string
): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        date: data.date?.toDate() || new Date(),
      } as Booking);
    });

    return bookings;
  } catch (error) {
    console.error('Error getting customer bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

// Get bookings by artist
export const getBookingsByArtist = async (
  artistId: string
): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('artistId', '==', artistId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        date: data.date?.toDate() || new Date(),
      } as Booking);
    });

    return bookings;
  } catch (error) {
    console.error('Error getting artist bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        date: data.date?.toDate() || new Date(),
      } as Booking);
    });

    return bookings;
  } catch (error) {
    console.error('Error getting all bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: Booking['status']
): Promise<void> => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingDocRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
};

// Delete booking
export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingDocRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
};

// Get all customers (admin only)
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', 'customer'));

    const querySnapshot = await getDocs(q);
    const customers: Customer[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      customers.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Customer);
    });

    return customers;
  } catch (error) {
    console.error('Error getting customers:', error);
    throw new Error('Failed to fetch customers');
  }
};

// Get customer by ID
export const getCustomerById = async (
  customerId: string
): Promise<Customer | null> => {
  try {
    const customerDocRef = doc(db, 'users', customerId);
    const customerDocSnap = await getDoc(customerDocRef);

    if (!customerDocSnap.exists()) {
      return null;
    }

    const data = customerDocSnap.data();
    return {
      ...data,
      id: customerDocSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Customer;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw new Error('Failed to fetch customer');
  }
};

// Search artists by specialty
export const searchArtistsBySpecialty = async (
  specialty: string
): Promise<Artist[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'artist'),
      where('approved', '==', true),
      where('specialties', 'array-contains', specialty)
    );

    const querySnapshot = await getDocs(q);
    const artists: Artist[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      artists.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Artist);
    });

    return artists;
  } catch (error) {
    console.error('Error searching artists:', error);
    throw new Error('Failed to search artists');
  }
};

// Search artists by location
export const searchArtistsByLocation = async (
  location: string
): Promise<Artist[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'artist'),
      where('approved', '==', true),
      where('location', '==', location)
    );

    const querySnapshot = await getDocs(q);
    const artists: Artist[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      artists.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Artist);
    });

    return artists;
  } catch (error) {
    console.error('Error searching artists by location:', error);
    throw new Error('Failed to search artists');
  }
};

// Get top-rated artists
export const getTopRatedArtists = async (
  limitCount = 10
): Promise<Artist[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'artist'),
      where('approved', '==', true),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const artists: Artist[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      artists.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Artist);
    });

    return artists;
  } catch (error) {
    console.error('Error getting top rated artists:', error);
    throw new Error('Failed to fetch top rated artists');
  }
};
