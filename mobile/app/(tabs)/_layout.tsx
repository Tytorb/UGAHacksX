import { Tabs, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, Image, Platform, StyleSheet, Text, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Feather from '@expo/vector-icons/Feather';
import { useAuth0 } from 'react-native-auth0';

export default function TabLayout() {
  const { user } = useAuth0();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            minHeight: 10,
            paddingBottom: 15, // Adjust to center icons
            paddingTop: 10, // Adjust to balance spacing
            //backgroundColor: '#fff',
          },

          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="compass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saves"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="bookmark" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user/[id]"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: user?.picture,
              }}
              style={{ width: 28, height: 28 }} // Add explicit dimensions
            />
          ),
        }}
      />
    </Tabs>
  );
}
