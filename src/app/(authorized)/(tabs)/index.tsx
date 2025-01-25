import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getMaterials, type Material } from "../../../hooks/material_api";

export default function Tab() {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        console.log("Fetching materials...");
        const data = await getMaterials();
        console.log("Fetched materials:", data);
        setMaterials(data);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };
    void fetchMaterials();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No materials found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={materials}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.Title}</Text>
            <Text style={styles.content}>
              {item.Content ?? "No content available"}
            </Text>
            <Text style={styles.status}>Status: {item.Status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    marginVertical: 5,
  },
  status: {
    fontSize: 14,
    color: "#888",
  },
});
