export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'artist' | 'admin';
  avatar?: string;
  createdAt: Date;
  // Optional artist fields (for profile editing)
  bio?: string;
  location?: string;
  specialties?: string[];
  portfolio?: string[];
  coverPhoto?: string;
  hourlyRate?: number;
  rating?: number;
  totalReviews?: number;
  availability?: {
    [key: string]: { start: string; end: string }[];
  };
  approved?: boolean;
}

export interface Customer extends User {
  role: 'customer';
  phone?: string;
}

export interface Artist extends User {
  role: 'artist';
  bio: string;
  location: string;
  specialties: string[];
  portfolio: string[];
  coverPhoto?: string;
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  availability: {
    [key: string]: { start: string; end: string }[];
  };
  approved: boolean;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  artistId: string;
  artistName: string;
  date: string;
  time: string;
  duration: number;
  description: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
  createdAt?: Date;
  reviewed?: boolean; // Track if customer has left a review
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  artistId: string;
  artistName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  signup: (data: SignupData) => Promise<boolean>;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: User['role'];
  bio?: string;
  location?: string;
  specialties?: string[];
}

export interface AppStore {
  artists: Artist[];
  customers: Customer[];
  bookings: Booking[];
  selectedArtist: Artist | null;
  setSelectedArtist: (artist: Artist | null) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  approveArtist: (artistId: string) => void;
  updateArtistProfile: (artistId: string, updates: Partial<Artist>) => void;
  deleteUser: (userId: string, role: User['role']) => void;
}