'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, Search, ArrowLeft } from 'lucide-react'

const categories = [
  { id: 1, name: 'Installation Guide' },
  { id: 2, name: 'Order Process' },
  { id: 3, name: 'Payment Information' },
  { id: 4, name: 'Refund Policy' },
  { id: 5, name: 'Delivery Information' },
  { id: 6, name: 'Directory Terms of Use' },
  { id: 7, name: 'Troubleshooting' },
]

const articles = [
  { id: 1, categoryId: 1, title: "Step-by-step installation process", content: "Detailed guide on how to install Smart Space Stair Storage systems..." },
  { id: 2, categoryId: 1, title: "How to measure stairs correctly", content: "Accurate measurements are crucial for a perfect fit. Here's how to measure..." },
  { id: 3, categoryId: 1, title: "Tools required for installation", content: "List of tools you'll need for a smooth installation process..." },
  { id: 4, categoryId: 2, title: "How to place an order", content: "Guide on placing an order through our system..." },
  { id: 5, categoryId: 2, title: "Order status tracking", content: "How to track the status of your orders..." },
  { id: 6, categoryId: 3, title: "Accepted payment methods", content: "We accept the following payment methods..." },
  { id: 7, categoryId: 3, title: "Invoicing process", content: "Understanding our invoicing process..." },
  { id: 8, categoryId: 4, title: "Refund eligibility", content: "Conditions under which refunds are provided..." },
  { id: 9, categoryId: 4, title: "How to request a refund", content: "Step-by-step guide on requesting a refund..." },
  { id: 10, categoryId: 5, title: "Delivery timeframes", content: "Expected delivery times for different regions..." },
  { id: 11, categoryId: 5, title: "Tracking your delivery", content: "How to track your Smart Space Stair Storage delivery..." },
  { id: 12, categoryId: 6, title: "Directory listing requirements", content: "Requirements for being listed in our fitter directory..." },
  { id: 13, categoryId: 6, title: "Reasons for removal from directory", content: "Actions that could result in removal from the fitter directory..." },
  { id: 14, categoryId: 7, title: "Common fitting issues and solutions", content: "Solutions to frequently encountered fitting problems..." },
  { id: 15, categoryId: 7, title: "Customer complaints handling", content: "Best practices for handling customer complaints..." },
]

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null)
  const router = useRouter()

  const filteredArticles = articles.filter(article => 
    (selectedCategory === null || article.categoryId === selectedCategory) &&
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Button 
        variant="outline" 
        onClick={() => router.push('/fitter-dashboard')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold mb-6">Fitter Knowledge Base</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Button
                key="all"
                variant="ghost"
                className="w-full justify-start mb-2"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-start mb-2"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Articles</CardTitle>
            <CardDescription>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-gray-700 text-white"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {filteredArticles.map(article => (
                <Button
                  key={article.id}
                  variant="ghost"
                  className="w-full justify-start mb-2"
                  onClick={() => setSelectedArticle(article)}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  {article.title}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      {selectedArticle && (
        <Card className="bg-gray-800 mt-6">
          <CardHeader>
            <CardTitle>{selectedArticle.title}</CardTitle>
            <CardDescription>
              {categories.find(cat => cat.id === selectedArticle.categoryId)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>{selectedArticle.content}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}