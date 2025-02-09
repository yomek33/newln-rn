import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { Chat, type ChatList, type Message } from "../hooks//chat";
import { wsWithToken } from "../hooks/fetch";

interface ChatState {
  chatLists: Record<string, ChatList>;
  wsConnections: Record<string, WebSocket>;
  connectChatWS: (ulid: string) => Promise<void>;
  disconnectChatWS: (ulid: string) => void;
  addMessage: (ulid: string, chatID: number, newMessage: Message) => void;
  setChatList: (ulid: string, newChatList: ChatList) => void;
}

interface ChatMessage {
  ChatID: number;
  Message: Message;
}

export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    chatLists: {},
    wsConnections: {} as Record<string, WebSocket>,

    connectChatWS: async (ulid) => {
      try {
        const ws: WebSocket = await wsWithToken(
          `wss://your-websocket-url/chat/${ulid}`,
          {
            onMessage: (data: ChatMessage) => {
              console.log("🆕 WebSocket received ChatList data:", data);

              if (data?.ChatID && data?.Message) {
                get().addMessage(ulid, data.ChatID, data.Message);
              }
            },
            onError: (error) => {
              console.error("❌ WebSocket error:", error);
            },
            onClose: () => {
              console.warn("⚠️ WebSocket closed for ChatList:", ulid);
            },
          },
        );

        set((state) => {
          state.wsConnections[ulid] = ws;
        });

        console.log("✅ Chat WebSocket connected for:", ulid);
      } catch (error) {
        console.error("❌ Failed to connect WebSocket for ChatList:", error);
      }
    },

    // ✅ WebSocket 切断
    disconnectChatWS: (ulid) => {
      set((state) => {
        if (state.wsConnections[ulid]) {
          state.wsConnections[ulid].close();
          delete state.wsConnections[ulid];
        }
      });

      console.warn("❌ Manually closing WebSocket for:", ulid);
    },

    // ✅ WebSocket で受信したメッセージを追加
    addMessage: (ulid, chatID, newMessage) => {
      set((state) => {
        if (!state.chatLists[ulid]) return;

        const chatIndex = state.chatLists[ulid].Chats.findIndex(
          (chat) => chat.ID === chatID,
        );

        if (chatIndex !== -1) {
          state.chatLists[ulid].Chats[chatIndex].Messages.push(newMessage);
        }
      });
    },

    // ✅ WebSocket で受信した ChatList を適用
    setChatList: (ulid, newChatList) => {
      set((state) => {
        state.chatLists[ulid] = newChatList;
      });
    },
  })),
);
