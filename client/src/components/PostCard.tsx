import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { useLikePost } from '@/src/hooks/usePosts';

const { width } = Dimensions.get('window');

type PostCardProps = {
  item: any;
  onShare: (id: string) => void;
};

const PostCard = ({ item, onShare }: PostCardProps) => {
  const { user } = useAuth();
  const likePostMutation = useLikePost();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const initialHasLiked = user && item.likes ? item.likes.includes(user._id) : false;
  const initialLikeCount = item.likes ? item.likes.length : 0;

  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const shareCount = item.shares || 0;

  // Sync with prop changes (e.g. background refetch)
  React.useEffect(() => {
    setHasLiked(initialHasLiked);
    setLikeCount(initialLikeCount);
  }, [initialHasLiked, initialLikeCount]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (item.images && activeIndex < item.images.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
    }
  };

  const handleLike = () => {
    if (!likePostMutation.isPending) {
      // Optimistic update locally
      setHasLiked(!hasLiked);
      setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);
      
      likePostMutation.mutate(item._id, {
        onError: () => {
          // Rollback on error
          setHasLiked(hasLiked);
          setLikeCount(likeCount);
        }
      });
    }
  };

  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row items-center p-4">
        <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: '#F1F5F9', marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>
          {item.author?.profileImage && !item.author.profileImage.includes('placeholder.com') ? (
            <Image 
              source={{ uri: getOptimizedCloudinaryUrl(item.author.profileImage, { width: 100 }) }} 
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
            />
          ) : (
            <Feather name="user" size={20} color="#9CA3AF" />
          )}
        </View>
        <View>
          <Text className="text-[15px] font-bold text-gray-900">{item.author?.name || 'Docconnect'}</Text>
          <Text className="text-[13px] text-gray-500">{item.author?.occupation || 'Healthcare Technology'}</Text>
        </View>
      </View>
      
      <Text className="text-[14px] text-gray-800 px-4 pb-3 leading-5">
        {item.content}
      </Text>

      {item.images && item.images.length > 0 && (
        <View className="relative">
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {item.images.map((img: string, idx: number) => (
              <Image 
                key={idx}
                source={{ uri: getOptimizedCloudinaryUrl(img, { width: Math.round(width) }) }} 
                style={{ width: width, height: width * (5/4) }}
                className="bg-gray-100"
                contentFit="cover"
              />
            ))}
          </ScrollView>
          
          {item.images.length > 1 && (
            <>
              {/* Top Left Text Pill */}
              <View className="absolute top-4 left-4 bg-black/40 px-3 py-1 rounded-full">
                <Text className="text-white text-[12px] font-medium">{activeIndex + 1}/{item.images.length}</Text>
              </View>

              {/* Top Right Dots */}
              <View className="absolute top-4 right-4 bg-black/40 px-2 py-1.5 rounded-full flex-row items-center">
                {item.images.map((_: any, idx: number) => (
                  <View 
                    key={idx}
                    className={`h-1.5 rounded-full mx-0.5 ${idx === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                  />
                ))}
              </View>

              {/* Next Button */}
              {activeIndex < item.images.length - 1 && (
                <TouchableOpacity 
                  onPress={handleNext}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center"
                >
                  <Feather name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}

      {item.image && !item.images?.length && (
        <Image 
          source={{ uri: getOptimizedCloudinaryUrl(item.image, { width: Math.round(width) }) }} 
          style={{ width: width, height: width * (5/4) }}
          className="bg-gray-100"
          contentFit="cover"
        />
      )}

      <View className="flex-row items-center px-4 py-3 mt-1 justify-between border-t border-gray-100">
        <TouchableOpacity onPress={handleLike} className="flex-row items-center">
          {hasLiked ? (
            <Ionicons name="heart" size={22} color="#EF4444" />
          ) : (
            <Feather name="heart" size={20} color="#585858" />
          )}
          <Text className="text-gray-500 font-medium ml-2">{likeCount}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => onShare(item._id)}
          className="flex-row items-center"
        >
          <Ionicons name="paper-plane-outline" size={20} color="#585858" />
          <Text className="text-gray-500 font-medium ml-2">{shareCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;
