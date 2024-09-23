import { NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fitterId = params.id
    console.log('Fetching fitter data for ID:', fitterId)

    const fitterDoc = await getDoc(doc(db, 'Fitters', fitterId))

    if (!fitterDoc.exists()) {
      console.log('Fitter not found for ID:', fitterId)
      return NextResponse.json({ error: 'Fitter not found' }, { status: 404 })
    }

    const fitterData = fitterDoc.data()
    console.log('Fitter data retrieved:', fitterData)

    // Remove sensitive information
    const { hashed_password, ...safeData } = fitterData

    return NextResponse.json(safeData)
  } catch (error) {
    console.error('Error fetching fitter data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}