'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type React from 'react'
import { useTheme as useNextTheme } from 'next-themes'

type Theme = 'light' | 'dark'

interface AlooThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const AlooThemeContext = createContext<AlooThemeContextType | undefined>(undefined)

/**
 * AlooChat custom theme provider that wraps next-themes
 * Maintains backward compatibility while adding enhanced theme features
 */
export function AlooThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: nextTheme, setTheme } = useNextTheme()
  const [theme, setLocalTheme] = useState<Theme>('light')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize theme from localStorage once on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('potato-chat-theme') as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
      setLocalTheme(savedTheme)
    } else if (nextTheme === 'dark' || nextTheme === 'light') {
      setLocalTheme(nextTheme)
    }
    setIsInitialized(true)
  }, []) // Only run once on mount

  // Sync with next-themes after initialization
  useEffect(() => {
    if (isInitialized && (nextTheme === 'dark' || nextTheme === 'light')) {
      setLocalTheme(nextTheme)
    }
  }, [nextTheme, isInitialized])

  // Update AlooChat custom localStorage when theme changes
  useEffect(() => {
    if (isInitialized && theme) {
      localStorage.setItem('potato-chat-theme', theme)
    }
  }, [theme, isInitialized])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return (
    <AlooThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AlooThemeContext.Provider>
  )
}

/**
 * Hook to access AlooChat theme (maintains backward compatibility)
 */
export function useTheme() {
  const context = useContext(AlooThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within an AlooThemeProvider')
  }
  return context
}
