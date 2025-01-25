import { fetchWithToken } from "./fetch";

export interface Phrase {
  id: number;
  materialID: number;
  text: string;
  importance: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string | null;
  deletedAt?: string | null;
}

export interface Word {
  id: number;
  materialID: number;
  text: string;
  importance: "low" | "medium" | "high";
  level: "beginner" | "intermediate" | "advanced";
  createdAt: string;
  updatedAt: string | null;
  deletedAt?: string | null;
}

export interface Chat {
  id: number;
  detail: string;
  materialID: number;
  userID: string;
  pendingMessage: number;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Message {
  id: number;
  chatID: number;
  content: string;
  userID: string;
  senderType: "user" | "system";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
