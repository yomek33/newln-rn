import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "tamagui";

import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen!</Text>
      {user ? (
        <>
          <Text>User ID: {user.id}</Text>
          <Button onPress={() => router.push("/profile")}>Go to Profile</Button>
        </>
      ) : (
        <Button onPress={() => router.push("/login")}>Go to Login</Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
