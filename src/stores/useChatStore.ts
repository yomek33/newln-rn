import { create } from "zustand";
import { immer } from "zustand/middleware/immer";



import { Chat, type ChatList, type Message } from "../hooks/chat";
import { wsWithToken } from "../hooks/fetch";
import { useMaterialStore } from "./materialStore";


interface ChatState {
  chatList: Record<string, ChatList>;
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
    chatList: {},
    wsConnections: {},
    connectChatWS: async (materialULID) => {
      try {
        // ✅ `materialULID` から `ChatList` を取得
        const material = useMaterialStore.getState().materials[materialULID];

        if (!material?.ChatList) {
          console.warn(
            `⚠️ No ChatList found for materialULID: ${materialULID}`,
          );
          return;
        }

        const chatList = material.ChatList;
        if (!chatList.Chats.length) {
          console.warn(`⚠️ No Chats found in ChatList ID ${chatList.ID}`);
          return;
        }

        // ✅ `ChatList` 内の最初の `ChatID` を取得
        const chatID = chatList.Chats[0].ID;
        console.log(`📡 Connecting WebSocket for chatID: ${chatID}`);

        // ✅ WebSocket に接続
        const ws: WebSocket = await wsWithToken(
          `ws://localhost:8080/api/chats/${chatID}/ws`,
          {
            onMessage: (data: ChatMessage) => {
              console.log("🆕 WebSocket received ChatList data:", data);
              if (data?.ChatID && data?.Message) {
                useChatStore
                  .getState()
                  .addMessage(materialULID, data.ChatID, data.Message);
              }
            },
            onError: (error) => {
              console.error("❌ WebSocket error:", error);
            },
            onClose: () => {
              console.warn(
                `⚠️ WebSocket closed for materialULID: ${materialULID}`,
              );
            },
          },
        );

        // ✅ Zustand の `wsConnections` に保存
        set((state) => {
          state.wsConnections[materialULID] = ws;
        });

        console.log(
          "✅ Chat WebSocket connected for materialULID:",
          materialULID,
        );
      } catch (error) {
        console.error("❌ Failed to connect WebSocket for ChatList:", error);
      }
    },

    // ✅ WebSocket を切断
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
        if (!state.chatList[ulid]) return;

        const chatIndex = state.chatList[ulid].Chats.findIndex(
          (chat) => chat.ID === chatID,
        );

        if (chatIndex !== -1) {
          state.chatList[ulid].Chats[chatIndex].Messages =
            state.chatList[ulid].Chats[chatIndex].Messages || [];
          state.chatList[ulid].Chats[chatIndex].Messages.push(newMessage);
        }
      });
    },

    // ✅ WebSocket で受信した ChatList を Zustand に保存
    setChatList: (ulid, newChatList) => {
      set((state) => {
        state.chatList[ulid] = { ...newChatList };
      });
      console.log("🆕 Zustand chatList updated:", newChatList);
    },
  })),
);