import { NextResponse } from 'next/server'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('Received signin request for email:', email)

    const fittersRef = collection(db, 'Fitters')
    const q = query(fittersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log('No fitter found with email:', email)
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const fitterDoc = querySnapshot.docs[0]
    const fitter = fitterDoc.data()

    console.log('Fitter found:', fitter)

    const passwordMatch = await bcrypt.compare(password, fitter.hashed_password)

    if (!passwordMatch) {
      console.log('Password does not match for email:', email)
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    console.log('Password match successful for email:', email)

    // Remove sensitive information before sending the fitter data
    const { hashed_password, ...safeData } = fitter

    return NextResponse.json({ message: 'Sign in successful', fitter: safeData })
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json({ message: 'An error occurred during sign-in', error: (error as Error).message }, { status: 500 })
  }
}