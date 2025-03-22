"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

interface TextInputPanelProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isProcessing: boolean
}

export default function TextInputPanel({ value, onChange, onSend, isProcessing }: TextInputPanelProps) {
  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your story or instructions..."
        className="min-h-[80px] flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSend()
          }
        }}
      />
      <Button onClick={onSend} disabled={!value.trim() || isProcessing} className="mb-1">
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </div>
  )
}

