import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { User } from 'lucide-react'
import { useTheme } from '../context/theme-context'
import type { ChatMessage } from '../type'
import { ScrollArea } from './ui/scroll-area'
import ToolOutput from './ToolOutput'

interface MessageListProps {
  messages: ChatMessage[]
  loading: boolean
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, loading }, ref) => {
    const { theme } = useTheme()

    return (
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full aloo-scroll">
          <div className="w-full">
            {messages.length === 0 ? (
              <div className="text-center py-8 px-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  🥔
                </div>
                <h3 className="text-xl font-semibold mb-2 text-aloo-text-primary">
                  Welcome to AlooChat!
                </h3>
                <p className="text-aloo-text-secondary max-w-md mx-auto mb-4">
                  Your intelligent AI assistant is ready to help. Start a
                  conversation by typing a message below.
                </p>
                <div className="space-y-1 text-sm text-aloo-text-secondary">
                  <div>🌤️ Ask about weather: "What's the weather in London?"</div>
                  <div>📚 Get information: "What is machine learning?"</div>
                  <div>🐙 Search GitHub: "Show me React repositories"</div>
                  <div>🎭 Find GIFs: "Show me funny cat memes"</div>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`w-full py-6 px-4 md:px-6 ${
                    msg.role === 'Bot' 
                      ? 'bg-aloo-bot-background' 
                      : 'bg-aloo-user-background'
                  }`}
                >
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        msg.role === 'Bot'
                          ? 'bg-aloo-accent text-white shadow-lg'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                      }`}>
                        {msg.role === 'Bot' ? '🥔' : <User size={16} />}
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        {/* Role Label */}
                        <div className="mb-2">
                          <span className={`text-sm font-semibold ${
                            msg.role === 'Bot' 
                              ? 'text-aloo-accent' 
                              : 'text-blue-600'
                          }`}>
                            {msg.role === 'Bot' ? 'AlooChat' : 'You'}
                          </span>
                        </div>
                        
                        {/* Message Text */}
                        <div
                          className={`prose prose-sm max-w-none aloo-message-content ${
                            theme === 'dark' ? 'prose-invert' : ''
                          } text-aloo-text-primary`}
                        >
                          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                        
                        {/* Tool Output */}
                        {msg.role === 'Bot' && msg.toolOutput && (
                          <div className="mt-4 pl-4 border-l-2 border-aloo-accent/30">
                            <ToolOutput toolOutput={msg.toolOutput} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="w-full py-6 px-4 md:px-6 bg-aloo-bot-background">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-aloo-accent text-white flex items-center justify-center text-sm shadow-lg flex-shrink-0">
                      🥔
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-sm font-semibold text-aloo-accent">
                          AlooChat
                        </span>
                      </div>
                      <div className="flex space-x-1.5">
                        <div
                          className="w-2 h-2 rounded-full bg-aloo-accent animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-aloo-accent animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-aloo-accent animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={ref} />
          </div>
        </ScrollArea>
      </div>
    )
  }
)

MessageList.displayName = 'MessageList'

export default MessageList
