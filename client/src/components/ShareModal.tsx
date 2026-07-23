import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useMyConnections } from '@/src/hooks/useConnections';
import { useSendMessage } from '@/src/hooks/useChat';
import { useSharePost } from '@/src/hooks/usePosts';
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ShareModalProps = {
  visible: boolean;
  onClose: () => void;
  postId: string;
};

const ShareModal = ({ visible, onClose, postId }: ShareModalProps) => {
  const { data: connections, isLoading } = useMyConnections();
  const sendMessageMutation = useSendMessage();
  const sharePostMutation = useSharePost();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    if (selectedIds.length === 0) return;
    sendMessageMutation.mutate(
      { receiverId: selectedIds, sharedPostId: postId },
      {
        onSuccess: () => {
          sharePostMutation.mutate(postId);
          setSelectedIds([]);
          onClose();
        }
      }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
          {/* Drag Handle */}
          <View className="w-12 h-1 bg-gray-200 rounded-full self-center mt-3 mb-1" />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-3 px-5 pt-3 pb-2">
            <View className="flex-row items-center">
              <Text className="text-[20px] font-bold text-gray-900 mr-3">Share to Chat</Text>
              {selectedIds.length > 0 && (
                <View className="bg-[#02B6B6] rounded-full w-[22px] h-[22px] items-center justify-center">
                  <Text className="text-white text-[12px] font-bold">{selectedIds.length}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-[#F3F4F6] rounded-full items-center justify-center">
              <Feather name="x" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#02B6B6" style={{ padding: 40 }} />
          ) : (
            <FlatList
              data={connections || []}
              keyExtractor={(item, index) => item?._id ? item._id.toString() + index : index.toString()}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => {
                const isSelected = selectedIds.includes(item._id);
                return (
                  <TouchableOpacity 
                    onPress={() => toggleSelect(item._id)}
                    className={`flex-row items-center py-3.5 px-5 ${isSelected ? 'bg-[#F0FAFA]' : 'bg-white'}`}
                  >
                    <View className="w-12 h-12 rounded-full mr-4 bg-[#E5F5F5] items-center justify-center overflow-hidden">
                      {item.profileImage && typeof item.profileImage === 'string' && !item.profileImage.includes('placeholder.com') ? (
                        <Image 
                          source={{ uri: getOptimizedCloudinaryUrl(item.profileImage, { width: 50 }) }}
                          style={{ width: 48, height: 48 }}
                          contentFit="cover"
                        />
                      ) : (
                        <MaterialCommunityIcons 
                          name={item.occupation?.toLowerCase().includes('student') ? 'school-outline' : 'hospital-building'} 
                          size={22} 
                          color="#02B6B6" 
                        />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-[16px] text-gray-900 font-medium mb-0.5">{item.name}</Text>
                      <Text className="text-[13px] text-gray-500">{item.occupation}</Text>
                    </View>
                    <View className="w-9 h-9 rounded-full bg-[#F3F4F6] items-center justify-center">
                      <Image 
                        source={require('../Assets/Icons - svg/icon-arrow-up-left.svg')} 
                        style={{ width: 18, height: 18 }}
                        tintColor="#6B7280"
                        contentFit="contain"
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View className="items-center justify-center py-10">
                  <Text className="text-[15px] text-gray-500">No connections to share with.</Text>
                </View>
              }
            />
          )}
          
          {/* Footer Sticky Button */}
          <View className="absolute bottom-0 left-0 right-0 p-5 bg-white" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
            <TouchableOpacity 
              onPress={handleShare}
              disabled={selectedIds.length === 0 || sendMessageMutation.isPending}
              className={`py-3.5 rounded-full flex-row items-center justify-center ${selectedIds.length > 0 ? 'bg-[#02B6B6]' : 'bg-gray-200'}`}
            >
              {sendMessageMutation.isPending ? (
                <ActivityIndicator color={selectedIds.length > 0 ? "#FFFFFF" : "#9CA3AF"} />
              ) : (
                <>
                  <Image 
                    source={require('../Assets/Icons - svg/icon-arrow-up-left.svg')} 
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    tintColor={selectedIds.length > 0 ? "#FFFFFF" : "#9CA3AF"}
                    contentFit="fill"
                  />
                  <Text className={`font-bold text-[16px] ${selectedIds.length > 0 ? 'text-white' : 'text-gray-500'}`}>
                    {selectedIds.length > 0 ? `Send to ${selectedIds.length} ${selectedIds.length === 1 ? 'person' : 'people'}` : 'Select users to share'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShareModal;
