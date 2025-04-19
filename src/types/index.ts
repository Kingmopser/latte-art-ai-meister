
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface LatteSubmission {
  id: string;
  userId: string;
  imageUrl: string;
  patternType: LattePattern;
  score: number;
  feedback: string;
  createdAt: Date;
}

export enum LattePattern {
  HEART = "Heart",
  ROSETTA = "Rosetta",
  TULIP = "Tulip",
  SWAN = "Swan",
  UNKNOWN = "Unknown"
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  submissionId?: string;
  timestamp: Date;
}
