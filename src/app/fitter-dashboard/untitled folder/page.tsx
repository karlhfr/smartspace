'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth, db, storage } from '@/lib/firebase';
import {
  collection, query, where, getDocs, doc, updateDoc, addDoc, limit, startAfter, orderBy, Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RefreshCw, Phone, Mail, Eye, FileText, Plus, Edit, Briefcase, Wrench, MessageSquare, DollarSign, Search, Star, Check, X, ClipboardList, FileQuestion, Send
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AutocompleteInput from '@/components/AutocompleteInput';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface FitterData {
  id: string;
  company_name: string;
  email: string;
  fitter_first_name: string;
  fitter_last_name: string;
  fitter_address: string;
  phone: string;
  service_radius: number;
  fitter_rating: number;
  logo_url?: string;
  latitude: number;
  longitude: number;
}

interface SurveyRequest {
  id: string;
  created_at: Date;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  message?: string;
}

interface Quote {
  id: string;
  fitter_id: string;
  created_at: Date;
  customer_name: string;
  customer_address: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  installation_date?: Date;
  review_requested?: boolean;
  quote_number: string;
  total_price: number;
  install_price: number;
  color_option: string;
  drawer_option: string;
  handle_size: string;
  handle_color: string;
  stair_width: number;
  height_of_4_steps: number;
  length_of_4_steps: number;
  tread_depth: number;
  riser_height: number;
  additional_notes?: string;
  unit_paid?: boolean;
  install_paid?: boolean;
}

interface ReviewRequest {
  id: string;
  created_at: Date;
  customer_name: string;
  rating: number;
  comment: string;
  status: string;
  fitter_id: string;
}

export default function FitterDashboard() {
  const [fitterData, setFitterData] = useState<FitterData | null>(null);
  const [surveyRequests, setSurveyRequests] = useState<SurveyRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatedFitterData, setUpdatedFitterData] = useState<FitterData | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.email, user.uid);
        fetchData(user);
      } else {
        console.log("No user authenticated");
        setError('User not authenticated');
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchData = async (user: any) => {
    if (!user) {
      setError('User not authenticated');
      router.push('/login');
      return;
    }

    try {
      setRefreshing(true);
      const fittersRef = collection(db, 'Fitters');
      const q = query(fittersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Fitter profile not found');
      }

      const fitterDoc = querySnapshot.docs[0];
      const data = { id: fitterDoc.id, ...fitterDoc.data() } as FitterData;
      setFitterData(data);
      setUpdatedFitterData(data);
      await fetchSurveyRequests(data.id);
      await fetchQuotes(data.id);
      await fetchReviews(data.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: "Error",
        description: `Failed to fetch data: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSurveyRequests = async (fitterId: string) => {
    try {
      const q = query(collection(db, 'SurveyRequests'), where('fitter_id', '==', fitterId), orderBy('created_at', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const requests: SurveyRequest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          ...data,
          created_at: data.created_at instanceof Timestamp ? data.created_at.toDate() : new Date(data.created_at),
        } as SurveyRequest);
      });
      setSurveyRequests(requests);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch survey requests: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const fetchQuotes = async (fitterId: string) => {
    try {
      const q = query(collection(db, 'Quotes'), where('fitter_id', '==', fitterId), orderBy('quote_date', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const fetchedQuotes: Quote[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedQuotes.push({
          id: doc.id,
          ...data,
          created_at: data.created_at instanceof Timestamp ? data.created_at.toDate() : new Date(data.created_at),
          installation_date: data.installation_date instanceof Timestamp ? data.installation_date.toDate() : data.installation_date ? new Date(data.installation_date) : undefined,
        } as Quote);
      });
      console.log('Processed quotes:', fetchedQuotes);
      setQuotes(fetchedQuotes);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      toast({
        title: "Error",
        description: `Failed to fetch quotes: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const fetchReviews = async (fitterId: string) => {
    try {
      const q = query(collection(db, 'ReviewRequests'), where('fitter_id', '==', fitterId), orderBy('created_at', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const fetchedReviewRequests: ReviewRequest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviewRequests.push({
          id: doc.id,
          ...data,
          created_at: data.created_at instanceof Timestamp ? data.created_at.toDate() : new Date(data.created_at),
        } as ReviewRequest);
      });
      setReviewRequests(fetchedReviewRequests);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch review requests: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const uploadLogo = async (): Promise<string | undefined> => {
    if (!logoFile || !fitterData) return undefined;

    const fileRef = ref(storage, `company_logos/${fitterData.id}/${logoFile.name}`);
    await uploadBytes(fileRef, logoFile);
    return await getDownloadURL(fileRef);
  };

  const handleUpdateProfile = async () => {
    if (!fitterData || !updatedFitterData) return;
    try {
      let logoUrl = updatedFitterData.logo_url;

      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const updatedData = {
        ...updatedFitterData,
        logo_url: logoUrl,
      };

      await updateDoc(doc(db, 'Fitters', fitterData.id), updatedData);
      setFitterData(updatedData);
      setEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your fitter profile has been successfully updated.",
      });
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

  const sendReviewRequest = async (install: Quote) => {
    try {
      if (!fitterData) {
        throw new Error("Fitter data not available")
      }

      // Create a new document in the ReviewRequests collection
      const reviewRequestRef = await addDoc(collection(db, 'ReviewRequests'), {
        fitter_id: fitterData.id,
        customer_name: install.customer_name,
        customer_email: install.customer_email,
        install_date: install.installation_date,
        sent_date: new Date(),
        status: 'pending'
      });

      // Generate a unique URL for the review page
      const reviewUrl = `${window.location.origin}/review/${reviewRequestRef.id}?fitter=${fitterData.id}`;

      // Call the API route to send the email
      const response = await fetch('/api/send-review-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: install.customer_email,
          subject: 'Please Review Your Recent Installation',
          customerName: install.customer_name,
          companyName: fitterData.company_name,
          fitterName: `${fitterData.fitter_first_name} ${fitterData.fitter_last_name}`,
          reviewUrl: reviewUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the quote status to indicate a review has been requested
        await updateDoc(doc(db, 'Quotes', install.id), {
          review_requested: true
        });

        toast({
          title: "Review Request Sent",
          description: `A review request has been sent to ${install.customer_email}`,
        });

        // Refresh the quotes data
        await fetchQuotes(fitterData.id);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error sending review request:', error);
      toast({
        title: "Error",
        description: "Failed to send review request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const reviewRef = doc(db, 'ReviewRequests', reviewId)
      await updateDoc(reviewRef, {
        status: action === 'approve' ? 'approved' : 'rejected'
      })
      toast({
        title: "Success",
        description: `Review ${action}d successfully`,
      })
      // Refresh reviews after action
      if (fitterData) {
        await fetchReviews(fitterData.id)
      }
    } catch (error) {
      console.error(`Error ${action}ing review:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} review. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const sortByPriority = (items: any[]) => {
    return items.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return 0;
    });
  };

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
          orderBy('created_at', 'desc'),
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
      const newData = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at instanceof Timestamp ? data.created_at.toDate() : new Date(data.created_at),
          installation_date: data.installation_date instanceof Timestamp ? data.installation_date.toDate() : data.installation_date ? new Date(data.installation_date) : undefined,
        }
      })

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])

      if (type === 'surveys') {
        setSurveyRequests(prev => [...prev, ...newData as SurveyRequest[]])
      } else if (type === 'quotes') {
        setQuotes(prev => [...prev, ...newData as Quote[]])
      } else {
        setReviewRequests(prev => [...prev, ...newData as ReviewRequest[]])
      }
    } catch (error) {
      console.error(`Error fetching more ${type}:`, error)
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

  const handleRefresh = () => {
    if (fitterData) {
      fetchData({ email: fitterData.email });
    }
  };

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
                    <Briefcase className="h-8 w-8 text-gray-400" />
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
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
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
              <FileQuestion className="mr-2 h-4 w-4" />
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
          <div className="mt-4 mb-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 text-white"
              />
            </div>
          </div>
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
                              <Button onClick={() => router.push(`/fitter/quote?surveyId=${request.id}`)} size="sm">
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
                  <Link href="/fitter/quote">
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      New Quote
                    </Button>
                  </Link>
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
                            <Badge variant={quote.status === 'pending' ? 'secondary' : quote.status === 'sent' ? 'default' : 'success'}>
                              {quote.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">Quote #: {quote.quote_number}</p>
                            <p className="text-sm text-gray-400">Date: {quote.created_at.toLocaleDateString()}</p>
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
                                      <p><span className="font-medium">Date:</span> {quote.created_at.toLocaleDateString()}</p>
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
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Installation Details</h3>
                                    <p><span className="font-medium">Installation Date:</span> {quote.installation_date ? quote.installation_date.toLocaleDateString() : 'Not scheduled'}</p>
                                    <p><span className="font-medium">Installation Status:</span> {quote.status}</p>
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
                            <Button variant="outline" size="sm" onClick={() => console.log('Resend quote email')}>
                              <Send className="mr-2 h-4 w-4" />
                              Resend Quote
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
          <TabsContent value="installs">
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Completed Installs</CardTitle>
                <CardDescription>You have {quotes.filter(q => q.status === 'completed' && !q.review_requested).length} installs that need review requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterData(quotes.filter(q => q.status === 'completed'), searchTerm).map((install) => (
                      <Card key={install.id} className="bg-gray-700">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{install.customer_name}</CardTitle>
                            <Badge variant="success">Completed</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">Quote #: {install.quote_number}</p>
                            <p className="text-sm text-gray-400">Install Date: {install.installation_date ? install.installation_date.toLocaleDateString() : 'Not set'}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="font-bold">Total: £{install.total_price.toFixed(2)}</p>
                            <div className="flex space-x-2">
                              <a href={`tel:${install.customer_phone}`} aria-label="Call customer">
                                <Phone className="h-5 w-5 text-gray-400 hover:text-white" />
                              </a>
                              <a href={`mailto:${install.customer_email}`} aria-label="Email customer">
                                <Mail className="h-5 w-5 text-gray-400 hover:text-white" />
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-wrap justify-between mt-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={install.unit_paid ? 'success' : 'destructive'}>
                                Unit: {install.unit_paid ? 'Paid' : 'Unpaid'}
                              </Badge>
                              <Badge variant={install.install_paid ? 'success' : 'destructive'}>
                                Install: {install.install_paid ? 'Paid' : 'Unpaid'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Install
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Install Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Customer Information</h3>
                                        <p><span className="font-medium">Name:</span> {install.customer_name}</p>
                                        <p><span className="font-medium">Email:</span> {install.customer_email}</p>
                                        <p><span className="font-medium">Phone:</span> {install.customer_phone}</p>
                                        <p><span className="font-medium">Address:</span> {install.customer_address}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Install Details</h3>
                                        <p><span className="font-medium">Quote Number:</span> {install.quote_number}</p>
                                        <p><span className="font-medium">Install Date:</span> {install.installation_date ? install.installation_date.toLocaleDateString() : 'Not set'}</p>
                                        <p><span className="font-medium">Total Price:</span> £{install.total_price.toFixed(2)}</p>
                                        <p><span className="font-medium">Unit Payment:</span> {install.unit_paid ? 'Paid' : 'Unpaid'}</p>
                                        <p><span className="font-medium">Install Payment:</span> {install.install_paid ? 'Paid' : 'Unpaid'}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <h3 className="text-lg font-semibold">Product Details</h3>
                                      <div className="grid grid-cols-2 gap-2">
                                        <p><span className="font-medium">Color:</span> {install.color_option}</p>
                                        <p><span className="font-medium">Drawer:</span> {install.drawer_option}</p>
                                        <p><span className="font-medium">Handle Size:</span> {install.handle_size}</p>
                                        <p><span className="font-medium">Handle Color:</span> {install.handle_color}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <h3 className="text-lg font-semibold">Measurements</h3>
                                      <div className="grid grid-cols-2 gap-2">
                                        <p><span className="font-medium">Stair Width:</span> {install.stair_width}mm</p>
                                        <p><span className="font-medium">Height of 4 Steps:</span> {install.height_of_4_steps}mm</p>
                                        <p><span className="font-medium">Length of 4 Steps:</span> {install.length_of_4_steps}mm</p>
                                        <p><span className="font-medium">Tread Depth:</span> {install.tread_depth}mm</p>
                                        <p><span className="font-medium">Riser Height:</span> {install.riser_height}mm</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <h3 className="text-lg font-semibold">Additional Information</h3>
                                      <p><span className="font-medium">Installation Price:</span> £{install.install_price.toFixed(2)}</p>
                                      <p><span className="font-medium">Notes:</span> {install.additional_notes || 'No additional notes'}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="outline" size="sm" onClick={() => console.log('Send invoice')}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Send Invoice
                              </Button>
                              <Button variant="outline" size="sm" disabled={install.review_requested} onClick={() => sendReviewRequest(install)}>
                                <Star className="mr-2 h-4 w-4" />
                                {install.review_requested ? 'Review Requested' : 'Request Review'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {!isLoading && quotes.filter(q => q.status === 'completed').length % 10 === 0 && (
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
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>You have {reviewRequests.filter(r => r.status === 'pending').length} pending reviews to approve.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortByPriority(filterData(reviewRequests, searchTerm)).map((review) => (
                      <Card key={review.id} className="bg-gray-700">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{review.customer_name}</CardTitle>
                            <Badge variant={review.status === 'pending' ? 'secondary' : review.status === 'approved' ? 'success' : 'destructive'}>
                              {review.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">Date: {review.created_at.toLocaleDateString()}</p>
                          <p className="text-sm mb-4">{review.comment}</p>
                          {review.status === 'pending' && (
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleReviewAction(review.id, 'approve')}>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleReviewAction(review.id, 'reject')}>
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

      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Make changes to your fitter profile here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company_name" className="text-right">
                Company Name
              </Label>
              <Input
                id="company_name"
                value={updatedFitterData?.company_name || ''}
                onChange={(e) => setUpdatedFitterData(prev => ({ ...prev!, company_name: e.target.value }))}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fitter_first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="fitter_first_name"
                value={updatedFitterData?.fitter_first_name || ''}
                onChange={(e) => setUpdatedFitterData(prev => ({ ...prev!, fitter_first_name: e.target.value }))}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fitter_last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="fitter_last_name"
                value={updatedFitterData?.fitter_last_name || ''}
                onChange={(e) => setUpdatedFitterData(prev => ({ ...prev!, fitter_last_name: e.target.value }))}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={updatedFitterData?.email || ''}
                onChange={(e) => setUpdatedFitterData(prev => ({ ...prev!, email: e.target.value }))}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={updatedFitterData?.phone || ''}
                onChange={(e) => setUpdatedFitterData(prev => ({ ...prev!, phone: e.target.value }))}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fitter_address" className="text-right">
                Address
              </Label>
              <AutocompleteInput
                id="fitter_address"
                value={updatedFitterData?.fitter_address || ''}
                onPlaceSelected={handleAddressUpdate}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service_radius" className="text-right">
                Service Radius (miles)
              </Label>
              <Input
                id="service_radius"
                type="number"
                value={updatedFitterData?.service_radius || ''}
                onChange={(e) => setUpdatedFitterData(prev => ({ ...prev!, service_radius: Number(e.target.value) }))}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Company Logo
              </Label>
              <Input
                id="logo"
                type="file"
                onChange={handleFileChange}
                className="col-span-3 bg-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}