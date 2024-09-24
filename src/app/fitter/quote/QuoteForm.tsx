'use client'

import { useState, useEffect } from 'react'
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
import { doc, setDoc } from 'firebase/firestore'

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

export default function QuoteForm() {
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

  useEffect(() => {
    setQuoteNumber(`Q${Date.now().toString().slice(-6)}`)

    const encodedCustomerData = searchParams.get('customerData')
    if (encodedCustomerData) {
      try {
        const customerData = JSON.parse(decodeURIComponent(encodedCustomerData))
        setCustomerName(customerData.name)
        setCustomerEmail(customerData.email)
        setCustomerPhone(customerData.phone)
        setCustomerAddress(customerData.address)
      } catch (error) {
        console.error('Error parsing customer data:', error)
        toast({
          title: "Error",
          description: "Failed to load customer data.",
          variant: "destructive",
        })
      }
    }
  }, [searchParams, toast])

  useEffect(() => {
    const colorPrice = colorOptions.find(c => c.id === unitColor)?.price || 0
    const drawerPrice = drawerOptions.find(d => d.id === drawerOption)?.price || 0
    const installTotal = parseFloat(installPrice) || 0
    setTotalPrice(BASE_UNIT_PRICE + colorPrice + drawerPrice + installTotal)
  }, [unitColor, drawerOption, installPrice])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const quoteData = {
        quote_number: quoteNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        width: parseFloat(width),
        height: parseFloat(height),
        length: parseFloat(length),
        tread_depth: parseFloat(treadDepth),
        riser_height: parseFloat(riserHeight),
        unit_color: unitColor,
        handle_width: handleWidth,
        handle_color: handleColor,
        drawer_option: drawerOption,
        install_price: parseFloat(installPrice) || 0,
        additional_notes: additionalNotes,
        total_price: totalPrice,
        status: 'pending',
        created_at: new Date(),
      }

      await setDoc(doc(db, 'Quotes', quoteNumber), quoteData)

      toast({
        title: "Quote Saved",
        description: "The quote has been successfully saved.",
      })

      // Reset form or redirect to another page
    } catch (error) {
      console.error('Error saving quote:', error)
      toast({
        title: "Error",
        description: "Failed to save the quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
                <Label htmlFor="width">Width (mm)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (mm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="length">Length (mm)</Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="treadDepth">Tread Depth (mm)</Label>
                <Input
                  id="treadDepth"
                  type="number"
                  value={treadDepth}
                  onChange={(e) => setTreadDepth(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="riserHeight">Riser Height (mm)</Label>
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
              <Label htmlFor="installPrice">Installation Price (£)</Label>
              <Input
                id="installPrice"
                type="number"
                value={installPrice}
                onChange={(e) => setInstallPrice(e.target.value)}
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
    </div>
  )
}