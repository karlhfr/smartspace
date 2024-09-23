// src/lib/notifications.ts
import { db, collection, doc, getDocs, query, where, Firestore, addDoc, serverTimestamp } from './firebase';
import { getDoc, orderBy } from 'firebase/firestore';
// Remove or comment out the emailService import if it's not implemented yet
// import { sendEmail } from './emailService';

export async function createNotification(userId: string, message: string) {
  const notificationRef = collection(db as Firestore, 'notifications');
  await addDoc(notificationRef, {
    userId,
    message,
    read: false,
    createdAt: serverTimestamp(),
  });

  // Fetch user's email
  const userDoc = await getDoc(doc(db as Firestore, 'users', userId));
  const userEmail = userDoc.data()?.email;

  // Uncomment this when you have implemented the email service
  // if (userEmail) {
  //   await sendEmail(userEmail, 'New Notification', message);
  // }
}

export async function getNotifications(userId: string) {
  const notificationsQuery = query(
    collection(db as Firestore, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(notificationsQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}