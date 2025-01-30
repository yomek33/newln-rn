import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getMaterialById, type Material } from "../../../hooks/material_api";

const MaterialDetail = () => {
  const { ulid } = useLocalSearchParams();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!ulid || Array.isArray(ulid)) {
        setError("Invalid ULID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getMaterialById(ulid);
        if (response.status === 200) {
          setMaterial(response.data);
        } else {
          setError("Failed to fetch material details.");
        }
      } catch (err) {
        setError("Error fetching material.");
      } finally {
        setLoading(false);
      }
    };

    void fetchMaterial();
  }, [ulid]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!material) {
    return (
      <View style={styles.container}>
        <Text>No material found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{material.Title}</Text>
      <Text style={styles.content}>
        {material.Content ?? "No content available"}
      </Text>
      <Text style={styles.status}>Status: {material.Status}</Text>
      <Text style={styles.date}>
        Created At: {new Date(material.CreatedAt).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: "#888",
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});

export default MaterialDetail;
