export interface Phrase {
  ID: number;
  Text: string;
  Importance: "low" | "medium" | "high";
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt?: string | null;
  Meaning: string;
  JPMeaning: string;
  Example: string;
  Difficulty: "easy" | "intermediate" | "advance";
}

export interface Word {
  ID: number;
  WordListID: number;
  Text: string;
  Importance: "low" | "medium" | "high";
  Level: "beginner" | "intermediate" | "advanced";
  Meaning: string;
  JPMeaning: string;
  Class?: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt?: string | null;
}

export interface Chat {
  ID: number;
  Detail: string;
  UserID: string;
  PendingMessage: number;
  Messages: Message[];
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
}

export interface Message {
  ID: number;
  ChatID: number;
  Content: string;
  UserID: string;
  SenderType: "user" | "system";
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
}
