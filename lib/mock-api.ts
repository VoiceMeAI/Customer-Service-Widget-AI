import type { Message, FileAttachment, ChatSession } from "./types"

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate unique IDs
export const generateId = () => Math.random().toString(36).substring(2, 15)

// Mock AI responses
const aiResponses = [
  "Thanks for reaching out! I'd be happy to help you with that.",
  "I understand your concern. Let me look into this for you.",
  "That's a great question! Here's what I can tell you...",
  "I've found some information that might help you.",
  "Is there anything else you'd like to know about this?",
]

// Mock agent responses
const agentResponses = [
  "Hi! I'm Sarah, your dedicated support agent. How can I assist you today?",
  "Thank you for your patience. I've reviewed your case and have an update.",
  "I completely understand your situation. Let me help resolve this for you.",
]

// Simulate sending a message and getting a response
export async function sendMessage(content: string, attachments?: FileAttachment[]): Promise<Message> {
  await delay(500 + Math.random() * 1000)

  // Randomly fail 5% of the time for error state testing
  if (Math.random() < 0.05) {
    throw new Error("Failed to send message. Please try again.")
  }

  return {
    id: generateId(),
    content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
    sender: "ai",
    timestamp: new Date(),
    status: "sent",
    suggestedActions:
      Math.random() > 0.5
        ? [
            { id: generateId(), label: "Book a Demo", action: "book_demo" },
            { id: generateId(), label: "View Pricing", action: "view_pricing" },
          ]
        : undefined,
    sentiment: Math.random() > 0.7 ? "positive" : "neutral",
  }
}

// Simulate file upload
export async function uploadFile(file: File, onProgress: (progress: number) => void): Promise<FileAttachment> {
  const totalSteps = 10
  for (let i = 1; i <= totalSteps; i++) {
    await delay(200)
    onProgress((i / totalSteps) * 100)
  }

  return {
    id: generateId(),
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
  }
}

// Simulate session restoration
export async function restoreSession(conversationId: string): Promise<ChatSession | null> {
  await delay(1500)

  // Return mock previous session
  const storedSession = localStorage.getItem(`chat_session_${conversationId}`)
  if (storedSession) {
    const session = JSON.parse(storedSession)
    return {
      ...session,
      messages: session.messages.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
    }
  }

  return null
}

// Save session to localStorage
export function saveSession(session: ChatSession) {
  localStorage.setItem(`chat_session_${session.conversationId}`, JSON.stringify(session))
  localStorage.setItem("chat_conversation_id", session.conversationId)
}

// Get stored conversation ID
export function getStoredConversationId(): string | null {
  return localStorage.getItem("chat_conversation_id")
}

// Simulate human escalation
export async function requestHumanAgent(): Promise<Message> {
  await delay(2000)

  return {
    id: generateId(),
    content: agentResponses[0],
    sender: "agent",
    timestamp: new Date(),
    status: "sent",
  }
}
