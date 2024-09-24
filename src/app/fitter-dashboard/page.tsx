'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { auth, db, storage } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, limit, orderBy, startAfter } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Phone, Mail, Eye, FileText, Plus, Edit, User, Briefcase, MapPin, Star, Compass, Send, Check, X, ChevronLeft, ChevronRight, ClipboardList, FileQuestion, Wrench, MessageSquare, DollarSign, Search } from 'lucide-react';


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

interface FitterData {
  id: string
  fitter_id: string
  company_name: string
  email: string
  fitter_first_name: string
  fitter_last_name: string
  fitter_address: string
  phone: string
  service_radius: number
  fitter_rating: number
  logo_url?: string
  latitude: number
  longitude: number
}

interface SurveyRequest {
  id: string
  fitter_id: string
  name: string
  email: string
  phone: string
  address: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: Date
}

interface Quote {
  id: string
  fitter_id: string
  customer_name: string
  customer_address: string
  customer_email: string
  customer_phone: string
  total_price: number
  status: 'pending' | 'sent' | 'completed'
  quote_date: Date
  quote_number: string
}

interface ReviewRequest {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: Date
  status: 'pending' | 'approved' | 'rejected'
  fitter_id: string
}

interface Install {
  id: string
  fitter_id: string
  customer_name: string
  customer_address: string
  customer_email: string
  customer_phone: string
  color_option: string
  drawer_option: string
  handle_size: string
  handle_color: string
  stair_width: number
  height_of_4_steps: number
  length_of_4_steps: number
  tread_depth: number
  riser_height: number
  install_price: number
  total_price: number
  quote_number: string
  salesorder: string
  status: string
  completion_date: Date
  quote_date: Date
}

export default function FitterDashboard() {
  const [fitterData, setFitterData] = useState<FitterData | null>(null)
  const [surveyRequests, setSurveyRequests] = useState<SurveyRequest[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([])
  const [installs, setInstalls] = useState<Install[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [updatedFitterData, setUpdatedFitterData] = useState<FitterData | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user)
      } else {
        setError('User not authenticated')
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  const fetchData = async (user: any) => {
    if (!user) {
      setError('User not authenticated')
      router.push('/login')
      return
    }

    try {
      setRefreshing(true)
      const fittersRef = collection(db, 'Fitters')
      const q = query(fittersRef, where("email", "==", user.email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error('Fitter profile not found')
      }

      const fitterDoc = querySnapshot.docs[0]
      const data = { id: fitterDoc.id, ...fitterDoc.data() } as FitterData
      setFitterData(data)
      setUpdatedFitterData(data)

      // Fetch related data by fitter_id
      await fetchSurveyRequests(data.fitter_id)
      await fetchQuotes(data.fitter_id)
      await fetchReviews(data.fitter_id)
      await fetchInstalls(data.fitter_id)  // Added fetchInstalls call
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      toast({
        title: "Error",
        description: `Failed to fetch data: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchSurveyRequests = async (fitterId: string) => {
    try {
      const q = query(collection(db, 'SurveyRequests'), where('fitter_id', '==', fitterId), orderBy('created_at', 'desc'), limit(10))
      const querySnapshot = await getDocs(q)
      const requests: SurveyRequest[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        requests.push({
          id: doc.id,
          ...data,
          created_at: data.created_at.toDate(),
        } as SurveyRequest)
      })
      setSurveyRequests(requests)
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch survey requests: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      })
    }
  }

  const fetchQuotes = async (fitterId: string) => {
    try {
      const q = query(collection(db, 'Quotes'), where('fitter_id', '==', fitterId), orderBy('quote_date', 'desc'), limit(10))
      const querySnapshot = await getDocs(q)
      const fetchedQuotes: Quote[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedQuotes.push({
          id: doc.id,
          ...data,
          quote_date: data.quote_date.toDate(),
        } as Quote)
      })
      setQuotes(fetchedQuotes)
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch quotes: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      })
    }
  }

  const fetchReviews = async (fitterId: string) => {
    try {
      const q = query(collection(db, 'ReviewRequests'), where('fitter_id', '==', fitterId), orderBy('created_at', 'desc'), limit(10))
      const querySnapshot = await getDocs(q)
      const fetchedReviewRequests: ReviewRequest[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedReviewRequests.push({
          id: doc.id,
          ...data,
          created_at: data.created_at.toDate(),
        } as ReviewRequest)
      })
      setReviewRequests(fetchedReviewRequests)
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch review requests: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      })
    }
  }

  // Fetch Installs data based on fitter_id
const fetchInstalls = async (fitterId: string) => {
  try {
    console.log("Fetching installs for fitter ID:", fitterId);
    
    const q = query(
      collection(db, 'Installs'),
      where('fitter_id', '==', fitterId),
      orderBy('completion_date', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const installs = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      installs.push({
        id: doc.id,
        ...data,
        completion_date: data.completion_date.toDate(), // Ensure timestamp is converted to JS Date
        quote_date: data.quote_date.toDate(),           // Convert Firestore timestamp to Date
      });
    });

    console.log("Fetched installs:", installs);
    return installs;

  } catch (error) {
    console.error("Error fetching installs:", error);

    // Check if it's a missing Firestore index error and log the link for creating an index
    if (error instanceof Error && error.message.includes('index')) {
      console.error("Missing Firestore index. Please follow the link to set it up:", error.message);
    }
  }
};




  const handleRefresh = () => {
    const user = auth.currentUser
    if (user) {
      fetchData(user)
    } else {
      setError('User not authenticated. Please log in again.')
      router.push('/login')
    }
  }

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject', fitter_id: string) => {
  try {
    const reviewRef = doc(db, 'ReviewRequests', reviewId) // Reference to the review in Firestore
    await updateDoc(reviewRef, {
      status: action === 'approve' ? 'approved' : 'rejected'
    }) // Update the status field

    toast({
      title: `Review ${action}d successfully`,
      description: `The review has been ${action}d.`,
      variant: 'success',
    })

    // Refresh reviews after approving/rejecting
    await fetchReviews(fitter_id) // Fetch reviews based on fitter_id
  } catch (error) {
    console.error(`Error ${action}ing review:`, error)
    toast({
      title: "Error",
      description: `Failed to ${action} the review. Please try again.`,
      variant: "destructive",
    })
  }
}


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !fitterData) return null
    const fileRef = ref(storage, `company_logos/${fitterData.id}/${logoFile.name}`)
    await uploadBytes(fileRef, logoFile)
    return getDownloadURL(fileRef)
  }

  const handleUpdateProfile = async () => {
    if (!fitterData || !updatedFitterData) return
    try {
      let logoUrl = updatedFitterData.logo_url

      if (logoFile) {
        logoUrl = await uploadLogo()
      }

      const updatedData = {
        ...updatedFitterData,
        logo_url: logoUrl,
      }

      await updateDoc(doc(db, 'Fitters', fitterData.id), updatedData)
      setFitterData(updatedData)
      setEditingProfile(false)
      toast({
        title: "Profile Updated",
        description: "Your fitter profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddressUpdate = (place: { formatted_address: string; latitude: number; longitude: number }) => {
    setUpdatedFitterData(prev => {
      if (!prev) return null
      return {
        ...prev,
        fitter_address: place.formatted_address,
        latitude: place.latitude,
        longitude: place.longitude,
      }
    })
  }

  const fetchMoreData = async (type: 'surveys' | 'quotes' | 'reviews') => {
    if (!fitterData || isLoading) return
    setIsLoading(true)
    try {
      let q
      if (type === 'surveys') {
        q = query(
          collection(db, 'SurveyRequests'),
          where('fitter_id', '==', fitterData.id),
          orderBy('created_at', 'desc'),
          startAfter(lastVisible),
          limit(10)
        )
      } else if (type === 'quotes') {
        q = query(
          collection(db, 'Quotes'),
          where('fitter_id', '==', fitterData.id),
          orderBy('quote_date', 'desc'),
          startAfter(lastVisible),
          limit(10)
        )
      } else {
        q = query(
          collection(db, 'ReviewRequests'),
          where('fitter_id', '==', fitterData.id),
          orderBy('created_at', 'desc'),
          startAfter(lastVisible),
          limit(10)
        )
      }

      const querySnapshot = await getDocs(q)
      const newData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate(),
        quote_date: doc.data().quote_date?.toDate(),
      }))
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])

      if (type === 'surveys') {
        setSurveyRequests(prev => [...prev, ...newData])
      } else if (type === 'quotes') {
        setQuotes(prev => [...prev, ...newData])
      } else {
        setReviewRequests(prev => [...prev, ...newData])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch more ${type}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterData = useCallback((data: any[], term: string) => {
    return data.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(term.toLowerCase())
      )
    )
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/login')}>Return to Login</Button>
      </div>
    )
  }

  if (!fitterData) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">No fitter data found. Please log in again.</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fitter Dashboard</h1>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
        
        <Card className="bg-gray-800 text-white mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {fitterData.logo_url ? (
                  <Image
                    src={fitterData.logo_url}
                    alt={`${fitterData.company_name} logo`}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-semibold">{fitterData.company_name}</h2>
                  <p className="text-gray-400">Welcome back, {fitterData.fitter_first_name}!</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{surveyRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {surveyRequests.filter(r => r.status === 'pending').length} pending
              </p>
              <Progress 
                value={(surveyRequests.filter(r => r.status === 'approved').length / surveyRequests.length) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Quotes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotes.filter(q => q.status === 'pending').length}</div>
              <p className="text-xs text-muted-foreground">
                {quotes.filter(q => q.status === 'sent').length} sent
              </p>
              <Progress 
                value={(quotes.filter(q => q.status === 'sent').length / quotes.length) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Installs</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotes.filter(q => q.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">
                {quotes.filter(q => q.status === 'completed' && !q.review_requested).length} need review requests
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewRequests.filter(r => r.status === 'pending').length}</div>
              <p className="text-xs text-muted-foreground">
                {reviewRequests.filter(r => r.status === 'approved').length} approved
              </p>
              <Progress 
                value={(reviewRequests.filter(r => r.status === 'approved').length / reviewRequests.length) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={() => router.push('/fitter/quote')}>
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Button>
          <Button variant="secondary" onClick={() => console.log('View calendar')}>
            <Eye className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button variant="outline" onClick={() => console.log('Generate report')}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        
        <Tabs defaultValue="surveys" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="surveys" className="data-[state=active]:bg-gray-700">
              <ClipboardList className="mr-2 h-4 w-4" />
              Surveys
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-gray-700">
              <FileText className="mr-2 h-4 w-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="installs" className="data-[state=active]:bg-gray-700">
              <Wrench className="mr-2 h-4 w-4" />
              Installs
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gray-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surveys">
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Recent Survey Requests</CardTitle>
                <CardDescription>You have {surveyRequests.filter(r => r.status === 'pending').length} pending survey requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterData(surveyRequests, searchTerm).map((request) => (
                      <Card key={request.id} className="bg-gray-700">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{request.name}</CardTitle>
                            <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'success' : 'destructive'}>
                              {request.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-400">Date: {request.created_at.toLocaleDateString()}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex space-x-2">
                              <a href={`tel:${request.phone}`} aria-label="Call customer">
                                <Phone className="h-5 w-5 text-gray-400 hover:text-white" />
                              </a>
                              <a href={`mailto:${request.email}`} aria-label="Email customer">
                                <Mail className="h-5 w-5 text-gray-400 hover:text-white" />
                              </a>
                            </div>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 text-white">
                                  <DialogHeader>
                                    <DialogTitle>Survey Request Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-1 gap-2">
                                      <Label>Name</Label>
                                      <Input value={request.name} className="bg-gray-700" readOnly />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      <Label>Email</Label>
                                      <Input value={request.email} className="bg-gray-700" readOnly />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      <Label>Phone</Label>
                                      <Input value={request.phone} className="bg-gray-700" readOnly />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      <Label>Address</Label>
                                      <Input value={request.address} className="bg-gray-700" readOnly />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      <Label>Message</Label>
                                      <textarea 
                                        value={request.message || 'No message provided'} 
                                        className="w-full h-24 p-2 bg-gray-700 rounded-md" 
                                        readOnly 
                                      />
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button onClick={() => router.push(`/fitter/quote?id=${request.id}`)} size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Quote
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {!isLoading && surveyRequests.length % 10 === 0 && (
                    <Button onClick={() => fetchMoreData('surveys')} className="w-full mt-4">
                      Load More
                    </Button>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Quotes</CardTitle>
                    <CardDescription>You have {quotes.filter(q => q.status === 'pending').length} open quotes.</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => router.push('/fitter/quote')}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Quote
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterData(quotes, searchTerm).map((quote) => (
                      <Card key={quote.id} className="bg-gray-700">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{quote.customer_name}</CardTitle>
                            <Badge variant={quote.status === 'pending' ? 'secondary' : quote.status === 'sent' ? 'primary' : 'success'}>
                              {quote.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">Quote #: {quote.quote_number}</p>
                            <p className="text-sm text-gray-400">Date: {quote.quote_date.toLocaleDateString()}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="font-bold">Total: £{quote.total_price.toFixed(2)}</p>
                            <div className="flex space-x-2">
                              <a href={`tel:${quote.customer_phone}`} aria-label="Call customer">
                                <Phone className="h-5 w-5 text-gray-400 hover:text-white" />
                              </a>
                              <a href={`mailto:${quote.customer_email}`} aria-label="Email customer">
                                <Mail className="h-5 w-5 text-gray-400 hover:text-white" />
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-wrap justify-end mt-4 space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Quote
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-800 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold">Quote Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <h3 className="text-lg font-semibold">Customer Information</h3>
                                      <p><span className="font-medium">Name:</span> {quote.customer_name}</p>
                                      <p><span className="font-medium">Email:</span> {quote.customer_email}</p>
                                      <p><span className="font-medium">Phone:</span> {quote.customer_phone}</p>
                                      <p><span className="font-medium">Address:</span> {quote.customer_address}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h3 className="text-lg font-semibold">Quote Details</h3>
                                      <p><span className="font-medium">Quote Number:</span> {quote.quote_number}</p>
                                      <p><span className="font-medium">Date:</span> {quote.quote_date.toLocaleDateString()}</p>
                                      <p><span className="font-medium">Status:</span> {quote.status}</p>
                                      <p><span className="font-medium">Total Price:</span> £{quote.total_price.toFixed(2)}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Measurements</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                      <p><span className="font-medium">Stair Width:</span> {quote.stair_width}mm</p>
                                      <p><span className="font-medium">Height of 4 Steps:</span> {quote.height_of_4_steps}mm</p>
                                      <p><span className="font-medium">Length of 4 Steps:</span> {quote.length_of_4_steps}mm</p>
                                      <p><span className="font-medium">Tread Depth:</span> {quote.tread_depth}mm</p>
                                      <p><span className="font-medium">Riser Height:</span> {quote.riser_height}mm</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Options</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                      <p><span className="font-medium">Color:</span> {quote.color_option}</p>
                                      <p><span className="font-medium">Drawer:</span> {quote.drawer_option}</p>
                                      <p><span className="font-medium">Handle Size:</span> {quote.handle_size}</p>
                                      <p><span className="font-medium">Handle Color:</span> {quote.handle_color}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Additional Information</h3>
                                    <p><span className="font-medium">Installation Price:</span> £{quote.install_price.toFixed(2)}</p>
                                    <p><span className="font-medium">Notes:</span> {quote.additional_notes || 'No additional notes'}</p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => console.log('Resend quote email')}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Resend Quote
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" onClick={() => console.log('Send invoice')}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Send Invoice
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {!isLoading && quotes.length % 10 === 0 && (
                    <Button onClick={() => fetchMoreData('quotes')} className="w-full mt-4">
                      Load More
                    </Button>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>You have {reviewRequests.filter(r => r.status === 'pending').length} pending reviews to moderate.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterData(reviewRequests, searchTerm).map((review) => (
                      <Card key={review.id} className="bg-gray-700">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{review.customer_name}</CardTitle>
                            <Badge 
                              variant={
                                review.status === 'pending' ? 'secondary' : 
                                review.status === 'approved' ? 'success' : 
                                'destructive'
                              }
                            >
                              {review.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                                }`}
                              />
                            ))}
                            <span className="ml-2">{review.rating}/5</span>
                          </div>
                          <p className="text-sm mb-4">{review.comment}</p>
                          <p className="text-xs text-gray-400">Date: {review.created_at.toLocaleDateString()}</p>
                          {review.status === 'pending' && (
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReviewAction(review.id, 'approve')}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReviewAction(review.id, 'reject')}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {!isLoading && reviewRequests.length % 10 === 0 && (
                    <Button onClick={() => fetchMoreData('reviews')} className="w-full mt-4">
                      Load More
                    </Button>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
