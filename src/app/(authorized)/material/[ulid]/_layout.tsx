import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { useMaterialStore } from "../../../../stores/materialStore";

export default function MaterialLayout() {
  const { ulid } = useLocalSearchParams();
  const { materials, fetchMaterial } = useMaterialStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterial = async () => {
      if (ulid && !Array.isArray(ulid)) {
        setLoading(true);
        await fetchMaterial(ulid);
        setLoading(false);
      }
    };

    loadMaterial().catch((error) => {
      console.error("Failed to load material:", error);
    });
  }, [ulid]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
