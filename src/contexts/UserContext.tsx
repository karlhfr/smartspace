'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, User, doc, getDoc } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  company_name: string;
  contact_name: string;
  phone: string;
  address: string;
  service_radius: number;
  is_active: boolean;
  rating: number;
  total_reviews: number;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true });

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const fitterDoc = await getDoc(doc(db, 'Fitters', firebaseUser.uid));
        if (fitterDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            ...(fitterDoc.data() as Omit<UserData, 'uid' | 'email'>)
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);