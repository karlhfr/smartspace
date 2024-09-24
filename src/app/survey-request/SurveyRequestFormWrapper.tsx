import { Suspense } from 'react';
import SurveyRequestForm from './SurveyRequestForm';

export default function SurveyRequestFormWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyRequestForm />
    </Suspense>
  );
}
