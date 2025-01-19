import React, { useEffect, useState, type FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { registerRootComponent } from "expo";
import { type Session } from "@supabase/supabase-js";
import { Button, TamaguiProvider } from "tamagui";

import appConfig from "../../tamagui.config";
import Auth from "../components/Auth";
import { supabase } from "../services/supabase";

const App: FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => {
        console.error("Error getting session:", error);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <TamaguiProvider config={appConfig}>
      {/* <View style={styles.container}>
        <Auth />
        {session?.user && <Text>{session.user.id}</Text>}
      </View> */}
      <View style={styles.container}>
        <Button theme="blue">Hello world</Button>
        <Auth />
        {session?.user && <Text>{session.user.id}</Text>}
      </View>
    </TamaguiProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
registerRootComponent(App);
