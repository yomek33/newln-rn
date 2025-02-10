export interface Chat {
  ID: number;
  Detail: string;
  ChatListID: number;
  Messages: Message[] | null;
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
export interface ChatList {
  ID: number;
  Title: string;
  Chats: Chat[];
}
