import React, { useEffect } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { type Message } from "../../../../../hooks/chat";
import { useChatStore } from "../../../../../stores/useChatStore";

interface ChatMessage {
  ChatID: number;
  Message: Message;
}

const ChatScreen = () => {
  const { ulid } = useLocalSearchParams();
  const chatList = useChatStore((state) => {
    if (typeof ulid !== "string") return null;
    return state.chatLists[ulid] || null;
  });
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (!ulid || typeof ulid !== "string") return;

    const chatID = 5;
    const ws = new WebSocket(`ws://localhost:8080/api/chats/${chatID}/ws`);

    ws.onopen = () => {
      console.log("📡 WebSocket connected for ChatList.");
    };

    ws.onmessage = (event) => {
      try {
        const data: ChatMessage = JSON.parse(event.data as string);
        console.log("🆕 WebSocket received new Chat:", data);

        if (data?.ChatID && data?.Message) {
          addMessage(ulid, data.ChatID, data.Message);
        }
      } catch (error) {
        console.error("❌ WebSocket message error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected.");
    };

    return () => {
      ws.close();
    };
  }, [ulid, addMessage]);

  return (
    <View>
      {chatList ? (
        <FlatList
          data={chatList.Chats}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.Detail}</Text>
            </View>
          )}
        />
      ) : (
        <Text>チャットがありません</Text>
      )}
    </View>
  );
};

export default ChatScreen;
