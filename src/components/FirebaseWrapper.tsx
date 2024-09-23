'use client'

import { FirebaseProvider } from '@/contexts/FirebaseContext'

export default function FirebaseWrapper({ children }: { children: React.ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>
}