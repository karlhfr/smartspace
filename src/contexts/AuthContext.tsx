'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { app, db } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  userRole: 'admin' | 'fitter' | null
  isAdmin: boolean
  loading: boolean
  logout: () => Promise<void>
  checkAdminStatus: (user: User) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  isAdmin: false,
  loading: true,
  logout: async () => {},
  checkAdminStatus: async () => false,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'fitter' | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdminStatus = async (currentUser: User) => {
    console.log('Checking admin status for user:', currentUser.email)
    if (currentUser.email === 'bookings@smartspacestairs.co.uk') {
      console.log('Admin email detected')
      return true
    }
    try {
      const userDoc = await getDoc(doc(db, 'Fitters', currentUser.uid))
      console.log('Firestore document exists:', userDoc.exists())
      if (userDoc.exists()) {
        const userData = userDoc.data()
        console.log('User data:', userData)
        return userData.isAdmin || false
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
    return false
  }

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed. User:', currentUser?.email)
      setUser(currentUser)
      if (currentUser) {
        const adminStatus = await checkAdminStatus(currentUser)
        setIsAdmin(adminStatus)
        setUserRole(adminStatus ? 'admin' : 'fitter')
        console.log('User role:', adminStatus ? 'admin' : 'fitter', 'Is admin:', adminStatus)
      } else {
        setUserRole(null)
        setIsAdmin(false)
        console.log('User logged out')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    const auth = getAuth(app)
    try {
      await signOut(auth)
      setUser(null)
      setUserRole(null)
      setIsAdmin(false)
      console.log('User logged out')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userRole, isAdmin, loading, logout, checkAdminStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)