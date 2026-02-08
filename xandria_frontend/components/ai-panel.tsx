"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/stores/useStore";
import type { AiPaneMode } from "@/types";

const modeConfig: Record<AiPaneMode, { label: string; actions: string[] }> = {
  explain: {
    label: "Explain",
    actions: ["Explain this passage", "Define key terms"],
  },
  summarize: {
    label: "Summarize",
    actions: ["Summarize this chapter", "Key takeaways"],
  },
  argue: {
    label: "Argue",
    actions: ["Play devil's advocate", "Challenge the thesis"],
  },
  counterpoints: {
    label: "Counterpoints",
    actions: ["What would a critic say?", "Alternative perspective"],
  },
};

const modes: AiPaneMode[] = ["explain", "summarize", "argue", "counterpoints"];

export default function AiPanel({
  bookId,
  open,
  onClose,
}: {
  bookId: number;
  open: boolean;
  onClose: () => void;
}) {
  const { aiMessages, sendAiMessage, aiPaneMode, setAiPaneMode, selectedText, setSelectedText } = useStore();
  const messages = aiMessages[bookId] || [];
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim() || loading) return;
    const context = selectedText;
    setInput("");
    setSelectedText(null);
    setLoading(true);
    await sendAiMessage(bookId, message, context);
    setLoading(false);
  };

  const config = modeConfig[aiPaneMode];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed top-0 right-0 bottom-0 w-[350px] z-40 bg-surface border-l border-border flex flex-col shadow-[var(--shadow-modal)]"
          initial={{ x: 350 }}
          animate={{ x: 0 }}
          exit={{ x: 350 }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-display text-lg text-text-primary">
              AI Assistant
            </h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-lg transition-colors"
            >
              &#10005;
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex border-b border-border">
            {modes.map((mode) => (
              <button
                key={mode}
                onClick={() => setAiPaneMode(mode)}
                className={`flex-1 py-2 text-[11px] font-body transition-colors ${
                  aiPaneMode === mode
                    ? "text-accent border-b-2 border-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {modeConfig[mode].label}
              </button>
            ))}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 p-3 border-b border-border">
            {config.actions.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                disabled={loading}
                className="px-3 py-1.5 text-xs bg-accent-subtle text-accent rounded border border-accent/20 hover:bg-accent/15 transition-colors disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Selected text context badge */}
          {selectedText && (
            <div className="mx-3 mt-2 px-3 py-2 bg-accent/10 border border-accent/20 rounded text-xs text-text-secondary flex items-start gap-2">
              <span className="flex-1 line-clamp-2 italic">
                &ldquo;{selectedText.length > 120 ? selectedText.slice(0, 120) + "..." : selectedText}&rdquo;
              </span>
              <button
                onClick={() => setSelectedText(null)}
                className="text-text-muted hover:text-text-primary shrink-0 mt-0.5"
              >
                &#10005;
              </button>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-text-muted text-sm text-center mt-8">
                Ask anything about this book...
              </p>
            )}
            {messages.map((msg) => (
              <div key={msg.id}>
                <p className="text-xs text-text-muted mb-1">
                  {msg.role === "user" ? "You" : "Xandria AI"}
                </p>
                <div
                  className={`text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "user" && (
                <div>
                  <p className="text-xs text-text-muted mb-1">Xandria AI</p>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(input);
                }}
                placeholder="Ask about this book..."
                disabled={loading}
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-accent text-background text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
