import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";



import { useAuth } from "../../contexts/AuthContext";


export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}