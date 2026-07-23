import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAllUsers } from '@/src/hooks/useUsers'
import { useAuth } from '@/src/context/AuthContext'
import { useConnect } from '@/src/hooks/useConnections'
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary'
import { Feather, MaterialIcons } from '@expo/vector-icons'

const Search = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { data: allUsers, isLoading } = useAllUsers();
  const connectMutation = useConnect();

  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return allUsers.filter((u: any) =>
      u.name.toLowerCase().includes(lowerQuery) ||
      u.occupation.toLowerCase().includes(lowerQuery)
    );
  }, [allUsers, query]);

  const handleConnect = (userId: string) => {
    connectMutation.mutate(userId);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isConnected = user?.connections?.includes(item._id);

    return (
      <View className="flex-row items-center py-4 px-5 border-b border-gray-100 bg-[#F8F9FA]">
        <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: 'white', marginRight: 16, alignItems: 'center', justifyContent: 'center' }}>
          {item.profileImage && typeof item.profileImage === 'string' && !item.profileImage.includes('placeholder.com') ? (
            <Image
              source={{ uri: getOptimizedCloudinaryUrl(item.profileImage, { width: 80 }) }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
              contentFit="cover"
            />
          ) : (
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="user" size={20} color="#9CA3AF" />
            </View>
          )}
        </View>

        <View className="flex-1 mr-3">
          <Text className="text-[15px] font-bold text-gray-900 mb-0.5">{item.name}</Text>
          <Text className="text-[13px] text-gray-500 mb-1">{item.occupation}</Text>
          <View className="flex-row items-center">
            <Feather name="map-pin" size={12} color="#7F7F80" style={{ marginRight: 4 }} />
            <Text className="text-[12px] text-gray-500">Chennai, Tamil Nadu</Text>
          </View>
        </View>

        {isConnected ? (
          <TouchableOpacity
            onPress={() => router.push(`/chat/${item._id}` as any)}
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white "
          >
            <Feather name="send" size={18} color="#7F7F80" />
          </TouchableOpacity>
        ) : item.connectionRequests?.includes(user?._id) ? (
          <TouchableOpacity
            onPress={() => handleConnect(item._id)}
            disabled={connectMutation.isPending && connectMutation.variables === item._id}
            className="w-12 h-12 rounded-full border border-gray-200 items-center justify-center bg-gray-100"
          >
            {connectMutation.isPending && connectMutation.variables === item._id ? (
              <ActivityIndicator size="small" color="#7F7F80" />
            ) : (
              <Feather name="clock" size={18} color="#7F7F80" />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleConnect(item._id)}
            disabled={connectMutation.isPending && connectMutation.variables === item._id}
            className="w-12 h-12 rounded-full border border-gray-200 items-center justify-center bg-white "
          >
            {connectMutation.isPending && connectMutation.variables === item._id ? (
              <ActivityIndicator size="small" color="#7F7F80" />
            ) : (
              <Feather name="user-plus" size={18} color="#7F7F80" />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mr-3 rounded-full bg-[#F0F0E8]"
        >
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#7F7F80" />
        </TouchableOpacity>

        <View className="flex-1 bg-[#F0F0E8] rounded-xl px-4 py-3 flex-row items-center">
          <Feather name="search" size={16} color="#7F7F80" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search profiles..."
            value={query}
            onChangeText={setQuery}
            className="flex-1 text-[15px] text-gray-900 m-0 p-0"
            placeholderTextColor="#7F7F80"
            autoFocus
          />
        </View>
      </View>

      <View className="px-5 py-3">
        <Text className="text-[13px] text-gray-500">
          {query.trim().length > 0 ? `${filteredUsers.length} profile matches` : 'Start typing to search...'}
        </Text>
      </View>


      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#02B6B6" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            query.trim().length > 0 ? (
              <View className="flex-1 justify-center items-center mt-20">
                <Text className="text-[15px] text-gray-500">No users found for "{query}"</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  )
}

export default Search
