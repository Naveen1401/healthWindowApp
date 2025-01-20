import { Stack } from "expo-router";
import React, { useContext, useEffect } from "react";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import "./global.css";
import { useRouter } from "expo-router";

function Layout() {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace('/home');  // Navigate to the home route when authenticated
    } else {
      router.replace('/auth');  // Navigate to the auth route when not authenticated
    }
  }, [token, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
