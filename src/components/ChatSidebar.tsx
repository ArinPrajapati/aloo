'use client'
import { Sun, Moon, Plus, Trash2, MessageCircle, Bot } from 'lucide-react'
import { useTheme } from '../context/theme-context'
import type { Chat } from '../type'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

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
    <TooltipProvider>
      <div className="w-80 flex flex-col border-r bg-sidebar border-sidebar-border">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <Bot size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">
                  AlooChat
                </h1>
                <p className="text-sm text-sidebar-foreground/60">
                  AI Assistant
                </p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9"
                >
                  {theme === 'dark' ? (
                    <Sun size={18} className="text-sidebar-foreground/70" />
                  ) : (
                    <Moon size={18} className="text-sidebar-foreground/70" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
          >
            <Plus size={18} className="mr-2" />
            New Conversation
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {chats.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle
                      size={32}
                      className="text-muted-foreground/50"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground/80 mb-1">
                    No conversations yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Start a new chat to get going!
                  </p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-sidebar-accent ${
                      chat.id === activeChatId
                        ? 'bg-sidebar-accent border border-sidebar-border/50 shadow-sm'
                        : ''
                    }`}
                  >
                    <div
                      className="flex-1 truncate pr-2"
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <div className="font-medium truncate text-sidebar-foreground text-sm mb-1">
                        {chat.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0 h-5"
                        >
                          {chat.messages.length} messages
                        </Badge>
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(chat.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  )
}
