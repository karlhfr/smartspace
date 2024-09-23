'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter your full address.",
  }),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Fitter {
  id: string
  company_name: string
  email: string
}

export default function SurveyRequestPage() {
  const searchParams = useSearchParams()
  const fitterId = searchParams.get('fitter')
  const isSmartSpace = searchParams.get('smartspace') === 'true'
  const [fitter, setFitter] = useState<Fitter | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    },
  })

  useEffect(() => {
    const fetchFitterData = async () => {
      if (isSmartSpace) {
        setFitter({
          id: 'qIg1KDBwVZhpYdW3Qm7wdmp7Od83',
          company_name: 'Smart Space',
          email: 'bookings@smartspacestairs.co.uk'
        })
      } else if (fitterId) {
        const fitterDoc = await getDoc(doc(db, 'Fitters', fitterId))
        if (fitterDoc.exists()) {
          setFitter({ 
            id: fitterDoc.id, 
            company_name: fitterDoc.data().company_name,
            email: fitterDoc.data().email
          })
        }
      }
    }

    fetchFitterData()
  }, [fitterId, isSmartSpace])

  async function onSubmit(values: FormValues) {
    try {
      if (!fitter) {
        throw new Error('Fitter information is missing')
      }

      console.log('Submitting survey request:', values);

      // Add survey request to SurveyRequests collection
      const surveyRequestRef = await addDoc(collection(db, 'SurveyRequests'), {
        ...values,
        fitter_id: fitter.id,
        fitter_name: fitter.company_name,
        fitter_email: fitter.email,
        status: 'pending',
        created_at: new Date(),
        customer_id: user ? user.uid : null,
      })
      console.log('Survey request document written with ID: ', surveyRequestRef.id);

      // Add or update customer in Customers collection
      const customersCollectionRef = collection(db, 'Customers')
      const customerDocRef = doc(customersCollectionRef, values.email)
      const customerDoc = await getDoc(customerDocRef)

      if (customerDoc.exists()) {
        console.log('Updating existing customer:', values.email);
        const updatedData = {
          name: values.name,
          phone: values.phone,
          address: values.address,
          surveys: [...(customerDoc.data().surveys || []), surveyRequestRef.id],
          updated_at: new Date(),
        }
        await setDoc(customerDocRef, updatedData, { merge: true })
        console.log('Customer document updated with ID:', customerDocRef.id);
      } else {
        console.log('Creating new customer:', values.email);
        const newCustomerData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          surveys: [surveyRequestRef.id],
          created_at: new Date(),
          updated_at: new Date(),
        }
        await setDoc(customerDocRef, newCustomerData)
        console.log('New customer document created with ID:', customerDocRef.id);
      }

      console.log('Customer data saved successfully');

      toast({
        title: "Survey Request Submitted",
        description: "We've received your request and will be in touch soon.",
      })

      form.reset()
    } catch (error) {
      console.error("Error submitting survey request:", error)
      if (error instanceof Error) {
        console.error("Error details:", error.message)
      }
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Request a Survey</CardTitle>
          <CardDescription>
            {fitter 
              ? `Fill out this form to request a survey from ${fitter.company_name}`
              : "Fill out this form to request a survey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us more about your project or any specific requirements"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}