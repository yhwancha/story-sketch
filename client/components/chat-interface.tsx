"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import type { InputType, OutputType, ContentItem, Message } from "@/types/story"
import { Video, Sparkles } from "lucide-react"
import TextInputPanel from "./input-panels/text-input-panel"
import VoiceInputPanel from "./input-panels/voice-input-panel"
import PhotoInputPanel from "./input-panels/photo-input-panel"
import VideoInputPanel from "./input-panels/video-input-panel"
import { sendChatMessage } from "@/app/api/chat/client"

interface ChatInterfaceProps {
  inputType: InputType
  outputType: OutputType
  content: ContentItem[]
  onContentUpdate: (content: ContentItem[]) => void
  onTitleUpdate: (title: string) => void
}

export default function ChatInterface({
  inputType,
  outputType,
  content,
  onContentUpdate,
  onTitleUpdate,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `Welcome to StorySketch! I'll help you create a ${outputType} using ${inputType} input. What would you like to create today?`,
      timestamp: Date.now(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && inputType === "text") return

    // Create a user message with the current input
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: Date.now(),
    }

    // Add the user message to the chat
    setMessages((prev) => [...prev, userMessage])

    // Clear the input field
    const currentMessage = inputMessage
    setInputMessage("")

    // Set processing state
    setIsProcessing(true)

    try {
      // Use the API utility function
      const data = await sendChatMessage(
        currentMessage,
        inputType,
        outputType,
        messages.map((msg) => ({
          role: msg.role,
          content: msg.content || msg.message,
        })),
      )

      console.log("API response:", data)

      // AI 응답 메시지 추가 - 외부 API 응답 형식에 맞게 수정
      const aiResponse: Message = {
        role: "assistant",
        content: data.response || data.message || data.content || "I'm not sure how to respond to that.",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiResponse])

      // 콘텐츠 생성 (API 응답에 콘텐츠가 포함된 경우)
      if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        onContentUpdate([...content, ...data.content])
      } else if (data.story_content && Array.isArray(data.story_content)) {
        // 외부 API가 story_content 필드를 사용하는 경우
        onContentUpdate([...content, ...data.story_content])
      } else {
        // 기존 방식으로 콘텐츠 생성 (API가 콘텐츠를 제공하지 않는 경우)
        generateContentFromMessage(currentMessage)
      }

      // 제목 업데이트 (API 응답에 제목이 포함된 경우)
      if (data.title) {
        onTitleUpdate(data.title)
      } else if (data.story_title) {
        // 외부 API가 story_title 필드를 사용하는 경우
        onTitleUpdate(data.story_title)
      } else if (currentMessage.toLowerCase().includes("title")) {
        onTitleUpdate("The Adventurous Journey")
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // 오류 메시지 추가
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  // 기존 콘텐츠 생성 함수 (API가 콘텐츠를 제공하지 않는 경우 사용)
  const generateContentFromMessage = (message: string) => {
    if (message.toLowerCase().includes("generate") || message.toLowerCase().includes("create")) {
      if (outputType === "storybook" || outputType === "text") {
        const newContent: ContentItem[] = [
          {
            type: "text",
            content:
              "Once upon a time in a magical forest, a young explorer discovered a hidden path that led to an ancient temple. The temple walls were covered in mysterious symbols that seemed to glow in the dim light.",
            timestamp: Date.now(),
          },
          {
            type: "image",
            content: `/placeholder.svg?height=300&width=500&text=${encodeURIComponent("Ancient Temple in Forest")}`,
            timestamp: Date.now(),
          },
        ]
        onContentUpdate([...content, ...newContent])
      } else if (outputType === "video") {
        onContentUpdate([
          ...content,
          {
            type: "video",
            content: `/placeholder.svg?height=300&width=500&text=${encodeURIComponent("Video Story Segment")}`,
            timestamp: Date.now(),
          },
        ])
      } else if (outputType === "audio") {
        onContentUpdate([
          ...content,
          {
            type: "audio",
            content: "Audio narration would play here",
            timestamp: Date.now(),
          },
        ])
      }
    }
  }

  // Add a text input panel regardless of the input type
  const renderTextInput = () => {
    return (
      <div className="flex items-end gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[80px] flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />
        <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isProcessing} className="mb-1">
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  const renderInputPanel = () => {
    switch (inputType) {
      case "voice":
        return (
          <div className="space-y-6">
            <VoiceInputPanel onTranscription={setInputMessage} onSend={handleSendMessage} />
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Or type your message:</h3>
              {renderTextInput()}
            </div>
          </div>
        )
      case "text":
        return (
          <TextInputPanel
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            isProcessing={isProcessing}
          />
        )
      case "photo":
        return (
          <div className="space-y-6">
            <PhotoInputPanel
              onUpload={(url) => {
                const userMessage: Message = {
                  role: "user",
                  content: "I've uploaded an image for my story.",
                  timestamp: Date.now(),
                  attachments: [{ type: "image", url }],
                }
                setMessages((prev) => [...prev, userMessage])
              }}
            />
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Or type your message:</h3>
              {renderTextInput()}
            </div>
          </div>
        )
      case "video":
        return (
          <div className="space-y-6">
            <VideoInputPanel
              onUpload={(url) => {
                const userMessage: Message = {
                  role: "user",
                  content: "I've uploaded a video for my story.",
                  timestamp: Date.now(),
                  attachments: [{ type: "video", url }],
                }
                setMessages((prev) => [...prev, userMessage])
              }}
            />
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Or type your message:</h3>
              {renderTextInput()}
            </div>
          </div>
        )
      default:
        return (
          <TextInputPanel
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            isProcessing={isProcessing}
          />
        )
    }
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <Tabs defaultValue="chat">
        <TabsList className="w-full justify-start px-4 pt-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col h-full">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "system"
                          ? "bg-muted"
                          : "bg-secondary"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content || message.message}</p>
                    {message.attachments?.map((attachment, i) => (
                      <div key={i} className="mt-2">
                        {attachment.type === "image" && (
                          <div className="relative h-40 w-full rounded overflow-hidden">
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt="User uploaded"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        {attachment.type === "video" && (
                          <div className="relative h-40 w-full rounded overflow-hidden bg-black flex items-center justify-center">
                            <Video className="h-10 w-10 text-white opacity-50" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">{renderInputPanel()}</div>
        </TabsContent>

        <TabsContent value="suggestions" className="h-full">
          <ScrollArea className="h-[calc(100vh-16rem)] p-4">
            <div className="space-y-2">
              <h3 className="font-medium mb-3">Try these prompts:</h3>
              {[
                "Generate a story about a magical forest",
                "Create a character who discovers a hidden treasure",
                "Add a plot twist to my story",
                "Suggest a title for my story",
                "Make the story more exciting",
                "Add a new character to the story",
                "Change the setting to a beach",
                "Make the ending more surprising",
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 px-3 mb-2"
                  onClick={() => {
                    setInputMessage(suggestion)
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

