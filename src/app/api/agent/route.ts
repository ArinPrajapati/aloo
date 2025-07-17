import { NextResponse } from 'next/server'
import { processUserQuery } from '@/lib/agent/orchestrator'

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    const result = await processUserQuery(message, history || [])

    return NextResponse.json({
      reply: result.text,
      toolOutput: result.toolOutput,
    })
  } catch (error) {
    console.error('Agent API error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      { error: `Agent processing failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
