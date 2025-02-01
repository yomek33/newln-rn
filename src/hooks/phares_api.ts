export interface Phrase {
  ID: number;
  MaterialID: number;
  Text: string;
  Importance: "low" | "medium" | "high";
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt?: string | null;
}

export interface Word {
  ID: number;
  MaterialID: number;
  Text: string;
  Importance: "low" | "medium" | "high";
  Level: "beginner" | "intermediate" | "advanced";
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt?: string | null;
}

export interface Chat {
  ID: number;
  Detail: string;
  MaterialID: number;
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
