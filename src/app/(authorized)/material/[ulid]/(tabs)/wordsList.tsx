import React from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H6, YStack } from "tamagui";



import WordCard from "../../../../../components/WordCard";
import { type Word } from "../../../../../hooks/phares_api";
import { useMaterialStore } from "../../../../../stores/materialStore";



const WordsList = () => {
  const { ulid } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material = ulid && !Array.isArray(ulid) ? materials[ulid] : null;
  const WordLists = material?.WordLists ?? [];
  console.log("Material Keys:", Object.keys(material ?? {}));
  console.log("WordLists:", JSON.stringify(WordLists, null, 2));
  console.log("Is Array?", Array.isArray(WordLists));
  console.log("WordLists Length:", WordLists?.length);
  const wordData: Word = {
    ID: 14,
    WordListID: 9,
    Text: "word1",
    Importance: "high",
    Level: "beginner",
    Meaning: "意味1",
    CreatedAt: "2025-02-01T09:38:13.481387Z",
    UpdatedAt: "2025-02-01T09:38:13.481387Z",
    DeletedAt: null,
  };
  return (
    <ScrollView>
      <YStack padding="$4">
        <H6 fontWeight="bold" paddingBottom="$4">
          <Text> Word List</Text>
        </H6>
        <WordCard word={wordData} />
        {WordLists.length > 0 ? (
          WordLists.map((wordList) => (
            <YStack key={wordList.ID} paddingVertical="$2">
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {wordList.Title}
              </Text>
              {Array.isArray(wordList.Words) && wordList.Words.length > 0 ? (
                wordList.Words.map((word) => (
                  <Text key={word.ID} style={{ fontSize: 16 }}>
                    {word.Text} ({word.Level}, {word.Importance})
                  </Text>
                ))
              ) : (
                <Text>単語がありません</Text>
              )}
            </YStack>
          ))
        ) : (
          <Text>単語リストがありません</Text>
        )}
      </YStack>
    </ScrollView>
  );
};

export default WordsList;