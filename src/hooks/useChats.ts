'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface ChatMessage {
    role: 'User' | 'Bot'
    text: string
    toolOutput?: any
}

interface Chat {
    id: string
    title: string
    messages: ChatMessage[]
    createdAt?: Date
    updatedAt?: Date
}

export function useChats() {
    const { user } = useUser()
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadChats = async () => {
        if (!user?.id) return

        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/chats')

            if (!response.ok) {
                // If it's a 500 error (server/database issue), try localStorage fallback
                if (response.status >= 500) {
                    console.warn('Database unavailable, falling back to localStorage')
                    const { loadChatsFromLocalStorage } = await import('../utils/storage')
                    const localChats = loadChatsFromLocalStorage()
                    setChats(localChats)
                    return
                }
                throw new Error(`Failed to load chats: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            setChats(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load chats'
            setError(errorMessage)
            console.error('Error loading chats:', err)

            // Try localStorage as fallback
            try {
                console.warn('Attempting localStorage fallback...')
                const { loadChatsFromLocalStorage } = await import('../utils/storage')
                const localChats = loadChatsFromLocalStorage()
                setChats(localChats)
                setError(null) // Clear error if localStorage works
            } catch (fallbackError) {
                console.error('localStorage fallback also failed:', fallbackError)
            }
        } finally {
            setLoading(false)
        }
    }

    const createChat = async (title: string): Promise<Chat | null> => {
        if (!user?.id) return null

        try {
            const response = await fetch('/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Create chat error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                })
                throw new Error(`Failed to create chat: ${response.status} - ${errorText}`)
            }

            const newChat = await response.json()
            setChats(prev => [newChat, ...prev])
            return newChat
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create chat'
            setError(errorMessage)
            console.error('Error creating chat:', err)
            return null
        }
    }

    const addMessage = async (
        chatId: string,
        role: 'User' | 'Bot',
        text: string,
        toolOutput?: any
    ): Promise<boolean> => {
        if (!user?.id) return false

        try {
            const response = await fetch('/api/chats/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId, role, text, toolOutput }),
            })

            if (!response.ok) {
                throw new Error('Failed to add message')
            }

            // Update local state
            setChats(prev => prev.map(chat =>
                chat.id === chatId
                    ? {
                        ...chat,
                        messages: [...chat.messages, { role, text, toolOutput }],
                        updatedAt: new Date()
                    }
                    : chat
            ))

            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add message')
            console.error('Error adding message:', err)
            return false
        }
    }

    const updateChatTitle = async (chatId: string, title: string): Promise<boolean> => {
        if (!user?.id) return false

        try {
            const response = await fetch('/api/chats', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId, title }),
            })

            if (!response.ok) {
                throw new Error('Failed to update chat title')
            }

            // Update local state
            setChats(prev => prev.map(chat =>
                chat.id === chatId ? { ...chat, title } : chat
            ))

            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update chat title')
            console.error('Error updating chat title:', err)
            return false
        }
    }

    const deleteChat = async (chatId: string): Promise<boolean> => {
        if (!user?.id) return false

        try {
            const response = await fetch(`/api/chats?chatId=${chatId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete chat')
            }

            // Update local state
            setChats(prev => prev.filter(chat => chat.id !== chatId))

            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete chat')
            console.error('Error deleting chat:', err)
            return false
        }
    }

    const getChat = async (chatId: string): Promise<Chat | null> => {
        if (!user?.id) return null

        try {
            const response = await fetch(`/api/chats?chatId=${chatId}`)

            if (!response.ok) {
                throw new Error('Failed to get chat')
            }

            return await response.json()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get chat')
            console.error('Error getting chat:', err)
            return null
        }
    }

    useEffect(() => {
        loadChats()
    }, [user?.id])

    return {
        chats,
        loading,
        error,
        loadChats,
        createChat,
        addMessage,
        updateChatTitle,
        deleteChat,
        getChat,
    }
}

export default useChats
