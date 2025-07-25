import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentResponse, ToolCall } from './types'
import { tools, getToolDescriptions, getToolByName } from './tools'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Gemini API call failed: ${errorMessage}`)
  }
}

export async function processUserQuery(
  userMessage: string,
  history: Array<{ role: string; text: string }> = []
): Promise<AgentResponse> {
  try {
    // Step 1: Ask Gemini if a tool is needed
    const detectionPrompt = `
You are an AI assistant with access to the following tools:

${getToolDescriptions()}

Based on the user's message and conversation history, determine if any tool should be used.

IMPORTANT: For Wikipedia tool, look for these patterns:
- Questions starting with: "What is", "Who is", "Who was", "Explain", "Tell me about", "Define"
- Educational/factual questions about: people, places, concepts, history, science, etc.
- Examples: "What is machine learning?", "Who is Einstein?", "Tell me about Paris", "Explain quantum physics"

Conversation history:
${history.map((h) => `${h.role}: ${h.text}`).join('\n')}

Current user message: "${userMessage}"

Respond ONLY with valid JSON in this exact format:
{
  "tool": "<tool_name_or_null>",
  "params": {<parameters_object>}
}

Examples:
- For weather: {"tool": "weather", "params": {"location": "London"}}
- For GitHub: {"tool": "github", "params": {"query": "react", "type": "search"}}
- For Wikipedia: {"tool": "wikipedia", "params": {"query": "machine learning"}}
- For Giphy: {"tool": "giphy", "params": {"query": "funny cats", "type": "gif"}}
- For general chat: {"tool": null, "params": {}}

JSON Response:`

    const detectionResponse = await callGeminiAPI(detectionPrompt)

    let toolCall: ToolCall
    try {
      // Clean up the response and parse JSON
      const cleanedResponse = detectionResponse
        .trim()
        .replace(/```json\n?|\n?```/g, '')
      toolCall = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.warn(
        'Failed to parse tool detection response:',
        detectionResponse
      )
      toolCall = { tool: null, params: {} }
    }

    let toolOutput = null
    let toolError = null

    // Step 2: Execute tool if one was selected
    if (toolCall.tool && toolCall.tool !== null) {
      const tool = getToolByName(toolCall.tool)
      if (tool) {
        try {
          console.log(
            `Executing tool: ${toolCall.tool} with params:`,
            toolCall.params
          )
          toolOutput = await tool.execute(toolCall.params)
        } catch (error) {
          toolError =
            error instanceof Error ? error.message : 'Tool execution failed'
          console.error(`Tool execution error:`, toolError)
        }
      }
    }

    // Step 3: Generate final response
    const contextualHistory =
      history.length > 0
        ? `\nConversation history:\n${history
          .slice(-5)
          .map((h) => `${h.role}: ${h.text}`)
          .join('\n')}\n`
        : ''

    const finalPrompt = `
You are AlooChat, a helpful and friendly AI assistant.
${contextualHistory}
User's current message: "${userMessage}"

${toolOutput ? `Tool Result: ${JSON.stringify(toolOutput, null, 2)}` : ''}
${toolError ? `Tool Error: ${toolError}` : ''}

Provide a natural, helpful response to the user. If tool data is available, incorporate it naturally into your response. If there was a tool error, acknowledge it gracefully and provide alternative help.

Keep your response conversational and engaging. Respond in 1-3 sentences unless more detail is specifically requested.

Response:`

    const finalResponse = await callGeminiAPI(finalPrompt)

    return {
      text: finalResponse.trim(),
      toolOutput: toolOutput,
    }
  } catch (error) {
    console.error('Agent processing error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    // Fallback to simple Gemini response
    const fallbackPrompt = `
You are AlooChat, a helpful AI assistant.
${history.length > 0
        ? `Conversation history:\n${history
          .slice(-3)
          .map((h) => `${h.role}: ${h.text}`)
          .join('\n')}\n`
        : ''
      }
User: ${userMessage}

Respond naturally and helpfully:`

    try {
      const fallbackResponse = await callGeminiAPI(fallbackPrompt)
      return {
        text:
          fallbackResponse.trim() +
          '\n\n(Note: Some advanced features are temporarily unavailable)',
        toolOutput: null,
      }
    } catch (fallbackError) {
      return {
        text: "I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment.",
        toolOutput: null,
      }
    }
  }
}
