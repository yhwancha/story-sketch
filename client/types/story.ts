export type InputType = "text" | "voice" | "photo" | "video"
export type OutputType = "storybook" | "video" | "audio" | "text"

export interface ContentItem {
  type: "text" | "image" | "audio" | "video"
  content: any
  timestamp?: number
}

export interface StoryState {
  step: "format-selection" | "creation" | "export"
  inputType: InputType | null
  outputType: OutputType | null
  content: ContentItem[]
  title: string
}

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  attachments?: {
    type: "image" | "audio" | "video"
    url: string
  }[]
}

