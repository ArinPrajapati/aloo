'use client'

import { useState, useEffect } from 'react'
import { Cloud, Github, Search, Image, Globe } from 'lucide-react'

const toolConfigs = [
  { name: 'Weather', icon: Cloud, color: '#3b82f6' },
  { name: 'GitHub', icon: Github, color: '#6366f1' },
  { name: 'Wikipedia', icon: Search, color: '#f59e0b' },
  { name: 'Giphy', icon: Image, color: '#ec4899' },
  { name: 'API Client', icon: Globe, color: '#10b981' },
]

export default function DynamicAPIStatus() {
  const [currentToolIndex, setCurrentToolIndex] = useState(0)

  useEffect(() => {
    // Gentle cycling animation every 4 seconds
    const interval = setInterval(() => {
      setCurrentToolIndex((prev) => (prev + 1) % toolConfigs.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const currentTool = toolConfigs[currentToolIndex]
  const Icon = currentTool.icon

  return (
    <div className="flex items-center gap-2 text-xs text-aloo-text-secondary">
      <Icon
        size={14}
        style={{ color: currentTool.color }}
        className="transition-all duration-700 ease-in-out transform"
      />
      <span className="transition-all duration-700 ease-in-out">
        {currentTool.name} Ready
      </span>
    </div>
  )
}
