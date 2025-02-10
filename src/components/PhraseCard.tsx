import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, H6, Paragraph, Spacer, XStack, YStack } from "tamagui";

import { type Phrase } from "../hooks/phares_api";

interface PhraseCardProps {
  phrase: Phrase | undefined;
}

const PhraseCard = ({ phrase }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{phrase.Text}</Text>
      <Text style={styles.meaning}>意味: {phrase.Meaning}</Text>
      <Text style={styles.jpMeaning}>和訳: {phrase.JPMeaning}</Text>
      <Text style={styles.example}>例文: {phrase.Example}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  meaning: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  jpMeaning: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  example: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
});

export default PhraseCard;