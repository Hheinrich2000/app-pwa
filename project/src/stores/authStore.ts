import { create } from 'zustand';
import { AuthState, User, UserRole } from '../types';
import { auth, firestore } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithWorkerCode: (code: string) => Promise<void>;
  godModeAccess: (secretKey: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

// Simulated worker code validation (would connect to Firestore in production)
const validateWorkerCode = async (code: string): Promise<User | null> => {
  try {
    // In a real app, we would query Firestore to find a user with this worker_code
    const usersRef = firestore.collection('users');
    const snapshot = await usersRef.where('worker_code', '==', code).where('role', '==', 'worker').get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const userData = snapshot.docs[0].data() as User;
    return {
      ...userData,
      id: snapshot.docs[0].id,
      created_at: userData.created_at instanceof Date ? userData.created_at : new Date(userData.created_at)
    };
  } catch (error) {
    console.error('Error validating worker code:', error);
    return null;
  }
};

// Secret key for God Mode - in a real app, this would be more secure
const GOD_MODE_SECRET = 'super_secret_god_key_2025';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        
        if (['admin', 'god'].includes(userData.role)) {
          set({ 
            user: { ...userData, id: userCredential.user.uid },
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          await firebaseSignOut(auth);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            error: 'Invalid role. Only administrators can log in here.' 
          });
        }
      } else {
        await firebaseSignOut(auth);
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false, 
          error: 'User profile not found.' 
        });
      }
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: 'Invalid email or password.' 
      });
    }
  },

  loginWithWorkerCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const worker = await validateWorkerCode(code);
      
      if (worker) {
        set({ 
          user: worker,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false, 
          error: 'Invalid worker code.' 
        });
      }
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: 'Error logging in. Please try again.' 
      });
    }
  },

  godModeAccess: async (secretKey) => {
    set({ isLoading: true, error: null });
    
    if (secretKey === GOD_MODE_SECRET) {
      // In a real app, we would properly authenticate and fetch the god user from the database
      const godUser: User = {
        id: 'god-user-id',
        role: 'god' as UserRole,
        name: 'God Mode User',
        created_at: new Date()
      };
      
      set({ 
        user: godUser,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: 'Invalid access key.' 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // For worker logins (code-based), we don't need to sign out from Firebase
      if (get().user?.role !== 'worker') {
        await firebaseSignOut(auth);
      }
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Error signing out.' 
      });
    }
  },

  checkAuth: () => {
    set({ isLoading: true });
    
    // Check for saved worker session in localStorage
    const savedWorkerSession = localStorage.getItem('workerSession');
    if (savedWorkerSession) {
      try {
        const workerData = JSON.parse(savedWorkerSession) as User;
        if (workerData && workerData.role === 'worker') {
          set({ 
            user: workerData,
            isAuthenticated: true,
            isLoading: false
          });
          return;
        }
      } catch (e) {
        localStorage.removeItem('workerSession');
      }
    }
    
    // Check for Firebase auth session
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ 
              user: { ...userData, id: firebaseUser.uid },
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            error: 'Error fetching user profile.' 
          });
        }
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    });
    
    // Cleanup function for the auth listener
    return () => unsubscribe();
  }
}));