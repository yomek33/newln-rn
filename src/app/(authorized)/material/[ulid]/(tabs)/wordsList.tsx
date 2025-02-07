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

  console.log("WordLists:", JSON.stringify(WordLists, null, 2));

  return (
    <ScrollView>
      <YStack padding="$4">
        <H6 fontWeight="bold" paddingBottom="$4">
          <Text>Word List</Text>
        </H6>
        {WordLists.length > 0 ? (
          WordLists[0].Words &&
          Array.isArray(WordLists[0].Words) &&
          WordLists[0].Words.length > 0 ? (
            WordLists[0].Words.map((word: Word) => (
              <WordCard key={word.ID} word={word} />
            ))
          ) : (
            <Text>単語がありません</Text>
          )
        ) : (
          <Text>単語リストがありません</Text>
        )}
      </YStack>
    </ScrollView>
  );
};

export default WordsList;