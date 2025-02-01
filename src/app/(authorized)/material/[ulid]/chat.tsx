import React from "react";
import { ScrollView, Text } from "react-native";
import { H1, YStack } from "tamagui";

const ChatScreen = () => {
  return (
    <ScrollView>
      <YStack padding="$4">
        <H1>Chat</H1>
        <Text>ここにチャットを表示</Text>
      </YStack>
    </ScrollView>
  );
};

export default ChatScreen;
