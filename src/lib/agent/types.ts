export interface Tool {
  name: string
  description: string
  parameters: Record<string, string> // parameter names and types
  execute(params: any): Promise<any>
}

export interface ToolCall {
  tool: string | null
  params: Record<string, any>
}

export interface AgentResponse {
  text: string
  toolOutput?: any
}
