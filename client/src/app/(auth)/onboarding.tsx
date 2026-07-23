import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/src/context/AuthContext'
import { apiClient } from '@/src/services/axios'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Feather } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  occupation: z.string().min(2, "Occupation is required"),
  profileImage: z.string().url("Valid URL required").optional().or(z.literal('')),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const Onboarding = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const phone = params.phone as string;
  const uid = params.uid as string;

  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      occupation: '',
      profileImage: '' // In a real app, this would use image picker. For now, string URL.
    }
  });

  const profileImage = watch('profileImage');

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setValue('profileImage', base64Img, { shouldValidate: true });
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/auth/onboarding', {
        mobileNumber: phone,
        name: data.name,
        occupation: data.occupation,
        profileImage: data.profileImage || 'https://via.placeholder.com/150', // fallback
      }, {
        headers: {
          'firebaseuid': uid,
          'Authorization': `Bearer ${uid}`
        }
      });

      const user = response.data.data;
      await login(uid, user);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error("Onboarding error", error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#FAFAFA' }}
    >
      <View style={{ paddingTop: insets.top }} className="bg-white">
        {/* Header Logo */}
        <View className="items-center py-4 bg-white border-b border-[#F0F0F0]">
          <Text className="text-[20px] font-extrabold tracking-tight">
            <Text className="text-[#1F2024]">Doc</Text>
            <Text className="text-[#02B6B6]">Connect</Text>
          </Text>
        </View>
      </View>

      <View className="flex-1 px-6 pt-8 pb-6 bg-[#FAFAFA]">
        <Text className="text-[24px] font-bold text-[#1F2024] mb-1">Profile Information</Text>
        <Text className="text-[15px] text-[#71727A] mb-10">
          Tell us about yourself
        </Text>

        {/* Profile Picture Placeholder */}
        <View className="items-center mb-10">
          <View className="relative w-[110px] h-[110px]">
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              className="w-full h-full rounded-full bg-[#A3A3A3] items-center justify-center overflow-hidden border-[3px] border-[#FAFAFA] shadow-sm"
            >
              {profileImage && profileImage.trim() !== '' ? (
                <Image source={{ uri: profileImage }} className="w-full h-full" />
              ) : (
                <>
                  <View className="w-[44px] h-[44px] rounded-full bg-[#F5F5F5] absolute top-[18px]"></View>
                  <View className="w-[72px] h-[40px] rounded-t-full bg-[#F5F5F5] absolute bottom-0"></View>
                </>
              )}
            </TouchableOpacity>

            {/* Camera Icon Button */}
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              className="absolute right-0 bottom-1 w-9 h-9 rounded-full bg-white items-center justify-center shadow-sm border border-[#F0F0F0] z-10"
              style={{ elevation: 2 }}
            >
              <Feather name="camera" size={16} color="#02B6B6" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 gap-6">
          <View>
            <Text className="text-[14px] text-[#2F3036] mb-2 font-medium">Your Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-[#F2F6F6] px-5 py-[16px] rounded-[4px] text-[15px] text-[#1F2024]"
                  placeholder="Enter your first name"
                  placeholderTextColor="#9EA0A5"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ paddingVertical: 8 }}
                />
              )}
            />
            {errors.name && <Text className="text-red-500 mt-1 text-xs">{errors.name.message}</Text>}
          </View>

          <View>
            <Text className="text-[14px] text-[#2F3036] mb-2 font-medium">Your Role</Text>
            <Controller
              control={control}
              name="occupation"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-[#F2F6F6] px-5 py-[16px] rounded-[4px] text-[15px] text-[#1F2024]"
                  placeholder="Enter your role"
                  placeholderTextColor="#9EA0A5"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ paddingVertical: 8 }}

                />
              )}
            />
            {errors.occupation && <Text className="text-red-500 mt-1 text-xs">{errors.occupation.message}</Text>}
          </View>
        </View>

        {/* Spacer to push button to bottom */}
        <View className="justify-end items-center ">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full py-[16px] rounded-full items-center justify-center active:opacity-80 bg-[#00C4B8] flex-row"
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-[16px] font-bold">Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Onboarding
