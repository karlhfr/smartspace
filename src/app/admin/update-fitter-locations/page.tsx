'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateFitterLocations } from '@/utils/updateFitterLocations'

export default function UpdateFitterLocationsPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<string | null>(null)

  const handleUpdateLocations = async () => {
    setIsUpdating(true)
    setUpdateStatus('Updating fitter locations...')
    try {
      await updateFitterLocations()
      setUpdateStatus('Fitter locations updated successfully!')
    } catch (error) {
      setUpdateStatus(`Error updating fitter locations: ${error}`)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Update Fitter Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Click the button below to update fitter locations with accurate latitude and longitude data.</p>
          <Button onClick={handleUpdateLocations} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Fitter Locations'}
          </Button>
          {updateStatus && (
            <p className="mt-4 text-sm text-gray-600">{updateStatus}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}