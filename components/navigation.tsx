"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  TreePine,
  LayoutDashboard,
  Trophy,
  Info,
  Sparkles,
  Home,
  User,
  LogIn,
  X,
  Send,
  Bot
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/about", label: "About", icon: Info },
  { href: "/profile", label: "Profile", icon: User },
]

const AI_WELCOME_MESSAGE = "I'm TreeBot! 🌿 I'm currently running via a live server-side API stream! I can help you with planting tips, track your progress, or answer questions about TreeTracker. What would you like to know?";

interface ChatMessage {
  role: "user" | "assistant"
  text: string
}

export function Navigation() {
  const pathname = usePathname()
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: AI_WELCOME_MESSAGE }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatInput("")
    
    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    setIsTyping(true)
    
    // Create a placeholder for the assistant's streaming response
    setMessages((prev) => [...prev, { role: "assistant", text: "" }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      setIsTyping(false);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          
          // Update the last message in the state with the new chunk
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              text: newMessages[lastIndex].text + chunk
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Chat API error:", error);
      setIsTyping(false);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: "assistant", text: "Sorry, I'm having trouble connecting right now." };
        return newMessages;
      });
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:block animate-slide-down">
        <nav className="glass mx-4 mt-4 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <TreePine className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Tree<span className="text-primary">Tracker</span>
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all duration-200 neon-glow hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
              <Link
                href="/profile"
                className="w-10 h-10 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <User className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up">
        <div className="glass mx-4 mb-4 rounded-2xl px-2 py-3">
          <div className="flex items-center justify-around">
            {navItems.filter(item => item.href !== "/about").map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                  <span className="text-xs">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 md:bottom-24 right-6 z-50 w-80 md:w-96 animate-fade-in-up">
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: "480px" }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">TreeBot AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="w-8 h-8 rounded-full hover:bg-secondary/50 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "320px" }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-foreground"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 rounded-2xl px-4 py-2.5 text-sm text-muted-foreground">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce [animation-delay:0ms]">·</span>
                      <span className="animate-bounce [animation-delay:150ms]">·</span>
                      <span className="animate-bounce [animation-delay:300ms]">·</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask me anything…"
                  className="flex-1 px-4 py-2.5 neumorphic-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Floating Action Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={cn(
          "fixed bottom-24 md:bottom-8 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all animate-fade-in [animation-delay:300ms]",
          showChat
            ? "bg-secondary text-muted-foreground border border-border/50"
            : "bg-primary text-primary-foreground neon-glow"
        )}
        aria-label="AI Assistant"
      >
        {showChat ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>
    </>
  )
}
