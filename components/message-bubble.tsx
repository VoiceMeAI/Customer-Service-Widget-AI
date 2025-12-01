"use client"

import { format } from "date-fns"
import { Check, CheckCheck, AlertCircle, User, Bot, Headphones, FileText, ImageIcon } from "lucide-react"
import type { Message, FileAttachment, SentimentType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  onActionClick?: (action: string) => void
}

export function MessageBubble({ message, onActionClick }: MessageBubbleProps) {
  const isUser = message.sender === "user"
  const isAi = message.sender === "ai"
  const isAgent = message.sender === "agent"
  const isSystem = message.sender === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{message.content}</span>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-2 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      {/* Avatar */}
      {!isUser && (
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isAi ? "bg-secondary text-secondary-foreground" : "bg-chat-bubble-agent text-chat-bubble-agent-foreground",
          )}
        >
          {isAi ? <Bot className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
        </div>
      )}

      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        {/* Sender label for agent */}
        {isAgent && <span className="text-xs text-muted-foreground px-1">Support Agent</span>}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isUser
              ? "bg-chat-bubble-user text-chat-bubble-user-foreground rounded-br-md"
              : isAgent
                ? "bg-chat-bubble-agent text-chat-bubble-agent-foreground rounded-bl-md"
                : "bg-chat-bubble-ai text-chat-bubble-ai-foreground rounded-bl-md",
          )}
        >
          {/* Sentiment indicator */}
          {message.sentiment && !isUser && <SentimentIndicator sentiment={message.sentiment} />}

          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {/* File attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {message.attachments.map((attachment) => (
                <AttachmentPreview key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}
        </div>

        {/* Suggested actions */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.suggestedActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onActionClick?.(action.action)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border border-primary/30",
                  "text-primary bg-primary/5",
                  "hover:bg-primary/10 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp and status */}
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-[10px] text-muted-foreground">{format(message.timestamp, "HH:mm")}</span>
          {isUser && <MessageStatus status={message.status} />}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

function MessageStatus({ status }: { status?: Message["status"] }) {
  if (status === "sending") {
    return <Check className="h-3 w-3 text-muted-foreground" />
  }
  if (status === "sent") {
    return <CheckCheck className="h-3 w-3 text-primary" />
  }
  if (status === "error") {
    return <AlertCircle className="h-3 w-3 text-destructive" />
  }
  return null
}

function SentimentIndicator({ sentiment }: { sentiment: SentimentType }) {
  const config = {
    positive: { emoji: "😊", color: "text-green-500" },
    neutral: { emoji: "😐", color: "text-muted-foreground" },
    negative: { emoji: "😟", color: "text-amber-500" },
  }
  const { emoji, color } = config[sentiment]

  return (
    <span className={cn("text-xs mr-1", color)} title={`Sentiment: ${sentiment}`}>
      {emoji}
    </span>
  )
}

function AttachmentPreview({ attachment }: { attachment: FileAttachment }) {
  const isImage = attachment.type.startsWith("image/")
  const isPdf = attachment.type === "application/pdf"

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5">
      {isImage ? (
        <div className="relative w-16 h-16 rounded overflow-hidden">
          <img
            src={attachment.url || "/placeholder.svg"}
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
          {isPdf ? (
            <FileText className="h-5 w-5 text-red-500" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{attachment.name}</p>
        <p className="text-[10px] text-muted-foreground">{(attachment.size / 1024).toFixed(1)} KB</p>
      </div>
    </div>
  )
}
