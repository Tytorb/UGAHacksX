import {
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Text,
  Dimensions,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlashList } from '@shopify/flash-list';
import { Stack, Slot } from 'expo-router';

import { Auth0Provider, useAuth0 } from 'react-native-auth0';

import Feather from '@expo/vector-icons/Feather';

// Import your global CSS file
import "../global.css";
import ListItem from '@/components/ListItem';

export default function Settings() {
  const { clearSession } = useAuth0();

  const onLogout = async () => {
    try {
      await clearSession();
      Alert.alert('Logged out', 'You have been logged out successfully.');
    } catch (e) {
      console.log('Log out cancelled', e);
      Alert.alert('Error', 'Log out cancelled.');
    }
  };


  return (
    <Auth0Provider
    domain="YOUR_AUTH0_DOMAIN"
    clientId="YOUR_AUTH0_CLIENT_ID"
  >
    <SafeAreaView className='bg-white h-full'>
      <ScrollView className='flex-col p-8 pt-0'>
        <ListItem icon="smile" title="Edit Profile" subheading="Username, icon, bio" goto='saves' />
        <ListItem icon="speaker" title="Devices" subheading="Connect, remove, view data" goto='saves' />
        <ListItem icon="unlock" title="Account Center" subheading="Sign up, log in, log out" goto='saves' />
        <ListItem icon="eye" title="Privacy" subheading="Profile visiblity, history" goto='saves' />
        <ListItem icon="users" title="Friends" subheading="Add and remove friends" goto='saves' />
        <ListItem icon="info" title="About" subheading="About MateOnTour" goto='saves' />

        <View className='flex-col justify-center items-center gap-1 mt-16'>
          <Text className='text-lg'>
            ©2025
          </Text>
          <Text className='text-lg'>
            Created for UGAHacks X
          </Text>
          <Pressable
            onPress={() => Alert.alert('our names')}
            accessibilityLabel="Credits"
          >
            <Text className='text-lg color-blue-600 underline'>Credits</Text>
          </Pressable>
        </View>


        <View className='flex-col justify-center items-center gap-1 mt-16'>
          <Button
            onPress={onLogout}
            title="Log Out"
            color="#841584"
            accessibilityLabel="Log Out"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
    </Auth0Provider>
  );
}
