"use client"

import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"

export function TypingIndicator() {
  return (
    <div className="flex gap-2 max-w-[85%] mr-auto">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-chat-bubble-ai text-chat-bubble-ai-foreground rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn("h-2 w-2 rounded-full bg-current opacity-30", "animate-typing-dot")}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
