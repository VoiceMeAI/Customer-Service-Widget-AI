"use client"

import { ChatProvider } from "./chat-context"
import { ChatBubble } from "./chat-bubble"
import { ChatDrawer } from "./chat-drawer"

export function ChatWidget() {
  return (
    <ChatProvider>
      <ChatBubble />
      <ChatDrawer />
    </ChatProvider>
  )
}
