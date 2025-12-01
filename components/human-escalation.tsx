"use client"

import { UserRound, Loader2, CheckCircle } from "lucide-react"
import { useChat } from "./chat-context"
import { cn } from "@/lib/utils"

export function HumanEscalation() {
  const { escalateToHuman, state, session } = useChat()

  const isEscalated = session?.isEscalated
  const isEscalating = state.isEscalating

  return (
    <div className="px-3 py-2 border-t border-border bg-muted/30">
      <button
        onClick={escalateToHuman}
        disabled={isEscalated || isEscalating}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm",
          "transition-all duration-200",
          isEscalated
            ? "bg-green-500/10 text-green-600 dark:text-green-400 cursor-default"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          "disabled:cursor-not-allowed",
        )}
      >
        {isEscalating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Connecting to agent...</span>
          </>
        ) : isEscalated ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Connected to human agent</span>
          </>
        ) : (
          <>
            <UserRound className="h-4 w-4" />
            <span>Talk to a human</span>
          </>
        )}
      </button>
    </div>
  )
}
