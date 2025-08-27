import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useTheme } from '../context/aloo-theme-context'
import type { ChatMessage } from '../type'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import ToolOutput from './ToolOutput'

interface MessageListProps {
  messages: ChatMessage[]
  loading: boolean
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, loading }, ref) => {
    const { theme } = useTheme()

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
    }

    return (
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="w-full">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-aloo-accent to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-3xl">🥔</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-aloo-text-primary">
                    Welcome to AlooChat!
                  </h3>
                  <p className="text-aloo-text-secondary mb-6 leading-relaxed">
                    Your intelligent AI assistant is ready to help. Start a
                    conversation by typing a message below.
                  </p>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {[
                      { icon: '🌤️', text: 'Ask about weather: "What\'s the weather in London?"' },
                      { icon: '📚', text: 'Get information: "What is machine learning?"' },
                      { icon: '🐙', text: 'Search GitHub: "Show me React repositories"' },
                      { icon: '🎭', text: 'Find GIFs: "Show me funny cat memes"' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-aloo-accent/5 border border-aloo-border">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-aloo-text-secondary">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <TooltipProvider>
                <div className="divide-y divide-aloo-border">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`group relative py-6 px-4 md:px-6 transition-colors hover:bg-aloo-accent/5 ${
                        msg.role === 'Bot'
                          ? 'bg-aloo-bot-background'
                          : 'bg-aloo-user-background'
                      }`}
                    >
                      <div className="mx-auto max-w-3xl">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-medium shadow-lg ${
                            msg.role === 'Bot'
                              ? 'bg-gradient-to-br from-aloo-accent to-orange-600 text-white'
                              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          }`}>
                            {msg.role === 'Bot' ? '🥔' : <User size={16} />}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Role Label */}
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-semibold ${
                                msg.role === 'Bot'
                                  ? 'text-aloo-accent'
                                  : 'text-blue-600'
                              }`}>
                                {msg.role === 'Bot' ? 'AlooChat' : 'You'}
                              </span>
                              
                              {/* Message Actions */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => copyToClipboard(msg.text)}
                                    >
                                      <Copy size={12} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy message</p>
                                  </TooltipContent>
                                </Tooltip>
                                
                                {msg.role === 'Bot' && (
                                  <>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 hover:bg-green-100 hover:text-green-600"
                                        >
                                          <ThumbsUp size={12} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Good response</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 hover:bg-red-100 hover:text-red-600"
                                        >
                                          <ThumbsDown size={12} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Poor response</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Message Text */}
                            <div
                              className={`prose prose-sm max-w-none break-words ${
                                theme === 'dark' ? 'prose-invert' : ''
                              } prose-pre:bg-aloo-sidebar-bg prose-pre:border prose-pre:border-aloo-border prose-code:bg-aloo-accent/10 prose-code:text-aloo-accent prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs text-aloo-text-primary`}
                            >
                              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {msg.text}
                              </ReactMarkdown>
                            </div>

                            {/* Tool Output */}
                            {msg.role === 'Bot' && msg.toolOutput && (
                              <div className="mt-4 overflow-hidden rounded-lg border border-aloo-border bg-aloo-sidebar-bg/50">
                                <ToolOutput toolOutput={msg.toolOutput} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="py-6 px-4 md:px-6 bg-aloo-bot-background border-t border-aloo-border">
                <div className="mx-auto max-w-3xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-aloo-accent to-orange-600 text-white flex items-center justify-center shadow-lg">
                      🥔
                    </div>

                    <div className="flex-1 space-y-2">
                      <span className="text-sm font-semibold text-aloo-accent">
                        AlooChat
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full bg-aloo-accent animate-bounce"
                              style={{ animationDelay: `${i * 150}ms` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-aloo-text-secondary ml-2">
                          Thinking...
                        </span>
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
