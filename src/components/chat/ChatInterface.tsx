
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useSubmissions } from "@/contexts/SubmissionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import ChatMessage from "./ChatMessage";

const ChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const { currentSubmission } = useSubmissions();
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue, currentSubmission || undefined);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-[75vh] border rounded-lg overflow-hidden bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">
          Latte Art Assistant
          {currentSubmission && (
            <span className="ml-2 text-sm text-muted-foreground">
              - Analyzing {currentSubmission.patternType} pattern
            </span>
          )}
        </h2>
      </div>
      
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 p-4"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask about your latte art..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
