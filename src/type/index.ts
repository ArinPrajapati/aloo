export interface ChatMessage {
  role: 'User' | 'Bot'
  text: string
  toolOutput?: any
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt?: Date
  updatedAt?: Date
}
