import type React from 'react'
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react'
import { useTheme } from '../context/theme-context'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { memo, useCallback } from 'react'
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
  onKeyDown: (e: React.KeyboardEvent) => void
}

const MessageInput = memo(function MessageInput({
  input,
  loading,
  onInputChange,
  onSendMessage,
  onKeyDown,
}: MessageInputProps) {
  const { theme } = useTheme()

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value)
  }, [onInputChange])

  const handleSendClick = useCallback(() => {
    if (!input.trim() || loading) return
    onSendMessage()
  }, [input, loading, onSendMessage])

  return (
    <TooltipProvider>
      <div className="aloo-input-area">
        <div className="max-w-4xl mx-auto flex items-end gap-3 w-full">
          {/* Attachment Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 border-aloo-border hover:bg-aloo-accent/10 hover:border-aloo-accent"
              >
                <Paperclip size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="aloo-tooltip">
              <p>Attach file</p>
            </TooltipContent>
          </Tooltip>

          {/* Input Area */}
          <div className="relative flex-1">
            <Textarea
              className="min-h-10 max-h-32 resize-none pr-16 shadow-sm border-aloo-border focus:border-aloo-accent focus:ring-aloo-accent/20 bg-aloo-background text-aloo-text-primary placeholder:text-aloo-text-secondary transition-none"
              value={input}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              disabled={loading}
              rows={1}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-aloo-accent/20 text-aloo-text-secondary"
                  >
                    <Mic size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="aloo-tooltip">
                  <p>Voice input</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendClick}
            disabled={!input.trim() || loading}
            className="aloo-send-btn h-10 w-10"
          >
            {loading ? (
              <div className="animate-spin">
                <Sparkles size={18} />
              </div>
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center mt-3 px-1 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="text-xs text-aloo-text-secondary">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-aloo-accent rounded-full animate-pulse"></div>
                  AI is thinking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Ready to send
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-aloo-text-secondary">
            {input.length}/2000
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
})

export default MessageInput
