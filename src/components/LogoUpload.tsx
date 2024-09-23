'use client'

import { useState, useRef, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { storage, db, auth } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Loader2 } from 'lucide-react'
import { User } from 'firebase/auth';

interface LogoUploadProps {
  fitterId: string
  currentLogo: string | null
  onLogoUpdate: (newLogoUrl: string) => void
}

export function LogoUpload({ fitterId, currentLogo, onLogoUpdate }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload a logo.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const storageRef = ref(storage, `fitter-logos/${fitterId}/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await updateDoc(doc(db, 'Fitters', fitterId), {
        logo_url: downloadURL
      })

      onLogoUpdate(downloadURL)

      toast({
        title: "Logo uploaded successfully",
        description: "Your new logo has been uploaded and saved.",
      })
    } catch (error) {
      console.error("Error uploading logo:", error)
      let errorMessage = "There was an error uploading your logo. Please try again."
      
      if ((error as any).code === 'storage/unauthorized') {
        errorMessage = "You don't have permission to upload files. Please check your authentication."
      } else if ((error as any).code === 'storage/canceled') {
        errorMessage = "Upload was canceled. Please try again."
      } else if ((error as any).code === 'storage/unknown') {
        errorMessage = "An unknown error occurred. Please try again later."
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative inline-block">
      {currentLogo ? (
        <img src={currentLogo} alt="Current logo" className="w-24 h-24 object-cover rounded-full" />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-xs">No Logo</span>
        </div>
      )}
      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-0 right-0 rounded-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || !user}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading || !user}
      />
    </div>
  )
}