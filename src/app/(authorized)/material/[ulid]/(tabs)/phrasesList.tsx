import React from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H1, YStack } from "tamagui";

import { useMaterialStore } from "../../../../../stores/materialStore";

const PhrasesList = () => {
  const { ulid } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material = ulid && !Array.isArray(ulid) ? materials[ulid] : null;
  const PhraseLists = material?.PhraseLists ?? [];

  console.log("Material Keys:", Object.keys(material ?? {}));
  console.log("PhraseLists:", JSON.stringify(PhraseLists, null, 2));
  console.log("Is Array?", Array.isArray(PhraseLists));
  console.log("PhraseLists Length:", PhraseLists?.length);

  return (
    <ScrollView>
      <YStack padding="$4">
        <H1>Phrases List</H1>
        {PhraseLists.length > 0 ? (
          PhraseLists.map((phraseList) => (
            <YStack key={phraseList.ID} paddingVertical="$2">
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {phraseList.Title}
              </Text>
              {Array.isArray(phraseList.Phrases) &&
              phraseList.Phrases.length > 0 ? (
                phraseList.Phrases.map((phrase) => (
                  <Text key={phrase.ID} style={{ fontSize: 16 }}>
                    {phrase.Text}
                  </Text>
                ))
              ) : (
                <Text>フレーズがありません</Text>
              )}
            </YStack>
          ))
        ) : (
          <Text>フレーズリストがありません</Text>
        )}
      </YStack>
    </ScrollView>
  );
};

export default PhrasesList;
