import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { z } from 'zod'

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number.");

const Signin = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Validates if the number matches the Zod schema
  const isValid = phoneSchema.safeParse(phoneNumber).success;

  const handleTextChange = (text: string) => {
    // Strip non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText);
  };

  const handleContinue = () => {
    const result = phoneSchema.safeParse(phoneNumber);
    if (result.success) {
      router.push({ pathname: '/(auth)/verify-otp', params: { phone: phoneNumber } });
    } else {
      Alert.alert("Invalid Number", result.error.issues[0].message);
    }
  };
  
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-background-light">
      {/* Header Logo */}
      <View className="items-center py-5 bg-white">
        <Text className="h1-header">
          <Text className="text-text-primary">Doc</Text>
          <Text className="text-primary">Connect</Text>
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-10 pb-6">
        <Text className="h1-header text-text-primary mb-2">Welcome</Text>
        <Text className="text-text-secondary b1-body mb-10 leading-6">
          Sign in to connect with healthcare professionals
        </Text>

        <Text className="text-text-secondary b2-body mb-3">Mobile number</Text>
        
        <View className="flex-row gap-3">
          {/* Country Code */}
          <View className="bg-surface-cream px-5 py-4 rounded-2xl flex-row items-center justify-center">
            <Text className="b1-body text-text-primary">🇮🇳 +91</Text>
          </View>
          
          {/* Phone Input */}
          <View className="flex-1 bg-surface-cream px-5 rounded-2xl justify-center">
            <TextInput 
              placeholder="Enter your number"
              placeholderTextColor="#7F7F80"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={handleTextChange}
              className="b1-body text-text-primary flex-1"
            />
          </View>
        </View>

        <View className="flex-1 justify-end items-center">
          <Text className="text-center text-text-secondary b2-body mb-6 px-4 leading-5">
            By continuing, you agree to Docconnect's{' '}
            <Text className="underline">Terms of Service</Text> and{' '}
            <Text className="underline">Privacy Policy</Text>
          </Text>

          <TouchableOpacity 
            disabled={!isValid}
            onPress={handleContinue}
            className={`w-full py-4 rounded-full items-center active:opacity-80 ${isValid ? 'bg-primary' : 'bg-border'}`}
          >
            <Text className={`cta-text ${isValid ? 'text-white' : 'text-text-secondary'}`}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Signin