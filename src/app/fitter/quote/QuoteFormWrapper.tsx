import { Suspense } from 'react';
import QuoteForm from './QuoteForm';

export default function QuoteFormWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteForm />
    </Suspense>
  );
}
