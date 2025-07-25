import { 
  Github, 
  Cloud, 
  BookOpen, 
  Image,
  Activity,
  Wifi,
  WifiOff 
} from 'lucide-react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from './ui/tooltip'

interface APIStatusProps {
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

export default function APIStatus({ activeTools, className = '' }: APIStatusProps) {
  return (
    <TooltipProvider>
      <div className={`aloo-api-status ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-aloo-text-secondary">
            Integrations
          </span>
          <div className="flex items-center gap-1">
            <Activity size={12} className="text-green-500" />
            <span className="text-xs text-green-500">Online</span>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {Object.entries(toolConfigs).map(([key, config]) => {
            const IconComponent = config.icon
            const isActive = activeTools.includes(key)
            
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div 
                    className={`aloo-api-icon ${isActive ? 'active' : ''}`}
                    style={{
                      backgroundColor: isActive ? config.color : 'transparent',
                      color: isActive ? 'white' : config.color
                    }}
                  >
                    <IconComponent size={18} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="aloo-tooltip">
                  <div className="text-center">
                    <div className="font-medium">{config.name}</div>
                    <div className="text-xs opacity-80">{config.description}</div>
                    {isActive && (
                      <div className="text-xs text-green-400 mt-1">
                        ● Currently Active
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t border-aloo-border">
          <div className="text-xs text-aloo-text-secondary mb-2">Quick Actions</div>
          <div className="flex gap-1 flex-wrap">
            <button className="text-xs bg-aloo-accent/10 text-aloo-accent px-2 py-1 rounded-md hover:bg-aloo-accent/20 transition-colors">
              Weather
            </button>
            <button className="text-xs bg-aloo-accent/10 text-aloo-accent px-2 py-1 rounded-md hover:bg-aloo-accent/20 transition-colors">
              GitHub
            </button>
            <button className="text-xs bg-aloo-accent/10 text-aloo-accent px-2 py-1 rounded-md hover:bg-aloo-accent/20 transition-colors">
              Wiki
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center mt-3 pt-2 border-t border-aloo-border">
          <div className="flex items-center gap-2 text-xs">
            <Wifi size={12} className="text-green-500" />
            <span className="text-aloo-text-secondary">All systems operational</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
