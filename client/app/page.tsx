"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import FormatSelection from "@/components/format-selection"
import ChatInterface from "@/components/chat-interface"
import StoryPreview from "@/components/story-preview"
import type { InputType, OutputType, StoryState } from "@/types/story"

export default function Home() {
  const [storyState, setStoryState] = useState<StoryState>({
    step: "format-selection",
    inputType: null,
    outputType: null,
    content: [],
    title: "",
  })

  const handleFormatSelection = (inputType: InputType, outputType: OutputType) => {
    setStoryState({
      ...storyState,
      step: "creation",
      inputType,
      outputType,
    })
  }

  const handleStoryUpdate = (updatedContent: Array<{ type: string; content: any }>) => {
    setStoryState({
      ...storyState,
      content: updatedContent,
    })
  }

  const handleTitleUpdate = (title: string) => {
    setStoryState({
      ...storyState,
      title,
    })
  }

  const resetStory = () => {
    setStoryState({
      step: "format-selection",
      inputType: null,
      outputType: null,
      content: [],
      title: "",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-2">StorySketch</h1>
          <p className="text-lg text-muted-foreground">Create beautiful stories with AI-powered assistance</p>
        </div>

        {storyState.step === "format-selection" ? (
          <FormatSelection onSelect={handleFormatSelection} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatInterface
                inputType={storyState.inputType!}
                outputType={storyState.outputType!}
                content={storyState.content}
                onContentUpdate={handleStoryUpdate}
                onTitleUpdate={handleTitleUpdate}
              />
            </div>
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-4">
                <StoryPreview
                  title={storyState.title}
                  content={storyState.content}
                  outputType={storyState.outputType!}
                  onReset={resetStory}
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

