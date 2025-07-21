import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { WeatherCard, GitHubCard, GiphyCard } from './tools'

interface ToolOutputProps {
  toolOutput: any
  toolName?: string
}

export default function ToolOutput({ toolOutput, toolName }: ToolOutputProps) {
  if (!toolOutput) return null

  // Weather tool detection
  if (toolName === 'weather' || toolOutput.temperature !== undefined) {
    return <WeatherCard weather={toolOutput} />
  }

  // GitHub tool detection
  if (toolName === 'github' || toolOutput.repositories || toolOutput.fullName || toolOutput.users || toolOutput.login) {
    return <GitHubCard data={toolOutput} />
  }

  // Giphy tool detection
  if (toolName === 'giphy' || toolOutput.gifs) {
    return <GiphyCard data={toolOutput} />
  }

  // Generic JSON display for unknown tool outputs
  return (
    <Card className="mt-3 bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Tool Result</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(toolOutput, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
