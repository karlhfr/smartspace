import { useState, useEffect } from 'react'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const db = getFirestore()

export default function FitterDashboard({ fitterId }) {
  const [surveys, setSurveys] = useState([])

  useEffect(() => {
    const fetchSurveys = async () => {
      const surveysRef = collection(db, 'Surveys')
      const q = query(surveysRef, where('fitterId', '==', fitterId))
      const querySnapshot = await getDocs(q)
      const surveyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSurveys(surveyData)
    }

    fetchSurveys()
  }, [fitterId])

  return (
    <div>
      <h2>Your Survey Requests</h2>
      {surveys.length === 0 ? (
        <p>No survey requests at the moment.</p>
      ) : (
        <ul>
          {surveys.map(survey => (
            <li key={survey.id}>
              {/* Display survey details */}
              <p>Customer: {survey.customerName}</p>
              <p>Status: {survey.status}</p>
              {/* Add more survey details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}