'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '../../components/ui/sidebar'
import { AppSidebar } from '../../components/AppSidebar'
import { useChats } from '../../hooks/useChats'

// Create a context for sharing chat state
import { createContext, useContext } from 'react'
import type { Chat } from '../../type'

interface ChatContextType {
  chats: Chat[]
  activeChatId: string | null
  setActiveChatId: (id: string | null) => void
  loading: boolean
  createNewChat: () => Promise<void>
  handleDeleteChat: (id: string) => Promise<void>
  addMessage: (chatId: string, role: 'User' | 'Bot', text: string, toolOutput?: any) => Promise<boolean>
  updateChatTitle: (chatId: string, title: string) => Promise<boolean>
}

const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatLayout')
  }
  return context
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const {
    chats,
    loading: chatsLoading,
    createChat,
    deleteChat: deleteChatFromDB,
    addMessage,
    updateChatTitle
  } = useChats()
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

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

  const chatContextValue: ChatContextType = {
    chats,
    activeChatId,
    setActiveChatId,
    loading: chatsLoading,
    createNewChat,
    handleDeleteChat,
    addMessage,
    updateChatTitle
  }
  
  return (
    <ChatContext.Provider value={chatContextValue}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-aloo-background">
          <AppSidebar 
            user={user}
            chats={chats}
            activeChatId={activeChatId}
            onNewChat={createNewChat}
            onSelectChat={setActiveChatId}
            onDeleteChat={handleDeleteChat}
          />
          <SidebarInset className="flex-1">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ChatContext.Provider>
  )
}
