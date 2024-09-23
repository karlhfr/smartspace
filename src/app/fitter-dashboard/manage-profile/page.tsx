// src/app/fitter-dashboard/manage-profile/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createProject, getFitterProjects, Project } from '@/lib/projects'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import Image from 'next/image'

export default function ManageProfile() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.email) {
      fetchProjects()
    } else {
      setIsLoading(false)
      setError('User not authenticated')
    }
  }, [user])

  const fetchProjects = async () => {
    if (user?.email) {
      setIsLoading(true)
      setError(null)
      try {
        console.log('Fetching projects for user:', user.email);
        const fetchedProjects = await getFitterProjects(user.email)
        console.log('Fetched projects:', fetchedProjects);
        setProjects(fetchedProjects)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(`Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User not authenticated.",
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
      await createProject(user.email, title, description, image)
      toast({
        title: "Success",
        description: "Project added successfully!",
      })
      setTitle('')
      setDescription('')
      setImage(null)
      fetchProjects()
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

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Please log in to manage your profile.</div>
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