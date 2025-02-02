import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";

import { useMaterialStore } from "../../../../stores/materialStore";


export default function MaterialLayout() {
  const { ulid } = useLocalSearchParams();
  const { materials, fetchMaterial } = useMaterialStore();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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

  useEffect(() => {
    if (ulid && !Array.isArray(ulid)) {
      const material = materials[ulid];
      if (material) {
        navigation.setOptions({
          title: material.Title,
          contentStyle: { backgroundColor: "#FFFFFF" },
        });
      }
    }
  }, [navigation, ulid, materials]);

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