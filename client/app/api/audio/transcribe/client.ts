// Client-side functions for the audio transcription API

export async function transcribeAudio(audioBlob: Blob) {
  const formData = new FormData()
  formData.append("audio", audioBlob, "audio.mp3")

  const response = await fetch("/api/audio/transcribe", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.status}`)
  }

  return await response.json()
}

