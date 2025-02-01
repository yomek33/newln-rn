import React from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H1, YStack } from "tamagui";

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

  return (
    <ScrollView>
      <YStack padding="$4">
        <H1>Words List</H1>
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
