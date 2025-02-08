import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H6, Spacer, YStack } from "tamagui";

import PhraseCard from "../../../../../components/PhraseCard";
import { useMaterialStore } from "../../../../../stores/materialStore";

const PhraseList = () => {
  const { ulid } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material = ulid && typeof ulid === "string" ? materials[ulid] : null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      material?.PhraseLists &&
      material.PhraseLists.length > 0 &&
      material.PhraseLists[0].Phrases.length > 0
    ) {
      setLoading(false);
    }
  }, [material?.HasPendingPhraseList, material?.PhraseLists]);

  const phraseLists = material?.PhraseLists ?? [];

  console.log("PhraseLists:", JSON.stringify(phraseLists, null, 2));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

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
