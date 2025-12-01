"use client"

import { useRef, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { useChat } from "./chat-context"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { cn } from "@/lib/utils"

export function MessageList() {
  const { messages, state } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, state.isTyping])

  if (state.isRestoring) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-primary animate-bounce-subtle"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Restoring your session...</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <MessageCircle className="h-8 w-8 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Start a conversation</h3>
          <p className="text-sm text-muted-foreground mt-1">We&apos;re here to help! Send us a message.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
      )}
    >
      {messages.map((message, index) => (
        <div key={message.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
          <MessageBubble message={message} />
        </div>
      ))}

      {state.isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  )
}
