'use client'
import { Sun, Moon, Plus, Trash2, MessageCircle, Bot, LogOut, User, Menu } from 'lucide-react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useTheme } from '../context/aloo-theme-context'
import type { Chat } from '../type'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useState } from 'react'

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
  const { user } = useUser()
  const { signOut } = useClerk()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ redirectUrl: '/auth/login' })
  }

  return (
    <TooltipProvider>
      {/* Mobile Menu Button */}
      <div className="aloo-mobile-menu fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-aloo-background border-aloo-border"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`aloo-sidebar ${isMobileOpen ? 'open' : ''} aloo-scroll`}>
        {/* Header Section */}
        <div className="aloo-brand">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            🥔
          </div>
          <span>AlooChat</span>
          <div className="ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8 hover:bg-aloo-accent/20"
                >
                  {theme === 'dark' ? (
                    <Sun size={16} />
                  ) : (
                    <Moon size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="aloo-tooltip">
                <p>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* New Chat Button */}
        <button onClick={onNewChat} className="aloo-new-chat-btn">
          <Plus size={18} className="mr-2" />
          New Conversation
        </button>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-2">
              {chats.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-aloo-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={32} className="text-aloo-accent" />
                  </div>
                  <p className="text-sm font-medium text-aloo-text-primary mb-1">
                    No conversations yet
                  </p>
                  <p className="text-xs text-aloo-text-secondary">
                    Start a new chat to get going!
                  </p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`aloo-conversation-item group ${chat.id === activeChatId ? 'active' : ''
                      }`}
                  >
                    <div
                      className="flex-1 truncate pr-2 cursor-pointer"
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <div className="font-medium truncate text-sm mb-1">
                        {chat.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0 h-5 bg-aloo-accent/20 text-aloo-accent border-0"
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
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-current hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="aloo-tooltip">
                        <p>Delete conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* API Status Integration */}
        {/* Removed - moved to top bar */}

        {/* User Profile Section */}
        {user && (
          <div className="mt-4 pt-4 border-t border-aloo-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-aloo-accent/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.imageUrl || undefined}
                        alt={user.fullName || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-aloo-accent to-orange-600 text-white">
                        {user.fullName?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm truncate text-aloo-text-primary">
                        {user.fullName || user.firstName || 'User'}
                      </div>
                      <div className="text-xs text-aloo-text-secondary truncate">
                        {user.primaryEmailAddress?.emailAddress}
                      </div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem className="hover:bg-aloo-accent/10">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
