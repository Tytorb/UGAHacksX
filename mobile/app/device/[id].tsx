import { BLEconnection } from '@/components/BLEconnection';
import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { Text, View, ScrollView } from 'react-native';

export default function DevicePage() {
  // Access the dynamic route parameter 'id'
  const { id } = useLocalSearchParams(); // 'id' corresponds to the dynamic part of the URL

  // Render the component based on the 'id'
  return (
    <ScrollView>
      <Link href={'./add-info/' + id}><Text className='text-2xl font-medium color-blue-600'>Add more info</Text></Link>
      <Stack.Screen options={{ headerBackTitle: 'Explore' }} />
      <Text>Device ID: {id}</Text>
      <BLEconnection />
      {/* You can use the 'id' to fetch device data or render specific content */}
    </ScrollView>
  );
}