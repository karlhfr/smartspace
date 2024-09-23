// src/lib/analytics.ts
import { db } from './firebase';

export async function trackEvent(fitterId: string, eventType: string, data: any) {
  const eventRef = db.collection('events').doc();
  await eventRef.set({
    fitterId,
    eventType,
    data,
    timestamp: new Date()
  });
}

export async function getAnalytics(fitterId: string, startDate: Date, endDate: Date) {
  const eventsSnapshot = await db.collection('events')
    .where('fitterId', '==', fitterId)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  const events = eventsSnapshot.docs.map(doc => doc.data());

  // Calculate metrics
  const customerAcquisition = events.filter(e => e.eventType === 'new_customer').length;
  const projectCompletions = events.filter(e => e.eventType === 'project_completed').length;
  const totalRevenue = events
    .filter(e => e.eventType === 'payment_received')
    .reduce((sum, e) => sum + e.data.amount, 0);
  const averageSatisfaction = events
    .filter(e => e.eventType === 'customer_rating')
    .reduce((sum, e) => sum + e.data.rating, 0) / events.length || 0;

  return {
    customerAcquisition,
    projectCompletions,
    totalRevenue,
    averageSatisfaction
  };
}