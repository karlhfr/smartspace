import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

interface MapCardProps {
  fitter: {
    id: string
    company_name: string
    fitter_address: string
    logo_url?: string
  }
}

export function MapCard({ fitter }: MapCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {fitter.logo_url ? (
            <Image
              src={fitter.logo_url}
              alt={`${fitter.company_name} logo`}
              width={50}
              height={50}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Logo</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold">{fitter.company_name}</h3>
            <p className="text-sm text-gray-600">{fitter.fitter_address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}