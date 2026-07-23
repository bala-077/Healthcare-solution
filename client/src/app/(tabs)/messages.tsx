import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useRecentChats } from '@/src/hooks/useChat'
import { useAllUsers } from '@/src/hooks/useUsers'
import { useDebounce } from '@/src/hooks/useDebounce'
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary'
import { Feather } from '@expo/vector-icons'

const Messages = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: recentChats, isLoading, refetch, isRefetching } = useRecentChats();
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const { data: searchResults, isLoading: isSearchLoading } = useAllUsers(debouncedSearchQuery);

  const displayData = React.useMemo(() => {
    if (debouncedSearchQuery.trim().length > 0) {
      if (!searchResults) return [];
      // Map server-side users to the chat item format
      return searchResults.map((u: any) => ({
        user: u,
        latestMessage: { message: 'Tap to start conversation', createdAt: new Date().toISOString() },
        unreadCount: 0
      }));
    }
    
    if (!recentChats) return [];
    return recentChats;
  }, [recentChats, debouncedSearchQuery, searchResults]);

  const renderChat = ({ item, index }: { item: any, index: number }) => {
    const partner = item.user;
    const latestMessage = item.latestMessage;
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity 
        onPress={() => router.push(`/chat/${partner._id}` as any)}
        className={`flex-row items-center px-4 py-4 ${unreadCount > 0 ? 'bg-white' : 'bg-[#F3F4F6]'}`}
      >
        <View style={{ width: 52, height: 52, borderRadius: 26, marginRight: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
          {partner?.profileImage && !partner.profileImage.includes('placeholder.com') ? (
            <Image 
              source={{ uri: getOptimizedCloudinaryUrl(partner.profileImage, { width: 100 }) }}
              style={{ width: 52, height: 52, borderRadius: 26 }}
              contentFit="cover"
            />
          ) : (
            <Feather name="user" size={24} color="#9CA3AF" />
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-[16px] font-bold text-gray-900" numberOfLines={1}>{partner.name || 'Dr. Arjun Mehta'}</Text>
            <Text className="text-[12px] text-gray-400">
              Just now
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text 
              className="text-[13px] text-gray-500 flex-1 mr-4"
              numberOfLines={1}
            >
              Shared a job: Senior Consultant - Cardiol...
            </Text>
            
            {unreadCount > 0 && (
              <View className="bg-[#02B6B6] rounded-full w-[20px] h-[20px] items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F3F4F6]">
      <View className="px-4 py-4 bg-[#FAFAFA]">
        <View className="flex-row items-center bg-[#F5F5F5] rounded-2xl px-4 py-3">
          <Feather name="search" size={18} color="#9CA3AF" />
          <TextInput 
            className="flex-1 ml-2.5 text-[15px] text-gray-900 p-0"
            placeholder="Search Chats..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading && !debouncedSearchQuery ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#02B6B6" />
        </View>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.user._id}
          renderItem={renderChat}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#02B6B6" />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-[15px] text-gray-500">
                {debouncedSearchQuery ? (isSearchLoading ? 'Searching...' : 'No users found.') : 'No recent conversations.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  )
}

export default Messages
