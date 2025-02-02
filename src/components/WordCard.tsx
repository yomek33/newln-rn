import React from "react";
import { Text } from "react-native";
import { Card, H6, Paragraph, Spacer, XStack } from "tamagui";

import { type Word } from "../hooks/phares_api";

interface WordCardProps {
  word: Word | undefined;
}

const WordCard: React.FC<WordCardProps> = ({ word }) => {
  console.log("WordCard:", word);
  if (!word) {
    return null;
  }

  return (
    <Card elevate size="$4" bordered>
      <Card.Header padded>
        <XStack space="$2" alignItems="center">
          <H6>{word.Text}</H6>
          <Paragraph theme="alt2">{word.Level}</Paragraph>
          <Spacer />
        </XStack>
        <Spacer />
        <Paragraph theme="alt2">Now available</Paragraph>
      </Card.Header>
      <Card.Background />
    </Card>
  );
};

export default WordCard;
