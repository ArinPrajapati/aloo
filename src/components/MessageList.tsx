import { forwardRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { useTheme } from "../context/theme-context"
import type { ChatMessage } from "../type"

interface MessageListProps {
    messages: ChatMessage[]
    loading: boolean
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
    ({ messages, loading }, ref) => {
        const { theme } = useTheme()

        return (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        <div className="text-6xl mb-4">🥔</div>
                        <h3 className="text-xl font-semibold mb-2">Welcome to PotatoChat!</h3>
                        <p>Start a conversation by typing a message below.</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "User" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`flex items-start space-x-3 max-w-[80%] ${msg.role === "User" ? "flex-row-reverse space-x-reverse" : ""
                                    }`}
                            >
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${msg.role === "User"
                                            ? theme === "dark"
                                                ? "bg-orange-600 text-white"
                                                : "bg-orange-500 text-white"
                                            : theme === "dark"
                                                ? "bg-gray-700 text-gray-300"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    {msg.role === "User" ? "U" : "🥔"}
                                </div>
                                <div
                                    className={`p-4 rounded-2xl shadow-sm ${msg.role === "User"
                                            ? theme === "dark"
                                                ? "bg-orange-600 text-white"
                                                : "bg-orange-500 text-white"
                                            : theme === "dark"
                                                ? "bg-gray-700 text-gray-100"
                                                : "bg-white text-gray-900 border border-gray-200"
                                        }`}
                                >
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                            <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                                    }`}
                            >
                                🥔
                            </div>
                            <div
                                className={`p-4 rounded-2xl ${theme === "dark" ? "bg-gray-700" : "bg-white border border-gray-200"
                                    }`}
                            >
                                <div className="flex space-x-1">
                                    <div
                                        className={`w-2 h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                                            }`}
                                        style={{ animationDelay: "0ms" }}
                                    ></div>
                                    <div
                                        className={`w-2 h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                                            }`}
                                        style={{ animationDelay: "150ms" }}
                                    ></div>
                                    <div
                                        className={`w-2 h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                                            }`}
                                        style={{ animationDelay: "300ms" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={ref} />
            </div>
        )
    }
)

MessageList.displayName = "MessageList"

export default MessageList
