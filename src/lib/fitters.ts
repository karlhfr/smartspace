import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

export async function getFitterDetails(fitterId: string) {
  try {
    console.log(`Attempting to fetch fitter with ID: ${fitterId}`)
    
    // First, try to fetch by document ID
    const fitterRef = doc(db, 'Fitters', fitterId)
    const fitterDoc = await getDoc(fitterRef)

    if (fitterDoc.exists()) {
      const fitterData = fitterDoc.data()
      console.log('Fitter data retrieved by document ID:', fitterData)
      return {
        id: fitterDoc.id,
        ...fitterData
      }
    }

    // If not found by document ID, try to fetch by UID
    const fittersCollection = collection(db, 'Fitters')
    const q = query(fittersCollection, where('uid', '==', fitterId))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const fitterData = querySnapshot.docs[0].data()
      console.log('Fitter data retrieved by UID:', fitterData)
      return {
        id: querySnapshot.docs[0].id,
        ...fitterData
      }
    }

    console.log(`No fitter found with ID or UID: ${fitterId}`)
    return null
  } catch (error) {
    console.error('Error fetching fitter details:', error)
    throw error
  }
}