"use client";

import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Define the shape of a chat message
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am PulseBot. I have access to the full medical benefit database. Ask me anything about drug coverage, step therapy, or prior authorization requirements."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to automatically scroll to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Add user message to UI immediately
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };
    
    // We create a new array holding the full history PLUS the new message
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // 2. Format the history to match our Python Pydantic model
      // We skip the very first welcome message so we don't send useless tokens
      const chatHistory = updatedMessages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));

      // 3. Hit the FastAPI endpoint
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 4. Append the AI's real response to the UI
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: data.role || "assistant",
          content: data.content || "I experienced an error analyzing the matrix.",
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        console.error("Failed to fetch chat response");
      }
    } catch (error) {
      console.error("Error calling chat API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      
      {/* Header */}
      <header className="bg-slate-950/40 backdrop-blur-md border-b border-white/10 px-8 py-6 shrink-0 z-10 shadow-lg">
        <h2 className="text-2xl font-bold tracking-tight mb-1">PulseBot</h2>
        <p className="text-muted-foreground">Ask natural language questions against the medical benefit data benefit.</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Bot Avatar */}
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <Card className={`p-4 max-w-[80%] shadow-2xl border-white/10 ${
                message.role === "user" 
                ? "bg-blue-600/90 text-white rounded-2xl rounded-tr-sm" 
                : "bg-slate-900/60 backdrop-blur-md text-white rounded-2xl rounded-tl-sm"
}               `}>
                {/* THE FIX: Moved space-y-4 to this parent div! */}
                <div className="leading-relaxed text-sm md:text-base space-y-4"> 
                  <ReactMarkdown
                  components={{
                    // Changed text-slate-900 to text-white
                    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
    
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1.5" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1.5" {...props} />,
    
                    // Changed text-slate-700 to text-slate-200
                    li: ({ node, ...props }) => <li className="text-slate-200" {...props} />,
    
                    // Ensure the paragraph text is also bright
                    p: ({ node, ...props }) => <p className="m-0 text-slate-100" {...props} />
            }}
>
  {message.content}
</ReactMarkdown>
                </div>
              </Card>

              {/* User Avatar */}
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <Card className="p-4 bg-white rounded-2xl rounded-tl-sm border-border shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></span>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-950/40 backdrop-blur-md border-t border-white/10 p-6 shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
          <Input 
            placeholder="e.g., Which payers cover Avastin without step therapy?" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 h-14 text-lg rounded-xl shadow-sm border-slate-300 focus-visible:ring-blue-600"
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="bg-white/50 backdrop-blur-md border-white/60 focus:bg-white/80 transition-all ..."
          >
            <Send className="w-5 h-5 mr-2" />
            Ask Copilot
          </Button>
        </form>
      </div>

    </div>
  );
}