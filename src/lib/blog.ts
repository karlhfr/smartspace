// src/lib/blog.ts
import { db } from './firebase';

export async function createBlogPost(title: string, content: string, author: string, category: string) {
  const postRef = db.collection('blogPosts').doc();
  await postRef.set({
    title,
    content,
    author,
    category,
    createdAt: new Date()
  });
}

export async function getBlogPosts(category?: string) {
  let query = db.collection('blogPosts').orderBy('createdAt', 'desc');
  if (category) {
    query = query.where('category', '==', category);
  }
  const snapshot = await query.get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}