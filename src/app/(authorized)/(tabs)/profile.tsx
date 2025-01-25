import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "tamagui";



import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../services/supabase";


export default function Profile() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.dismissTo("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user?.email}</Text>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});