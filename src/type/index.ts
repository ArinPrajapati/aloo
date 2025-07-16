export interface ChatMessage {
    role: "User" | "Bot"
    text: string
}

export interface Chat {
    id: string
    title: string
    messages: ChatMessage[]
}

