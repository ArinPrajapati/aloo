import { MessageSquare, Settings, MoreVertical, SidebarOpen } from 'lucide-react'
import { useTheme } from '../context/aloo-theme-context'
import { useSidebar } from './ui/sidebar'
import type { Chat } from '../type'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
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
import DynamicAPIStatus from './DynamicAPIStatus'

interface ChatHeaderProps {
  chat: Chat
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
  const { theme } = useTheme()
  const { toggleSidebar } = useSidebar()

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-4 border-b border-aloo-border bg-aloo-background/95 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-aloo-accent/20 lg:hidden"
          >
            <SidebarOpen size={16} />
          </Button>
          
          {/* Chat Info */}
          <div className="w-8 h-8 bg-gradient-to-br from-aloo-accent to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
            <MessageSquare size={16} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-aloo-text-primary truncate max-w-[200px] sm:max-w-[300px]">
              {chat.title}
            </h2>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="text-xs bg-aloo-accent/20 text-aloo-accent border-0 px-2 py-0 h-5"
              >
                {chat.messages.length} messages
              </Badge>
              <div className="hidden sm:flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-aloo-text-secondary">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dynamic API Status - Preserved Unique Feature */}
          <div className="hidden sm:block">
            <DynamicAPIStatus />
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-1">
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-aloo-accent/20 text-aloo-text-secondary hover:text-aloo-accent transition-colors"
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="hover:bg-aloo-accent/10">
                  <Settings className="mr-2 h-4 w-4" />
                  Chat Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-aloo-accent/10 sm:hidden">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  API Status
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-aloo-accent/10">
                  Export Chat
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-aloo-accent/10 text-red-600 hover:text-red-700">
                  Clear History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
