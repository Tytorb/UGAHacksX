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

import Feather from '@expo/vector-icons/Feather';

// Import your global CSS file
import "../global.css";
import ListItem from '@/components/ListItem';

const DATA = [
  {
    title: 'First Item',
  },
  {
    title: 'Second Item',
  },
];

export default function Profile() {
  return (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});

const MyList = () => {
  return (
    <FlashList
      data={DATA}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      estimatedItemSize={200}
    />
  );
};
