import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H6, YStack } from "tamagui";

import WordCard from "../../../../../components/WordCard";
import { type Word } from "../../../../../hooks/phares_api";
import { useMaterialStore } from "../../../../../stores/materialStore";

const WordsList = () => {
  const { ulid } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material = ulid && !Array.isArray(ulid) ? materials[ulid] : null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(
      "🧐 Current WordLists in state:",
      JSON.stringify(material?.WordLists, null, 2),
    );

    if (
      material?.WordLists &&
      material.WordLists.length > 0 &&
      material.WordLists.some((list) => list.Words.length > 0)
    ) {
      setLoading(false);
    }
  }, [material?.HasPendingWordList, material?.WordLists]);

  const WordLists = material?.WordLists ?? [];

  console.log("WordLists:", JSON.stringify(WordLists, null, 2));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
