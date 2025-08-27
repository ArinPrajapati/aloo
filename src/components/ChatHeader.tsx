import { MessageSquare, Settings, MoreVertical, Activity } from 'lucide-react'
import { useTheme } from '../context/theme-context'
import type { Chat } from '../type'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import DynamicAPIStatus from './DynamicAPIStatus'

interface ChatHeaderProps {
  chat: Chat
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
  const { theme } = useTheme()

  return (
    <TooltipProvider>
      <div className="aloo-chat-header">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-aloo-accent to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
            <MessageSquare size={16} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-aloo-text-primary">
              {chat.title}
            </h2>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="text-xs bg-aloo-accent/20 text-aloo-accent border-0"
              >
                {chat.messages.length} messages
              </Badge>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-aloo-text-secondary">
                  Active conversation
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Dynamic API Status - Main Feature */}
          <DynamicAPIStatus />

          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-aloo-accent/20 text-aloo-text-secondary"
                >
                  <Settings size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="aloo-tooltip">
                <p>Chat settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-aloo-accent/20 text-aloo-text-secondary"
                >
                  <MoreVertical size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="aloo-tooltip">
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
