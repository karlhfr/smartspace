'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit button pressed')
    setError(null)
    setLoading(true)

    try {
      console.log('Attempting to sign in with email and password')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Sign-in successful', user)

      console.log('Fetching fitter data')
      const fittersRef = collection(db, 'Fitters')
      const q = query(fittersRef, where("email", "==", email))
      const querySnapshot = await getDocs(q)

      let fitterData
      if (querySnapshot.empty) {
        console.log('Fitter profile not found, creating one')
        fitterData = {
          id: user.uid,
          email: user.email,
          company_name: 'Default Company',
          fitter_first_name: 'Default',
          fitter_last_name: 'Fitter',
          fitter_address: 'Default Address',
          phone: 'Default Phone',
          service_radius: 0,
          fitter_rating: 0
        }
        await setDoc(doc(db, 'Fitters', user.uid), fitterData)
      } else {
        fitterData = querySnapshot.docs[0].data()
      }

      console.log('Fitter data received', fitterData)

      console.log('Storing fitter data in localStorage')
      localStorage.setItem('fitterData', JSON.stringify(fitterData))

      console.log('Redirecting to dashboard')
      router.push('/fitter-dashboard')
    } catch (err) {
      console.error('Sign-in error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}