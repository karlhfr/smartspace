// src/components/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { getAnalytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchAnalytics = async () => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);  // Last 30 days
        const data = await getAnalytics(user.uid, startDate, endDate);
        setAnalytics(data);
      };
      fetchAnalytics();
    }
  }, [user]);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>New Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{analytics.customerAcquisition}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{analytics.projectCompletions}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">£{analytics.totalRevenue.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Satisfaction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{analytics.averageSatisfaction.toFixed(1)} / 5</p>
        </CardContent>
      </Card>
    </div>
  );
}