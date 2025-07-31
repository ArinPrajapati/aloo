import {
  Github,
  Cloud,
  BookOpen,
  Image,
  Activity,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import { Button } from './ui/button'

interface DynamicAPIStatusProps {
  activeTools: string[]
  className?: string
}

const toolConfigs = {
  github: {
    icon: Github,
    name: 'GitHub',
    color: '#24292e',
    description: 'Repository and user data'
  },
  weather: {
    icon: Cloud,
    name: 'Weather',
    color: '#0ea5e9',
    description: 'Weather information'
  },
  wikipedia: {
    icon: BookOpen,
    name: 'Wikipedia',
    color: '#000000',
    description: 'Educational content'
  },
  giphy: {
    icon: Image,
    name: 'Giphy',
    color: '#ff6550',
    description: 'GIFs and memes'
  }
}

export default function DynamicAPIStatus({ activeTools, className = '' }: DynamicAPIStatusProps) {
  const [currentToolIndex, setCurrentToolIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Cycle through active tools every 3 seconds
  useEffect(() => {
    if (activeTools.length <= 1) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentToolIndex((prev) => (prev + 1) % activeTools.length)
        setIsAnimating(false)
      }, 250) // Half of animation duration
    }, 3000)

    return () => clearInterval(interval)
  }, [activeTools.length])

  // Reset index when activeTools change
  useEffect(() => {
    setCurrentToolIndex(0)
  }, [activeTools])

  if (activeTools.length === 0) {
    return (
      <div className={`aloo-status-idle ${className}`}>
        <div className="status-dot"></div>
        <span>All systems operational</span>
      </div>
    )
  }

  const currentTool = activeTools[currentToolIndex]
  const config = toolConfigs[currentTool as keyof typeof toolConfigs]

  if (!config) return null

  const IconComponent = config.icon

  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`aloo-api-indicator ${isAnimating ? 'cycling' : ''} ${className}`}
              style={{ background: config.color }}
              onClick={() => setShowDetails(!showDetails)}
            >
              <IconComponent size={14} />
              <span>{config.name}</span>
              {activeTools.length > 1 && (
                <div className="flex items-center gap-1 ml-1">
                  <span className="text-xs opacity-80">+{activeTools.length - 1}</span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="aloo-tooltip">
            <div className="text-center">
              <div className="font-medium">{config.name} Active</div>
              <div className="text-xs opacity-80">{config.description}</div>
              {activeTools.length > 1 && (
                <div className="text-xs mt-1">
                  {activeTools.length} integrations running • Click for details
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Simple dropdown details */}
        {showDetails && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-aloo-background border border-aloo-border rounded-lg shadow-lg z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-aloo-accent" />
                <span className="font-medium text-aloo-text-primary">Active Integrations</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowDetails(false)}
              >
                <X size={12} />
              </Button>
            </div>

            <div className="space-y-2">
              {activeTools.map((tool, index) => {
                const toolConfig = toolConfigs[tool as keyof typeof toolConfigs]
                if (!toolConfig) return null

                const ToolIcon = toolConfig.icon
                return (
                  <div
                    key={tool}
                    className="flex items-center justify-between p-2 bg-aloo-accent/5 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                        style={{ background: toolConfig.color }}
                      >
                        <ToolIcon size={12} />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-aloo-text-primary">{toolConfig.name}</div>
                        <div className="text-xs text-aloo-text-secondary">
                          {toolConfig.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
