import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreatePost } from '@/src/hooks/usePosts';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CreatePost = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const createPostMutation = useCreatePost();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handlePost = () => {
    if (!text.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append('content', text);

    images.forEach((imageUri, index) => {
      const filename = imageUri.split('/').pop() || `image_${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('images', {
        uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
        name: filename,
        type,
      } as any);
    });

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setText('');
        setImages([]);
        router.push('/(tabs)/home');
      },
      onError: (error) => {
        console.error('Failed to create post:', error);
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
        >
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Create post</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
          {images.length === 0 ? (
            /* Empty State: Initial + Button */
            <TouchableOpacity 
              onPress={pickImage}
              className="w-16 h-16 rounded-xl border border-dashed border-gray-300 bg-gray-50 items-center justify-center mb-6"
            >
              <Text className="text-gray-400 text-2xl font-light">+</Text>
            </TouchableOpacity>
          ) : (
            /* Filled State: Selected Images Carousel and Thumbnails */
            <View className="mb-6">
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                className="mb-4"
              >
                {images.map((img, idx) => (
                  <View key={idx} className="mr-4">
                    <Image 
                      source={{ uri: img }}
                      style={{ width: width * 0.7, height: width * 0.9, borderRadius: 16, backgroundColor: '#F3F4F6' }}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </ScrollView>
              
              <View className="flex-row items-center">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {images.map((img, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      onPress={() => setSelectedImageIndex(idx)}
                      className={`mr-3 rounded-xl overflow-hidden border-2 ${selectedImageIndex === idx ? 'border-[#02B6B6]' : 'border-transparent'}`}
                    >
                      <Image 
                        source={{ uri: img }}
                        style={{ width: 60, height: 60, borderRadius: 10, backgroundColor: '#F3F4F6' }}
                        contentFit="cover"
                      />
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity 
                    onPress={pickImage}
                    className="w-[60px] h-[60px] rounded-xl border border-dashed border-gray-300 bg-gray-50 items-center justify-center mr-4"
                  >
                    <Text className="text-gray-400 text-xl font-light">+</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          )}

          <View className="h-[1px] bg-gray-100 w-full mb-4" />

          <TextInput
            className="text-[17px] text-gray-900 leading-6"
            placeholder="What do you want to talk about?"
            placeholderTextColor="#9CA3AF"
            multiline
            value={text}
            onChangeText={setText}
            style={{ minHeight: 150, textAlignVertical: 'top' }}
          />
        </ScrollView>

        <View className="p-4 bg-white" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <TouchableOpacity 
            onPress={handlePost}
            disabled={createPostMutation.isPending}
            className={`rounded-full py-4 items-center justify-center flex-row ${createPostMutation.isPending ? 'bg-gray-400' : 'bg-[#02B6B6]'}`}
          >
            <Text className="text-white text-lg font-bold mr-2">
              {createPostMutation.isPending ? 'Posting...' : 'Post'}
            </Text>
            {!createPostMutation.isPending && (
              <Feather name="arrow-right" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreatePost;
