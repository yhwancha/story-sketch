"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Play, Loader2, Download, Trash2, Check, Edit, Save, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { transcribeAudio } from "@/app/api/audio/transcribe/client"

interface VoiceInputPanelProps {
  onTranscription: (text: string) => void
  onSend: () => void
}

export default function VoiceInputPanel({ onTranscription, onSend }: VoiceInputPanelProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribedText, setTranscribedText] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Reset previous recording if any
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
        setAudioBlob(null)
        setTranscribedText(null)
        setIsEditing(false)
      }

      audioChunksRef.current = []
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mpeg" })
        const url = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(url)

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop())
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Failed to access microphone. Please check your microphone permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "recording.mp3"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setAudioBlob(null)
      setTranscribedText(null)
      setIsEditing(false)
    }
  }

  const handleTranscribeAudio = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    setTranscribedText(null)

    try {
      // Use the API client function
      const data = await transcribeAudio(audioBlob)

      const text = data.text || "Failed to transcribe audio"

      // Store the transcribed text
      setTranscribedText(text)

      // Update the transcription in parent component
      onTranscription(text)
    } catch (error) {
      console.error("Error transcribing audio:", error)
      alert("An error occurred while transcribing audio")
      onTranscription("Failed to transcribe audio")
      setTranscribedText("Failed to transcribe audio")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleSendTranscription = () => {
    if (transcribedText) {
      // Make sure the parent component has the latest transcribed text
      onTranscription(transcribedText)
      // Then trigger the send action to add it to the chat
      setTimeout(() => {
        onSend()
      }, 100)
    }
  }

  const startEditing = () => {
    if (transcribedText) {
      setEditedText(transcribedText)
      setIsEditing(true)
    }
  }

  const saveEdit = () => {
    setTranscribedText(editedText)
    onTranscription(editedText)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-center">
        {isRecording ? (
          <div className="text-red-500 animate-pulse font-medium">Recording... {formatTime(recordingTime)}</div>
        ) : audioUrl ? (
          <div className="text-green-600 font-medium">Recording complete</div>
        ) : (
          <div className="text-muted-foreground">Press the microphone button to start recording</div>
        )}
      </div>

      <div className="flex gap-4 items-center justify-center">
        {!isRecording ? (
          <>
            <Button
              onClick={startRecording}
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
            >
              <Mic className="h-6 w-6" />
            </Button>

            {audioUrl && (
              <Button
                onClick={playRecording}
                variant="outline"
                size="lg"
                className="rounded-full h-16 w-16 flex items-center justify-center"
              >
                <Play className="h-6 w-6" />
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            size="lg"
            className="rounded-full h-16 w-16 flex items-center justify-center"
          >
            <Square className="h-6 w-6" />
          </Button>
        )}
      </div>

      {audioUrl && (
        <div className="w-full space-y-4">
          <div className="relative">
            <div className="flex items-center">
              <audio ref={audioRef} src={audioUrl} controls className="w-full" />
              <div className="flex gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadRecording}
                  className="h-10 w-10"
                  title="Download recording"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={deleteRecording}
                  className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Delete recording"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {transcribedText ? (
            <Card className="w-full overflow-hidden">
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="min-h-[100px] w-full"
                      placeholder="Edit transcription text..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm mb-1">Transcription Result:</h4>
                        <p className="text-sm break-words">{transcribedText}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={startEditing}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Text
                      </Button>
                      <Button size="sm" onClick={handleSendTranscription}>
                        Use This Text
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ) : (
            <Button onClick={handleTranscribeAudio} disabled={isTranscribing} className="w-full">
              {isTranscribing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                "Transcribe Audio"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

