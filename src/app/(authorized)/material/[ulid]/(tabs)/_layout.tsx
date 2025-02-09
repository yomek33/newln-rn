import { Tabs, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function MaterialTabsLayout() {
  const { ulid } = useLocalSearchParams();
  if (!ulid) {
    console.error("ulid is undefined in MaterialTabsLayout");
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Material",
          sceneStyle: {
            backgroundColor: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="article" size={size} color={color} />
          ),
          headerShown: false,
        }}
        initialParams={{ ulid }}
      />
      <Tabs.Screen
        name="wordsList"
        options={{
          title: "Words",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list" size={size} color={color} />
          ),
          sceneStyle: {
            backgroundColor: "white",
          },
          headerShown: false,
        }}
        initialParams={{ ulid }}
      />
      <Tabs.Screen
        name="phrasesList"
        options={{
          title: "Phrases",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="format-quote" size={size} color={color} />
          ),
          sceneStyle: {
            backgroundColor: "white",
          },
          headerShown: false,
        }}
        initialParams={{ ulid }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat" size={size} color={color} />
          ),
          sceneStyle: {
            backgroundColor: "white",
          },
          headerShown: false,
        }}
        initialParams={{ ulid }}
      />
    </Tabs>
  );
}
