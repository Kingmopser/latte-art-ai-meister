import React, { createContext, useContext, useState, useEffect } from "react";
import { ChatMessage, LatteSubmission } from "@/types";
import { useAuth } from "./AuthContext";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, submission?: LatteSubmission) => Promise<void>;
  isLoading: boolean;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// AI responses for different score ranges
const getAIResponse = (submission?: LatteSubmission): string => {
  if (!submission) {
    return "Hello! Upload a latte art image, and I can provide specific feedback to help you improve.";
  }

  const { score, patternType, feedback } = submission;
  
  if (score >= 90) {
    return `Excellent ${patternType} pattern! ${feedback} Your technique is at a professional level. The symmetry and definition are outstanding. Score: ${score}/100`;
  } else if (score >= 80) {
    return `Very good ${patternType}! ${feedback} You're showing strong skills. With a bit more practice on the fine details, you could reach professional quality. Score: ${score}/100`;
  } else if (score >= 70) {
    return `Good attempt at a ${patternType}. ${feedback} Your basic technique is solid, but there's room for improvement in symmetry and definition. Score: ${score}/100`;
  } else {
    return `I see you're working on a ${patternType} pattern. ${feedback} Focus on milk texture and pouring speed to achieve better definition. Score: ${score}/100`;
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load chat history from localStorage
      const savedMessages = localStorage.getItem(`latteChat-${user.id}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initialize with welcome message
        const initialMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "Welcome to Latte Art Meister! Upload your latte art, and I'll analyze it for you.",
          timestamp: new Date()
        };
        setMessages([initialMessage]);
      }
    } else {
      setMessages([]);
    }
  }, [user]);

  const saveMessages = (newMessages: ChatMessage[]) => {
    if (user) {
      localStorage.setItem(`latteChat-${user.id}`, JSON.stringify(newMessages));
    }
  };

  const sendMessage = async (content: string, submission?: LatteSubmission) => {
    if (!user) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      submissionId: submission?.id,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    // Simulate AI thinking
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: getAIResponse(submission),
        submissionId: submission?.id,
        timestamp: new Date()
      };
      
      const newMessages = [...updatedMessages, aiResponse];
      setMessages(newMessages);
      saveMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (!user) return;
    
    // Keep only the welcome message
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: "Welcome to Latte Art Meister! Upload your latte art, and I'll analyze it for you.",
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
    saveMessages([initialMessage]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLoading, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
