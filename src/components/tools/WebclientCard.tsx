import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { CheckCircle, XCircle, Clock, Globe, AlertTriangle } from 'lucide-react'

interface WebclientCardProps {
  data: {
    status: number
    statusText: string
    data: any
    headers: Record<string, string>
    responseTime: number
    error?: string
    analysis?: string
  }
}

export default function WebclientCard({ data }: WebclientCardProps) {
  const { status, statusText, data: responseData, headers, responseTime, error, analysis } = data

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/50'
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/50'
    if (status >= 500) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/50'
    return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50'
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle size={16} />
    if (status >= 400) return <XCircle size={16} />
    if (status === 0) return <AlertTriangle size={16} />
    return <Globe size={16} />
  }

  return (
    <Card className="mt-3 border-l-4 border-l-blue-500 dark:border-l-blue-400">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe size={16} className="text-blue-500 dark:text-blue-400" />
          API Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Section */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {status > 0 ? `${status} ${statusText}` : 'Network Error'}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Clock size={14} />
            {responseTime}ms
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/20 dark:border-red-800/50">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-400 font-medium mb-1">
              <XCircle size={16} />
              Error
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Analysis */}
        {analysis && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-950/20 dark:border-blue-800/50">
            <div className="text-blue-800 dark:text-blue-400 font-medium mb-2 text-sm">Analysis</div>
            <div className="text-blue-700 dark:text-blue-300 text-sm whitespace-pre-line">{analysis}</div>
          </div>
        )}

        {/* Response Data */}
        {responseData && !error && (
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Data</div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 overflow-x-auto border dark:border-gray-700">
              <pre className="text-xs text-gray-800 dark:text-gray-200">
                {typeof responseData === 'string'
                  ? responseData.length > 500
                    ? responseData.substring(0, 500) + '...\n\n[Truncated - showing first 500 characters]'
                    : responseData
                  : JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Response Headers */}
        {Object.keys(headers).length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Headers</div>
            <div className="space-y-1">
              {Object.entries(headers).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex text-xs">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-32 flex-shrink-0">{key}:</span>
                  <span className="text-gray-800 dark:text-gray-200 break-all">{value}</span>
                </div>
              ))}
              {Object.keys(headers).length > 5 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  +{Object.keys(headers).length - 5} more headers
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {status >= 200 && status < 300 && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              ✅ Request Successful
            </Badge>
            {Array.isArray(responseData) && (
              <Badge variant="outline" className="text-xs">
                📋 {responseData.length} items returned
              </Badge>
            )}
            {typeof responseData === 'object' && !Array.isArray(responseData) && responseData && (
              <Badge variant="outline" className="text-xs">
                📦 {Object.keys(responseData).length} properties
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
