import { Stack } from "expo-router";
import React, { useContext, useEffect } from "react";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import "./global.css";
import { useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReportDataProvider } from "@/context/ReportContext";
import { DoctorDataProvider } from "@/context/DoctorContext";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Data is cached for 10 minutes
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Disable refetch on window focus (React Native doesn't have a "window")
    },
  },
});

function Layout() {
  const { isLoggedIn} = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/home');  // Navigate to the home route when authenticated
    } else {
      router.replace('/auth');  // Navigate to the auth route when not authenticated
    }
  }, [isLoggedIn, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DoctorDataProvider>
          <ReportDataProvider>
            <Layout />
          </ReportDataProvider>
        </DoctorDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
