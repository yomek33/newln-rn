import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function ProfileScreen() {
  const { user, setUser } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user?.email}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
