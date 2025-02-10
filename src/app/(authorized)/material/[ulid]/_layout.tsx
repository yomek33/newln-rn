/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";

import { type ChatList } from "../../../../hooks/chat";
import { wsWithToken } from "../../../../hooks/fetch";
import { useMaterialStore } from "../../../../stores/materialStore";
import { useChatStore } from "../../../../stores/useChatStore";

export default function MaterialLayout() {
  const { ulid } = useLocalSearchParams();
  const { materials, fetchMaterial, updateMaterialData } = useMaterialStore();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const wsUrl =
    Platform.OS === "android"
      ? `ws://10.0.2.2:8080/api/materials/${String(ulid)}/progress`
      : `ws://localhost:8080/api/materials/${String(ulid)}/progress`;

  // 初回に素材データを読み込み
  useEffect(() => {
    const loadMaterial = async () => {
      if (ulid && typeof ulid === "string") {
        setLoading(true);
        try {
          await fetchMaterial(ulid);

          // ✅ Zustandの `useMaterialStore` から最新の `chatList` を取得
          const material = useMaterialStore.getState().materials[ulid];

          if (material?.ChatList?.Chats?.length) {
            console.log(
              "✅ ChatList is not empty. Inserting into Zustand:",
              material.ChatList,
            );
            useChatStore.getState().setChatList(ulid, material.ChatList);
          } else {
            console.log("⚠️ ChatList is empty, skipping Zustand insertion.");
          }
        } catch (error) {
          console.error("❌ Failed to load material:", error);
        }
        setLoading(false);
      }
    };

    loadMaterial().catch((error) => {
      console.error("Failed to load material:", error);
    });
  }, [ulid]);

  // ナビゲーションのタイトルを素材のタイトルに設定
  useEffect(() => {
    if (ulid && typeof ulid === "string" && materials[ulid]) {
      const material = materials[ulid];
      navigation.setOptions({
        title: material.Title || "Material",
        contentStyle: { backgroundColor: "#FFFFFF" },
      });
    }
  }, [ulid, materials, navigation]);

  // WebSocket 接続：WordLists と PhraseLists の更新を反映
  useEffect(() => {
    if (!ulid || typeof ulid !== "string") return;
    const material = materials[ulid];
    if (
      material?.HasPendingPhraseList === false &&
      material?.HasPendingWordList === false
    ) {
      console.log(
        "✅ No pending phrase or word lists. Skipping WebSocket connection.",
        material?.HasPendingPhraseList,
        material?.HasPendingWordList,
      );
      return;
    }
    let wsInstance: WebSocket;

    const connectWebSocket = async () => {
      try {
        wsInstance = await wsWithToken(wsUrl, {
          onMessage: (data: { event: string; data: any; message: any }) => {
            console.log("📩 WebSocket message received:", data);

            // 現在の state を取得してログ出力
            const currentMaterial = useMaterialStore.getState().materials[ulid];
            console.log("🧐 currentMaterial before update:", currentMaterial);

            if (data.event === "phrases_stored" && data.data) {
              console.log("🔄 Updating PhraseLists with data:", data.data);
              updateMaterialData(ulid, (currentMaterial) => {
                const updatedPhraseLists =
                  currentMaterial.PhraseLists?.map((list) =>
                    list.ID === data.data[0]?.PhraseListID
                      ? { ...list, Phrases: data.data }
                      : list,
                  ) ?? data.data;
                const updatePayload = {
                  PhraseLists: updatedPhraseLists,
                  HasPendingPhraseList: false,
                };
                console.log("💡 Payload for phraseList update:", updatePayload);
                return updatePayload;
              });
            } else if (data.event === "words_stored" && data.data) {
              console.log("🔄 Updating WordLists with data:", data.data);
              updateMaterialData(ulid, (currentMaterial) => {
                const updatedWordLists =
                  currentMaterial.WordLists?.map((list) =>
                    list.ID === data.data[0]?.WordListID
                      ? { ...list, Words: data.data }
                      : list,
                  ) ?? data.data;
                const updatePayload = {
                  WordLists: updatedWordLists,
                  HasPendingWordList: false,
                };
                console.log("💡 Payload for wordList update:", updatePayload);
                return updatePayload;
              });
            } else if (data.event === "chat_list_created") {
              console.log("💬 Chat list created (Raw Data):", data);

              // `Chats` の中身を展開して確認
              if (Array.isArray(data.data.Chats)) {
                console.log("🔍 Chat List Details:");
                data.data.Chats.forEach((chat, index) => {
                  console.log(
                    `📌 Chat #${index + 1}:`,
                    JSON.stringify(chat, null, 2),
                  );
                });
              } else {
                // console.warn(
                //   "⚠️ Chats is not an array or is empty:",
                //   data.data.Chats,
                // );
              }

              const newChatList: ChatList = {
                ID: data.data.ID,
                Title: data.data.Title,
                Chats: Array.isArray(data.data.Chats) ? data.data.Chats : [],
              };

              // ✅ Zustandの `useChatStore` にセット
              try {
                const setChatList = useChatStore.getState().setChatList;
                if (setChatList) {
                  setChatList(ulid, newChatList);
                  //  console.log("✅ Chat list set in Zustand:", newChatList);
                } else {
                  console.error("❌ Zustand's setChatList is undefined!");
                }
              } catch (error) {
                console.error("❌ Error setting chat list in Zustand:", error);
              }
            } else if (data.event === "completed") {
              console.log("💡 Processing complete.");
              wsInstance.close();
            } else if (data.event === "error" && data.message) {
              console.error("Error:", data.message);
            }

            // 更新後の state もログに出してみる（非同期処理のため若干タイミングに注意）
            setTimeout(() => {
              const updatedMaterial =
                useMaterialStore.getState().materials[ulid];
              console.log("🧐 currentMaterial after update:", updatedMaterial);
            }, 100);
          },
        });

        setWs(wsInstance);
      } catch (error) {
        // console.error("Failed to connect WebSocket:", error);
      }
    };

    connectWebSocket().catch((error) => {
      console.error("Failed to connect WebSocket:", error);
    });
    return () => {
      if (wsInstance) {
        //console.log("⚡️ Component unmounted. Closing WebSocket.");
        wsInstance.close();
      }
    };
  }, [ulid, wsUrl]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, backgroundColor: "#f1f0ee" }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "#f1f0ee" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
};
