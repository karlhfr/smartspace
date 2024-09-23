import { useState } from 'react'
import { createSurveyRequest } from '../utils/createSurvey'

export default function SurveyRequestForm({ fitterId, fitterCompanyName }) {
  const [formData, setFormData] = useState({
    // ... other form fields
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const surveyId = await createSurveyRequest({
        ...formData,
        fitterId,
        fitterCompanyName,
      })
      // Handle successful submission (e.g., show success message, redirect)
    } catch (error) {
      // Handle error (e.g., show error message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Render your form fields here */}
      <input type="hidden" name="fitterId" value={fitterId} />
      <input type="hidden" name="fitterCompanyName" value={fitterCompanyName} />
      {/* ... other form fields */}
      <button type="submit">Submit Survey Request</button>
    </form>
  )
}