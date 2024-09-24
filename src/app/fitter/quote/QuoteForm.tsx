'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const BASE_UNIT_PRICE = 790

const colorOptions = [
  { id: 'white', name: 'White', price: 0 },
  { id: 'black', name: 'Black', price: 30 },
  { id: 'green', name: 'Green', price: 35 },
]

const handleWidthOptions = ['Wide', 'Narrow', 'Knob']
const handleColorOptions = ['Black', 'Chrome', 'Brass']

const drawerOptions = [
  { id: 'none', name: 'No Drawer', price: 0 },
  { id: 'standard', name: 'Standard Drawer', price: 100 },
  { id: 'extended', name: 'Extended Drawer', price: 125 },
]

function QuoteForm() {
  const [quoteNumber, setQuoteNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [length, setLength] = useState('')
  const [treadDepth, setTreadDepth] = useState('')
  const [riserHeight, setRiserHeight] = useState('')
  const [unitColor, setUnitColor] = useState(colorOptions[0].id)
  const [handleWidth, setHandleWidth] = useState(handleWidthOptions[0])
  const [handleColor, setHandleColor] = useState(handleColorOptions[0])
  const [drawerOption, setDrawerOption] = useState(drawerOptions[0].id)
  const [installPrice, setInstallPrice] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [totalPrice, setTotalPrice] = useState(BASE_UNIT_PRICE)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const searchParams = useSearchParams()
  const surveyId = searchParams.get('id')

  useEffect(() => {
    // Log the surveyId to ensure it is being fetched correctly
    console.log('Survey ID from URL:', surveyId)

    // Generate a unique quote number
    setQuoteNumber(`Q${Date.now().toString().slice(-6)}`)

    if (surveyId) {
      // Fetch survey data from Firebase
      const fetchSurveyData = async () => {
        try {
          const surveyDoc = await getDoc(doc(db, 'SurveyRequests', surveyId))
          if (surveyDoc.exists()) {
            const surveyData = surveyDoc.data()
            console.log('Fetched survey data:', surveyData) // Log the fetched data
            setCustomerName(surveyData.name)
            setCustomerEmail(surveyData.email)
            setCustomerPhone(surveyData.phone)
            setCustomerAddress(surveyData.address)
          } else {
            toast({
              title: "Error",
              description: "Survey data not found.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error('Error fetching survey data:', error)
          toast({
            title: "Error",
            description: "Failed to fetch survey data.",
            variant: "destructive",
          })
        }
      }

      fetchSurveyData()
    }
  }, [surveyId, toast])

  useEffect(() => {
    // Calculate total price whenever options change
    const colorPrice = colorOptions.find(c => c.id === unitColor)?.price || 0
    const drawerPrice = drawerOptions.find(d => d.id === drawerOption)?.price || 0
    const installTotal = parseFloat(installPrice) || 0
    setTotalPrice(BASE_UNIT_PRICE + colorPrice + drawerPrice + installTotal)
  }, [unitColor, drawerOption, installPrice])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Here you would typically send the quote data to your backend
    // The backend would:
    // 1. Associate the fitter ID with this quote
    // 2. Associate the customer ID (if available from a survey)
    // 3. Save all the quote data, including measurements and options

    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsLoading(false)
    toast({
      title: "Quote Saved",
      description: "The quote has been successfully saved and sent to the customer.",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Quote</CardTitle>
          <div className="text-lg font-semibold">Quote Number: {quoteNumber}</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Customer Address</Label>
                <Input
                  id="customerAddress"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="width">Width (between stringers)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (4 steps)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="length">Length (4 steps)</Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="treadDepth">Tread Depth</Label>
                <Input
                  id="treadDepth"
                  type="number"
                  value={treadDepth}
                  onChange={(e) => setTreadDepth(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="riserHeight">Riser Height</Label>
                <Input
                  id="riserHeight"
                  type="number"
                  value={riserHeight}
                  onChange={(e) => setRiserHeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitColor">Unit Color</Label>
                <Select value={unitColor} onValueChange={setUnitColor}>
                  <SelectTrigger id="unitColor">
                    <SelectValue placeholder="Select unit color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.name} {color.price > 0 && `(+£${color.price})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="handleWidth">Handle Width</Label>
                <Select value={handleWidth} onValueChange={setHandleWidth}>
                  <SelectTrigger id="handleWidth">
                    <SelectValue placeholder="Select handle width" />
                  </SelectTrigger>
                  <SelectContent>
                    {handleWidthOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="handleColor">Handle Color</Label>
                <Select value={handleColor} onValueChange={setHandleColor}>
                  <SelectTrigger id="handleColor">
                    <SelectValue placeholder="Select handle color" />
                  </SelectTrigger>
                  <SelectContent>
                    {handleColorOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="drawerOption">Drawer Option</Label>
                <Select value={drawerOption} onValueChange={setDrawerOption}>
                  <SelectTrigger id="drawerOption">
                    <SelectValue placeholder="Select drawer option" />
                  </SelectTrigger>
                  <SelectContent>
                    {drawerOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} {option.price > 0 && `(+£${option.price})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="installPrice">Installation Price</Label>
              <Input
                id="installPrice"
                type="number"
                value={installPrice}
                onChange={(e) => setInstallPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="text-xl font-bold">
              Total Price: £{totalPrice.toFixed(2)}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Quote...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Quote
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {surveyId && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded">
          <h2 className="text-xl font-bold">Fetched Survey Data</h2>
          <p><strong>Survey ID:</strong> {surveyId}</p>
          <p><strong>Customer Name:</strong> {customerName}</p>
          <p><strong>Customer Email:</strong> {customerEmail}</p>
          <p><strong>Customer Phone:</strong> {customerPhone}</p>
          <p><strong>Customer Address:</strong> {customerAddress}</p>
        </div>
      )}
    </div>
  )
}
