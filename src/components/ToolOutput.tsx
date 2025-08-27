import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Zap, ExternalLink, Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { WeatherCard, GitHubCard, GiphyCard, WikipediaCard, WebclientCard } from './tools'

interface ToolOutputProps {
  toolOutput: any
  toolName?: string
}

export default function ToolOutput({ toolOutput, toolName }: ToolOutputProps) {
  const [copied, setCopied] = useState(false)

  if (!toolOutput) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Weather tool detection
  if (toolName === 'weather' || toolOutput.temperature !== undefined) {
    return (
      <div className="artifact-container">
        <div className="artifact-header">
          <Badge variant="secondary" className="gap-1.5">
            <Zap size={12} />
            Weather Data
          </Badge>
        </div>
        <div className="artifact-content">
          <WeatherCard weather={toolOutput} />
        </div>
      </div>
    )
  }

  // GitHub tool detection
  if (toolName === 'github' || toolOutput.repositories || toolOutput.fullName || toolOutput.users || toolOutput.login) {
    return (
      <div className="artifact-container">
        <div className="artifact-header">
          <Badge variant="secondary" className="gap-1.5">
            <Zap size={12} />
            GitHub Data
          </Badge>
        </div>
        <div className="artifact-content">
          <GitHubCard data={toolOutput} />
        </div>
      </div>
    )
  }

  // Giphy tool detection
  if (toolName === 'giphy' || toolOutput.gifs) {
    return (
      <div className="artifact-container">
        <div className="artifact-header">
          <Badge variant="secondary" className="gap-1.5">
            <Zap size={12} />
            GIF Results
          </Badge>
        </div>
        <div className="artifact-content">
          <GiphyCard data={toolOutput} />
        </div>
      </div>
    )
  }

  // Wikipedia tool detection
  if (toolName === 'wikipedia' || toolOutput.title || toolOutput.summary || toolOutput.error) {
    return (
      <div className="artifact-container">
        <div className="artifact-header">
          <Badge variant="secondary" className="gap-1.5">
            <Zap size={12} />
            Wikipedia
          </Badge>
        </div>
        <div className="artifact-content">
          <WikipediaCard data={toolOutput} />
        </div>
      </div>
    )
  }

  // Webclient tool detection
  if (toolName === 'webclient' || toolOutput.status !== undefined || toolOutput.responseTime !== undefined) {
    return (
      <div className="artifact-container">
        <div className="artifact-header">
          <Badge variant="secondary" className="gap-1.5">
            <Zap size={12} />
            Web Request
          </Badge>
        </div>
        <div className="artifact-content">
          <WebclientCard data={toolOutput} />
        </div>
      </div>
    )
  }

  // Generic JSON display for unknown tool outputs
  const jsonString = JSON.stringify(toolOutput, null, 2)
  
  return (
    <div className="artifact-container">
      <div className="artifact-header">
        <Badge variant="secondary" className="gap-1.5">
          <Zap size={12} />
          Tool Result
        </Badge>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => copyToClipboard(jsonString)}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </Button>
        </div>
      </div>
      <div className="artifact-content">
        <Card className="bg-aloo-sidebar-bg/50 border-aloo-border">
          <CardContent className="p-4">
            <pre className="text-xs overflow-x-auto text-aloo-text-primary bg-transparent">
              {jsonString}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
