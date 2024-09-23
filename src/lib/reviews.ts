import { db } from '@/lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, runTransaction, serverTimestamp } from 'firebase/firestore'

interface ReviewRequestData {
  customer_name: string
  customer_email: string
  rating: number
  comment: string
  fitter_email: string
  fitter_id: string
  status: 'pending' | 'approved' | 'rejected'
}

export async function addReview(fitterId: string, reviewData: ReviewRequestData): Promise<string> {
  console.log('Starting addReview function with data:', reviewData)
  try {
    let reviewRequestId: string = '';

    await runTransaction(db, async (transaction) => {
      // Get the fitter document
      const fitterRef = doc(db, 'Fitters', fitterId)
      const fitterDoc = await transaction.get(fitterRef)

      if (!fitterDoc.exists()) {
        console.error('Fitter not found with ID:', fitterId)
        throw new Error('Fitter not found')
      }

      console.log('Fitter document found:', fitterDoc.data())

      // Add review request to ReviewRequests collection
      const reviewRequestRef = doc(collection(db, 'ReviewRequests'))
      reviewRequestId = reviewRequestRef.id
      const reviewRequestData = {
        ...reviewData,
        fitter_id: fitterId,
        created_at: serverTimestamp()
      }
      console.log('Adding review request with data:', reviewRequestData)
      transaction.set(reviewRequestRef, reviewRequestData)
    })

    console.log('Review request added successfully with ID:', reviewRequestId)
    return reviewRequestId
  } catch (error) {
    console.error('Error adding review request:', error)
    throw new Error('Failed to add review request. Please try again.')
  }
}