"use client"

import { AlertTriangle, RefreshCw, X } from "lucide-react"
import { useChat } from "./chat-context"
import { cn } from "@/lib/utils"

export function ErrorBanner() {
  const { state, retryConnection, clearError } = useChat()

  if (!state.error) return null

  return (
    <div className="px-3 py-2 bg-destructive/10 border-b border-destructive/20">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
        <p className="flex-1 text-xs text-destructive">{state.error}</p>
        <button
          onClick={retryConnection}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            "text-destructive hover:bg-destructive/10",
            "focus:outline-none focus:ring-2 focus:ring-destructive/30",
          )}
          aria-label="Retry"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={clearError}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            "text-destructive hover:bg-destructive/10",
            "focus:outline-none focus:ring-2 focus:ring-destructive/30",
          )}
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
