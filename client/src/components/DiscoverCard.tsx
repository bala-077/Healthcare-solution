import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, ToastAndroid, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { getOptimizedCloudinaryUrl } from '@/src/utils/cloudinary';
import { useAuth } from '@/src/context/AuthContext';
import { useConnect } from '@/src/hooks/useConnections';
import { Feather } from '@expo/vector-icons';

type DiscoverCardProps = {
  item: any;
};

const DiscoverCard = ({ item }: DiscoverCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const connectMutation = useConnect();

  const isConnected = user?.connections?.includes(item._id);
  const initialIsPending = item.connectionRequests?.includes(user?._id);
  const [isPending, setIsPending] = useState(initialIsPending);

  useEffect(() => {
    setIsPending(initialIsPending);
  }, [initialIsPending]);
  const connectionCount = item.connections?.length || 0;

  const handleConnect = () => {
    connectMutation.mutate(item._id, {
      onSuccess: (data: any) => {
        if (data?.status === 'sent') {
          setIsPending(true);
        } else if (data?.status === 'cancelled') {
          setIsPending(false);
        } else {
          setIsPending(!isPending);
        }
        const msg = data?.message || (isPending ? 'Connection request cancelled' : 'Connection request sent!');
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', msg);
        }
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || 'Failed to send connection request';
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
          Alert.alert('Error', msg);
        }
      }
    });
  };

  return (
    <View className="bg-white p-4 mb-4 rounded-lg flex-1 mx-2 items-center">
      {/* Connection count badge */}
      <View className="flex-row items-center bg-primary-light rounded-full px-2 py-0.5 mb-4 border border-primary/20">
        <Feather name="user-plus" size={10} color="#02B6B6" style={{ marginRight: 4 }} />
        <Text className="text-[10px] text-text-secondary font-medium">{connectionCount} Connects</Text>
      </View>

      <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden', backgroundColor: 'white' }}>
        {item.profileImage && typeof item.profileImage === 'string' && !item.profileImage.includes('placeholder.com') ? (
          <Image
            source={{ uri: getOptimizedCloudinaryUrl(item.profileImage, { width: 100 }) }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            contentFit="cover"
          />
        ) : (
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="user" size={24} color="#9CA3AF" />
          </View>
        )}
      </View>

      <Text className="text-[15px] text-text-primary font-bold text-center mb-0.5" numberOfLines={1}>{item.name}</Text>
      <Text className="text-[12px] text-text-secondary text-center mb-4" numberOfLines={1}>{item.occupation}</Text>

      {isConnected ? (
        <TouchableOpacity
          onPress={() => router.push(`/chat/${item._id}` as any)}
          className="border border-border px-4 py-2 rounded-full w-full flex-row items-center justify-center bg-white"
        >
          <Image 
            source={require('../Assets/Icons - svg/icon-send-filled.svg')}
            style={{ width: 14, height: 14, marginRight: 6 }}
            tintColor="#7F7F80"
            contentFit="contain"
          />
          <Text className="text-[13px] text-text-secondary font-medium">Message</Text>
        </TouchableOpacity>
      ) : isPending ? (
        <TouchableOpacity 
          onPress={() => handleConnect()}
          disabled={connectMutation.isPending}
          className="bg-gray-200 px-4 py-2 rounded-md w-full flex-row items-center justify-center"
        >
          {connectMutation.isPending ? (
            <ActivityIndicator size="small" color="#6B7280" style={{ marginRight: 6 }} />
          ) : (
            <Feather name="clock" size={14} color="#6B7280" style={{ marginRight: 6 }} />
          )
          }
          <Text className="text-[13px] text-gray-500 font-bold">
            {connectMutation.isPending ? 'Canceling...' : 'Pending'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleConnect()}
          disabled={connectMutation.isPending}
          className="bg-primary px-4 py-2 rounded-md w-full flex-row items-center justify-center"
        >
          {connectMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
          ) : (
            <Feather name="user-plus" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          )}
          <Text className="text-[13px] text-white font-bold">
            {connectMutation.isPending ? 'Connecting...' : 'Connect'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DiscoverCard;
