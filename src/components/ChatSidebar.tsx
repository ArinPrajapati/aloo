"use client"
import { Sun, Moon, Plus, Trash2, MessageCircle } from "lucide-react"
import { useTheme } from "../context/theme-context"
import type { Chat } from "../type"

interface ChatSidebarProps {
    chats: Chat[]
    activeChatId: string | null
    onNewChat: () => void
    onSelectChat: (id: string) => void
    onDeleteChat: (id: string) => void
}

export default function ChatSidebar({
    chats,
    activeChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
}: ChatSidebarProps) {
    const { theme, toggleTheme } = useTheme()

    return (
        <div
            className={`w-80 flex flex-col border-r transition-colors duration-200 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="text-3xl">🥔</div>
                        <div>
                            <h1 className="text-xl font-bold">PotatoChat</h1>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}></p>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
                            }`}
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <button
                    onClick={onNewChat}
                    className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg font-medium transition-colors ${theme === "dark"
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                >
                    <Plus size={18} />
                    <span>New Chat</span>
                </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    {chats.length === 0 ? (
                        <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No chats yet</p>
                            <p className="text-sm">Start a new conversation!</p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${chat.id === activeChatId
                                    ? theme === "dark"
                                        ? "bg-orange-600 text-white"
                                        : "bg-orange-500 text-white"
                                    : theme === "dark"
                                        ? "hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex-1 truncate pr-2" onClick={() => onSelectChat(chat.id)}>
                                    <div className="font-medium truncate">{chat.title}</div>
                                    <div
                                        className={`text-sm truncate ${chat.id === activeChatId
                                            ? "text-orange-100"
                                            : theme === "dark"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {chat.messages.length} messages
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDeleteChat(chat.id)
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${chat.id === activeChatId
                                        ? "hover:bg-orange-700 text-orange-100"
                                        : theme === "dark"
                                            ? "hover:bg-red-600 text-red-400"
                                            : "hover:bg-red-100 text-red-500"
                                        }`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
