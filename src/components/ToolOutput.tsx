import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Star,
  GitFork,
  ExternalLink,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface ToolOutputProps {
  toolOutput: any
  toolName?: string
}

export default function ToolOutput({ toolOutput, toolName }: ToolOutputProps) {
  if (!toolOutput) return null

  if (toolName === 'weather' || toolOutput.temperature !== undefined) {
    return <WeatherCard weather={toolOutput} />
  }

  if (toolName === 'github' || toolOutput.repositories || toolOutput.fullName) {
    return <GitHubCard data={toolOutput} />
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

function WeatherCard({ weather }: { weather: any }) {
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase()
    if (desc.includes('rain'))
      return <CloudRain className="text-blue-500" size={24} />
    if (desc.includes('cloud'))
      return <Cloud className="text-gray-500" size={24} />
    if (desc.includes('clear') || desc.includes('sun'))
      return <Sun className="text-yellow-500" size={24} />
    return <Cloud className="text-gray-500" size={24} />
  }

  return (
    <Card className="mt-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          {getWeatherIcon(weather.description)}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              Weather in {weather.location}
              {weather.country && (
                <span className="text-sm font-normal">({weather.country})</span>
              )}
            </div>
            {weather.coordinates && (
              <div className="flex items-center gap-1 text-xs font-normal text-blue-600 dark:text-blue-400">
                <MapPin size={12} />
                <span>
                  {weather.coordinates.lat.toFixed(2)}, {weather.coordinates.lon.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 capitalize">
              {weather.description}
            </div>
          </div>
          <div className="text-right text-sm text-blue-600 dark:text-blue-400">
            <div>Feels like {weather.feelsLike}°C</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Droplets size={14} className="text-blue-500" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind size={14} className="text-blue-500" />
            <span>{weather.windSpeed} m/s</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} className="text-blue-500" />
            <span>{weather.pressure} hPa</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GitHubCard({ data }: { data: any }) {
  if (data.repositories) {
    // Search results
    return (
      <Card className="mt-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 dark:text-gray-200 text-sm">
            GitHub Repositories ({data.totalCount} found)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.repositories.slice(0, 3).map((repo: any, index: number) => (
            <div key={index} className="border rounded-lg p-3 bg-background/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm">{repo.fullName}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {repo.description || 'No description available'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={12} />
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {repo.language && (
                  <Badge variant="secondary" className="text-xs py-0 px-2 h-5">
                    {repo.language}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Star size={12} />
                  {repo.stars.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  } else {
    // Single repository
    return (
      <Card className="mt-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
            <span className="text-sm">{data.fullName}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
              <a href={data.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} />
              </a>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {data.description || 'No description available'}
          </p>

          <div className="flex items-center gap-3 text-sm">
            {data.language && (
              <Badge variant="secondary" className="text-xs">
                {data.language}
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Star size={14} />
              {data.stars.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <GitFork size={14} />
              {data.forks.toLocaleString()}
            </div>
          </div>

          {data.topics && data.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.topics.map((topic: string) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="text-xs py-0 px-2 h-5"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
}
