import FitterCard from '@/components/FitterCard'

const fitters = [
  { name: 'John Doe', company: 'Stair Masters', rating: 4.8, distance: 2.5, imageUrl: '/placeholder.svg?height=48&width=48' },
  { name: 'Jane Smith', company: 'Custom Stairs Co.', rating: 4.9, distance: 3.2, imageUrl: '/placeholder.svg?height=48&width=48' },
  { name: 'Bob Johnson', company: 'Step It Up Fitters', rating: 4.7, distance: 1.8, imageUrl: '/placeholder.svg?height=48&width=48' },
]

export default function Fitters() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Find Fitters Near You</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fitters.map((fitter, index) => (
            <FitterCard key={index} {...fitter} />
          ))}
        </div>
      </div>
    </div>
  )
}