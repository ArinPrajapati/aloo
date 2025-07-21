import ChatService from '../lib/chatService'

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

// Legacy localStorage functions for backward compatibility and migration
export function loadChatsFromLocalStorage(): Chat[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('potato-chat-data')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing stored chats:', error)
        return []
      }
    }
  }
  return []
}

export function clearLocalStorageChats(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('potato-chat-data')
  }
}

// Database-powered functions
export async function loadChats(userId: string): Promise<Chat[]> {
  try {
    // First, check if there's any localStorage data to migrate
    const localChats = loadChatsFromLocalStorage()
    if (localChats.length > 0) {
      // Check if user already has chats in database
      const dbChats = await ChatService.getChats(userId)
      if (dbChats.length === 0) {
        // Migrate localStorage data to database
        await ChatService.migrateFromLocalStorage(userId, localChats)
        // Clear localStorage after successful migration
        clearLocalStorageChats()
      }
    }

    // Return chats from database
    return await ChatService.getChats(userId)
  } catch (error) {
    console.error('Error loading chats:', error)
    // Fallback to localStorage if database fails
    return loadChatsFromLocalStorage()
  }
}

export async function saveChat(userId: string, chat: Chat): Promise<void> {
  try {
    if (chat.messages.length === 0) {
      // Create empty chat
      await ChatService.createChat(userId, chat.title)
    } else {
      // This function assumes the chat already exists
      // Use addMessage for adding individual messages
      throw new Error('Use addMessage function to add messages to existing chats')
    }
  } catch (error) {
    console.error('Error saving chat:', error)
    throw error
  }
}

export async function createNewChat(userId: string, title: string): Promise<Chat> {
  try {
    return await ChatService.createChat(userId, title)
  } catch (error) {
    console.error('Error creating new chat:', error)
    throw error
  }
}

export async function addMessageToChat(
  chatId: string, 
  userId: string, 
  role: 'User' | 'Bot', 
  text: string, 
  toolOutput?: any
): Promise<void> {
  try {
    await ChatService.addMessage(chatId, userId, role, text, toolOutput)
  } catch (error) {
    console.error('Error adding message to chat:', error)
    throw error
  }
}

export async function updateChatTitle(chatId: string, userId: string, title: string): Promise<void> {
  try {
    await ChatService.updateChatTitle(chatId, userId, title)
  } catch (error) {
    console.error('Error updating chat title:', error)
    throw error
  }
}

export async function deleteChat(chatId: string, userId: string): Promise<void> {
  try {
    await ChatService.deleteChat(chatId, userId)
  } catch (error) {
    console.error('Error deleting chat:', error)
    throw error
  }
}

export async function getChat(chatId: string, userId: string): Promise<Chat | null> {
  try {
    return await ChatService.getChat(chatId, userId)
  } catch (error) {
    console.error('Error getting chat:', error)
    return null
  }
}

// Legacy function for backward compatibility (deprecated)
export function saveChats(chats: Chat[]): void {
  console.warn('saveChats is deprecated. Use database-powered functions instead.')
  if (typeof window !== 'undefined') {
    localStorage.setItem('potato-chat-data', JSON.stringify(chats))
  }
}
