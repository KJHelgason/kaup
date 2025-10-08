"use client"

import { useState, useRef } from 'react'
import { X, Loader2, Plus } from 'lucide-react'
import Image from 'next/image'

interface MultipleImageUploadProps {
  onUpload: (urls: string[]) => void
  currentImages?: string[]
  maxImages?: number
}

export function MultipleImageUpload({ onUpload, currentImages = [], maxImages = 10 }: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(currentImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deleteImage = async (imageUrl: string) => {
    try {
      await fetch(`http://localhost:5075/api/upload/image?imageUrl=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      // Don't fail if deletion fails
    }
  }

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check total count
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`)
        return
      }
    }

    // Upload to backend
    setUploading(true)
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))

      const response = await fetch('http://localhost:5075/api/upload/listing-images', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const newImages = [...images, ...data.urls]
      setImages(newImages)
      onUpload(newImages)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index]
    
    // Delete from S3 if it's an S3 image
    if (imageToRemove && imageToRemove.includes('amazonaws.com')) {
      await deleteImage(imageToRemove)
    }
    
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onUpload(newImages)
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelect}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Existing Images */}
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                Main
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors bg-muted/50 flex flex-col items-center justify-center gap-2"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Plus className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Add Image</p>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {images.length} / {maxImages} images • First image will be the main image
      </p>
    </div>
  )
}
