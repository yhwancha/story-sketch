import { type NextRequest, NextResponse } from "next/server"

// 외부 Gemini API 엔드포인트
const CHAT_API_ENDPOINT = "http://34.81.186.95:8000/api/v1/chats"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Request body received:", body)

    // 외부 API로 요청 전달
    console.log("Sending request to external API:", CHAT_API_ENDPOINT)
    const response = await fetch(CHAT_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("External API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("External API error:", errorData)
      throw new Error(`External API returned ${response.status}`)
    }

    // 응답 데이터를 그대로 반환
    const data = await response.json()
    console.log("External API response data:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to get response from chat service", details: (error as Error).message },
      { status: 500 },
    )
  }
}

