import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";

import MaterialPreviewCard from "../../../components/MaterialPreviewCard";
import { type Material } from "../../../hooks/material_api";
import { useMaterialStore } from "../../../stores/materialListStore";

export default function Home() {
  const { materials, fetchMaterials } = useMaterialStore(
    useShallow((state) => ({
      materials: state.materials as Material[] | null,
      fetchMaterials: state.fetchMaterials,
    })),
  );

  const router = useRouter();

  useEffect(() => {
    void fetchMaterials();
  }, []);

  if (!materials) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sortedMaterials = [...materials].sort(
    (a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime(),
  );

  return (
    <View style={styles.container}>
      {sortedMaterials.length > 0 ? (
        <FlatList
          data={sortedMaterials}
          keyExtractor={(item) => item.ULID}
          renderItem={({ item }) => <MaterialPreviewCard material={item} />}
        />
      ) : (
        <Text>No materials found.</Text>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          router.push("/newPost");
        }}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
    width: "100%",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
