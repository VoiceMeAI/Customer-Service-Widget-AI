"use client"

import { MessageCircle, X } from "lucide-react"
import { useChat } from "./chat-context"
import { cn } from "@/lib/utils"

export function ChatBubble() {
  const { state, toggleChat } = useChat()

  return (
    <button
      onClick={toggleChat}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-xl",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "active:scale-95",
      )}
      aria-label={state.isOpen ? "Close chat" : "Open chat"}
    >
      {/* Pulse ring effect when closed */}
      {!state.isOpen && <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />}

      <span className={cn("transition-transform duration-300", state.isOpen ? "rotate-0" : "rotate-0")}>
        {state.isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </span>
    </button>
  )
}
