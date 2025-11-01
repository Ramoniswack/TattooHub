# TattooHub

<div align="center">
  
  **Premium Tattoo Artist Booking Platform**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![React](https://img.shields.io/badge/React-19.0%2B-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0%2B-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![Firebase](https://img.shields.io/badge/Firebase-10.0%2B-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## Overview

TattooHub is a modern, comprehensive platform that connects tattoo artists with customers, revolutionizing the tattoo booking experience. Our platform provides seamless artist discovery, booking management, portfolio showcasing, and review systems, creating a vibrant community for tattoo enthusiasts.

## Key Features

### For Customers

- **Artist Discovery** - Browse and search verified tattoo artists
- **Advanced Filtering** - Search by location, specialty, rating, and price
- **Booking System** - Schedule appointments with real-time availability
- **Portfolio Viewing** - Explore artist portfolios with high-quality images
- **Review System** - Read and write reviews for completed bookings
- **Booking Management** - Reschedule, edit, or cancel bookings
- **Favorite Artists** - Save and track your favorite artists
- **Personalized Dashboard** - Track booking history and reviews

### For Artists

- **Professional Profiles** - Showcase your work and expertise
- **Portfolio Management** - Upload and organize your tattoo portfolio
- **Availability Control** - Set your working hours by day of the week
- **Booking Dashboard** - Manage incoming bookings and appointments
- **Review Analytics** - Track ratings and customer feedback
- **Profile Customization** - Update bio, specialties, hourly rates
- **Cover Photos** - Professional profile presentation

### For Admins

- **Comprehensive Dashboard** - Monitor platform statistics
- **Artist Management** - Approve, edit, or remove artist profiles
- **Customer Management** - View customer details, bookings, and reviews
- **Booking Oversight** - Track and manage all platform bookings
- **Data Migration Tools** - Import and sync user data
- **Admin Creation** - Manage admin user accounts

### Smart Features

- **Real-time Updates** - Live booking status changes
- **Secure Authentication** - Firebase Authentication with multiple providers
- **Responsive Design** - Seamless experience across all devices
- **Image Optimization** - Base64 image storage for fast loading
- **Dark/Light Themes** - Customizable visual experience
- **Type Safety** - Full TypeScript implementation

## Quick Start

### Prerequisites

- Node.js 18.0+
- npm or yarn package manager
- Firebase account
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/BGTechs/tabs-frontend-Ramoniswack.git
   cd tabs-frontend-Ramoniswack/tattoohub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   ```

4. **Setup Firebase Database Rules**

   Deploy the `database.rules.json` to your Firebase Realtime Database:

   ```bash
   firebase deploy --only database
   ```

5. **Launch Application**

   ```bash
   npm run dev
   ```

   Visit: `http://localhost:3000`

## Technology Stack

### Frontend Framework

- **Next.js 15** - React framework with server-side rendering
- **React 19** - Modern component-based architecture
- **TypeScript** - Type-safe development
- **Turbopack** - Next-generation bundler for fast development

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Beautiful icon library
- **Radix UI** - Accessible component primitives

### Backend & Database

- **Firebase Firestore** - Primary NoSQL database
- **Firebase Realtime Database** - Real-time data synchronization
- **Firebase Authentication** - User authentication system
- **Firebase Storage** - Image and file storage

### State Management

- **Zustand** - Lightweight state management
- **React Hooks** - Built-in state management

### Additional Libraries

- **date-fns** - Modern date utility library
- **React Hook Form** - Form validation and handling
- **Zod** - Schema validation

## Design Philosophy

TattooHub features a modern, professional design with:

- **Gradient Themes** - Beautiful teal and purple color schemes
- **Card-Based Layout** - Clean, organized content presentation
- **Glassmorphism Effects** - Modern UI aesthetics
- **Smooth Animations** - Polished user interactions
- **Responsive Grid System** - Adaptive layouts for all screen sizes
- **Professional Typography** - Clear and readable fonts

## Project Structure

```
tattoohub/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin dashboard
│   │   ├── artist/            # Artist dashboard
│   │   ├── auth/              # Authentication pages
│   │   ├── customer/          # Customer pages
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   ├── artist/            # Artist-specific components
│   │   ├── auth/              # Authentication components
│   │   ├── customer/          # Customer-specific components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utilities and libraries
│   │   ├── firebase/          # Firebase configuration
│   │   └── stores/            # Zustand state stores
│   ├── types/                 # TypeScript type definitions
│   └── data/                  # Mock data and constants
├── public/                    # Static assets
├── database.rules.json        # Firebase database rules
└── package.json              # Project dependencies
```

## Performance Metrics

### Frontend Performance

- Lightning-fast page loads with Next.js 15
- Optimized image handling with base64 encoding
- Server-side rendering for improved SEO
- Efficient component rendering with React 19
- Fast development with Turbopack

### User Experience

- Instant navigation with client-side routing
- Real-time booking updates
- Smooth animations and transitions
- Mobile-first responsive design
- Accessible UI components

### Code Quality

- 100% TypeScript for type safety
- Modular component architecture
- Clean code principles
- ESLint and Prettier configured
- Comprehensive error handling

## Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm start`       | Start production server  |
| `npm run lint`    | Run ESLint               |
| `npm run preview` | Preview production build |

## Firebase Collections & Structure

### Firestore Collections

- **users** - User profiles (all roles)
- **artists** - Artist-specific data
- **customers** - Customer-specific data
- **bookings** - Booking information
- **reviews** - Review and rating data

### Realtime Database Structure

```
/
├── artists/          # Artist profiles for browse
├── customers/        # Customer data for admin
├── bookings/         # Real-time booking updates
├── reviews/          # Customer reviews
└── users/            # User account data
```

## API Integration

### Firebase Authentication

- Email/Password authentication
- Google Sign-In (optional)
- User session management
- Role-based access control

### Database Operations

- CRUD operations for all entities
- Real-time data synchronization
- Indexed queries for performance
- Transaction support for bookings

## User Roles & Permissions

### Customer

- Browse artists
- Book appointments
- Write reviews
- Manage bookings
- View booking history

### Artist

- Manage profile and portfolio
- Set availability schedules
- Accept/reject bookings
- View booking history
- Track reviews and ratings

### Admin

- Manage all users
- Approve artist registrations
- Monitor platform activity
- Access all bookings and reviews
- Data migration tools

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## System Requirements

### Development

- Node.js 18.0 or higher
- npm 9.0 or higher
- 4GB RAM minimum
- Modern web browser

### Production

- Node.js 18.0 or higher
- Firebase project with Blaze plan
- HTTPS-enabled domain
- 1GB RAM minimum

## Contributing

We welcome contributions to TattooHub! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write clean, documented code
- Test your changes thoroughly
- Follow existing code style
- Use conventional commits
- Update documentation as needed
- Ensure responsive design

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

### Authentication & Authorization

- Secure Firebase Authentication
- Role-based access control
- Session management
- Input validation and sanitization

### Data Protection

- Encrypted data transmission (HTTPS)
- Secure image storage
- User privacy protection
- Firebase security rules

### Configuration Management

- Environment variables for sensitive data
- `.env.local` excluded from git
- Firebase configuration secured
- API keys protected

### Setup

```bash
# Copy environment template
cp .env.example .env.local

# Fill in your Firebase credentials
# NEVER commit .env.local to git
```

## Troubleshooting

### Common Issues

**Customers showing 0 in admin dashboard:**

- Run the customer migration tool at `/admin/debug-customers`
- Click "Migrate Firestore → Realtime DB"

**Authentication errors:**

- Verify Firebase configuration in `.env.local`
- Check Firebase Authentication is enabled
- Ensure email/password provider is active

**Images not loading:**

- Check file size (max 200KB)
- Ensure base64 conversion is working
- Verify Firebase Storage rules

**Build errors:**

- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run build`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend infrastructure
- Tailwind CSS team for the utility-first CSS approach
- shadcn/ui for beautiful, accessible components
- Lucide team for comprehensive icon library
- Zustand team for simple state management
- Open source contributors worldwide

## Roadmap

### Upcoming Features

- [ ] Email notifications for bookings
- [ ] SMS reminders
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Artist certification system
- [ ] Booking calendar view
- [ ] Chat system between artists and customers
- [ ] Mobile app (React Native)

## Contact & Support

For questions, suggestions, or support:

- Create an issue on [GitHub](https://github.com/BGTechs/tabs-frontend-Ramoniswack/issues)
- Check documentation and FAQ
- Review existing issues and discussions

---

<div align="center">

<i>© 2024 TattooHub. All rights reserved.</i>

</div>
