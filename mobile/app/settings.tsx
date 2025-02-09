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
    <SafeAreaView style={{ backgroundColor: '#fff', height: '100%' }}>
      <ScrollView className='flex-col p-8 pt-0'>
        <ListItem icon="user" title="Sign In" subheading="Sign into your account" goto='saves' />
        <ListItem icon="user" title="Sign In" subheading="Sign into your account" goto='saves' />
        <ListItem icon="user" title="Sign In" subheading="Sign into your account" goto='saves' />

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
