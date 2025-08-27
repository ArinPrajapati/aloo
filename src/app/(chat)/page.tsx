'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import type React from 'react'

import { useTheme } from '../../context/aloo-theme-context'
import type { ChatMessage } from '../../type'
import { useChatContext } from './layout'

import {
  ChatHeader,
  MessageList,
  MessageInput,
  WelcomeScreen,
} from '../../components'

export default function ChatPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { 
    chats, 
    activeChatId, 
    loading: chatsLoading,
    createNewChat,
    addMessage,
    updateChatTitle
  } = useChatContext()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoaded, router])

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
    <div className="flex flex-col h-full overflow-hidden">
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
  )
}
