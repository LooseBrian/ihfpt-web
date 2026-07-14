"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Lock, CheckCircle2 } from "lucide-react";
import type { Inquiry } from "@/lib/inquiry-context";
import { useInquiry } from "@/lib/inquiry-context";

interface InquiryChatProps {
  inquiry: Inquiry;
  viewerRole: "buyer" | "supplier";
  viewerName: string;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return d.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InquiryChat({ inquiry, viewerRole, viewerName }: InquiryChatProps) {
  const { sendMessage } = useInquiry();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [inquiry.messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || inquiry.status === "closed") return;
    sendMessage(inquiry.id, viewerRole, viewerName, input.trim());
    setInput("");
  };

  const isClosed = inquiry.status === "closed";

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20"
        style={{ minHeight: "300px", maxHeight: "calc(70vh - 160px)" }}
      >
        {/* Inquiry initial message banner */}
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground bg-white px-3 py-1 rounded-full border">
            询盘创建于 {formatTime(inquiry.createdAt)}
          </span>
        </div>

        {inquiry.messages.map((msg) => {
          const isMine = msg.sender === viewerRole;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                {/* Sender name */}
                <span className="text-[11px] text-muted-foreground mb-0.5 px-1">
                  {isMine ? "我" : msg.senderName}
                  <span className="ml-1 text-[10px] opacity-60">
                    ({msg.sender === "buyer" ? "采购商" : "供应商"})
                  </span>
                </span>
                {/* Message bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-brand-600 text-white rounded-br-md"
                      : "bg-white text-foreground border rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                {/* Timestamp */}
                <span className="text-[10px] text-muted-foreground mt-0.5 px-1 flex items-center gap-1">
                  {formatTime(msg.createdAt)}
                  {isMine && msg.read && (
                    <CheckCircle2 className="h-2.5 w-2.5 text-brand-400" />
                  )}
                  {isMine && msg.read && <span className="opacity-60">已读</span>}
                </span>
              </div>
            </div>
          );
        })}

        {/* Pending status hint */}
        {inquiry.status === "pending" && !isClosed && (
          <div className="text-center py-2">
            <span className="text-xs text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
              等待供应商回复...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {isClosed ? (
        <div className="p-4 border-t bg-muted/30 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          询盘已关闭，无法继续发送消息
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          className="p-3 border-t bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 px-3.5 py-2 border border-input rounded-full text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-brand-600 hover:bg-brand-700 shrink-0"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
