import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../context/theme-context'
import { Providers } from '../components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AlooChat - AI-Powered Conversations',
  description: 'Your friendly AI companion for engaging conversations',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 fontSize=%2290%22>🥔</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
          {/* Global Clerk CAPTCHA element for bot protection */}
          <div id="clerk-captcha" style={{ display: 'none' }}></div>
        </Providers>
      </body>
    </html>
  )
}
