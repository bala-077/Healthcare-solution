import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDiscoverUsers } from '@/src/hooks/useUsers'
import { useConnect, useConnectionRequests, useAcceptConnection } from '@/src/hooks/useConnections'
import { useAuth } from '@/src/context/AuthContext'
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary'
import DiscoverCard from '@/src/components/DiscoverCard'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const Discover = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, refetch, isRefetching } = useDiscoverUsers();
  const { data: requests, refetch: refetchRequests } = useConnectionRequests();
  const acceptMutation = useAcceptConnection();

  const handleAccept = (userId: string) => {
    acceptMutation.mutate(userId);
  };

  const renderHeader = () => (
    <View className="px-5 mb-4 mt-2">
      {requests && requests.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-3">Pending Requests ({requests.length})</Text>
          {requests.map((req: any) => (
            <View key={req._id} className="bg-white p-3 mb-2 rounded-2xl flex-row items-center shadow-sm border border-black/5">
              <Image
                source={{ uri: getOptimizedCloudinaryUrl(req.profileImage, { width: 50 }) || 'https://via.placeholder.com/50' }}
                className="w-12 h-12 rounded-full mr-3"
                contentFit="cover"
              />
              <View className="flex-1 mr-2">
                <Text className="text-[15px] text-gray-900 font-bold" numberOfLines={1}>{req.name}</Text>
                <Text className="text-[12px] text-gray-500" numberOfLines={1}>{req.occupation}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleAccept(req._id)}
                disabled={acceptMutation.isPending}
                className="bg-[#02B6B6] px-4 py-2 rounded-full"
              >
                <Text className="text-[13px] text-white font-bold">Accept</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

    </View>
  );

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: 80 }} className="flex-1 bg-surface-cream">
      {/* Search Header */}
      <View className="px-5 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.push('/search')}
          className="bg-[#F8F9FA] rounded-xl px-4 py-3 flex-row items-center"
        >
          <Feather name="search" size={16} color="#7F7F80" style={{ marginRight: 8 }} />
          <Text className="text-[15px] text-gray-500 flex-1">
            Search profiles, organizations...
          </Text>
        </TouchableOpacity>
        <Text className="text-[14px] text-gray-500 mt-5">People you may know</Text>
      </View>

      {isLoading && !isRefetching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#02B6B6" />
        </View>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <DiscoverCard item={item} />}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
                refetchRequests();
              }}
              tintColor="#02B6B6"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-[15px] text-gray-500">No users found.</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

export default Discover
