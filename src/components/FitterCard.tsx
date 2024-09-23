import Image from 'next/image'

type FitterProps = {
  name: string;
  company: string;
  rating: number;
  distance: number;
  imageUrl: string;
}

export default function FitterCard({ name, company, rating, distance, imageUrl }: FitterProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Image className="h-12 w-12 rounded-full" src={imageUrl} alt={name} width={48} height={48} />
          </div>
          <div className="ml-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm font-medium text-indigo-600">{rating} stars</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-sm text-gray-500">{distance} miles away</span>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Request Survey
        </button>
      </div>
    </div>
  )
}