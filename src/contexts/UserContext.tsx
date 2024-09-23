'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

interface UserContextType {
  user: {
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
  } | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const fitterDoc = await getDoc(doc(db, 'Fitters', firebaseUser.uid));
        if (fitterDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            ...fitterDoc.data() as Omit<UserContextType['user'], 'uid' | 'email'>
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