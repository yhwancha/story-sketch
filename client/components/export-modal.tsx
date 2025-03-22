"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Video } from "lucide-react"

interface ExportModalProps {
  storyPanels: Array<{ text: string; imageUrl: string }>
  onClose: () => void
}

export default function ExportModal({ storyPanels, onClose }: ExportModalProps) {
  const [exportType, setExportType] = useState<"pdf" | "video">("pdf")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would:
    // - For PDF: Use html2pdf.js or similar to generate a PDF
    // - For Video: Create a slideshow animation using canvas or a server-side process

    setIsExporting(false)
    onClose()

    // Show success message or trigger download
    alert(`Your story has been exported as a ${exportType === "pdf" ? "PDF" : "video slideshow"}!`)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Your Story</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pdf" onValueChange={(value) => setExportType(value as "pdf" | "video")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText size={16} />
              PDF Storybook
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video size={16} />
              Video Slideshow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="py-4">
            <div className="space-y-4">
              <p>Export your story as a PDF document that you can print or share digitally.</p>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Your story has {storyPanels.length} pages and will be formatted as a storybook.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="video" className="py-4">
            <div className="space-y-4">
              <p>Create a video slideshow with smooth transitions between scenes.</p>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Your {storyPanels.length}-page story will be converted to an MP4 video file.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : `Export as ${exportType === "pdf" ? "PDF" : "Video"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

