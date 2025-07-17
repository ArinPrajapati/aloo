import { MessageSquare, Settings, MoreVertical } from 'lucide-react'
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

interface ChatHeaderProps {
  chat: Chat
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
  const { theme } = useTheme()

  return (
    <TooltipProvider>
      <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-foreground">
                {chat.title}
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {chat.messages.length} messages
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Active conversation
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
