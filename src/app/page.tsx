'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type React from 'react'

import { saveChats, loadChats } from '../utils/storage'
import { useTheme } from '../context/theme-context'
import type { Chat, ChatMessage } from '../type'

import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  MessageInput,
  WelcomeScreen,
} from '../components'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const storedChats = loadChats()
    setChats(storedChats)
    if (storedChats.length > 0) {
      setActiveChatId(storedChats[0].id)
    }
  }, [])

  useEffect(() => {
    saveChats(chats)
  }, [chats])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, loading])

  const activeChat = chats.find((c) => c.id === activeChatId)

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return

    const updatedMessages = [
      ...activeChat.messages,
      { role: 'User' as const, text: input },
    ]

    let updatedChatTitle = activeChat.title
    if (activeChat.messages.length === 0) {
      updatedChatTitle = input.length > 30 ? input.slice(0, 30) + '...' : input
    }

    updateChat(activeChat.id, updatedMessages, updatedChatTitle)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: activeChat.messages }),
      })
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      updateChat(
        activeChat.id,
        [
          ...updatedMessages,
          {
            role: 'Bot' as const,
            text: data.reply,
            toolOutput: data.toolOutput,
          },
        ],
        updatedChatTitle
      )
    } catch (error) {
      updateChat(
        activeChat.id,
        [
          ...updatedMessages,
          {
            role: 'Bot' as const,
            text: 'Sorry, I encountered an error. Please try again.',
          },
        ],
        updatedChatTitle
      )
    }

    setLoading(false)
  }

  const updateChat = (id: string, messages: ChatMessage[], title?: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? { ...chat, messages, title: title ?? chat.title }
          : chat
      )
    )
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
    }
    setChats([newChat, ...chats])
    setActiveChatId(newChat.id)
  }

  const deleteChat = (id: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== id)
    setChats(updatedChats)

    if (activeChatId === id) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id)
      } else {
        setActiveChatId(null)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Handle authentication loading
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={deleteChat}
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
              onInputChange={setInput}
              onSendMessage={sendMessage}
              onKeyPress={handleKeyPress}
            />
          </>
        ) : (
          <WelcomeScreen onNewChat={createNewChat} />
        )}
      </div>
    </div>
  )
}
