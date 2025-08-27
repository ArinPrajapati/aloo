import type React from 'react'
import { Send, Paperclip, Mic, Sparkles, Plus } from 'lucide-react'
import { useTheme } from '../context/aloo-theme-context'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { memo, useCallback, useRef, useEffect } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value)
  }, [onInputChange])

  const handleSendClick = useCallback(() => {
    if (!input.trim() || loading) return
    onSendMessage()
  }, [input, loading, onSendMessage])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  return (
    <TooltipProvider>
      <div className="border-t border-aloo-border bg-aloo-background p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end gap-3">
            {/* Attachment Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 border-aloo-border hover:bg-aloo-accent/10 hover:border-aloo-accent transition-colors"
                >
                  <Paperclip size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>

            {/* Input Container */}
            <div className="relative flex-1">
              <div className="relative overflow-hidden rounded-xl border border-aloo-border bg-aloo-background focus-within:border-aloo-accent focus-within:ring-1 focus-within:ring-aloo-accent/20 transition-all">
                <Textarea
                  ref={textareaRef}
                  className="min-h-[50px] max-h-32 resize-none border-0 bg-transparent p-4 pr-16 text-aloo-text-primary placeholder:text-aloo-text-secondary focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={onKeyDown}
                  placeholder="Type a message..."
                  disabled={loading}
                  rows={1}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                
                {/* Input Actions */}
                <div className="absolute right-3 top-3 flex items-center gap-1">
                  {input.length > 0 && (
                    <div className="text-xs text-aloo-text-secondary mr-2">
                      {input.length}
                    </div>
                  )}
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-aloo-accent/20 text-aloo-text-secondary hover:text-aloo-accent"
                      >
                        <Mic size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice input</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Status Indicator */}
              {loading && (
                <div className="absolute -top-8 left-4">
                  <div className="flex items-center gap-2 text-xs text-aloo-text-secondary bg-aloo-background border border-aloo-border rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-aloo-accent rounded-full animate-pulse"></div>
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendClick}
              disabled={!input.trim() || loading}
              size="icon"
              className="h-10 w-10 shrink-0 bg-aloo-accent hover:bg-aloo-accent-hover disabled:opacity-50 disabled:hover:bg-aloo-accent transition-all"
            >
              {loading ? (
                <div className="animate-spin">
                  <Sparkles size={16} />
                </div>
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-aloo-text-secondary hover:text-aloo-accent hover:bg-aloo-accent/10"
              >
                <Plus size={12} className="mr-1" />
                Shortcuts
              </Button>
            </div>
            
            <div className="text-xs text-aloo-text-secondary">
              Press <kbd className="px-1 py-0.5 bg-aloo-accent/10 rounded text-xs">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-aloo-accent/10 rounded text-xs">Shift + Enter</kbd> for new line
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
})

export default MessageInput
