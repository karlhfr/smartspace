// src/components/AnalyticsDashboard.tsx
import React, { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/analytics';

interface AnalyticsData {
  customerAcquisition: number;
  projectCompletions: number;
  totalRevenue: number;
  averageSatisfaction: number;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      const data = await getAnalytics();
      setAnalytics(data);
    }
    fetchAnalytics();
  }, []);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">New Customers</h3>
        <p className="text-2xl font-bold">{analytics.customerAcquisition}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Completed Projects</h3>
        <p className="text-2xl font-bold">{analytics.projectCompletions}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-2xl font-bold">£{analytics.totalRevenue.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Average Satisfaction</h3>
        <p className="text-2xl font-bold">{analytics.averageSatisfaction.toFixed(1)} / 5</p>
      </div>
    </div>
  );
}