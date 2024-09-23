'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Search } from 'lucide-react'
import Image from 'next/image'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

interface Fitter {
  id: string
  company_name: string
  email: string
  fitter_first_name: string
  fitter_last_name: string
  fitter_address: string
  phone: string
  service_radius: number
  fitter_rating: number
  latitude: number
  longitude: number
  logo_url?: string
}

export default function SelectFitterPage() {
  const [fitters, setFitters] = useState<Fitter[]>([])
  const [filteredFitters, setFilteredFitters] = useState<Fitter[]>([])
  const [selectedFitter, setSelectedFitter] = useState<Fitter | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [customerLocation, setCustomerLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 54.5, lng: -4 })
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  useEffect(() => {
    const fetchFitters = async () => {
      try {
        const fittersCollection = collection(db, 'Fitters')
        const fittersSnapshot = await getDocs(fittersCollection)
        const fittersList = fittersSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            service_radius: data.service_radius || 0,
            fitter_rating: data.fitter_rating || 0,
            logo_url: data.logo_url || undefined,
          } as Fitter
        })
        setFitters(fittersList)
        setFilteredFitters(fittersList)
      } catch (error) {
        console.error('Error fetching fitters:', error)
        toast({
          title: "Error",
          description: "Failed to load fitters. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchFitters()
  }, [toast])

  useEffect(() => {
    if (filteredFitters.length > 0 && mapRef.current) {
      fitMapToFitters()
    }
  }, [filteredFitters])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    if (filteredFitters.length > 0) {
      fitMapToFitters()
    }
  }, [filteredFitters])

  const fitMapToFitters = () => {
    if (!mapRef.current) return
    const bounds = new google.maps.LatLngBounds()
    filteredFitters.forEach((fitter) => {
      bounds.extend(new google.maps.LatLng(fitter.latitude, fitter.longitude))
    })
    if (customerLocation) {
      bounds.extend(new google.maps.LatLng(customerLocation.lat, customerLocation.lng))
    }
    mapRef.current.fitBounds(bounds)
    setMapBounds(bounds)
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address, town, or postcode.",
        variant: "destructive",
      })
      return
    }

    if (!isLoaded) {
      toast({
        title: "Error",
        description: "Map is not loaded yet. Please try again in a moment.",
        variant: "destructive",
      })
      return
    }

    const geocoder = new google.maps.Geocoder()
    try {
      const results = await geocoder.geocode({ address: searchInput })
      if (results.results[0]) {
        const location = results.results[0].geometry.location
        const newCustomerLocation = { lat: location.lat(), lng: location.lng() }
        setCustomerLocation(newCustomerLocation)
        setMapCenter(newCustomerLocation)
        filterFittersByRadius(newCustomerLocation)
      } else {
        throw new Error('No results found')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      toast({
        title: "Error",
        description: "Unable to find the location. Please try a different address.",
        variant: "destructive",
      })
    }
  }

  const filterFittersByRadius = (location: google.maps.LatLngLiteral) => {
    const filtered = fitters.filter(fitter => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        fitter.latitude,
        fitter.longitude
      )
      return distance <= fitter.service_radius
    })
    setFilteredFitters(filtered)
    if (filtered.length === 0) {
      toast({
        title: "No Fitters Found",
        description: "There are no fitters available in your area. Please try a different location.",
        variant: "warning",
      })
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959 // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  const onBoundsChanged = () => {
    if (mapRef.current) {
      const newBounds = mapRef.current.getBounds()
      setMapBounds(newBounds || null)
    }
  }

  const isMarkerVisible = (lat: number, lng: number) => {
    if (!mapBounds) return true
    return mapBounds.contains(new google.maps.LatLng(lat, lng))
  }

  const mapOptions = useMemo(() => ({
    styles: [
      {
        featureType: "all",
        elementType: "geometry.fill",
        stylers: [{ weight: "2.00" }]
      },
      {
        featureType: "all",
        elementType: "geometry.stroke",
        stylers: [{ color: "#9c9c9c" }]
      },
      {
        featureType: "all",
        elementType: "labels.text",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ color: "#f2f2f2" }]
      },
      {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }]
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }]
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [{ saturation: -100 }, { lightness: 45 }]
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#eeeeee" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#7b7b7b" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }]
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{ visibility: "simplified" }]
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#46bcec" }, { visibility: "on" }]
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{ color: "#c8d7d4" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#070707" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }]
      }
    ],
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControlOptions: { position: 3 }, // 3 corresponds to TOP_RIGHT
    zoomControlOptions: { position: 6 }, // 6 corresponds to RIGHT_CENTER
    gestureHandling: 'greedy', // This enables pinch-to-zoom on mobile
  }), [])

  const handleViewProfile = (fitter: Fitter) => {
    router.push(`/fitter/${fitter.id}`)
  }

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading maps</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6 text-foreground text-center">Find Your Perfect Fitter</h1>
        
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-4 pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your address, town, or postcode"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 w-full bg-background text-foreground"
                  aria-label="Search location"
                />
              </div>
              <Button onClick={handleSearch} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90" aria-label="Search">
                Find Fitters
              </Button>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-2xl"
        >
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '70vh',
              borderRadius: '0.75rem',
            }}
            center={mapCenter}
            zoom={6}
            onLoad={onMapLoad}
            onBoundsChanged={onBoundsChanged}
            options={mapOptions}
            onClick={() => setSelectedFitter(null)}
          >
            {customerLocation && (
              <Marker
                position={customerLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#4A90E2",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                }}
              />
            )}
            {filteredFitters.map((fitter) => (
              isMarkerVisible(fitter.latitude, fitter.longitude) && (
                <Marker
                  key={fitter.id}
                  position={{ lat: fitter.latitude, lng: fitter.longitude }}
                  onClick={() => setSelectedFitter(fitter)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#FF6B6B",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                  }}
                />
              )
            ))}
            <AnimatePresence>
              {selectedFitter && (
                <InfoWindow
                  position={{ lat: selectedFitter.latitude, lng: selectedFitter.longitude }}
                  onCloseClick={() => setSelectedFitter(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card text-card-foreground rounded-lg overflow-hidden w-full max-w-[280px] sm:w-72"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary to-secondary">
                      <Image
                        src={selectedFitter.logo_url || '/placeholder.svg'}
                        alt={`${selectedFitter.company_name} logo`}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src={selectedFitter.logo_url || '/placeholder.svg'}
                          alt={`${selectedFitter.company_name} logo`}
                          width={60}
                          height={60}
                          className="rounded-full border-4 border-white shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="font-bold text-lg sm:text-xl mb-2 text-center">{selectedFitter.company_name}</h2>
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              i < Math.round(selectedFitter.fitter_rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-semibold text-sm sm:text-base">
                          {selectedFitter.fitter_rating ? selectedFitter.fitter_rating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleViewProfile(selectedFitter)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base"
                      >
                        View Profile
                      </Button>
                    </div>
                  </motion.div>
                </InfoWindow>
              )}
            </AnimatePresence>
          </GoogleMap>
        </motion.div>
      </motion.div>
    </div>
  )
}