import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, H6, Paragraph, Spacer, XStack } from "tamagui";

import { type Word } from "../hooks/phares_api";

interface WordCardProps {
  word: Word | undefined;
}

const WordCard = ({ word }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{word.Text}</Text>
      <Text style={styles.meaning}>{word.Meaning}</Text>
      <Text style={styles.jpMeaning}>{word.JPMeaning}</Text>
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
    marginBottom: 4,
  },
  meaning: {
    fontSize: 16,
    color: "#333",
  },
  jpMeaning: {
    fontSize: 16,
    color: "#666",
  },
});

export default WordCard;