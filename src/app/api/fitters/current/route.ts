import { NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  console.log('Received request to /api/fitters/current');
  try {
    const authHeader = request.headers.get('Authorization')
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Unauthorized: No valid Authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('Verifying token...');
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token)
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const email = decodedToken.email
    console.log('Token verified. User email:', email);

    if (!email) {
      console.error('No email found in token');
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
    }

    console.log('Fetching fitter document...');
    let fitterDoc;
    try {
      const fittersRef = db.collection('Fitters');
      const query = fittersRef.where('email', '==', email);
      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        console.error('Fitter not found for email:', email);
        return NextResponse.json({ error: 'Fitter not found' }, { status: 404 })
      }

      fitterDoc = querySnapshot.docs[0];
    } catch (error) {
      console.error('Error fetching fitter document:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log('Fitter document found');
    const fitterData = fitterDoc.data()
    // Remove sensitive information
    const { hashed_password, ...safeData } = fitterData || {}

    console.log('Returning fitter data');
    return NextResponse.json(safeData)
  } catch (error) {
    console.error('Error in /api/fitters/current:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}