'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, User, Calendar, Settings, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { signOutUser } from '@/lib/firebase/auth';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      router.push('/');
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'customer':
        return '/customer/browse';
      case 'artist':
        return '/artist/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getProfileLink = () => {
    switch (user?.role) {
      case 'customer':
        return '/customer/profile';
      case 'artist':
        return '/artist/profile';
      case 'admin':
        return '/admin/profile';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:shadow-teal-600/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              TattooHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/customer/browse" className="px-4 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium">
              Browse Artists
            </Link>
            <Link href="/auth/signup?role=artist" className="px-4 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium">
              Become an Artist
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium dark:text-gray-200">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={getProfileLink()}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'customer' && (
                    <DropdownMenuItem asChild>
                      <Link href="/customer/bookings">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/add-admin">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Add Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="text-slate-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800 font-medium">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all duration-300">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-b-2xl shadow-lg">
              <Link
                href="/customer/browse"
                className="block px-3 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Artists
              </Link>
              <Link
                href="/auth/signup?role=artist"
                className="block px-3 py-2 rounded-lg text-slate-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become an Artist
              </Link>
              {!isAuthenticated && (
                <div className="pt-4 flex flex-col space-y-2">
                  <Button variant="ghost" asChild className="justify-start hover:bg-teal-50 dark:hover:bg-gray-800">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="justify-start bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                    <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
