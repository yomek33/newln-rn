import React from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H6, Spacer, YStack } from "tamagui";

import PhraseCard from "../../../../../components/PhraseCard";
import { useMaterialStore } from "../../../../../stores/materialStore";


const PhraseList = () => {
  const { ulid } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material = ulid && !Array.isArray(ulid) ? materials[ulid] : null;
  const phraseLists = material?.PhraseLists ?? [];
  console.log("PhraseLists:", JSON.stringify(phraseLists, null, 2));

  return (
    <ScrollView>
      <YStack padding="$4">
        <H6 fontWeight="bold" paddingBottom="$4">
          <Text>Phrase List</Text>
        </H6>
        {phraseLists.length > 0 ? (
          phraseLists[0].Phrases &&
          Array.isArray(phraseLists[0].Phrases) &&
          phraseLists[0].Phrases.length > 0 ? (
            phraseLists[0].Phrases.map((phrase) => {
              if (phrase && typeof phrase === "object" && "ID" in phrase) {
                return (
                  <React.Fragment key={String(phrase.ID)}>
                    <PhraseCard phrase={phrase} />
                    <Spacer />
                  </React.Fragment>
                );
              }
              return null;
            })
          ) : (
            <Text>フレーズがありません</Text>
          )
        ) : (
          <Text>フレーズリストがありません</Text>
        )}
      </YStack>
      <Spacer />
    </ScrollView>
  );
};
export default PhraseList;