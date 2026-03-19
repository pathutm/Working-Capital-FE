"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  Bot,
  User,
  Loader2,
  Brain,
  MessageSquare
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Working Capital AI assistant. Ask me anything about your customers, vendors, or invoices." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      { role: "assistant", content: "Hello! I'm your Working Capital AI assistant. Ask me anything about your customers, vendors, or invoices." }
    ]);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-72 z-50 flex flex-col items-start transition-all duration-500 ease-in-out">
      {isOpen ? (
        <div className="w-96 h-[520px] bg-card/95 backdrop-blur-xl border border-white/10 rounded-md shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary flex items-center justify-between border-b border-white/10 shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Brain className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-none">SNS Intelligence</h3>
                {/* <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Llama 3 70B Active</p> */}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-sm transition-colors text-white/80"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 hover:bg-white/10 rounded-sm transition-colors text-white/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
              >
                <div className={`max-w-[85%] flex space-x-2 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center border shadow-sm ${msg.role === "user" ? "bg-primary/20 border-primary/20 text-primary" : "bg-card border-border text-foreground/60"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-sm text-sm font-medium ${msg.role === "user"
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-background border border-border text-foreground/80"
                    }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-sm bg-card border border-border flex items-center justify-center text-foreground/60">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-background border border-border p-3 rounded-sm flex space-x-1.5 self-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-card/50 border-t border-border backdrop-blur-sm">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="w-full pl-4 pr-12 py-3 bg-background border border-border rounded-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all group-hover:border-primary/40"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {/* <p className="text-[9px] text-center text-foreground/20 font-bold uppercase tracking-widest mt-3">
              Experimental RAG Engine • Llama 3 Power
            </p> */}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-primary text-white rounded-md shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in"
        >
          <div className="absolute inset-0 bg-primary/40 blur-xl rounded-md group-hover:bg-primary/60 transition-all animate-pulse"></div>
          <MessageSquare className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-12" />
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
