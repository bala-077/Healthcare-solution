import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'

const Profile = () => {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View className="py-4 items-center border-b border-border bg-white">
                <Text className="h1-header">
                    <Text className="text-text-primary">Doc</Text>
                    <Text className="text-primary">Connect</Text>
                </Text>
            </View>

            {/* Content */}
            <KeyboardAvoidingView
                className="flex-1 bg-background-light px-6 pt-8 pb-6"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View className="flex-1">
                    <Text className="h1-header text-text-primary mb-2">Profile Information</Text>
                    <Text className="b1-body text-text-secondary mb-10">
                        Tell us about yourself
                    </Text>

                    {/* Avatar Upload */}
                    <View className="items-center mb-10">
                        <TouchableOpacity className="relative" onPress={pickImage} activeOpacity={0.7}>
                            <View className="w-28 h-28 bg-[#A5A5A5] rounded-full items-center justify-end overflow-hidden">
                                {image ? (
                                    <Image 
                                        source={{ uri: image }} 
                                        style={{ position: 'absolute', width: '100%', height: '100%' }} 
                                        contentFit="cover" 
                                    />
                                ) : (
                                    <Ionicons name="person" size={90} color="#F5F5F5" style={{ marginBottom: -15 }} />
                                )}
                            </View>
                            <View className="absolute bottom-0 right-0 bg-white w-9 h-9 rounded-full items-center justify-center shadow-sm border border-border">
                                <Ionicons name="camera-outline" size={18} color="#02B6B6" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View className="mb-6">
                        <Text className="b2-body text-text-primary mb-2">Your Name</Text>
                        <View className="w-full bg-surface-cream rounded-lg px-5 py-2">
                            <TextInput
                                style={{
                                    fontFamily: 'DMSans_500Medium',
                                    fontSize: 16,
                                    color: '#29292B',
                                    width: '100%',
                                    paddingVertical: 8,
                                }}
                                placeholder="Enter your first name"
                                placeholderTextColor="#7F7F80"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="b2-body text-text-primary mb-2">Your Role</Text>
                        <View className="w-full bg-surface-cream rounded-lg px-5 py-2">
                            <TextInput
                                style={{
                                    fontFamily: 'DMSans_500Medium',
                                    fontSize: 16,
                                    color: '#29292B',
                                    width: '100%',
                                    paddingVertical: 8,
                                }}
                                placeholder="Enter your role"
                                placeholderTextColor="#7F7F80"
                                value={role}
                                onChangeText={setRole}
                            />
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="mt-auto pt-6">
                    <TouchableOpacity className="bg-primary py-4 rounded-full items-center justify-center">
                        <Text className="cta-text text-white">Continue</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default Profile
