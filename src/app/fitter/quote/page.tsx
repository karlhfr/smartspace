'use client'

import React, { Suspense } from 'react';
import QuoteForm from './QuoteForm';

function QuotePage() {
  return <QuoteForm />;
}

export default function Page() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <QuotePage />
      </Suspense>
    );
  }

  return <QuotePage />;
}