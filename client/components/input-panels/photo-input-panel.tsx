"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus, Upload } from "lucide-react"

interface PhotoInputPanelProps {
  onUpload: (url: string) => void
}

export default function PhotoInputPanel({ onUpload }: PhotoInputPanelProps) {
  const [isDragging, setIsDragging] = useState(false)

  // In a real app, this would upload the file to a storage service
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Simulate file upload with a placeholder
    setTimeout(() => {
      const placeholderUrl = `/placeholder.svg?height=300&width=500&text=${encodeURIComponent("Uploaded Image")}`
      onUpload(placeholderUrl)
    }, 1000)
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0])
          }
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <ImagePlus className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-medium">Drag and drop an image</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>

          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files[0])
              }
            }}
          />
          <label htmlFor="photo-upload">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          </label>
        </div>
      </div>
    </div>
  )
}

