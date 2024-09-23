'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Phone, Mail, Eye, Camera, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  createdAt: Date
}

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: Date
  status: 'approved' | 'pending' | 'rejected'
  fitter_id: string
}

interface Fitter {
  id: string
  uid: string
  company_name: string
  email: string
  fitter_first_name: string
  fitter_last_name: string
  phone: string
  service_radius: number
  fitter_rating?: number
  latitude: number
  longitude: number
  logo_url?: string
  bio?: string
  specialties?: string[]
}

export default function FitterProfilePage() {
  const [fitter, setFitter] = useState<Fitter | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchFitterAndProjects = async () => {
      if (!id) {
        console.error('No fitter ID provided')
        setLoading(false)
        return
      }

      try {
        // Fetch fitter data
        const fitterDoc = await getDoc(doc(db, 'Fitters', id))
        if (fitterDoc.exists()) {
          const fitterData = { id: fitterDoc.id, ...fitterDoc.data() } as Fitter
          setFitter(fitterData)
          console.log('Fitter data fetched successfully:', fitterData)

          // Fetch projects data using fitter's email
          const projectsQuery = query(collection(db, 'projects'), where('fitterEmail', '==', fitterData.email))
          const projectsSnapshot = await getDocs(projectsQuery)
          const projectsData = projectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
          })) as Project[]
          setProjects(projectsData)
          console.log('Projects data fetched successfully:', projectsData)

          // Fetch reviews data using fitter's id
          const reviewsQuery = query(collection(db, 'ReviewRequests'), where('fitter_id', '==', fitterData.id))
          const reviewsSnapshot = await getDocs(reviewsQuery)
          const reviewsData = reviewsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at.toDate()
          } as Review))
          setReviews(reviewsData)
          console.log('Reviews fetched:', reviewsData.length)
        } else {
          console.log('Fitter not found')
          toast({
            title: "Error",
            description: "Fitter not found.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load fitter profile and projects. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFitterAndProjects()
  }, [id, toast])

  const handleRequestSurvey = () => {
    router.push(`/survey-request?fitter=${id}`)
  }

  const handleNextReviews = () => {
    setCurrentReviewIndex(prevIndex => Math.min(prevIndex + 3, approvedReviews.length - 3))
  }

  const handlePrevReviews = () => {
    setCurrentReviewIndex(prevIndex => Math.max(prevIndex - 3, 0))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!fitter) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Fitter not found</h1>
        <Button onClick={() => router.push('/select-fitter')}>
          Return to Fitter Selection
        </Button>
      </div>
    )
  }

  const approvedReviews = reviews.filter(review => review.status === 'approved')

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-80">
        {fitter.logo_url && (
          <Image
            src={fitter.logo_url}
            alt="Cover"
            layout="fill"
            objectFit="cover"
            className="filter blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-white text-center"
          >
            {fitter.company_name}
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative -mt-20 mb-8"
            >
              <Image
                src={fitter.logo_url || '/placeholder.svg'}
                alt={`${fitter.company_name} logo`}
                width={200}
                height={200}
                className="rounded-full border-4 border-background shadow-lg"
              />
            </motion.div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href={`tel:${fitter.phone}`} className="hover:underline">{fitter.phone}</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${fitter.email}`} className="hover:underline">{fitter.email}</a>
                </div>
                {fitter.fitter_rating !== undefined && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-primary" />
                      <span>Rating: {fitter.fitter_rating.toFixed(1)} / 5</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={i < Math.round(fitter.fitter_rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <div className="mt-4 space-y-2">
              <Button className="w-full" onClick={handleRequestSurvey}>
                <Camera className="w-4 h-4 mr-2" />
                Request Survey
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => router.push(`/review/${fitter.id}?fitter=${fitter.uid}`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About {fitter.company_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{fitter.bio || 'No bio available.'}</p>
                  {fitter.specialties && fitter.specialties.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Specialties:</h3>
                      <div className="flex flex-wrap gap-2">
                        {fitter.specialties.map((specialty, index) => (
                          <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedReviews.length > 0 ? (
                    <div className="relative">
                      <div className="flex space-x-4 overflow-x-hidden">
                        {approvedReviews.slice(currentReviewIndex, currentReviewIndex + 3).map((review) => (
                          <Card key={review.id} className="flex-shrink-0 w-full sm:w-1/3">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm">{review.customer_name}</CardTitle>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <CardDescription className="text-xs">{review.created_at.toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm line-clamp-3">{review.comment}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {currentReviewIndex > 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-0 top-1/2 transform -translate-y-1/2"
                          onClick={handlePrevReviews}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      )}
                      {currentReviewIndex < approvedReviews.length - 3 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-0 top-1/2 transform -translate-y-1/2"
                          onClick={handleNextReviews}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p>No reviews yet. Be the first to leave a review!</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Smart Space Installations</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {projects.map((project) => (
                        <div key={project.id} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                            <h3 className="text-white font-semibold mb-2">{project.title}</h3>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" className="w-full">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>{project.title}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="aspect-video relative rounded-lg overflow-hidden">
                                    <Image
                                      src={project.imageUrl}
                                      alt={project.title}
                                      layout="fill"
                                      objectFit="cover"
                                    />
                                  </div>
                                  <p>{project.description}</p>
                                  <p className="text-sm text-gray-500">
                                    Completed on: {project.createdAt.toLocaleDateString()}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No projects available yet.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}