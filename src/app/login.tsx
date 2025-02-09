import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Auth from "../components/Auth";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Auth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
