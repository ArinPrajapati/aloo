interface ChatMessage {
    role: "User" | "Bot"
    text: string
}

interface Chat {
    id: string
    title: string
    messages: ChatMessage[]
}

export function saveChats(chats: Chat[]): void {
    if (typeof window !== "undefined") {
        localStorage.setItem("potato-chat-data", JSON.stringify(chats))
    }
}

export function loadChats(): Chat[] {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("potato-chat-data")
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch (error) {
                console.error("Error parsing stored chats:", error)
                return []
            }
        }
    }
    return []
}

