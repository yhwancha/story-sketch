"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { ContentItem, OutputType } from "@/types/story"
import { Download, FileText, Film, Music, Edit, RefreshCw } from "lucide-react"

interface StoryPreviewProps {
  title: string
  content: ContentItem[]
  outputType: OutputType
  onReset: () => void
}

export default function StoryPreview({ title, content, outputType, onReset }: StoryPreviewProps) {
  const [showExportModal, setShowExportModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsExporting(false)
    setShowExportModal(false)

    // Show success message
    alert(`Your story has been exported as a ${outputType}!`)
  }

  const getOutputIcon = () => {
    switch (outputType) {
      case "storybook":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Film className="h-5 w-5" />
      case "audio":
        return <Music className="h-5 w-5" />
      case "text":
        return <Edit className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-center">
          <CardTitle>Story Preview</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-1" />
              New Story
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 flex-1 overflow-auto">
        {content.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">Your story will appear here as you create it.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{title || "Untitled Story"}</h2>

            {content.map((item, index) => (
              <div key={index} className="mb-4">
                {item.type === "text" && <p className="text-lg">{item.content}</p>}
                {item.type === "image" && (
                  <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                    <img
                      src={item.content || "/placeholder.svg"}
                      alt="Story illustration"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                {item.type === "video" && (
                  <div className="relative h-[300px] w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <Film className="h-12 w-12 text-white opacity-50" />
                  </div>
                )}
                {item.type === "audio" && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-center text-muted-foreground">[Audio Narration]</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-0 pt-4 border-t">
        <Button
          className="w-full flex items-center gap-2"
          disabled={content.length === 0}
          onClick={() => setShowExportModal(true)}
        >
          <Download className="h-4 w-4" />
          Export as {outputType.charAt(0).toUpperCase() + outputType.slice(1)}
        </Button>
      </CardFooter>

      {showExportModal && (
        <Dialog open={true} onOpenChange={setShowExportModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Export Your Story</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mb-4">
                {getOutputIcon()}
                <div>
                  <h3 className="font-medium">
                    {outputType === "storybook" && "PDF Storybook"}
                    {outputType === "video" && "Video Animation"}
                    {outputType === "audio" && "Audio Narration"}
                    {outputType === "text" && "Editable Text"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {content.length} {content.length === 1 ? "item" : "items"} in your story
                  </p>
                </div>
              </div>

              {outputType === "storybook" && (
                <div className="space-y-2">
                  <p>Your story will be exported as a PDF document with text and images.</p>
                </div>
              )}

              {outputType === "video" && (
                <div className="space-y-2">
                  <p>Your story will be exported as an MP4 video with animations and transitions.</p>
                </div>
              )}

              {outputType === "audio" && (
                <div className="space-y-2">
                  <p>Your story will be exported as an MP3 audio file with narration.</p>
                </div>
              )}

              {outputType === "text" && (
                <div className="space-y-2">
                  <p>Your story will be exported as a text document that you can edit further.</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? "Exporting..." : "Export Now"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

