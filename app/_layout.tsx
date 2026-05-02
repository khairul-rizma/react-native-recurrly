import { Stack, router, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SubscriptionsProvider } from "@/context/SubscriptionsContext";
import { useEffect } from "react";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    // Check if the user is currently in the (auth) group
    const inAuthGroup = segments[0] === "(auth)" || segments[0] === "onboarding";

    if (!isAuthenticated && !inAuthGroup) {
      // If not logged in and not in auth screens, redirect to onboarding
      router.replace("/onboarding");
    } else if (isAuthenticated && inAuthGroup) {
      // If logged in and trying to access auth screens, redirect to home
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
  );
}

export default function RootLayout() {
  return (
      <AuthProvider>
        <SubscriptionsProvider>
          <RootLayoutNav />
        </SubscriptionsProvider>
      </AuthProvider>
  );
}