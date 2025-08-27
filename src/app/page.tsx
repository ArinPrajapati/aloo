'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import type React from 'react'

import { useTheme } from '../context/theme-context'
import type { Chat, ChatMessage } from '../type'
import { useChats } from '../hooks/useChats'

import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  MessageInput,
  WelcomeScreen,
} from '../components'

export default function Home() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const {
    chats,
    loading: chatsLoading,
    createChat,
    addMessage,
    updateChatTitle,
    deleteChat: deleteChatFromDB
  } = useChats()
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoaded, router])

  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id)
    }
  }, [chats, activeChatId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, loading])

  const activeChat = chats.find((c) => c.id === activeChatId)

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !activeChat) return

    // Add user message to database
    await addMessage(activeChat.id, 'User', input)

    // Update chat title if this is the first message
    if (activeChat.messages.length === 0) {
      const newTitle = input.length > 30 ? input.slice(0, 30) + '...' : input
      await updateChatTitle(activeChat.id, newTitle)
    }

    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          history: [...activeChat.messages, { role: 'User', text: currentInput }]
        }),
      })
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Add bot response to database
      await addMessage(activeChat.id, 'Bot', data.reply, data.toolOutput)
    } catch (error) {
      // Add error message to database
      await addMessage(activeChat.id, 'Bot', 'Sorry, I encountered an error. Please try again.')
    }

    setLoading(false)
  }, [input, activeChat, addMessage, updateChatTitle])

  const createNewChat = useCallback(async () => {
    const newChat = await createChat('New Chat')
    if (newChat) {
      setActiveChatId(newChat.id)
    }
  }, [createChat])

  const handleDeleteChat = useCallback(async (id: string) => {
    await deleteChatFromDB(id)

    if (activeChatId === id) {
      if (chats.length > 1) {
        const remainingChats = chats.filter(chat => chat.id !== id)
        setActiveChatId(remainingChats[0]?.id || null)
      } else {
        setActiveChatId(null)
      }
    }
  }, [deleteChatFromDB, activeChatId, chats])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
  }, [])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  // Handle authentication loading
  if (!isLoaded || chatsLoading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--aloo-background)' }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            🥔
          </div>
          <p style={{ color: 'var(--aloo-text-secondary)' }}>Loading AlooChat...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null // Redirect handled in useEffect
  }

  return (
    <div className="flex h-screen" style={{ background: 'var(--aloo-background)' }}>
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeChat ? (
          <>
            <ChatHeader chat={activeChat} />
            <MessageList
              ref={chatEndRef}
              messages={activeChat.messages}
              loading={loading}
            />
            <MessageInput
              input={input}
              loading={loading}
              onInputChange={handleInputChange}
              onSendMessage={sendMessage}
              onKeyDown={handleKeyPress}
            />
          </>
        ) : (
          <WelcomeScreen onNewChat={createNewChat} />
        )}
      </div>
    </div>
  )
}
