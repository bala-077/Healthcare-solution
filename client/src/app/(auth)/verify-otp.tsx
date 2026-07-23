import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/src/context/AuthContext'
import { apiClient } from '@/src/services/axios'

const VerifyOtp = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const phone = params.phone as string || '';
  
  const { login } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<TextInput[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      isMounted.current = false;
    };
  }, [timer]);

  const handleResend = () => {
    // Add logic here to actually resend the OTP if needed
    setTimer(30);
  };

  const handleOtpChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // MOCK FIREBASE OTP: Use the phone number as the mock firebase UID
      const mockFirebaseUid = `uid-${phone}`;
      
      try {
        // Try to fetch the user profile
        const { data } = await apiClient.get('/users/me', {
          headers: {
            'firebaseuid': mockFirebaseUid,
            'Authorization': `Bearer ${mockFirebaseUid}`
          }
        });
        
        // If successful, the user exists
        await login(mockFirebaseUid, data.data);
        router.replace('/(tabs)/home');
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // User doesn't exist, go to onboarding
          router.replace({ pathname: '/(auth)/onboarding', params: { phone, uid: mockFirebaseUid } });
        } else {
          console.error("Verification error", error);
        }
      }
    } finally {
      if (isMounted.current) {
        setIsVerifying(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-background-light">
        <View className="items-center py-5 bg-white">
          <Text className="h1-header">
            <Text className="text-text-primary">Doc</Text>
            <Text className="text-primary">Connect</Text>
          </Text>
        </View>

        <View className="flex-1 px-6 pt-10 pb-6">
          <Text className="h1-header text-text-primary mb-2">Verify your number</Text>
          <Text className="text-text-secondary b1-body mb-8">
            We sent a 6-digit code to <Text className="text-text-primary font-medium">+91 {phone}</Text>
          </Text>

          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <View 
                key={index} 
                className="w-14 h-14 bg-surface-cream rounded-xl justify-center items-center"
              >
                <TextInput
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  className="b1-body text-text-primary w-full h-full text-xl"
                  style={{ textAlign: 'center' }}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>

          {timer > 0 ? (
            <Text className="text-center text-text-secondary b2-body">
              Resend code in <Text className="text-text-primary font-medium">0:{timer.toString().padStart(2, '0')}</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7} className="py-2">
              <Text className="text-center text-primary font-medium b2-body">
                Resend Code
              </Text>
            </TouchableOpacity>
          )}

          <View className="flex-1 justify-end items-center">
            <TouchableOpacity 
              onPress={handleVerify}
              disabled={isVerifying}
              className="w-full py-4 rounded-full items-center justify-center active:opacity-80 bg-primary flex-row"
            >
              {isVerifying ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="cta-text text-white">Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default VerifyOtp