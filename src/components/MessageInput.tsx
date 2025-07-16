import type React from "react"
import { Send } from "lucide-react"
import { useTheme } from "../context/theme-context"

interface MessageInputProps {
    input: string
    loading: boolean
    onInputChange: (value: string) => void
    onSendMessage: () => void
    onKeyPress: (e: React.KeyboardEvent) => void
}

export default function MessageInput({
    input,
    loading,
    onInputChange,
    onSendMessage,
    onKeyPress,
}: MessageInputProps) {
    const { theme } = useTheme()

    return (
        <div
            className={`p-4 border-t ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
        >
            <div className="flex space-x-3">
                <textarea
                    className={`flex-1 p-3 rounded-lg resize-none transition-colors ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500"
                        } border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyPress={onKeyPress}
                    placeholder="Type your message... (Press Enter to send)"
                    rows={1}
                    disabled={loading}
                />
                <button
                    onClick={onSendMessage}
                    disabled={!input.trim() || loading}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${!input.trim() || loading
                            ? theme === "dark"
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : theme === "dark"
                                ? "bg-orange-600 hover:bg-orange-700 text-white"
                                : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                >
                    <Send size={18} />
                    <span>Send</span>
                </button>
            </div>
        </div>
    )
}
