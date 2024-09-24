'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { query, where, getDocs, collection } from 'firebase/firestore'
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

interface SurveyRequest {
  id: string
  name: string
  email: string
  phone: string
  address: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: Date
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
          company_name: 'SmartSpace',
          email: 'support@smartspace.com',
        })
      } else if (fitterId) {
        try {
          // Fetch fitter based on fitter_id from Firestore
          const fitterQuery = query(
            collection(db, 'Fitters'),
            where('fitter_id', '==', fitterId)
          )
          const fitterSnapshot = await getDocs(fitterQuery)

          if (!fitterSnapshot.empty) {
            const fitterData = fitterSnapshot.docs[0].data() as Fitter
            setFitter({
              id: fitterSnapshot.docs[0].id,
              ...fitterData,
            })
          } else {
            throw new Error('Fitter not found')
          }
        } catch (error) {
          console.error('Error fetching fitter data:', error)
        }
      }
    }

    fetchFitterData()
  }, [fitterId, isSmartSpace])

  // Submitting the form
  const handleFormSubmit = async (values: FormValues) => {
    try {
      if (!fitter) {
        throw new Error("Fitter data is not available.")
      }

      const surveyData: SurveyRequest = {
        id: '', // Will be auto-generated by Firestore
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        message: values.message || '', // Optional field
        status: 'pending',
        created_at: new Date(),
      }

      await addDoc(collection(db, 'surveyRequests'), surveyData)

      toast({
        title: "Survey request sent successfully!",
        description: "Your request has been submitted and is now pending approval.",
        variant: "success",
      })

      // Reset the form after submission
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred.',
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Request</CardTitle>
        <CardDescription>
          {fitter ? `Request a survey from ${fitter.company_name}` : "Loading..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...form.register('name')} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...form.register('email')} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...form.register('phone')} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...form.register('address')} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...form.register('message')} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
