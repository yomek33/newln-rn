import React, { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H1, Spinner, YStack } from "tamagui";

import { useMaterialStore } from "../../../../../stores/materialStore";

const MaterialDetail = () => {
  const { ulid } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material = ulid && !Array.isArray(ulid) ? materials[ulid] : null;
  console.log(material);
  return (
    <ScrollView>
      <YStack padding="$4">
        <H1>{material?.Title ?? "No Title"}</H1>
        <Text>{material?.Content ?? "No content available"}</Text>
      </YStack>
    </ScrollView>
  );
};

export default MaterialDetail;
