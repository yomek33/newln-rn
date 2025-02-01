import { Slot } from "expo-router";
import { TamaguiProvider, Theme, YStack } from "tamagui";

import appConfig from "../../tamagui.config";
import { AuthProvider } from "../contexts/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <TamaguiProvider config={appConfig} defaultTheme="light">
        <YStack f={1} backgroundColor="#FFFFFF">
          <Slot />
        </YStack>
      </TamaguiProvider>
    </AuthProvider>
  );
}
