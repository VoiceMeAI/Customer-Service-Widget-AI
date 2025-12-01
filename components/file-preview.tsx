"use client"

import { X, FileText, ImageIcon, Loader2 } from "lucide-react"
import type { FileAttachment } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FilePreviewProps {
  files: (FileAttachment & { progress?: number })[]
  onRemove: (id: string) => void
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (files.length === 0) return null

  return (
    <div className="flex gap-2 p-2 border-t border-border overflow-x-auto">
      {files.map((file) => {
        const isImage = file.type.startsWith("image/")
        const isPdf = file.type === "application/pdf"
        const isUploading = file.progress !== undefined && file.progress < 100

        return (
          <div
            key={file.id}
            className={cn(
              "relative flex-shrink-0 rounded-lg overflow-hidden",
              "border border-border bg-muted/50",
              isImage ? "w-20 h-20" : "w-36 h-12",
            )}
          >
            {isImage ? (
              <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center gap-2 px-3 h-full">
                {isPdf ? (
                  <FileText className="h-5 w-5 text-red-500 shrink-0" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span className="text-xs truncate">{file.name}</span>
              </div>
            )}

            {/* Upload progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span className="text-[10px] text-white font-medium">{Math.round(file.progress || 0)}%</span>
                </div>
              </div>
            )}

            {/* Remove button */}
            <button
              onClick={() => onRemove(file.id)}
              className={cn(
                "absolute top-1 right-1 p-1 rounded-full",
                "bg-black/60 text-white",
                "hover:bg-black/80 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-white/30",
              )}
              aria-label={`Remove ${file.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
