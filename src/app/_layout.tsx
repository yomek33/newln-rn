import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";

import appConfig from "../../tamagui.config";
import { AuthProvider } from "../contexts/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <TamaguiProvider config={appConfig}>
        <Stack />
      </TamaguiProvider>
    </AuthProvider>
  );
}
