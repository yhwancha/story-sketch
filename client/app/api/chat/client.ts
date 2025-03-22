// Client-side functions for the chat API

export async function sendChatMessage(message: string, inputType?: string, outputType?: string, history?: any[]) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
//      inputType,
//      outputType,
//      history,
    }),
  })

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`)
  }

  return await response.json()
}

