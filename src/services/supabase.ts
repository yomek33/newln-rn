import { AppState } from "react-native";

import "react-native-url-polyfill/auto";

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// AppStateでフォアグラウンド・バックグラウンド状態を監視し、トークンの自動リフレッシュを制御
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh().catch((error) => {
      console.error("Failed to start auto-refresh:", error);
    });
  } else {
    supabase.auth.stopAutoRefresh().catch((error) => {
      console.error("Failed to stop auto-refresh:", error);
    });
  }
});

// SecureStoreにトークンを保存
const saveToken = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log("Token saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// SecureStoreからトークンを取得
export const getToken = async (key: string) => {
  try {
    const token = await SecureStore.getItemAsync(key);
    if (token) {
      console.log("Token retrieved successfully");
      return token;
    } else {
      console.log("No token found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// SecureStoreからトークンを削除
const deleteToken = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log("Token deleted successfully");
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};

// Emailでサインインし、トークンを保存
export async function signInWithEmail(email: string, password: string) {
  const { data: session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // トークンをSecureStoreに保存
  if (session?.session?.access_token) {
    await saveToken("accessToken", session.session.access_token);
  }
}

// Emailでサインアップ
export async function signUpWithEmail(email: string, password: string) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // セッションが生成された場合はトークンを保存
  if (session?.access_token) {
    await saveToken("accessToken", session.access_token);
  }

  return session;
}

// トークンリフレッシュの実装
export const refreshToken = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error("Token refresh error:", error);
    throw error;
  }

  if (data.session?.access_token) {
    await saveToken("accessToken", data.session.access_token);
    console.log("Token refreshed successfully");
  }
};
