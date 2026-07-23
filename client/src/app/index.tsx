import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { useMe } from "@/src/hooks/useUsers";

export default function Index() {
  const { isAuthenticated, isLoading, logout, setUser } = useAuth();
  
  const { data: userData, error, isLoading: isFetchingMe } = useMe();

  useEffect(() => {
    if (error) {
      logout();
    } else if (userData) {
      setUser(userData);
    }
  }, [userData, error]);

  if (isLoading || (isAuthenticated && isFetchingMe)) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#02B6B6" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
