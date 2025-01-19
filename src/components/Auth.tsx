import React from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { supabase } from "../services/supabase";

const Auth: React.FC = () => {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: "YOUR CLIENT ID FROM GOOGLE CONSOLE",
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const SignInSuccessResponse = await GoogleSignin.signIn();
          const userInfo = SignInSuccessResponse.data;
          if (userInfo?.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.idToken,
            });
            console.log(error, data);
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error) {
          const typedError = error as { code?: string };
          if (typedError.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (typedError.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (
            typedError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
          ) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
};

Auth.displayName = "Auth";

export default Auth;
