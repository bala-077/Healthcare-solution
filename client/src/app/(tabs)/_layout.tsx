import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#02B6B6',
        tabBarInactiveTintColor: '#7F7F80',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          position: 'absolute',
          bottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={
                focused 
                  ? require('../../Assets/Icons - svg/icon-home-filled.svg')
                  : require('../../Assets/Icons - svg/icon-home-outline.svg')
              }
              style={{ width: 36, height: 36 }}
              tintColor={color}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={
                focused 
                  ? require('../../Assets/Icons - svg/icon-search-filled.svg')
                  : require('../../Assets/Icons - svg/icon-search-outline.svg')
              }
              style={{ width: 36, height: 36 }}
              tintColor={color}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={
                focused 
                  ? require('../../Assets/Icons - svg/icon-send-filled.svg')
                  : require('../../Assets/Icons - svg/icon-send-outline.svg')
              }
              style={{ width: 36, height: 36 }}
              tintColor={color}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
