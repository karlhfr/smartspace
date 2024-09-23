// src/components/BlogList.tsx
import React, { useState, useEffect } from 'react';
import { getBlogPosts } from '@/lib/blog';
import Link from 'next/link';

export function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getBlogPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-500">{post.category} | {post.author}</p>
          <Link href={`/blog/${post.id}`}>
            <a className="text-blue-500 hover:underline">Read more</a>
          </Link>
        </div>
      ))}
    </div>
  );
}