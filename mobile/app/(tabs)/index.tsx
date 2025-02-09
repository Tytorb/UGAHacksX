import {
  Image,
  StyleSheet,
  Platform,
  Button,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';

import DeviceCard from '../../components/DeviceCard'; // Import the DeviceCard component


import '../../global.css';

const MATEDATA = [
  {
    name: 'My Name (item 1)',
    hider: 'Theo',
    area: 'Athens, GA',
    origin: 'New York City, NY',
    goal: 'San Jose, CA',
    clue: 'Look under a rock by the river...',
    id: '0000001',
  },
  {
    name: 'My Name (item 2)',
    hider: 'Theo',
    area: 'Athens, GA',
    origin: 'New York City, NY',
    goal: 'San Jose, CA',
    clue: 'Look under a rock by the river...',
    id: '0000002',
  },
  {
    name: 'My Name (item 3)',
    hider: 'Theo',
    area: 'Ontario, CA',
    origin: 'Omaha, NE',
    goal: 'Panama City, FL',
    clue: 'Look under a rock by the river...',
    id: '0000003',
  },
  {
    name: 'My Name (item 4)',
    hider: 'Theo',
    area: 'Athens, GA',
    origin: 'New York City, NY',
    goal: 'San Jose, CA',
    clue: 'Look under a rock by the river...',
    id: '0000004',
  },

];

export default function HomeScreen() {
  return (
    <SafeAreaView className='bg-white'>
      <ScrollView className='p-8'>
      <View>
        <Text className="text-black text-5xl font-medium">Explore</Text>
      </View>

      <View className='w-full h-full'>
        <MyList />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

const MyList = () => {
  const router = useRouter();
  return (
    <FlashList
      className='mt-4'
      data={MATEDATA}
      renderItem={({ item }) => {
        return (
          <View className='mb-4'>
            <DeviceCard
            name={item.name}
            clue={item.clue}
            hider={item.hider}
            origin={item.origin}
            area={item.area}
            goal={item.goal}
            id={item.id}
          />

          </View>
        );
      }}
      estimatedItemSize={200}
    />
  );
};
