import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from '@/lib/firebase'
import { db } from '@/lib/firebase'

interface Survey {
  id: string;
  customerName: string;
  status: string;
  // Add other survey properties here
}

interface FitterDashboardProps {
  fitterId: string;
}

export default function FitterDashboard({ fitterId }: FitterDashboardProps) {
  const [surveys, setSurveys] = useState<Survey[]>([])

  useEffect(() => {
    const fetchSurveys = async () => {
      const surveysRef = collection(db, 'Surveys')
      const q = query(surveysRef, where('fitterId', '==', fitterId))
      const querySnapshot = await getDocs(q)
      const surveyData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Survey))
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