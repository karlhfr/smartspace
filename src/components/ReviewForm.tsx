// src/components/ReviewForm.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createReview } from '@/lib/reviews';
import { useAuth } from '@/contexts/AuthContext';

export function ReviewForm({ fitterId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await createReview(fitterId, user.uid, rating, comment);
      // Reset form or show success message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
      />
      <Button type="submit">Submit Review</Button>
    </form>
  );
}