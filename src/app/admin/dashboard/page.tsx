'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Users, FileText, ClipboardList, LogOut } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [surveys, setSurveys] = useState([])
  const [quotes, setQuotes] = useState([])
  const [fitters, setFitters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser
      if (!user || user.email !== 'bookings@smartspacestairs.co.uk') {
        router.push('/login')
        return
      }

      try {
        // Fetch recent surveys
        const surveysQuery = query(collection(db, 'SurveyRequests'), orderBy('created_at', 'desc'), limit(5))
        const surveysSnapshot = await getDocs(surveysQuery)
        const surveysData = surveysSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setSurveys(surveysData)

        // Fetch recent quotes
        const quotesQuery = query(collection(db, 'Quotes'), orderBy('quote_date', 'desc'), limit(5))
        const quotesSnapshot = await getDocs(quotesQuery)
        const quotesData = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setQuotes(quotesData)

        // Fetch fitters
        const fittersQuery = query(collection(db, 'Fitters'))
        const fittersSnapshot = await getDocs(fittersQuery)
        const fittersData = fittersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setFitters(fittersData)

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveys.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fitters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fitters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{quotes.reduce((sum, quote) => sum + (quote.total_price || 0), 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="surveys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="surveys">Recent Surveys</TabsTrigger>
          <TabsTrigger value="quotes">Recent Quotes</TabsTrigger>
          <TabsTrigger value="fitters">Fitters</TabsTrigger>
        </TabsList>
        <TabsContent value="surveys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Surveys</CardTitle>
              <CardDescription>Overview of the latest survey requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>{survey.name}</TableCell>
                      <TableCell>{survey.email}</TableCell>
                      <TableCell>{survey.status}</TableCell>
                      <TableCell>{new Date(survey.created_at.seconds * 1000).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quotes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quotes</CardTitle>
              <CardDescription>Overview of the latest quotes submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote Number</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>{quote.quote_number}</TableCell>
                      <TableCell>{quote.customer_name}</TableCell>
                      <TableCell>£{quote.total_price.toFixed(2)}</TableCell>
                      <TableCell>{quote.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fitters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fitters</CardTitle>
              <CardDescription>Overview of registered fitters</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Service Radius</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fitters.map((fitter) => (
                    <TableRow key={fitter.id}>
                      <TableCell className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={fitter.profile_picture} alt={fitter.name} />
                          <AvatarFallback>{fitter.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {fitter.name}
                      </TableCell>
                      <TableCell>{fitter.email}</TableCell>
                      <TableCell>{fitter.company_name}</TableCell>
                      <TableCell>{fitter.service_radius} miles</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}