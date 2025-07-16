import { useTheme } from "../context/theme-context"
import type { Chat } from "../type"

interface ChatHeaderProps {
    chat: Chat
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
    const { theme } = useTheme()

    return (
        <div
            className={`p-4 border-b flex items-center justify-between ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
        >
            <div>
                <h2 className="font-semibold text-lg">{chat.title}</h2>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {chat.messages.length} messages
                </p>
            </div>
        </div>
    )
}
