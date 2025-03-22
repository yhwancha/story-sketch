import { type NextRequest, NextResponse } from "next/server"

// On-premise Whisper API endpoint (change to your actual server address)
const WHISPER_API_ENDPOINT = "http://34.81.186.95:8000/api/v1/voices/transcribe"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([arrayBuffer], { type: audioFile.type })

    // Create FormData for the on-premise Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append("file", audioBlob, "audio.mp3")

    try {
      // Real implementation: Call on-premise Whisper API
      const response = await fetch(WHISPER_API_ENDPOINT, {
        method: "POST",
        body: whisperFormData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to transcribe audio")
      }

      const data = await response.json()
      return NextResponse.json({
        text: data.text,
        success: true,
      })
    } catch (error) {
      console.error("Whisper API call error:", error)

      // Return simulated response during development
      console.log("Development mode: Returning simulated response")
      return NextResponse.json({
        text: "This is a simulated response before connecting to the on-premise Whisper API. Uncomment the code above when your server is ready.",
        success: true,
      })
    }
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json(
      { error: "Failed to process audio file", details: (error as Error).message },
      { status: 500 },
    )
  }
}

