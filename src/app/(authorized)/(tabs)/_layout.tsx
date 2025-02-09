import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";





export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
            sceneStyle: {
              backgroundColor: "#ffffff",
            },
            // headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            sceneStyle: {
              backgroundColor: "#f1f0ee",
            },
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}