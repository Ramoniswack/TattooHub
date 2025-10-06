// Authentication functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, update } from 'firebase/database';
import { auth, db, database } from './config';
import { User, Artist } from '@/types';
import { createArtist } from './database';

// Sign up new user
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: {
    name: string;
    role: 'artist' | 'customer' | 'admin';
    bio?: string;
    location?: string;
    specialties?: string[];
    hourlyRate?: number;
    avatar?: string;
    coverPhoto?: string;
  }
): Promise<User> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, {
      displayName: userData.name,
    });

    const userDoc: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: userData.name,
      role: userData.role,
      createdAt: new Date(),
      ...(userData.bio && { bio: userData.bio }),
      ...(userData.location && { location: userData.location }),
      ...(userData.specialties && { specialties: userData.specialties }),
      ...(userData.avatar && { avatar: userData.avatar }),
      ...(userData.coverPhoto && { coverPhoto: userData.coverPhoto }),
    };

    if (userData.role === 'artist') {
      const artistAvatar = userData.avatar || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0D8ABC&color=fff`;
      Object.assign(userDoc, {
        portfolio: [],
        rating: 0,
        totalReviews: 0,
        hourlyRate: userData.hourlyRate || 50,
        approved: false,
        avatar: artistAvatar,
        ...(userData.coverPhoto && { coverPhoto: userData.coverPhoto }),
      });
    }

    // Save to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userDoc,
      createdAt: serverTimestamp(),
    });

    // If artist, also save to Realtime Database for browse functionality
    if (userData.role === 'artist') {
      await createArtist(userDoc as Artist);
    }

    return userDoc;
  } catch (error) {
    console.error('Error signing up:', error);
    const err = error as { message?: string };
    throw new Error(err.message || 'Failed to sign up');
  }
};

// Sign in existing user
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDocSnap.data() as User;

    return {
      ...userData,
      id: firebaseUser.uid,
      email: firebaseUser.email!,
    };
  } catch (error) {
    console.error('Error signing in:', error);
    const err = error as { code?: string; message?: string };
    
    if (err.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (err.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (err.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    
    throw new Error(err.message || 'Failed to sign in');
  }
};

// Sign out current user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    const err = error as { message?: string };
    throw new Error(err.message || 'Failed to sign out');
  }
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<User | null> => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return null;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return null;
    }

    const userData = userDocSnap.data() as User;

    return {
      ...userData,
      id: currentUser.uid,
      email: currentUser.email!,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Listen for auth state changes
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const profile = await getCurrentUserProfile();
      callback(profile);
    } else {
      callback(null);
    }
  });
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    const err = error as { code?: string; message?: string };
    
    if (err.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    }
    
    throw new Error(err.message || 'Failed to send password reset email');
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<void> => {
  try {
    // Remove undefined values from updates (Firestore doesn't accept undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanedUpdates: Record<string, any> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedUpdates[key] = value;
      }
    });

    console.log('📝 Updating profile...', cleanedUpdates);

    // Update Firestore (primary database)
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, cleanedUpdates, { merge: true });
    console.log('✅ Firestore updated');

    // Get current user role to determine if we need to update artists collection
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const userRole = userData?.role;

    // Update Realtime Database in background (non-blocking)
    // Don't await this - let it happen in background
    const userRef = ref(database, `users/${userId}`);
    update(userRef, cleanedUpdates).catch(err => {
      console.warn('⚠️ Realtime DB update failed (non-critical):', err);
    });

    // If user is an artist, also update the artists collection
    // This is needed for the browse page to show updated photos
    if (userRole === 'artist') {
      const artistRef = ref(database, `artists/${userId}`);
      update(artistRef, cleanedUpdates).catch(err => {
        console.warn('⚠️ Artists DB update failed (non-critical):', err);
      });
      console.log('📸 Artist collection updated with photos');
    }

    console.log('✅ Profile update complete');
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    const err = error as { message?: string };
    throw new Error(err.message || 'Failed to update profile');
  }
};

// Sign in with Google
export const signInWithGoogle = async (
  role: 'artist' | 'customer' | 'admin' = 'customer'
): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // User exists, return their data
      const userData = userDocSnap.data() as User;
      return {
        ...userData,
        id: firebaseUser.uid,
        email: firebaseUser.email!,
      };
    } else {
      // New user, create profile
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: role,
        avatar: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
      };

      // Add default fields based on role
      if (role === 'artist') {
        Object.assign(newUser, {
          portfolio: [],
          rating: 0,
          totalReviews: 0,
          hourlyRate: 50,
          approved: false,
          bio: '',
          location: '',
          specialties: [],
        });
      }

      await setDoc(userDocRef, {
        ...newUser,
        createdAt: serverTimestamp(),
      });

      // If artist, also save to Realtime Database for browse functionality
      if (role === 'artist') {
        await createArtist(newUser as Artist);
      }

      return newUser;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    const err = error as { message?: string };
    throw new Error(err.message || 'Failed to sign in with Google');
  }
};
