import { Artist, Customer, Booking } from '@/types';

export const mockArtists: Artist[] = [
  {
    id: '1',
    email: 'sanjay.gurung@gmail.com',
    name: 'Sanjay Gurung',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Realism and geometric specialist with 8+ years of studio experience in Kathmandu.',
    location: 'Kathmandu, Bagmati',
    specialties: ['Realistic', 'Portraits', 'Black & Gray'],
    portfolio: [
      'https://images.pexels.com/photos/1616383/pexels-photo-1616383.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1616407/pexels-photo-1616407.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 4.8,
    totalReviews: 156,
    hourlyRate: 120,
    availability: {
      monday: [{ start: '10:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '18:00' }],
      wednesday: [{ start: '10:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '20:00' }],
      saturday: [{ start: '12:00', end: '18:00' }]
    },
    approved: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'aayusha.shrestha@outlook.com',
    name: 'Aayusha Shrestha',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Traditional & neo-traditional with bold colours. Based in Pokhara Lakeside.',
    location: 'Pokhara, Gandaki',
    specialties: ['Traditional', 'Neo-Traditional', 'Color Work'],
    portfolio: [
      'https://images.pexels.com/photos/1616384/pexels-photo-1616384.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1616385/pexels-photo-1616385.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1616386/pexels-photo-1616386.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 4.9,
    totalReviews: 203,
    hourlyRate: 140,
    availability: {
      tuesday: [{ start: '11:00', end: '19:00' }],
      wednesday: [{ start: '11:00', end: '19:00' }],
      thursday: [{ start: '11:00', end: '19:00' }],
      friday: [{ start: '11:00', end: '21:00' }],
      saturday: [{ start: '10:00', end: '18:00' }],
      sunday: [{ start: '12:00', end: '17:00' }]
    },
    approved: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    email: 'bibek.thapa@proton.me',
    name: 'Bibek Thapa',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Minimalist & fine-line tattoos with clean, delicate detail. Studio in Lalitpur.',
    location: 'Lalitpur, Bagmati',
    specialties: ['Minimalist', 'Fine Line', 'Geometric'],
    portfolio: [
      'https://images.pexels.com/photos/1616387/pexels-photo-1616387.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1616388/pexels-photo-1616388.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1616389/pexels-photo-1616389.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 4.7,
    totalReviews: 89,
    hourlyRate: 95,
    availability: {
      monday: [{ start: '12:00', end: '20:00' }],
      wednesday: [{ start: '12:00', end: '20:00' }],
      friday: [{ start: '12:00', end: '20:00' }],
      saturday: [{ start: '10:00', end: '16:00' }]
    },
    approved: false,
    createdAt: new Date('2024-02-15')
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '4',
    email: 'prerana.adhikari@gmail.com',
    name: 'Prerana Adhikari',
    role: 'customer',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+977-9812345678',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '5',
    email: 'roshan.kc@yahoo.com',
    name: 'Roshan KC',
    role: 'customer',
    avatar: 'https://images.pexels.com/photos/2379006/pexels-photo-2379006.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+977-9807654321',
    createdAt: new Date('2024-02-05')
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    customerId: '4',
    artistId: '1',
    date: '2024-03-15',
    time: '14:00',
    duration: 2,
    description: 'Realistic portrait on forearm',
    status: 'confirmed',
    price: 240,
    createdAt: new Date('2024-03-01')
  },
  {
    id: '2',
    customerId: '5',
    artistId: '2',
    date: '2024-03-20',
    time: '16:00',
    duration: 3,
    description: 'Neo-traditional rose on shoulder',
    status: 'pending',
    price: 420,
    createdAt: new Date('2024-03-05')
  }
];
