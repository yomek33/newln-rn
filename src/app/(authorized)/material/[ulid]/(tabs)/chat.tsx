import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H3, YStack } from "tamagui";

import { fetchWithToken } from "../../../../../hooks/fetch";
import { useMaterialStore } from "../../../../../stores/materialStore";
import { useChatStore } from "../../../../../stores/useChatStore";

interface Message {
  ID: number;
  Content: string;
  ChatID: number;
  SenderType: string;
}
const ChatScreen = () => {
  const { ulid: materialULID } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material =
    materialULID && !Array.isArray(materialULID)
      ? materials[materialULID]
      : null;
  const { chatList, connectChatWS, disconnectChatWS } = useChatStore();

  console.log(JSON.stringify(material, null, 2));
  console.log(JSON.stringify(chatList, null, 2));
  const chatData =
    typeof materialULID === "string"
      ? chatList[materialULID]?.Chats?.[0]
      : undefined;

  const [inputText, setInputText] = useState("");
  const chatID = chatData?.ID;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  console.log("ChatID:", chatID);
  async function sendMessage() {
    if (!inputText) return;
    setLoading(true); // ローディング開始

    try {
      const { data, status } = await fetchWithToken<{ history: Message[] }>(
        `http://localhost:8080/api/chat/${chatID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatID?.toString(),
            message: inputText,
          }),
          requireToken: true, // トークンが必要な場合
        },
      );

      if (!status) {
        console.error("Failed to send message");
        return;
      }
      setMessages(data.history); // 最新のメッセージ履歴をセット
      setInputText(""); // 入力欄をクリア
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // ローディング終了
    }
  }
  return (
    <YStack padding="$4" flex={1}>
      <H3>Chat</H3>

      {/* メッセージ一覧 */}
      <FlatList
        data={chatData?.Messages || []}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.SenderType === "user"
                ? styles.userMessage
                : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.Content}</Text>
          </View>
        )}
      />

      {/* メッセージ入力フォーム */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="メッセージを入力..."
        />
        <Button
          title={loading ? "送信中..." : "送信"}
          onPress={sendMessage}
          disabled={loading}
        />
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
