
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage as ChatMessageType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-cream-500")}>
        <AvatarFallback>
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "rounded-lg px-4 py-3 max-w-[80%]",
        isUser 
          ? "bg-primary text-primary-foreground self-end" 
          : "bg-muted self-start"
      )}>
        <div className="space-y-1">
          <div className="text-sm">{message.content}</div>
          <p className="text-xs opacity-50">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
