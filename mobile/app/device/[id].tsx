import { BLEconnection } from '@/components/BLEconnection';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function DevicePage() {
  // Access the dynamic route parameter 'id'
  const { id } = useLocalSearchParams(); // 'id' corresponds to the dynamic part of the URL

  // Render the component based on the 'id'
  return (
    <View>
      <Stack.Screen options={{ headerBackTitle: 'Explore' }} />
      <Text>Device ID: {id}</Text>
      <BLEconnection />
      {/* You can use the 'id' to fetch device data or render specific content */}
    </View>
  );
}
