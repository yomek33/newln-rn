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

interface Message {
  ID: number;
  Content: string;
  ChatID: number;
  SenderType: string;
}
const ChatScreen = () => {
  const { ulid: materialULID } = useLocalSearchParams();

  // デモ用ダミーデータ
  const dummyMessages: Message[] = [
    {
      ID: 1,
      Content: "Tell me what you learned from the article!",
      ChatID: 1,
      SenderType: "bot",
    },
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 初回レンダリング時にダミーデータをセット
    setMessages(dummyMessages);
  }, []);

  async function sendMessage() {
    if (!inputText) return;
    setLoading(true);

    try {
      // ダミーデータとして新しいメッセージを追加
      const newMessage: Message = {
        ID: messages.length + 1,
        Content: inputText,
        ChatID: 1,
        SenderType: "user",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 簡単なレスポンスを追加
      setTimeout(() => {
        const botResponse: Message = {
          ID: messages.length + 2,
          Content: "Interesting! Can you tell me more?",
          ChatID: 1,
          SenderType: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        setLoading(false);
      }, 1000);

      setInputText(""); // 入力欄をクリア
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <YStack padding="$4" flex={1}>
      {/* メッセージ一覧 */}
      <FlatList
        data={messages}
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
    backgroundColor: "green",
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
