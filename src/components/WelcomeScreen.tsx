import { Bot, MessageSquare, Sparkles, Zap } from 'lucide-react'
import { useTheme } from '../context/aloo-theme-context'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

interface WelcomeScreenProps {
  onNewChat: () => void
}

export default function WelcomeScreen({ onNewChat }: WelcomeScreenProps) {
  const { theme } = useTheme()

  const features = [
    {
      icon: <MessageSquare size={24} />,
      title: 'Natural Conversations',
      description: 'Chat naturally with AI that understands context and nuance',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Smart Responses',
      description: 'Get intelligent, helpful responses tailored to your needs',
    },
    {
      icon: <Zap size={24} />,
      title: 'Lightning Fast',
      description:
        'Experience near-instant responses with optimized performance',
    },
  ]

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Bot size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Welcome to AlooChat
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Your intelligent AI assistant is ready to help with questions,
            creative tasks, problem-solving, and engaging conversations.
          </p>
          <Button
            onClick={onNewChat}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg px-8 py-3 text-lg"
          >
            <MessageSquare size={20} className="mr-2" />
            Start Your First Conversation
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-border transition-colors duration-200"
            >
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <div className="text-orange-600 dark:text-orange-400">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            <span className="font-medium">💡 Quick tip:</span> You can use{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>{' '}
            to send messages and{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
              Shift + Enter
            </kbd>{' '}
            for new lines
          </p>
        </div>
      </div>
    </div>
  )
}
