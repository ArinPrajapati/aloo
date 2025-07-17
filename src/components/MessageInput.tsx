import type React from 'react'
import { Send, Paperclip, Mic } from 'lucide-react'
import { useTheme } from '../context/theme-context'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

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
    <TooltipProvider>
      <div className="flex-shrink-0 p-4 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                  >
                    <Paperclip size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="relative flex-1">
              <Textarea
                className="min-h-10 max-h-32 resize-none pr-16 shadow-sm"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                disabled={loading}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mic size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voice input</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Button
              onClick={onSendMessage}
              disabled={!input.trim() || loading}
              className="h-10 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md"
            >
              <Send size={18} className="mr-2" />
              Send
            </Button>
          </div>

          <div className="flex justify-between items-center mt-2 px-1">
            <div className="text-xs text-muted-foreground">
              {loading ? 'AI is thinking...' : 'Ready to send'}
            </div>
            <div className="text-xs text-muted-foreground">
              {input.length}/2000
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
