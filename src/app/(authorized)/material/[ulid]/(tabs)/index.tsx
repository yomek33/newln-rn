import React from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H6, SizableText, YStack } from "tamagui";

import { useMaterialStore } from "../../../../../stores/materialStore";

const MaterialDetail = () => {
  const { ulid } = useLocalSearchParams();
  const { materials } = useMaterialStore();
  const material = ulid && !Array.isArray(ulid) ? materials[ulid] : null;
  console.log(material);
  return (
    <ScrollView>
      <YStack padding="$4">
        <H6 fontWeight="bold" paddingBottom="$4">
          {material?.Title ?? "No Title"}
        </H6>
        <SizableText size="$4">
          {material?.Content ?? "No content available"}
        </SizableText>
      </YStack>
    </ScrollView>
  );
};

export default MaterialDetail;
