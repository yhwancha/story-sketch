"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { InputType, OutputType } from "@/types/story"
import { FileText, Mic, Image, Video, BookOpen, Film, Music, Edit } from "lucide-react"
import { useState } from "react"

interface FormatSelectionProps {
  onSelect: (inputType: InputType, outputType: OutputType) => void
}

export default function FormatSelection({ onSelect }: FormatSelectionProps) {
  const [selectedInput, setSelectedInput] = useState<InputType | null>(null)
  const [selectedOutput, setSelectedOutput] = useState<OutputType | null>(null)

  const inputOptions: Array<{ type: InputType; icon: React.ReactNode; title: string; description: string }> = [
    {
      type: "text",
      icon: <FileText className="h-10 w-10 mb-2" />,
      title: "Text",
      description: "Write your story or provide a prompt",
    },
    {
      type: "voice",
      icon: <Mic className="h-10 w-10 mb-2" />,
      title: "Voice",
      description: "Record your story idea",
    },
    {
      type: "photo",
      icon: <Image className="h-10 w-10 mb-2" />,
      title: "Photo",
      description: "Upload an image to inspire your story",
    },
    {
      type: "video",
      icon: <Video className="h-10 w-10 mb-2" />,
      title: "Video",
      description: "Upload a video clip to transform",
    },
  ]

  const outputOptions: Array<{ type: OutputType; icon: React.ReactNode; title: string; description: string }> = [
    {
      type: "text",
      icon: <Edit className="h-10 w-10 mb-2" />,
      title: "Editable Text",
      description: "Text-only story you can edit",
    },
    {
      type: "audio",
      icon: <Music className="h-10 w-10 mb-2" />,
      title: "Audio",
      description: "Narrated story with background music",
    },
    {
      type: "storybook",
      icon: <BookOpen className="h-10 w-10 mb-2" />,
      title: "Storybook",
      description: "PDF with text and images",
    },
    {
      type: "video",
      icon: <Film className="h-10 w-10 mb-2" />,
      title: "Video",
      description: "Animated story with visuals",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">What kind of story would you like to create?</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Choose your input format:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inputOptions.map((option) => (
                <Card
                  key={option.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedInput === option.type ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedInput(option.type)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {option.icon}
                    <h4 className="font-bold">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Choose your output format:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {outputOptions.map((option) => (
                <Card
                  key={option.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedOutput === option.type ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedOutput(option.type)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {option.icon}
                    <h4 className="font-bold">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={!selectedInput || !selectedOutput}
          onClick={() => {
            if (selectedInput && selectedOutput) {
              onSelect(selectedInput, selectedOutput)
            }
          }}
        >
          Start Creating
        </Button>
      </div>
    </div>
  )
}

