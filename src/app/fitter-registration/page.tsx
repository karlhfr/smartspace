'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { db, auth } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useLoadScript } from '@react-google-maps/api'
import { Autocomplete } from '@react-google-maps/api'

// Form validation schema
const formSchema = z.object({
  company_name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  contact_name: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  service_radius: z.number().min(1, { message: "Service radius must be at least 1 mile." }),
})

// Generate unique fitter ID
const generateFitterId = () => {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `SSF-${randomNumber}`;
}

export default function FitterRegistration() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null })
  const [fitterId, setFitterId] = useState('')
  const [autocomplete, setAutocomplete] = useState(null); // For Google Autocomplete

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      email: "",
      password: "",
      contact_name: "",
      phone: "",
      address: "",
      service_radius: 10,
    },
  })

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  // Generate fitter ID on page load
  useEffect(() => {
    const generatedFitterId = generateFitterId();
    setFitterId(generatedFitterId);
    console.log('Generated Fitter ID:', generatedFitterId);
  }, [])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      if (coordinates.lat === null || coordinates.lng === null) {
        throw new Error('Coordinates are missing for the selected address.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const user = userCredential.user

      await addDoc(collection(db, 'Fitters'), {
        uid: user.uid,
        fitter_id: fitterId,
        company_name: values.company_name,
        email: values.email,
        contact_name: values.contact_name,
        phone: values.phone,
        fitter_address: values.address,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        service_radius: values.service_radius,
        created_at: new Date(),
      })

      toast({
        title: "Registration Successful",
        description: "Your fitter account has been created.",
      })

      router.push('/fitter-dashboard')
    } catch (error) {
      console.error('Error registering fitter:', error)
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize Google Places Autocomplete
  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance)
  }

  // Handle place selection
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      const address = place.formatted_address
      const lat = place.geometry?.location?.lat()
      const lng = place.geometry?.location?.lng()

      form.setValue("address", address); // Set address in form
      setCoordinates({ lat, lng }); // Store lat/lng
      console.log('Selected Address:', address);
      console.log('Latitude:', lat, 'Longitude:', lng);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Fitter Registration</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Fitter ID - Read-only and moved to top */}
          <FormField
            control={form.control}
            name="fitter_id"
            render={() => (
              <FormItem>
                <FormLabel>Fitter ID</FormLabel>
                <FormControl>
                  <Input value={fitterId} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Fitters Ltd" {...field} />
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
                  <Input type="email" placeholder="This Will Be Your Login" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Mobile Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address with Google Maps Autocomplete */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  {isLoaded ? (
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                      <Input placeholder="Start Typing Address & Select" {...field} />
                    </Autocomplete>
                  ) : (
                    <Input placeholder="Start Typing Address & Select" {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_radius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Radius (miles)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
