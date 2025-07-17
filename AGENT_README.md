# 🤖 AlooChat AI Agent System

## Overview

AlooChat is powered by an intelligent agent system that can use external tools to provide enhanced responses. The agent automatically detects when to use tools based on user queries and seamlessly integrates the results into natural conversations.

## Architecture

```
/lib/agent/
├── types.ts           # Type definitions
├── orchestrator.ts    # Main agent logic
├── tools.ts          # Tool registry
├── weatherTool.ts    # Weather API integration
└── githubTool.ts     # GitHub API integration
```

## How It Works

1. **Intent Detection**: The agent analyzes user messages to determine if external tools are needed
2. **Tool Execution**: If a tool is required, it executes with the appropriate parameters
3. **Response Formatting**: Results are integrated into a natural, conversational response

## Available Tools

### 🌤️ Weather Tool

Get current weather information for any location.

**Usage Examples:**

- "What's the weather in London?"
- "How's the weather in New York today?"
- "Temperature in Tokyo"

### 🐙 GitHub Tool

Search for repositories or get specific repository information.

**Usage Examples:**

- "Find React repositories on GitHub"
- "Show me the facebook/react repository"
- "Search for machine learning projects"

## Adding New Tools

1. Create a new tool file in `/lib/agent/`:

```typescript
// newTool.ts
import type { Tool } from './types'

export function getNewTool(): Tool {
  return {
    name: 'toolName',
    description: 'What this tool does',
    parameters: {
      param1: 'string - Description',
      param2: 'number - Description',
    },
    async execute({ param1, param2 }) {
      // Tool implementation
      return result
    },
  }
}
```

2. Register it in `/lib/agent/tools.ts`:

```typescript
import { getNewTool } from './newTool'

export const tools: Record<string, Tool> = {
  weather: getWeatherTool(),
  github: getGitHubTool(),
  newTool: getNewTool(), // Add here
}
```

3. The agent will automatically include it in tool detection!

## Environment Variables

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional (for weather tool)
OPENWEATHER_API_KEY=your_openweather_api_key
```

## API Usage

The agent is accessible via `/api/agent`:

```typescript
const response = await fetch('/api/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "What's the weather in Paris?",
    history: [], // Previous conversation context
  }),
})

const data = await response.json()
// { reply: "The weather in Paris is...", toolOutput: {...} }
```

## Error Handling

The agent includes robust error handling:

- **Tool failures**: Graceful fallback with informative messages
- **API issues**: Automatic retry with simple Gemini responses
- **Invalid requests**: Clear error messages

## Performance Considerations

- Tool detection uses minimal API calls
- Results are cached when appropriate
- Fallback mechanisms ensure reliability
- Rate limiting prevents API abuse

## Future Enhancements

Planned tool integrations:

- 📰 News API
- 🔍 Web Search
- 📊 Data Analysis
- 🎵 Music/Spotify
- 📱 App/Package Search
- 🌍 Translation Services
