'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { db, storage } from '@/lib/firebase'
import { collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Eye, Edit, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext'
import { AutocompleteInput } from '@/components/AutocompleteInput'

interface CompanyData {
  id: string
  company_name: string
  email: string
  phone: string
  address: string
  latitude: number
  longitude: number
  service_radius: number
  logo_url?: string
}

interface SurveyRequest {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: Date
}

interface Quote {
  id: string
  customer_name: string
  total_price: number
  status: 'pending' | 'accepted' | 'rejected'
  quote_date: Date
  quote_number: string
}

export default function AdminDashboard() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [surveyRequests, setSurveyRequests] = useState<SurveyRequest[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [updatedCompanyData, setUpdatedCompanyData] = useState<CompanyData | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAdmin } = useAuth()

  const fetchData = async () => {
    if (!user || !isAdmin) {
      setError('Unauthorized access')
      router.push('/login')
      return
    }

    try {
      setRefreshing(true)
      await Promise.all([
        fetchCompanyData(),
        fetchSurveyRequests(),
        fetchQuotes(),
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
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

  useEffect(() => {
    fetchData()
  }, [user, isAdmin, router])

  const fetchCompanyData = async () => {
    if (!user) return
    const companyDoc = await getDocs(query(collection(db, 'Fitters'), where('email', '==', user.email)))
    if (!companyDoc.empty) {
      const data = companyDoc.docs[0].data() as CompanyData
      data.id = companyDoc.docs[0].id
      setCompanyData(data)
      setUpdatedCompanyData(data)
    }
  }

  const fetchSurveyRequests = async () => {
    if (!user) return
    const surveyRequestsRef = collection(db, 'SurveyRequests')
    const q = query(surveyRequestsRef, where('fitter_id', '==', user.uid))
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
  }

  const fetchQuotes = async () => {
    if (!user) return
    const quotesRef = collection(db, 'Quotes')
    const q = query(quotesRef, where('fitter_id', '==', user.uid))
    const querySnapshot = await getDocs(q)
    const fetchedQuotes: Quote[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      fetchedQuotes.push({
        id: doc.id,
        ...data,
        quote_date: data.quote_date.toDate(),
        total_price: typeof data.total_price === 'number' ? data.total_price : parseFloat(data.total_price) || 0
      } as Quote)
    })
    setQuotes(fetchedQuotes)
  }

  const handleRefresh = () => {
    fetchData()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user) return null

    const fileRef = ref(storage, `company_logos/${user.uid}/${logoFile.name}`)
    await uploadBytes(fileRef, logoFile)
    return getDownloadURL(fileRef)
  }

  const handleUpdateProfile = async () => {
    if (!companyData || !updatedCompanyData) return
    try {
      let logoUrl = updatedCompanyData.logo_url

      if (logoFile) {
        logoUrl = await uploadLogo()
      }

      const updatedData = {
        ...updatedCompanyData,
        logo_url: logoUrl,
      }

      await updateDoc(doc(db, 'Fitters', companyData.id), updatedData)
      setCompanyData(updatedData)
      setEditingProfile(false)
      toast({
        title: "Profile Updated",
        description: "Your company profile has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddressUpdate = (place: { formatted_address: string; latitude: number; longitude: number }) => {
    setUpdatedCompanyData(prev => {
      if (!prev) return null
      return {
        ...prev,
        address: place.formatted_address,
        latitude: place.latitude,
        longitude: place.longitude,
      }
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/login')}>Return to Login</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {companyData && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Company Profile</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Company Name:</strong> {companyData.company_name}</p>
                <p><strong>Email:</strong> {companyData.email}</p>
                <p><strong>Phone:</strong> {companyData.phone}</p>
              </div>
              <div>
                <p><strong>Address:</strong> {companyData.address}</p>
                <p><strong>Service Radius:</strong> {companyData.service_radius} miles</p>
              </div>
            </div>
            {companyData.logo_url && (
              <div className="mt-4">
                <p><strong>Company Logo:</strong></p>
                <Image
                  src={companyData.logo_url}
                  alt={`${companyData.company_name} logo`}
                  width={100}
                  height={100}
                  className="mt-2 rounded-md"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Survey Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{surveyRequests.length}</p>
            <p>Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{quotes.length}</p>
            <p>Total Quotes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              £{quotes.reduce((sum, quote) => sum + quote.total_price, 0).toFixed(2)}
            </p>
            <p>Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Survey Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveyRequests.slice(0, 5).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.customer_name}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'success' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.created_at.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Survey Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input id="name" value={request.customer_name} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input id="email" value={request.customer_email} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="phone" className="text-right">
                                Phone
                              </Label>
                              <Input id="phone" value={request.customer_phone} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="address" className="text-right">
                                Address
                              </Label>
                              <Input id="address" value={request.address} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="status" className="text-right">
                                Status
                              </Label>
                              <Input id="status" value={request.status} className="col-span-3" readOnly />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.slice(0, 5).map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>{quote.customer_name}</TableCell>
                    <TableCell>£{quote.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={quote.status === 'pending'
                        ? 'secondary'
                        : quote.status === 'accepted'
                        ? 'success'
                        : 'destructive'}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Quote Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="customer" className="text-right">
                                Customer
                              </Label>
                              <Input id="customer" value={quote.customer_name} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                Amount
                              </Label>
                              <Input id="amount" value={`£${quote.total_price.toFixed(2)}`} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="status" className="text-right">
                                Status
                              </Label>
                              <Input id="status" value={quote.status} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="date" className="text-right">
                                Date
                              </Label>
                              <Input id="date" value={quote.quote_date.toLocaleDateString()} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="number" className="text-right">
                                Quote Number
                              </Label>
                              <Input id="number" value={quote.quote_number} className="col-span-3" readOnly />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogDescription>
              Update your company's public profile information.
            </DialogDescription>
          </DialogHeader>
          {updatedCompanyData && (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company_name" className="text-right">
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    value={updatedCompanyData.company_name}
                    onChange={(e) => setUpdatedCompanyData({ ...updatedCompanyData, company_name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={updatedCompanyData.phone}
                    onChange={(e) => setUpdatedCompanyData({ ...updatedCompanyData, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <div className="col-span-3">
                    <AutocompleteInput
                      value={updatedCompanyData.address}
                      onChange={(value) => setUpdatedCompanyData({ ...updatedCompanyData, address: value })}
                      onPlaceSelected={handleAddressUpdate}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service_radius" className="text-right">
                    Service Radius
                  </Label>
                  <Input
                    id="service_radius"
                    type="number"
                    value={updatedCompanyData.service_radius}
                    onChange={(e) => setUpdatedCompanyData({ ...updatedCompanyData, service_radius: parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logo" className="text-right">
                    Company Logo
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {updatedCompanyData.logo_url && (
                      <div className="mt-2">
                        <Image
                          src={updatedCompanyData.logo_url}
                          alt="Current company logo"
                          width={100}
                          height={100}
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}