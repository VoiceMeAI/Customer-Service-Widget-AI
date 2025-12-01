export type MessageSender = "user" | "ai" | "agent" | "system"

export type MessageStatus = "sending" | "sent" | "error"

export type SentimentType = "positive" | "neutral" | "negative"

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  progress?: number
}

export interface SuggestedAction {
  id: string
  label: string
  action: string
}

export interface Message {
  id: string
  content: string
  sender: MessageSender
  timestamp: Date
  status?: MessageStatus
  attachments?: FileAttachment[]
  suggestedActions?: SuggestedAction[]
  sentiment?: SentimentType
}

export interface ChatSession {
  conversationId: string
  messages: Message[]
  isEscalated: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ChatState {
  isOpen: boolean
  isTyping: boolean
  isConnected: boolean
  isRestoring: boolean
  isEscalating: boolean
  error: string | null
}
