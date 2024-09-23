'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { addReview } from '@/lib/reviews'
import { getFitterDetails } from '@/lib/fitters'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { StarIcon } from 'lucide-react'

interface FitterDetails {
  id: string;
  email: string;
  company_name: string;
  uid: string;
  // Add other properties as needed
}

export default function ReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const fitterId = searchParams?.get('fitter');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fitterDetails, setFitterDetails] = useState<FitterDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchFitterDetails = async () => {
      try {
        if (!fitterId) {
          throw new Error('Fitter ID not provided')
        }
        console.log('Fetching fitter details for ID:', fitterId)
        const details = await getFitterDetails(fitterId)
        if (details) {
          console.log('Fitter details fetched:', details)
          setFitterDetails(details as FitterDetails);
        } else {
          throw new Error('Fitter not found')
        }
      } catch (error) {
        console.error('Error fetching fitter details:', error)
        toast({
          title: "Error",
          description: "Failed to load fitter details. You will be redirected to the home page.",
          variant: "destructive",
        })
        setTimeout(() => router.push('/'), 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchFitterDetails()
  }, [fitterId, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || rating === 0 || !comment) {
      toast({
        title: "Error",
        description: "Please fill in all fields and provide a rating.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (!fitterDetails) {
        throw new Error("Fitter details not available")
      }
      console.log('Submitting review request with data:', {
        customer_name: name,
        customer_email: email,
        rating,
        comment,
        fitter_email: fitterDetails.email,
        fitter_id: fitterDetails.uid,
        status: 'pending'
      })
      const reviewRequestId = await addReview(fitterDetails.id, {
        customer_name: name,
        customer_email: email,
        rating,
        comment,
        fitter_email: fitterDetails.email,
        fitter_id: fitterDetails.uid,
        status: 'pending'
      })
      console.log('Review request submitted successfully with ID:', reviewRequestId)
      toast({
        title: "Success",
        description: "Your review request has been submitted and is pending approval. Thank you!",
      })
      setName('')
      setEmail('')
      setRating(0)
      setComment('')
      // Optionally, redirect to a thank you page or back to the fitter's profile
      router.push(`/fitter/${fitterDetails.id}`)
    } catch (error) {
      console.error('Error submitting review request:', error)
      toast({
        title: "Error",
        description: "Failed to submit review request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!fitterDetails) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Fitter not found</h1>
        <Button onClick={() => router.push('/')}>Return to Home</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Leave a Review</CardTitle>
          <CardDescription>
            for {fitterDetails.company_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-sm font-medium">Rating</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setRating(star)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Rate ${star} stars`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm font-medium">Your Review</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                required
                className="w-full min-h-[100px]"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}