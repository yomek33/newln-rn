import React from "react";
import { Card, H6, Paragraph, Spacer, XStack, YStack } from "tamagui";

import { type Phrase } from "../hooks/phares_api";

interface PhraseCardProps {
  phrase: Phrase | undefined;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
  if (!phrase) {
    return null;
  }

  return (
    <Card elevate size="$4" bordered>
      <Card.Header padded>
        <XStack space="$2" alignItems="center">
          <H6>{phrase.Text}</H6>
          <Spacer />
        </XStack>
        <YStack space="$2">
          <Paragraph>Meaning: {phrase.Meaning}</Paragraph>
          <Paragraph>JP Meaning: {phrase.JPMeaning}</Paragraph>
          <Paragraph>Example: {phrase.Example}</Paragraph>
        </YStack>
        <Spacer />
      </Card.Header>
    </Card>
  );
};

export default PhraseCard;
