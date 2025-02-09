import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";



import { createMaterial } from "../../hooks/material_api";
import { useMaterialStore } from "../../stores/materialListStore";


export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const addMaterial = useMaterialStore((state) => state.addMaterial);

  const handleSubmit = async () => {
    const material = {
      Title: title,
      Content: content,
    };
    console.log("Creating new material:", material);

    try {
      const response = await createMaterial(material);
      if (response.status === 201) {
        console.log("New material created:", response.data);
        const newMaterial = {
          ULID: response.data.ULID,
          Title: response.data.Title,
          Content: response.data.Content,
          Status: response.data.Status,
          CreatedAt: response.data.CreatedAt,
          WordsCount: null,
          PhrasesCount: null,
        };
        console.log("Adding new material to store:", newMaterial);
        addMaterial(newMaterial);
        router.dismissTo(`/(authorized)/material/${newMaterial.ULID}`);
      } else {
        console.error("Failed to create new material:", response);
      }
    } catch (error) {
      console.error("Failed to create new material:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});