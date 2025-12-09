import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReportDataProvider } from "@/context/ReportContext";
import { DoctorDataProvider } from "@/context/DoctorContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DoctorDataProvider>
          <ReportDataProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ReportDataProvider>
        </DoctorDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
