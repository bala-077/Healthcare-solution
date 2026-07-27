import 'react-native-get-random-values';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/src/context/AuthContext';
import { StatusBar } from "expo-status-bar";
import "../../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
