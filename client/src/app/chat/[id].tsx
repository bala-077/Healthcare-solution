import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useEffect } from 'react'
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useChatHistory, useSendMessage } from '@/src/hooks/useChat'
import { useAuth } from '@/src/context/AuthContext'
import { useUser } from '@/src/hooks/useUsers'
import { socketService } from '@/src/services/socket'
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const Chat = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const receiverId = id as string;
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = React.useRef<FlatList>(null);

  const { data: receiverUser } = useUser(receiverId);
  const { data: history, isLoading } = useChatHistory(receiverId);
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    socketService.connect();

    if (socketService.socket && user) {
      socketService.socket.on('receive_message', (newMessage: any) => {
        if (newMessage.sender === receiverId || newMessage.receiver === user._id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }

    return () => {
      if (socketService.socket) {
        socketService.socket.off('receive_message');
      }
    };
  }, [receiverId, user]);

  const handleSend = () => {
    if (!message.trim()) return;

    const tempMessage = {
      _id: Date.now().toString(),
      sender: user?._id,
      receiver: receiverId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    sendMessageMutation.mutate({ receiverId, message: message.trim() });
    setMessage('');
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === user?._id;
    const timeString = formatTime(item.createdAt);

    return (
      <View className={`my-2 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
        {/* Incoming Avatar */}
        {!isMe && (
          <View className="w-10 h-10 rounded-full bg-white mr-2 justify-center items-center">
            {receiverUser?.profileImage && !receiverUser.profileImage.includes('placeholder.com') ? (
              <Image
                source={{ uri: getOptimizedCloudinaryUrl(receiverUser.profileImage, { width: 50 }) }}
                className="w-full h-full rounded-full"
                contentFit="cover"
              />
            ) : (
              <MaterialCommunityIcons name="account-group" size={24} color="#4ADE80" />
            )}
          </View>
        )}

        {/* Message Content Container */}
        <View className="max-w-[82%]">
          {item.sharedPost ? (
            <View className="bg-white rounded-2xl p-1 pb-0 shadow-sm border border-gray-100 overflow-hidden min-w-[250px]">
              <View className="p-2.5">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 rounded-full overflow-hidden mr-2 bg-[#1A365D] items-center justify-center">
                    {item.sharedPost.author?.profileImage && !item.sharedPost.author.profileImage.includes('placeholder.com') ? (
                      <Image
                        source={{ uri: getOptimizedCloudinaryUrl(item.sharedPost.author.profileImage, { width: 40 }) }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        contentFit="cover"
                      />
                    ) : (
                      <MaterialCommunityIcons name="account-circle-outline" size={24} color="white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] text-gray-900 font-bold" numberOfLines={1}>
                      {item.sharedPost.author?.name || 'User'}
                    </Text>
                    <Text className="text-[12px] text-gray-500" numberOfLines={1}>
                      {item.sharedPost.author?.occupation || 'Healthcare Technology'}
                    </Text>
                  </View>
                </View>

                <Text className="text-[13px] text-gray-600 mb-2" numberOfLines={2}>
                  {item.sharedPost.content}
                </Text>
              </View>

              {item.sharedPost.images && item.sharedPost.images.length > 0 && (
                <View className="relative w-full h-[140px] px-2.5 pb-2">
                  <Image
                    source={{ uri: getOptimizedCloudinaryUrl(item.sharedPost.images[0], { width: 300 }) }}
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    contentFit="cover"
                  />
                  {item.sharedPost.images.length > 1 && (
                    <View className="absolute top-3 left-4 bg-black/40 px-2.5 py-1 rounded-full">
                      <Text className="text-white text-[10px]">1/{item.sharedPost.images.length}</Text>
                    </View>
                  )}
                </View>
              )}

              <View className="px-3 pb-3 pt-2">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-[12px] text-gray-500">Post on Docconnect</Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-[12px] font-medium text-[#02B6B6] mr-1">View</Text>
                    <Feather name="external-link" size={12} color="#02B6B6" />
                  </TouchableOpacity>
                </View>
                <View className="items-end">
                  <Text className="text-[10px] text-gray-400">{timeString}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className={`px-4 py-3 rounded-2xl ${isMe ? 'bg-white rounded-br-sm' : 'bg-[#EAEAEA] rounded-bl-sm'}`}>
              <Text className={`text-[15px] ${isMe ? 'text-gray-900' : 'text-gray-900'}`}>
                {item.message}
              </Text>
              <Text className={`text-[11px] mt-1 text-right ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                {timeString}
              </Text>
            </View>
          )}
        </View>

        {/* Outgoing Avatar/Icon */}
        {isMe && (
          <View className="w-10 h-10 rounded-full bg-white ml-2 justify-center items-center overflow-hidden">
            {user?.profileImage && !user.profileImage.includes('placeholder.com') ? (
              <Image 
                source={{ uri: getOptimizedCloudinaryUrl(user.profileImage, { width: 50 }) }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit="cover"
              />
            ) : (
              <MaterialCommunityIcons name="hospital-box-outline" size={24} color="#02B6B6" />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-[#F8F9FA]">
        {/* Header */}
        <View className="px-5 py-3 flex-row items-center bg-white z-10 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center mr-3 rounded-full bg-[#F3F4F6]">
            <MaterialIcons name="arrow-back-ios-new" size={16} color="#1F2937" style={{ marginLeft: 0 }} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-[18px] font-bold text-gray-900 mb-0.5">
              {receiverUser?.name || 'Loading...'}
            </Text>
            {receiverUser && (
              <Text className="text-[13px] text-gray-500" numberOfLines={1}>
                {receiverUser.occupation} · {receiverUser.location || 'Unknown Location'}
              </Text>
            )}
          </View>
        </View>

        {/* Messages */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#02B6B6" />
          </View>
        ) : (
          <FlatList
            inverted={true}
            data={[...messages].reverse()}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 }}
            className="flex-1"
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input */}
        <View className="px-4 py-3 bg-white flex-row items-center mt-auto">
          <View className="flex-1 bg-[#F3F4F6] rounded-full px-3 py-1.5 flex-row items-center min-h-[50px]">
            <TextInput
              className="flex-1 text-[15px] text-gray-900 h-full py-0 m-0"
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-full items-center justify-center ml-2 bg-[#EBF9F9]"
            >
              <Ionicons name="send" size={18} color="#02B6B6" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Chat
