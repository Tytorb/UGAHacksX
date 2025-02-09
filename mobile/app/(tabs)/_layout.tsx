import { Tabs, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, Image, Platform, StyleSheet, Text, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Feather from '@expo/vector-icons/Feather';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';

function TabLayout() {
  const colorScheme = useColorScheme();
  const { authorize, clearSession, user, error, isLoading } = useAuth0();

  const onLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  const loggedIn = user !== undefined && user !== null;

  return !loggedIn ? (
    <View style={styles.container}>
      {!loggedIn && <Text>You are not logged in</Text>}
      {error && <Text>{error.message}</Text>}

      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
  ) : (
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

export default function App() {
  return (
    <Auth0Provider
      domain="dev-ekqy8oookh1isaek.us.auth0.com"
      clientId="KZeg9aWZuZUebf73q9nFOKfVmtuyI1iG"
    >
      <TabLayout />
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
