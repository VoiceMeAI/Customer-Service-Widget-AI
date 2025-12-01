"use client"

import { useChat } from "./chat-context"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { ErrorBanner } from "./error-banner"
import { HumanEscalation } from "./human-escalation"
import { cn } from "@/lib/utils"

export function ChatDrawer() {
  const { state } = useChat()

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 z-40",
        "w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)]",
        "bg-chat-widget-bg rounded-xl shadow-2xl",
        "flex flex-col overflow-hidden",
        "border border-border",
        state.isOpen ? "animate-slide-up" : "hidden",
      )}
      role="dialog"
      aria-label="Chat window"
    >
      <ChatHeader />
      <ErrorBanner />
      <MessageList />
      <HumanEscalation />
      <MessageInput />
    </div>
  )
}
