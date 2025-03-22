"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VideoIcon, Upload } from "lucide-react"

interface VideoInputPanelProps {
  onUpload: (url: string) => void
}

export default function VideoInputPanel({ onUpload }: VideoInputPanelProps) {
  const [isDragging, setIsDragging] = useState(false)

  // In a real app, this would upload the file to a storage service
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file")
      return
    }

    // Simulate file upload with a placeholder
    setTimeout(() => {
      const placeholderUrl = `/placeholder.svg?height=300&width=500&text=${encodeURIComponent("Uploaded Video")}`
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
          <VideoIcon className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-medium">Drag and drop a video</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>

          <Input
            type="file"
            accept="video/*"
            className="hidden"
            id="video-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files[0])
              }
            }}
          />
          <label htmlFor="video-upload">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Choose Video
            </Button>
          </label>
        </div>
      </div>
    </div>
  )
}

