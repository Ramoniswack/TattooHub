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
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
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
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
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
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
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
    approved: true,
    createdAt: new Date('2024-02-15')
  },
  {
    id: '4',
    email: 'priya.rai@gmail.com',
    name: 'Priya Rai',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Watercolor and abstract art specialist. Creating unique flowing designs in Biratnagar.',
    location: 'Biratnagar, Koshi',
    specialties: ['Watercolor', 'Abstract', 'Color Work'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.6,
    totalReviews: 134,
    hourlyRate: 110,
    availability: {
      monday: [{ start: '10:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
      saturday: [{ start: '12:00', end: '17:00' }]
    },
    approved: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '5',
    email: 'rajesh.maharjan@yahoo.com',
    name: 'Rajesh Maharjan',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Traditional Nepali & mandala expert. 10+ years preserving cultural art in Bhaktapur.',
    location: 'Bhaktapur, Bagmati',
    specialties: ['Mandala', 'Cultural', 'Geometric'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.9,
    totalReviews: 278,
    hourlyRate: 150,
    availability: {
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [{ start: '10:00', end: '18:00' }]
    },
    approved: true,
    createdAt: new Date('2023-11-10')
  },
  {
    id: '6',
    email: 'samiksha.tamang@outlook.com',
    name: 'Samiksha Tamang',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Japanese-style tattoos with intricate details. Dragon and koi specialist in Butwal.',
    location: 'Butwal, Lumbini',
    specialties: ['Japanese', 'Dragon', 'Koi Fish'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.8,
    totalReviews: 192,
    hourlyRate: 135,
    availability: {
      monday: [{ start: '11:00', end: '19:00' }],
      wednesday: [{ start: '11:00', end: '19:00' }],
      thursday: [{ start: '11:00', end: '19:00' }],
      saturday: [{ start: '10:00', end: '20:00' }],
      sunday: [{ start: '12:00', end: '18:00' }]
    },
    approved: true,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '7',
    email: 'nirajan.karki@proton.me',
    name: 'Nirajan Karki',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Tribal & Polynesian designs. Bold, powerful patterns in Chitwan.',
    location: 'Bharatpur, Bagmati',
    specialties: ['Tribal', 'Polynesian', 'Black Work'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.5,
    totalReviews: 67,
    hourlyRate: 100,
    availability: {
      tuesday: [{ start: '10:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
      saturday: [{ start: '11:00', end: '17:00' }]
    },
    approved: true,
    createdAt: new Date('2024-02-20')
  },
  {
    id: '8',
    email: 'sunita.limbu@gmail.com',
    name: 'Sunita Limbu',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Cover-up specialist and blackout expert. Transforming old tattoos in Dharan.',
    location: 'Dharan, Koshi',
    specialties: ['Cover-up', 'Blackout', 'Rework'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.7,
    totalReviews: 145,
    hourlyRate: 125,
    availability: {
      monday: [{ start: '10:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '18:00' }],
      wednesday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '20:00' }],
      saturday: [{ start: '12:00', end: '18:00' }]
    },
    approved: true,
    createdAt: new Date('2024-01-28')
  },
  {
    id: '9',
    email: 'dipendra.basnet@yahoo.com',
    name: 'Dipendra Basnet',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Surrealism and horror tattoos. Creating nightmares and dreams in Nepalgunj.',
    location: 'Nepalgunj, Lumbini',
    specialties: ['Surrealism', 'Horror', 'Dark Art'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.6,
    totalReviews: 98,
    hourlyRate: 115,
    availability: {
      monday: [{ start: '13:00', end: '21:00' }],
      wednesday: [{ start: '13:00', end: '21:00' }],
      friday: [{ start: '13:00', end: '21:00' }],
      saturday: [{ start: '10:00', end: '18:00' }]
    },
    approved: true,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '10',
    email: 'anisha.shakya@gmail.com',
    name: 'Anisha Shakya',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Botanical and nature-inspired tattoos. Delicate floral work in Pokhara.',
    location: 'Pokhara, Gandaki',
    specialties: ['Botanical', 'Floral', 'Nature'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.9,
    totalReviews: 221,
    hourlyRate: 130,
    availability: {
      tuesday: [{ start: '10:00', end: '18:00' }],
      wednesday: [{ start: '10:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
      saturday: [{ start: '11:00', end: '19:00' }],
      sunday: [{ start: '12:00', end: '17:00' }]
    },
    approved: true,
    createdAt: new Date('2023-12-15')
  },
  {
    id: '11',
    email: 'kiran.lama@outlook.com',
    name: 'Kiran Lama',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Dotwork and stippling master. Intricate shading techniques in Kathmandu.',
    location: 'Kathmandu, Bagmati',
    specialties: ['Dotwork', 'Stippling', 'Shading'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.8,
    totalReviews: 167,
    hourlyRate: 140,
    availability: {
      monday: [{ start: '11:00', end: '19:00' }],
      tuesday: [{ start: '11:00', end: '19:00' }],
      wednesday: [{ start: '11:00', end: '19:00' }],
      thursday: [{ start: '11:00', end: '19:00' }],
      saturday: [{ start: '10:00', end: '18:00' }]
    },
    approved: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '12',
    email: 'sabina.magar@proton.me',
    name: 'Sabina Magar',
    role: 'artist',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Script and lettering specialist. Beautiful calligraphy work in Lalitpur.',
    location: 'Lalitpur, Bagmati',
    specialties: ['Lettering', 'Script', 'Calligraphy'],
    portfolio: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616401/pexels-photo-1616401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1616402/pexels-photo-1616402.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.7,
    totalReviews: 178,
    hourlyRate: 105,
    availability: {
      tuesday: [{ start: '12:00', end: '20:00' }],
      wednesday: [{ start: '12:00', end: '20:00' }],
      thursday: [{ start: '12:00', end: '20:00' }],
      friday: [{ start: '12:00', end: '20:00' }],
      saturday: [{ start: '10:00', end: '18:00' }]
    },
    approved: true,
    createdAt: new Date('2024-01-18')
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '13',
    email: 'prerana.adhikari@gmail.com',
    name: 'Prerana Adhikari',
    role: 'customer',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+977-9812345678',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '14',
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
    customerId: '13',
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
    customerId: '14',
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
