import type { Tool } from './types'
import { getWeatherTool } from './tools/weatherTool'
import { getGitHubTool } from './tools/githubTool'
import { getGiphyTool } from './tools/giphyTool'

export const tools: Record<string, Tool> = {
  weather: getWeatherTool(),
  github: getGitHubTool(),
  giphy: getGiphyTool(),
}

export function getToolDescriptions(): string {
  return Object.values(tools)
    .map(
      (tool) =>
        `- ${tool.name}: ${tool.description}\n  Parameters: ${JSON.stringify(tool.parameters, null, 2)}`
    )
    .join('\n')
}

export function getToolByName(name: string): Tool | null {
  return tools[name] || null
}
