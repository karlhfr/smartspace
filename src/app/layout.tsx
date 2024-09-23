import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FirebaseProvider } from '@/contexts/FirebaseContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserProvider } from '@/contexts/UserContext'
import { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartSpace Stair Storage',
  description: 'Custom stair storage solutions for your home',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <AuthProvider>
            <UserProvider>
              <div className="flex flex-col min-h-screen">
                <header>
                  <Navbar />
                </header>
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </UserProvider>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}