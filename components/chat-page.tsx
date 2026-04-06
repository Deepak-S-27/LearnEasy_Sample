"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useApp } from "@/lib/app-context"
import {
  ArrowLeft,
  Send,
  ImagePlus,
  MessageCircle,
  Bot,
  User,
  Sparkles,
} from "lucide-react"

export function ChatPage() {
  const { t, setCurrentPage, initialChatMessage, setInitialChatMessage } = useApp()
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (initialChatMessage) {
      setInput(initialChatMessage)
      setInitialChatMessage(null)
    }
  }, [initialChatMessage, setInitialChatMessage])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-border bg-card">
        <button
          onClick={() => setCurrentPage("home")}
          className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-secondary-foreground" />
        </button>
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            {t("aiAssistant")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Thinking..." : "Online"}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 pb-36"
        role="log"
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-foreground font-semibold mb-2">
              {t("aiAssistant")}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("aiGreeting")}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((message) => {
            const isUser = message.role === "user"
            return (
              <div
                key={message.id}
                className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <span key={index} className="whitespace-pre-wrap">
                          {part.text}
                        </span>
                      )
                    }
                    return null
                  })}
                </div>
                {isUser && (
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            )
          })}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-2 justify-start">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-lg mx-auto">
          <button
            type="button"
            className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            aria-label={t("uploadImage")}
          >
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatPlaceholder")}
              disabled={isLoading}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-95 transition-transform"
            aria-label={t("send")}
          >
            <Send className="h-5 w-5 text-primary-foreground" />
          </button>
        </form>
      </div>
    </div>
  )
}
