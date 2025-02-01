import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { H1, Spinner, YStack } from "tamagui";

import { getMaterialById, type Material } from "../../../../hooks/material_api";

const MaterialDetail = () => {
  const { ulid } = useLocalSearchParams();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!ulid || Array.isArray(ulid)) {
        setError("Invalid ULID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getMaterialById(ulid);
        if (response.status === 200) {
          setMaterial(response.data);
          console.log(JSON.stringify(response.data, null, 2));
        } else {
          setError("Failed to fetch material details.");
        }
      } catch (err) {
        setError("Error fetching material.");
      } finally {
        setLoading(false);
      }
    };

    void fetchMaterial();
  }, [ulid]);

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView>
      <YStack padding="$4">
        <H1>{material?.Title}</H1>
        <Text>{material?.Content ?? "No content available"}</Text>
      </YStack>
    </ScrollView>
  );
};

export default MaterialDetail;
