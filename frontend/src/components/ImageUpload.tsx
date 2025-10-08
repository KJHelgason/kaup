"use client"

import { useState, useRef } from 'react'
import { X, Loader2, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  label?: string
  type?: 'profile' | 'listing'
}

export function ImageUpload({ onUpload, currentImage, label = 'Upload Image', type = 'listing' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deleteOldImage = async (imageUrl: string) => {
    try {
      await fetch(`http://localhost:5075/api/upload/image?imageUrl=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting old image:', error)
      // Don't fail the upload if deletion fails
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to backend
    setUploading(true)
    try {
      // Delete old image if it exists
      if (currentImage && currentImage.includes('amazonaws.com')) {
        await deleteOldImage(currentImage)
      }

      const formData = new FormData()
      formData.append('file', file)

      const endpoint = type === 'profile' ? 'profile-image' : 'listing-images'
      const response = await fetch(`http://localhost:5075/api/upload/${endpoint}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const url = type === 'profile' ? data.url : data.urls[0]
      onUpload(url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    // Delete from S3 if it's an S3 image
    if (currentImage && currentImage.includes('amazonaws.com')) {
      await deleteOldImage(currentImage)
    }
    
    setPreview(null)
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={preview.startsWith('data:') || preview.startsWith('http')}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-64 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors bg-muted/50 flex flex-col items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xs text-muted-foreground/75">JPG, PNG, or WebP (max 5MB)</p>
            </>
          )}
        </button>
      )}
    </div>
  )
}
