"use client"

import { useState, useRef, useCallback, type KeyboardEvent, type ChangeEvent } from "react"
import { Send, Paperclip, Loader2 } from "lucide-react"
import { useChat } from "./chat-context"
import { FilePreview } from "./file-preview"
import type { FileAttachment } from "@/lib/types"
import { generateId } from "@/lib/mock-api"
import { cn } from "@/lib/utils"

export function MessageInput() {
  const { sendMessage, uploadFile, state } = useChat()
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<(FileAttachment & { progress?: number })[]>([])
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput && files.length === 0) return
    if (isSending) return

    setIsSending(true)
    try {
      const completedFiles = files.filter((f) => f.progress === undefined || f.progress === 100)
      await sendMessage(trimmedInput, completedFiles.length > 0 ? completedFiles : undefined)
      setInput("")
      setFiles([])
    } finally {
      setIsSending(false)
    }
  }, [input, files, isSending, sendMessage])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    for (const file of selectedFiles) {
      const tempId = generateId()
      const tempFile: FileAttachment & { progress?: number } = {
        id: tempId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        progress: 0,
      }

      setFiles((prev) => [...prev, tempFile])

      try {
        const uploaded = await uploadFile(file, (progress) => {
          setFiles((prev) => prev.map((f) => (f.id === tempId ? { ...f, progress } : f)))
        })
        setFiles((prev) => prev.map((f) => (f.id === tempId ? { ...uploaded, progress: 100 } : f)))
      } catch {
        setFiles((prev) => prev.filter((f) => f.id !== tempId))
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const isDisabled = isSending || !state.isConnected
  const hasContent = input.trim().length > 0 || files.length > 0

  return (
    <div className="border-t border-border bg-card">
      <FilePreview files={files} onRemove={handleRemoveFile} />

      <div className="flex items-end gap-2 p-3">
        {/* File attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isDisabled}
            rows={1}
            className={cn(
              "w-full resize-none rounded-xl px-4 py-2.5 text-sm",
              "bg-input border border-border",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "max-h-[120px]",
            )}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={isDisabled || !hasContent}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            hasContent && !isDisabled && "shadow-md",
          )}
          aria-label="Send message"
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
