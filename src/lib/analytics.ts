import { db, collection, getDocs, query, where, Firestore, addDoc, serverTimestamp } from './firebase';

interface Event {
  eventType: string;
  data: any;
  timestamp: any;
}

export async function logEvent(eventType: string, data: any) {
  const eventRef = collection(db as Firestore, 'events');
  await addDoc(eventRef, {
    eventType,
    data,
    timestamp: serverTimestamp(),
  });
}

export async function getAnalytics() {
  const eventsSnapshot = await getDocs(collection(db as Firestore, 'events'));
  const events: Event[] = eventsSnapshot.docs.map(doc => doc.data() as Event);

  const customerAcquisition = events.filter(e => e.eventType === 'new_customer').length;
  const projectCompletions = events.filter(e => e.eventType === 'project_completed').length;
  const totalRevenue = events
    .filter(e => e.eventType === 'payment_received')
    .reduce((sum, e) => sum + (e.data.amount || 0), 0);
  const averageSatisfaction = events
    .filter(e => e.eventType === 'customer_rating')
    .reduce((sum, e) => sum + (e.data.rating || 0), 0) / events.length || 0;

  return {
    customerAcquisition,
    projectCompletions,
    totalRevenue,
    averageSatisfaction,
  };
}