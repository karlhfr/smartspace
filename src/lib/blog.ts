import { db, collection, doc, getDocs, query, orderBy, where, Firestore } from './firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';

export async function createBlogPost(postData: any) {
  const postRef = collection(db as Firestore, 'blogPosts');
  await addDoc(postRef, {
    ...postData,
    createdAt: serverTimestamp(),
  });
}

export async function getBlogPosts(category?: string) {
  let blogQuery = query(collection(db as Firestore, 'blogPosts'), orderBy('createdAt', 'desc'));

  if (category) {
    blogQuery = query(blogQuery, where('category', '==', category));
  }

  const snapshot = await getDocs(blogQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}