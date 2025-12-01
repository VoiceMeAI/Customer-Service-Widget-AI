"use client"

import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from "react"
import type { Message, ChatState, ChatSession, FileAttachment } from "@/lib/types"
import {
  sendMessage as apiSendMessage,
  uploadFile as apiUploadFile,
  restoreSession,
  saveSession,
  getStoredConversationId,
  requestHumanAgent,
  generateId,
} from "@/lib/mock-api"

interface ChatContextValue {
  messages: Message[]
  state: ChatState
  session: ChatSession | null
  sendMessage: (content: string, attachments?: FileAttachment[]) => Promise<void>
  uploadFile: (file: File, onProgress: (progress: number) => void) => Promise<FileAttachment>
  toggleChat: () => void
  escalateToHuman: () => Promise<void>
  retryConnection: () => void
  clearError: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

type Action =
  | { type: "TOGGLE_CHAT" }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_RESTORING"; payload: boolean }
  | { type: "SET_ESCALATING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; updates: Partial<Message> } }
  | { type: "SET_SESSION"; payload: ChatSession }
  | { type: "SET_ESCALATED" }

interface State {
  messages: Message[]
  chatState: ChatState
  session: ChatSession | null
}

function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_CHAT":
      return {
        ...state,
        chatState: { ...state.chatState, isOpen: !state.chatState.isOpen },
      }
    case "SET_TYPING":
      return {
        ...state,
        chatState: { ...state.chatState, isTyping: action.payload },
      }
    case "SET_CONNECTED":
      return {
        ...state,
        chatState: { ...state.chatState, isConnected: action.payload },
      }
    case "SET_RESTORING":
      return {
        ...state,
        chatState: { ...state.chatState, isRestoring: action.payload },
      }
    case "SET_ESCALATING":
      return {
        ...state,
        chatState: { ...state.chatState, isEscalating: action.payload },
      }
    case "SET_ERROR":
      return {
        ...state,
        chatState: { ...state.chatState, error: action.payload },
      }
    case "ADD_MESSAGE":
      const newMessages = [...state.messages, action.payload]
      if (state.session) {
        const updatedSession = {
          ...state.session,
          messages: newMessages,
          updatedAt: new Date(),
        }
        saveSession(updatedSession)
        return { ...state, messages: newMessages, session: updatedSession }
      }
      return { ...state, messages: newMessages }
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((m) => (m.id === action.payload.id ? { ...m, ...action.payload.updates } : m)),
      }
    case "SET_SESSION":
      return {
        ...state,
        session: action.payload,
        messages: action.payload.messages,
      }
    case "SET_ESCALATED":
      if (state.session) {
        const escalatedSession = { ...state.session, isEscalated: true }
        saveSession(escalatedSession)
        return { ...state, session: escalatedSession }
      }
      return state
    default:
      return state
  }
}

const initialChatState: ChatState = {
  isOpen: false,
  isTyping: false,
  isConnected: true,
  isRestoring: false,
  isEscalating: false,
  error: null,
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    chatState: initialChatState,
    session: null,
  })

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      const storedId = getStoredConversationId()

      if (storedId) {
        dispatch({ type: "SET_RESTORING", payload: true })
        try {
          const session = await restoreSession(storedId)
          if (session) {
            dispatch({ type: "SET_SESSION", payload: session })
          } else {
            // Create new session if restore fails
            createNewSession()
          }
        } catch {
          createNewSession()
        } finally {
          dispatch({ type: "SET_RESTORING", payload: false })
        }
      } else {
        createNewSession()
      }
    }

    const createNewSession = () => {
      const newSession: ChatSession = {
        conversationId: generateId(),
        messages: [],
        isEscalated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      dispatch({ type: "SET_SESSION", payload: newSession })
      saveSession(newSession)
    }

    initSession()
  }, [])

  const toggleChat = useCallback(() => {
    dispatch({ type: "TOGGLE_CHAT" })
  }, [])

  const sendMessage = useCallback(async (content: string, attachments?: FileAttachment[]) => {
    const userMessage: Message = {
      id: generateId(),
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
      attachments,
    }

    dispatch({ type: "ADD_MESSAGE", payload: userMessage })
    dispatch({ type: "UPDATE_MESSAGE", payload: { id: userMessage.id, updates: { status: "sent" } } })
    dispatch({ type: "SET_TYPING", payload: true })

    try {
      const response = await apiSendMessage(content, attachments)
      dispatch({ type: "ADD_MESSAGE", payload: response })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to send message" })
    } finally {
      dispatch({ type: "SET_TYPING", payload: false })
    }
  }, [])

  const uploadFile = useCallback(async (file: File, onProgress: (progress: number) => void) => {
    return apiUploadFile(file, onProgress)
  }, [])

  const escalateToHuman = useCallback(async () => {
    dispatch({ type: "SET_ESCALATING", payload: true })

    const systemMessage: Message = {
      id: generateId(),
      content: "Connecting you to a human agent...",
      sender: "system",
      timestamp: new Date(),
    }
    dispatch({ type: "ADD_MESSAGE", payload: systemMessage })

    try {
      const agentMessage = await requestHumanAgent()
      dispatch({ type: "ADD_MESSAGE", payload: agentMessage })
      dispatch({ type: "SET_ESCALATED" })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to connect to agent. Please try again." })
    } finally {
      dispatch({ type: "SET_ESCALATING", payload: false })
    }
  }, [])

  const retryConnection = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null })
    dispatch({ type: "SET_CONNECTED", payload: true })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null })
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages: state.messages,
        state: state.chatState,
        session: state.session,
        sendMessage,
        uploadFile,
        toggleChat,
        escalateToHuman,
        retryConnection,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
