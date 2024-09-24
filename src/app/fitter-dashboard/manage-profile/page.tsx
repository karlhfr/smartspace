'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createProject, getFitterProjects, Project } from '@/lib/projects' // Update your createProject function accordingly
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import Image from 'next/image'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ManageProfile() {
  const { user } = useAuth()
  const [fitterId, setFitterId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.email) {
      fetchFitterIdAndProjects()
    } else {
      setIsLoading(false)
      setError('User not authenticated')
    }
  }, [user])

  // Fetch fitter_id from 'Fitters' collection based on user's email
  const fetchFitterIdAndProjects = async () => {
    try {
      setIsLoading(true)
      const q = query(collection(db, 'Fitters'), where("email", "==", user?.email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const fitterDoc = querySnapshot.docs[0]
        const fetchedFitterId = fitterDoc.data().fitter_id
        setFitterId(fetchedFitterId)
        fetchProjects(fetchedFitterId) // Fetch projects based on fitter_id
      } else {
        setError('Fitter ID not found')
      }
    } catch (err) {
      setError(`Failed to fetch fitter data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch projects by fitter_id from 'projects' collection
  const fetchProjects = async (fitter_id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const q = query(collection(db, 'projects'), where('fitter_id', '==', fitter_id)) // Fetch projects where fitter_id matches
      const querySnapshot = await getDocs(q)
      const fetchedProjects: Project[] = []
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({
          id: doc.id,
          ...doc.data(),
        } as Project)
      })
      setProjects(fetchedProjects)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(`Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fitterId) {
      toast({
        title: "Error",
        description: "Fitter ID not found.",
        variant: "destructive",
      })
      return
    }

    if (!title || !description || !image) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select an image.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Save the new project to 'projects' collection with fitter_id
      await addDoc(collection(db, 'projects'), {
        fitter_id: fitterId, // Add fitter_id to the project document
        title,
        description,
        imageUrl: image ? URL.createObjectURL(image) : '', // Save image (ideally, you should upload it to a storage service)
      })
      toast({
        title: "Success",
        description: "Project added successfully!",
      })
      setTitle('')
      setDescription('')
      setImage(null)
      fetchProjects(fitterId) // Refetch projects after adding a new one
    } catch (error) {
      console.error('Error adding project:', error)
      toast({
        title: "Error",
        description: `Failed to add project: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const renderProjects = () => {
    if (isLoading) {
      return <div>Loading projects...</div>
    }

    if (error) {
      return <div className="text-red-500">{error}</div>
    }

    if (!projects) {
      return <div>No projects data available. Please try refreshing the page.</div>
    }

    if (projects.length === 0) {
      return <div>No projects found. Add your first project above!</div>
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-4">
              <div className="aspect-video relative mb-4">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Your Public Profile</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Smart Space Installation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Modern Kitchen Transformation"
              />
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the Smart Space installation..."
              />
            </div>
            <div>
              <Label htmlFor="image">Project Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Add Project'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Your Smart Space Installations</h2>
      {renderProjects()}
    </div>
  )
}
