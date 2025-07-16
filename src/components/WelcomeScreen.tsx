import { useTheme } from "../context/theme-context"

interface WelcomeScreenProps {
    onNewChat: () => void
}

export default function WelcomeScreen({ onNewChat }: WelcomeScreenProps) {
    const { theme } = useTheme()

    return (
        <div
            className={`flex-1 flex items-center justify-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
        >
            <div className="text-center">
                <div className="text-8xl mb-6">🥔</div>
                <h2 className="text-2xl font-bold mb-2">Welcome to PotatoChat</h2>
                <p className="text-lg mb-6">Your AI-powered conversation companion</p>
                <button
                    onClick={onNewChat}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${theme === "dark"
                            ? "bg-orange-600 hover:bg-orange-700 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                >
                    Start Your First Chat
                </button>
            </div>
        </div>
    )
}
