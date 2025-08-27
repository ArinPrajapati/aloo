import type { Tool } from '../types'

interface WebClientParams {
  method?: string
  url: string
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

interface ApiResponse {
  status: number
  statusText: string
  data: any
  headers: Record<string, string>
  responseTime: number
  error?: string
}

export const webclientTool: Tool = {
  name: 'webclient',
  description: 'Make HTTP requests to API endpoints and analyze responses. Supports GET, POST, PUT, DELETE methods with custom headers and payloads.',
  parameters: {
    method: 'HTTP method (GET, POST, PUT, DELETE, PATCH)',
    url: 'Target URL for the API request',
    headers: 'HTTP headers as JSON object',
    body: 'Request body for POST/PUT requests',
    timeout: 'Request timeout in milliseconds'
  },

  async execute(params: WebClientParams): Promise<ApiResponse> {
    const {
      method = 'GET',
      url,
      headers = {},
      body,
      timeout = 10000
    } = params

    // Validate URL
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL provided. Please ensure the URL is properly formatted (e.g., https://api.example.com/users)')
    }

    // Security: Block common internal/private endpoints
    const blockedPatterns = [
      /localhost/i,
      /127\.0\.0\.1/,
      /192\.168\./,
      /10\./,
      /172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /::1/,
      /0\.0\.0\.0/
    ]

    if (blockedPatterns.some(pattern => pattern.test(url))) {
      throw new Error('Access to local/private networks is not allowed for security reasons')
    }

    const startTime = Date.now()

    try {
      // Prepare request options
      const requestOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          'User-Agent': 'AlooChat-WebClient/1.0',
          ...headers
        },
        signal: AbortSignal.timeout(timeout)
      }

      // Add body for non-GET requests
      if (method.toUpperCase() !== 'GET' && body) {
        if (typeof body === 'object') {
          requestOptions.body = JSON.stringify(body)
          if (!headers['Content-Type'] && !headers['content-type']) {
            requestOptions.headers = {
              ...requestOptions.headers,
              'Content-Type': 'application/json'
            }
          }
        } else {
          requestOptions.body = body
        }
      }

      const response = await fetch(url, requestOptions)
      const responseTime = Date.now() - startTime

      // Get response headers
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Parse response data
      let data: any
      const contentType = response.headers.get('content-type') || ''

      try {
        if (contentType.includes('application/json')) {
          data = await response.json()
        } else if (contentType.includes('text/')) {
          data = await response.text()
        } else {
          // For other content types, get text representation
          data = await response.text()
        }
      } catch (parseError) {
        data = 'Unable to parse response body'
      }

      return {
        status: response.status,
        statusText: response.statusText,
        data,
        headers: responseHeaders,
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      }

    } catch (error) {
      const responseTime = Date.now() - startTime

      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          return {
            status: 0,
            statusText: 'Timeout',
            data: null,
            headers: {},
            responseTime,
            error: `Request timed out after ${timeout}ms`
          }
        }

        if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          return {
            status: 0,
            statusText: 'Network Error',
            data: null,
            headers: {},
            responseTime,
            error: 'Network error - check if the server is reachable and CORS is configured'
          }
        }

        return {
          status: 0,
          statusText: 'Error',
          data: null,
          headers: {},
          responseTime,
          error: error.message
        }
      }

      return {
        status: 0,
        statusText: 'Unknown Error',
        data: null,
        headers: {},
        responseTime,
        error: 'An unknown error occurred'
      }
    }
  }
}

// Helper function to parse structured API requests from user input
export function parseApiRequest(input: string): WebClientParams | null {
  // Try to parse structured format first
  const structuredMatch = input.match(/webclient:\s*([\s\S]+)/i)
  if (structuredMatch) {
    return parseStructuredRequest(structuredMatch[1])
  }

  // Try to parse simple URL format
  const simpleUrlMatch = input.match(/(GET|POST|PUT|DELETE|PATCH)\s+(https?:\/\/[^\s]+)/i)
  if (simpleUrlMatch) {
    return {
      method: simpleUrlMatch[1],
      url: simpleUrlMatch[2]
    }
  }

  // Try to parse just URL (defaults to GET)
  const urlMatch = input.match(/https?:\/\/[^\s]+/i)
  if (urlMatch) {
    return {
      method: 'GET',
      url: urlMatch[0]
    }
  }

  return null
}

function parseStructuredRequest(content: string): WebClientParams | null {
  try {
    const lines = content.trim().split('\n').map(line => line.trim())

    // First line should be METHOD URL
    const firstLine = lines[0]
    const methodUrlMatch = firstLine.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(https?:\/\/[^\s]+)/i)

    if (!methodUrlMatch) {
      return null
    }

    const result: WebClientParams = {
      method: methodUrlMatch[1],
      url: methodUrlMatch[2],
      headers: {}
    }

    let currentSection = ''
    let bodyLines: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]

      if (line.toLowerCase().startsWith('headers:')) {
        currentSection = 'headers'
        continue
      }

      if (line.toLowerCase().startsWith('body:')) {
        currentSection = 'body'
        continue
      }

      if (currentSection === 'headers' && line.includes(':')) {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        if (key && value) {
          result.headers![key.trim()] = value
        }
      }

      if (currentSection === 'body' && line) {
        bodyLines.push(line)
      }
    }

    // Parse body if present
    if (bodyLines.length > 0) {
      const bodyText = bodyLines.join('\n')
      try {
        result.body = JSON.parse(bodyText)
      } catch {
        result.body = bodyText
      }
    }

    return result
  } catch {
    return null
  }
}

// Helper to analyze response and provide feedback
export function analyzeApiResponse(response: ApiResponse): string {
  const { status, statusText, data, responseTime, error } = response

  let analysis = ''

  // Status analysis
  if (error) {
    analysis += `❌ **Error**: ${error}\n\n`

    if (status === 0) {
      analysis += `**Troubleshooting Tips:**\n`
      analysis += `• Check if the URL is correct and the server is running\n`
      analysis += `• Verify CORS configuration on the target server\n`
      analysis += `• Ensure the endpoint accepts requests from web browsers\n\n`
    } else if (status === 401) {
      analysis += `**Authentication Issue:**\n`
      analysis += `• Add authentication headers (e.g., Authorization: Bearer <token>)\n`
      analysis += `• Check if API key is valid and not expired\n\n`
    } else if (status === 403) {
      analysis += `**Permission Issue:**\n`
      analysis += `• Your credentials may lack required permissions\n`
      analysis += `• Check if the resource requires specific roles\n\n`
    } else if (status === 404) {
      analysis += `**Resource Not Found:**\n`
      analysis += `• Verify the endpoint URL is correct\n`
      analysis += `• Check API documentation for the right path\n\n`
    } else if (status >= 500) {
      analysis += `**Server Error:**\n`
      analysis += `• The server encountered an internal error\n`
      analysis += `• Try again later or contact the API provider\n\n`
    }
  } else {
    analysis += `✅ **Status**: ${status} ${statusText}\n`
    analysis += `⏱️ **Response Time**: ${responseTime}ms\n\n`

    // Data analysis
    if (data) {
      if (Array.isArray(data)) {
        analysis += `📋 **Response**: Array with ${data.length} items\n`
        if (data.length === 0) {
          analysis += `*The array is empty - you might want to check if data exists or verify query parameters*\n\n`
        } else if (data.length > 0) {
          analysis += `*You can now process these ${data.length} items or apply filtering/pagination*\n\n`
        }
      } else if (typeof data === 'object') {
        const keys = Object.keys(data)
        analysis += `📦 **Response**: Object with ${keys.length} properties\n`
        if (keys.length > 0) {
          analysis += `*Key properties: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}*\n\n`
        }
      } else if (typeof data === 'string') {
        analysis += `📄 **Response**: Text content (${data.length} characters)\n\n`
      }
    }
  }

  return analysis
}
