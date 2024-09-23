'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Maximize2, Shield, Clock, Wrench, Palette, Box, Check, Lock, PaintBucket, Star, Zap } from 'lucide-react'
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
    <CardHeader>
      <Icon className="h-10 w-10 mb-2 text-primary" />
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
)

interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, rating, comment }) => (
  <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
    <CardHeader>
      <CardTitle className="flex items-center">
        {name}
        <span className="ml-2 text-yellow-400">{'★'.repeat(rating)}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>"{comment}"</CardDescription>
    </CardContent>
  </Card>
)

interface Review {
  author_name: string
  rating: number
  text: string
}

export default function StandardInstallPage() {
  const [surveyOption, setSurveyOption] = useState<'smartspace' | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews')
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        const data = await response.json()
        setReviews(data)
      } catch (err) {
        setError('Failed to load reviews')
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleSurveyOption = (option: 'smartspace') => {
    setSurveyOption(option)
    router.push('/survey-request?smartspace=true')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center space-y-4"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                  Smart Space Standard Install
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Transform your under-stair space into a functional storage solution.
                </p>
                <Button size="lg" onClick={() => handleSurveyOption('smartspace')} className="bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
                  Request Smart Space Survey
                </Button>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/smartspace.jpg"
                  alt="Smart Space Standard Install"
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
              Key Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={Maximize2}
                title="Two Lifting Steps"
                description="Seamlessly integrated storage solution"
              />
              <FeatureCard 
                icon={Shield}
                title="Bespoke Frame"
                description="Custom-made to fit your unique space"
              />
              <FeatureCard 
                icon={Zap}
                title="Gas Struts"
                description="Smooth and effortless operation"
              />
              <FeatureCard 
                icon={Clock}
                title="Quick Installation"
                description="Completed in just 1-2 hours"
              />
              <FeatureCard 
                icon={Palette}
                title="Existing Carpet Use"
                description="Seamless integration with your current flooring"
              />
              <FeatureCard 
                icon={Lock}
                title="Child-Friendly Design"
                description="Prioritizing safety with robust frame and smooth mechanism"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
              See It In Action
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/1.jpg"
                  alt="Smart Space Standard Install - Before"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/2.jpg"
                  alt="Smart Space Standard Install - After"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
              Benefits & Advantages
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Box className="h-5 w-5 mr-2 text-primary" />
                    Maximize Space
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Utilize wasted under-stair space effectively</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <PaintBucket className="h-5 w-5 mr-2 text-primary" />
                    Seamless Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Blends perfectly with existing staircase design</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    25-Year Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Long-term peace of mind assured</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Wrench className="h-5 w-5 mr-2 text-primary" />
                    Professional Install
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Expert setup by our skilled team</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-12 text-center">
              Customer Reviews
            </h2>
            {loading ? (
              <div className="text-center">Loading reviews...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.slice(0, 3).map((review, index) => (
                  <ReviewCard 
                    key={index}
                    name={review.author_name}
                    rating={review.rating}
                    comment={review.text}
                  />
                ))}
              </div>
            )}
            <div className="mt-8 text-center">
              <a 
                href="https://www.google.com/maps/place/?q=place_id:YOUR_PLACE_ID"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                See more reviews on Google
              </a>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
              Ready to Maximize Your Space?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your under-stair area into a functional storage solution today.
            </p>
            <Button size="lg" onClick={() => handleSurveyOption('smartspace')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Request Smart Space Survey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}