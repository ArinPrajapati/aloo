import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import ChatService from '../../../lib/chatService'

export async function GET(request: NextRequest) {
    try {
        console.log('GET /api/chats - Starting request')
        const { userId } = await auth()
        console.log('GET /api/chats - User ID:', userId)

        if (!userId) {
            console.log('GET /api/chats - No user ID, returning 401')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const chatId = searchParams.get('chatId')
        console.log('GET /api/chats - Chat ID param:', chatId)

        if (chatId) {
            // Get specific chat
            console.log('GET /api/chats - Getting specific chat:', chatId)
            const chat = await ChatService.getChat(chatId, userId)
            if (!chat) {
                console.log('GET /api/chats - Chat not found')
                return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
            }
            console.log('GET /api/chats - Chat found:', chat)
            return NextResponse.json(chat)
        } else {
            // Get all chats for user
            console.log('GET /api/chats - Getting all chats for user')
            const chats = await ChatService.getChats(userId)
            console.log('GET /api/chats - Chats found:', chats.length)
            return NextResponse.json(chats)
        }
    } catch (error) {
        console.error('Error in chat GET:', error)
        return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('POST /api/chats - Starting request')
        const { userId } = await auth()
        console.log('POST /api/chats - User ID:', userId)

        if (!userId) {
            console.log('POST /api/chats - No user ID, returning 401')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        console.log('POST /api/chats - Request body:', body)
        const { title } = body

        if (!title) {
            console.log('POST /api/chats - No title provided, returning 400')
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        console.log('POST /api/chats - Creating chat with title:', title)
        const chat = await ChatService.createChat(userId, title)
        console.log('POST /api/chats - Chat created successfully:', chat)
        return NextResponse.json(chat)
    } catch (error) {
        console.error('Error in chat POST:', error)
        return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { chatId, title } = body

        if (!chatId || !title) {
            return NextResponse.json({ error: 'Chat ID and title are required' }, { status: 400 })
        }

        await ChatService.updateChatTitle(chatId, userId, title)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in chat PUT:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const chatId = searchParams.get('chatId')

        if (!chatId) {
            return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
        }

        await ChatService.deleteChat(chatId, userId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in chat DELETE:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
