"use client"

import { X, Minus, MoreVertical } from "lucide-react"
import { useChat } from "./chat-context"
import { cn } from "@/lib/utils"

export function ChatHeader() {
  const { toggleChat, state, session } = useChat()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-chat-header-bg text-chat-header-foreground rounded-t-xl">
      <div className="flex items-center gap-3">
        {/* Logo placeholder */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <MessageCircleIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">Live Support</h2>
          <p className="text-xs opacity-80">
            {session?.isEscalated ? "Connected to agent" : state.isTyping ? "Typing..." : "Online"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleChat}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
          )}
          aria-label="Minimize chat"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
          )}
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        <button
          onClick={toggleChat}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
          )}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}

function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
