import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { Bot, User } from 'lucide-react'
import { useTheme } from '../context/theme-context'
import type { ChatMessage } from '../type'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Card, CardContent } from './ui/card'

interface MessageListProps {
  messages: ChatMessage[]
  loading: boolean
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, loading }, ref) => {
    const { theme } = useTheme()

    return (
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Bot size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  Welcome to AlooChat!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your intelligent AI assistant is ready to help. Start a
                  conversation by typing a message below.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${msg.role === 'User' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'Bot' && (
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <Card
                    className={`max-w-[75%] py-3 ${msg.role === 'User'
                      ? 'bg-primary text-primary-foreground shadow-md border-primary/20'
                      : 'bg-card border shadow-sm'
                      }`}
                  >
                    <CardContent className="px-3">
                      <div
                        className={`prose prose-sm max-w-none ${msg.role === 'User'
                          ? 'prose-invert'
                          : theme === 'dark'
                            ? 'prose-invert'
                            : ''
                          }`}
                      >
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>

                  {msg.role === 'User' && (
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>

                <Card className="bg-card border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex space-x-1.5">
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
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
