import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { type Material } from "../hooks/material_api";

interface MaterialPreviewCardProps {
  material: Material;
}
const MaterialPreviewCard: React.FC<MaterialPreviewCardProps> = ({
  material,
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push(`/(authorized)/material/${material.LocalULID}`)
      }
    >
      <Text style={styles.title}>{material.Title}</Text>
      <Text style={styles.content}>
        {material.Content ?? "No content available"}
      </Text>
      <Text style={styles.status}>Status: {material.Status}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
    alignSelf: "stretch",
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

export default MaterialPreviewCard;
