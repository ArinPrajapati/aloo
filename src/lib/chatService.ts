import prisma from './prisma'

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

export class ChatService {
    // Get all chats for a user
    static async getChats(userId: string): Promise<Chat[]> {
        try {
            const chats = await prisma.chat.findMany({
                where: { userId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            })

            return chats.map(chat => ({
                id: chat.id,
                title: chat.title,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
                messages: chat.messages.map(message => ({
                    role: message.role as 'User' | 'Bot',
                    text: message.text,
                    toolOutput: message.toolOutput ? JSON.parse(message.toolOutput) : undefined
                }))
            }))
        } catch (error) {
            console.error('Error fetching chats:', error)
            return []
        }
    }

    // Get a specific chat
    static async getChat(chatId: string, userId: string): Promise<Chat | null> {
        try {
            const chat = await prisma.chat.findFirst({
                where: {
                    id: chatId,
                    userId
                },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            })

            if (!chat) return null

            return {
                id: chat.id,
                title: chat.title,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
                messages: chat.messages.map(message => ({
                    role: message.role as 'User' | 'Bot',
                    text: message.text,
                    toolOutput: message.toolOutput ? JSON.parse(message.toolOutput) : undefined
                }))
            }
        } catch (error) {
            console.error('Error fetching chat:', error)
            return null
        }
    }

    // Create a new chat
    static async createChat(userId: string, title: string): Promise<Chat> {
        try {
            const chat = await prisma.chat.create({
                data: {
                    title,
                    userId
                },
                include: {
                    messages: true
                }
            })

            return {
                id: chat.id,
                title: chat.title,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
                messages: []
            }
        } catch (error) {
            console.error('Error creating chat:', error)
            throw new Error('Failed to create chat')
        }
    }

    // Add a message to a chat
    static async addMessage(
        chatId: string,
        userId: string,
        role: 'User' | 'Bot',
        text: string,
        toolOutput?: any
    ): Promise<void> {
        try {
            // Verify chat belongs to user
            const chat = await prisma.chat.findFirst({
                where: { id: chatId, userId }
            })

            if (!chat) {
                throw new Error('Chat not found or access denied')
            }

            await prisma.message.create({
                data: {
                    chatId,
                    role,
                    text,
                    toolOutput: toolOutput ? JSON.stringify(toolOutput) : null
                }
            })

            // Update chat's updatedAt timestamp
            await prisma.chat.update({
                where: { id: chatId },
                data: { updatedAt: new Date() }
            })
        } catch (error) {
            console.error('Error adding message:', error)
            throw new Error('Failed to add message')
        }
    }

    // Update chat title
    static async updateChatTitle(chatId: string, userId: string, title: string): Promise<void> {
        try {
            await prisma.chat.updateMany({
                where: {
                    id: chatId,
                    userId
                },
                data: { title }
            })
        } catch (error) {
            console.error('Error updating chat title:', error)
            throw new Error('Failed to update chat title')
        }
    }

    // Delete a chat
    static async deleteChat(chatId: string, userId: string): Promise<void> {
        try {
            await prisma.chat.deleteMany({
                where: {
                    id: chatId,
                    userId
                }
            })
        } catch (error) {
            console.error('Error deleting chat:', error)
            throw new Error('Failed to delete chat')
        }
    }

    // Delete all chats for a user
    static async deleteAllChats(userId: string): Promise<void> {
        try {
            await prisma.chat.deleteMany({
                where: { userId }
            })
        } catch (error) {
            console.error('Error deleting all chats:', error)
            throw new Error('Failed to delete all chats')
        }
    }

    // Migrate localStorage data to database
    static async migrateFromLocalStorage(userId: string, localChats: Chat[]): Promise<void> {
        try {
            for (const localChat of localChats) {
                // Create the chat
                const newChat = await prisma.chat.create({
                    data: {
                        title: localChat.title,
                        userId
                    }
                })

                // Add all messages
                for (const message of localChat.messages) {
                    await prisma.message.create({
                        data: {
                            chatId: newChat.id,
                            role: message.role,
                            text: message.text,
                            toolOutput: message.toolOutput ? JSON.stringify(message.toolOutput) : null
                        }
                    })
                }
            }
        } catch (error) {
            console.error('Error migrating localStorage data:', error)
            throw new Error('Failed to migrate localStorage data')
        }
    }
}

export default ChatService
