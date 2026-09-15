import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { streamChat, type ChatMessage } from "../lib/api";
import {
  Code2,
  Briefcase,
  Award,
  GraduationCap,
  Plus,
  MessageSquare,
  Trash2,
} from "lucide-react";
import {
  loadConversations,
  saveConversations,
  makeTitle,
  type Conversation,
} from "../lib/conversations";

const SUGGESTIONS = [
  {
    icon: Code2,
    iconColor: "text-emerald-400",
    title: "Technical Skills",
    question: "What are Shivam's core programming languages, frameworks, & AI skills?",
  },
  {
    icon: Briefcase,
    iconColor: "text-blue-400",
    title: "Work Experience",
    question: "Tell me about Shivam's past roles, responsibilities, and achievements.",
  },
  {
    icon: Award,
    iconColor: "text-gold",
    title: "Why Hire Shivam?",
    question: "What key strengths make Shivam a great fit for our team?",
  },
  {
    icon: GraduationCap,
    iconColor: "text-pink-400",
    title: "Projects & Education",
    question: "What major software/AI projects has Shivam built?",
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load saved conversations once on mount
  useEffect(() => {
    setConversations(loadConversations());
  }, []);

  // Persist on every change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const active = conversations.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const existing = activeId ? conversations.find((c) => c.id === activeId) : undefined;
    const idToUse = existing ? existing.id : crypto.randomUUID();
    const historyBefore = existing ? existing.messages : [];

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const placeholderMsg: ChatMessage = { role: "assistant", content: "" };

    setConversations((prev) => {
      if (existing) {
        return prev.map((c) =>
          c.id === idToUse
            ? { ...c, messages: [...c.messages, userMsg, placeholderMsg], updatedAt: Date.now() }
            : c
        );
      }
      const newConvo: Conversation = {
        id: idToUse,
        title: makeTitle(trimmed),
        messages: [userMsg, placeholderMsg],
        updatedAt: Date.now(),
      };
      return [newConvo, ...prev];
    });

    setActiveId(idToUse);
    setInput("");
    setLoading(true);

    const apiHistory: ChatMessage[] = [...historyBefore, userMsg];

    try {
      await streamChat(apiHistory, (chunk) => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== idToUse) return c;
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
            return { ...c, messages: msgs, updatedAt: Date.now() };
          })
        );
      });
    } catch {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== idToUse) return c;
          const msgs = [...c.messages];
          msgs[msgs.length - 1] = {
            role: "assistant",
            content: "Something went wrong reaching the server. Try again.",
          };
          return { ...c, messages: msgs };
        })
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewChat() {
    setActiveId(null);
    setInput("");
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === activeId) setActiveId(null);
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-raised bg-surface/50">
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 rounded-xl border border-white/10
                       px-3 py-2.5 text-sm text-hi hover:bg-raised transition-colors"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full group flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm
                            transition-colors ${
                              c.id === activeId
                                ? "bg-raised text-hi"
                                : "text-lo hover:bg-raised/60 hover:text-hi"
                            }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 truncate">{c.title || "New chat"}</span>
                <span
                  onClick={(e) => handleDelete(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 hover:text-red-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-raised px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-gold text-ink font-serif text-sm font-bold flex items-center justify-center shrink-0">
              S
            </span>
            <span className="font-serif text-lg">HireMeAI</span>
          </button>
          <span className="text-xs text-lo flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            Interviewing Shivam Verma
          </span>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="max-w-[720px] w-full mx-auto px-6 py-10 flex-1 flex flex-col justify-center">
            {messages.length === 0 && (
              <div>
                <div className="text-lo text-center mb-8">
                  <p className="font-serif text-2xl text-hi mb-2">Ready when you are</p>
                  <p>Ask about my experience, a project, or a specific skill.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTIONS.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => sendMessage(s.question)}
                        disabled={loading}
                        className="text-left bg-raised hover:bg-raised/70 hover:border-white/15 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-150 rounded-3xl px-4 py-4 border border-white/5"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className={`w-4 h-4 ${s.iconColor} shrink-0`} />
                          <span className="font-medium text-hi text-sm">{s.title}</span>
                        </div>
                        <p className="text-xs text-lo leading-relaxed">{s.question}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      m.role === "user"
                        ? "inline-block bg-raised px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%] text-left"
                        : "inline-block max-w-[85%] text-left"
                    }
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.content || (i === messages.length - 1 && loading ? "…" : "")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="border-t border-raised px-6 py-4">
          <div className="max-w-[720px] mx-auto flex items-end gap-3 bg-surface rounded-2xl px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask me about my experience…"
              className="flex-1 bg-transparent resize-none outline-none placeholder:text-lo max-h-32"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gold disabled:bg-lo/30 text-ink font-medium px-4 py-2 rounded-full transition-colors shrink-0"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}