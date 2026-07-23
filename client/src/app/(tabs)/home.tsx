import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Dimensions, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { usePosts } from '@/src/hooks/usePosts'
import { useMe } from '@/src/hooks/useUsers'
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary'
import ShareModal from '@/src/components/ShareModal'
import PostCard from '@/src/components/PostCard'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@/src/context/AuthContext'

const { width } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { data: userData } = useMe();
  const { data, isLoading, refetch, isRefetching } = usePosts();
  const [sharePostId, setSharePostId] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/sign-in');
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard item={item} onShare={setSharePostId} />
  );

  const renderHeader = () => (
    <View className="items-center pb-6 bg-background-light pt-6">
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: 'white', borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {userData?.profileImage && !userData.profileImage.includes('placeholder.com') ? (
          <Image 
            source={{ uri: userData.profileImage }} 
            style={{ width: 96, height: 96, borderRadius: 48 }}
            contentFit="cover"
          />
        ) : (
          <Feather name="user" size={40} color="#9CA3AF" />
        )}
      </View>
      
      <View className="flex-row items-center bg-primary-light rounded-full px-3 py-1 mt-4 border border-primary/20">
        <Feather name="user-plus" size={14} color="#02B6B6" style={{ marginRight: 6 }} />
        <Text className="text-xs text-text-secondary font-medium">{userData?.connections?.length || 0} Connects</Text>
      </View>

      <Text className="h2-sub-header text-text-primary mt-3">{userData?.name || 'Dr. Arjun Mehta'}</Text>
      <Text className="b2-body text-text-secondary mt-1">{userData?.occupation || 'Cardiology'}</Text>
    </View>
  );

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: 80 }} className="flex-1 bg-background-light">
      <View className="px-5 py-4 flex-row justify-between items-center bg-background-light">
        <Text className="h2-sub-header">
          <Text className="text-text-primary">Doc</Text>
          <Text className="text-primary">Connect</Text>
        </Text>
        <View className="flex-row items-center gap-3">
          {/* <TouchableOpacity 
            onPress={handleLogout}
            className="w-10 h-10 rounded-lg bg-red-50 items-center justify-center shadow-sm"
          >
            <Feather name="log-out" size={18} color="#EF4444" />
          </TouchableOpacity> */}
          <TouchableOpacity 
            onPress={() => router.push('/create-post')}
            className="w-10 h-10 rounded-lg bg-primary items-center justify-center shadow-sm"
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && !isRefetching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#02B6B6" />
        </View>
      ) : (
        <FlatList
          data={data?.posts || []}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#02B6B6" />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="b1-body text-text-secondary">No posts available.</Text>
            </View>
          }
        />
      )}
      
      {sharePostId && (
        <ShareModal 
          visible={!!sharePostId} 
          onClose={() => setSharePostId(null)} 
          postId={sharePostId} 
        />
      )}
    </View>
  )
}

export default Home
