import React from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
}

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
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