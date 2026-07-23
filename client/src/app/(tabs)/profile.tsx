import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'expo-router'

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/sign-in');
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background-light">
      <View className="px-5 py-4 bg-white border-b border-border">
        <Text className="h1-header text-text-primary text-center">Profile</Text>
      </View>

      <View className="items-center px-6 py-10">
        <View className="w-32 h-32 rounded-full bg-surface-cream mb-6 items-center justify-center overflow-hidden border border-border">
          {user?.profileImage && !user.profileImage.includes('placeholder.com') ? (
            <Image 
              source={{ uri: user.profileImage }}
              className="w-full h-full"
            />
          ) : (
            <Feather name="user" size={60} color="#9CA3AF" />
          )}
        </View>
        <Text className="h1-header text-text-primary mb-2">{user?.name || 'User Name'}</Text>
        <Text className="b1-body text-text-secondary mb-1">{user?.occupation || 'Occupation'}</Text>
        <Text className="b2-body text-text-secondary mb-10">{user?.mobileNumber || '+91 0000000000'}</Text>

        <TouchableOpacity 
          className="w-full py-4 rounded-full items-center justify-center bg-surface-cream mb-4 border border-border"
        >
          <Text className="cta-text text-text-primary">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleLogout}
          className="w-full py-4 rounded-full items-center justify-center bg-red-50 border border-red-100"
        >
          <Text className="cta-text text-red-500">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile
