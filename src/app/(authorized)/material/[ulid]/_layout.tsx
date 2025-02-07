import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";



import { useMaterialStore } from "../../../../stores/materialStore";


export default function MaterialLayout() {
  const { ulid } = useLocalSearchParams();
  const { materials, fetchMaterial } = useMaterialStore();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterial = async () => {
      if (ulid && typeof ulid === "string") {
        setLoading(true);
        try {
          await fetchMaterial(ulid); // 毎回最新データを取得
        } catch (error) {
          console.error("Failed to load material:", error);
        }
        setLoading(false);
      }
    };

    loadMaterial().catch((error) => {
      console.error("Failed to load material:", error);
    });
  }, [ulid]); // ulidが変わるたびにfetchMaterialを実行

  useEffect(() => {
    if (ulid && typeof ulid === "string" && materials[ulid]) {
      const material = materials[ulid];
      navigation.setOptions({
        title: material.Title || "Material",
        contentStyle: { backgroundColor: "#FFFFFF" },
      });
    }
  }, [ulid, materials, navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "#FFFFFF" },
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