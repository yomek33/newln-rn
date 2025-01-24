import React from "react";
import { Redirect } from "expo-router";

import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; //TODO: ローディング状態を示すUIを追加しても良い
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return children;
}
