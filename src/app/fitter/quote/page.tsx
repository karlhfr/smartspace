'use client'

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function QuotePage() {
  const searchParams = useSearchParams();

  // Your component logic here

  return (
    <div>
      {/* Your component JSX here */}
    </div>
  );
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