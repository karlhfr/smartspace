// src/lib/notifications.ts
import { db } from './firebase';
import { sendEmail } from './emailService'; // You'll need to implement this

export async function createNotification(userId: string, message: string, type: 'survey' | 'quote' | 'message') {
  const notificationRef = db.collection('notifications').doc();
  await notificationRef.set({
    userId,
    message,
    type,
    createdAt: new Date(),
    read: false
  });

  // Send email notification
  const user = await db.collection('users').doc(userId).get();
  const userEmail = user.data()?.email;
  if (userEmail) {
    await sendEmail(userEmail, 'New Notification', message);
  }
}

export async function getNotifications(userId: string) {
  const snapshot = await db.collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}