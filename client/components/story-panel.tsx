"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"

interface StoryPanelProps {
  text: string
  imageUrl: string
  pageNumber: number
  onRemove: () => void
}

export default function StoryPanel({ text, imageUrl, pageNumber, onRemove }: StoryPanelProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="relative h-[400px] w-full">
          <Image src={imageUrl || "/placeholder.svg"} alt={text} fill className="object-cover" priority />
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          Page {pageNumber}
        </div>
      </div>
      <div className="p-6">
        <p className="text-lg">{text}</p>
      </div>
    </Card>
  )
}

