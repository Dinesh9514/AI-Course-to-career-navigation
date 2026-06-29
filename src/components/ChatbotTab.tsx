import { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, Send, ShieldAlert, ArrowDown, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotTabProps {
  token: string;
}

export default function ChatbotTab({ token }: ChatbotTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory();
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch("/api/chat", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data.chatHistory || []);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    setError("");
    setLoading(true);
    if (!customText) setInput("");

    // optimistic update
    const userMsg: ChatMessage = {
      id: "opt-u-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: textToSend, history: messages.slice(-8) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to communicate with AI");
      setMessages(data.chatHistory || []);
    } catch (err: any) {
      setError(err.message || "Failed to reach AI assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Recommend study hours for web dev",
    "How do I prepare for a Google interview?",
    "Give me tips on writing high-impact resumes",
    "Suggest a beginner python project idea"
  ];

  return (
    <div className="flex flex-col h-[600px] bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-sm overflow-hidden" id="chatbot-tab-view">
      {/* Chat header */}
      <div className="px-6 py-4 border-b border-[#45A29E]/15 bg-[#0B0C10]/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#66FCF1] text-[#0B0C10] flex items-center justify-center shadow-sm shadow-[#66FCF1]/10">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">AI Career Counselor</h4>
            <p className="text-[10px] text-[#C5C6C7]/60 font-medium">Equipped with Gemini 3.5 Recruiter Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3 h-3" />
          <span>Active Online</span>
        </div>
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0B0C10]/20">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/20 text-red-400 text-xs border border-red-500/20">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {messages.map((m) => {
          const isBot = m.sender === "bot";
          return (
            <div
              key={m.id}
              className={`flex ${isBot ? "justify-start" : "justify-end"} animate-fade-in`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                  isBot
                    ? "bg-[#1F2833] border border-[#45A29E]/20 text-white shadow-sm"
                    : "bg-[#66FCF1]/10 border border-[#66FCF1]/30 text-white shadow-sm"
                }`}
              >
                {/* Parse markdown very simply (headers and linebreaks) */}
                <div className="whitespace-pre-wrap font-medium">
                  {m.text}
                </div>
                <div className={`text-[9px] mt-1.5 text-right font-mono ${isBot ? "text-[#C5C6C7]/40" : "text-[#66FCF1]/50"}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bot writing loader */}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-[#1F2833] border border-[#45A29E]/20 p-4 rounded-2xl max-w-[75%] flex items-center gap-2 text-xs text-[#C5C6C7]/50">
              <span className="w-2 h-2 bg-[#66FCF1] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#66FCF1] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-[#66FCF1] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="font-medium ml-1">AI Guide is writing...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestions and input footer */}
      <div className="p-4 border-t border-[#45A29E]/15 bg-[#1F2833] space-y-3">
        {/* Suggestion prompt helpers */}
        {messages.length < 4 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 bg-[#0B0C10] hover:bg-[#66FCF1]/10 hover:text-[#66FCF1] border border-[#45A29E]/20 hover:border-[#66FCF1]/30 rounded-lg text-[10px] font-semibold text-[#C5C6C7]/80 transition-all focus:outline-none cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            id="chat-message-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Counselor about interview preparation, portfolio reviews, or code help..."
            className="flex-1 px-4 py-2.5 bg-[#0B0C10] border border-[#45A29E]/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] text-white transition-colors placeholder-[#C5C6C7]/30"
          />
          <button
            type="submit"
            id="chat-send-btn"
            disabled={loading || !input.trim()}
            className="px-4 bg-[#66FCF1] hover:bg-[#45A29E] disabled:bg-[#45A29E]/40 text-[#0B0C10] font-bold rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
