import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import ChatService from '../../../../lib/chatService'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { chatId, role, text, toolOutput } = body

    if (!chatId || !role || !text) {
      return NextResponse.json({ error: 'Chat ID, role, and text are required' }, { status: 400 })
    }

    if (role !== 'User' && role !== 'Bot') {
      return NextResponse.json({ error: 'Role must be either "User" or "Bot"' }, { status: 400 })
    }

    await ChatService.addMessage(chatId, userId, role, text, toolOutput)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in message POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
