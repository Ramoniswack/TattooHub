import { create } from 'zustand';
import { AppStore, Booking } from '@/types';
import { mockArtists, mockCustomers, mockBookings } from '@/data/mockData';

export const useAppStore = create<AppStore>((set, get) => ({
  artists: mockArtists,
  customers: mockCustomers,
  bookings: mockBookings,
  selectedArtist: null,

  setSelectedArtist: (artist) => set({ selectedArtist: artist }),

  addBooking: (bookingData) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    set(state => ({
      bookings: [...state.bookings, newBooking]
    }));
  },

  updateBookingStatus: (bookingId, status) => {
    set(state => ({
      bookings: state.bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    }));
  },

  approveArtist: (artistId) => {
    set(state => ({
      artists: state.artists.map(artist =>
        artist.id === artistId ? { ...artist, approved: true } : artist
      )
    }));
  },

  updateArtistProfile: (artistId, updates) => {
    set(state => ({
      artists: state.artists.map(artist =>
        artist.id === artistId ? { ...artist, ...updates } : artist
      )
    }));
  },

  deleteUser: (userId, role) => {
    set(state => {
      if (role === 'artist') {
        return {
          artists: state.artists.filter(artist => artist.id !== userId)
        };
      } else if (role === 'customer') {
        return {
          customers: state.customers.filter(customer => customer.id !== userId)
        };
      }
      return state;
    });
  }
}));