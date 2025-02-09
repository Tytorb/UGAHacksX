import { BLEconnection } from '@/components/BLEconnection';
import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, ScrollView } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

export default function DevicePage() {
  // Access the dynamic route parameter 'id'
  const { user } = useAuth0();
  const { id } = useLocalSearchParams(); // 'id' corresponds to the dynamic part of the URL
  const [data, setData] = useState<any>([]);

  const getMovies = async () => {
    try {
      const response = await fetch(
        'https://pink-petite-leech-526.mypinata.cloud/ipfs/bafkreiekl5e2zykhlkuuplczyf4r67uq7ddkrap6c4gttajl2zbrfrvx7m',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: `Bearer ${process.env.JWT}`,
          },
        }
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    console.error(data, 'here');
  }, [data]);

  // Render the component based on the 'id'
  return (
    <ScrollView>
      <Link href={'./add-info/' + id}>
        <Text className="text-2xl font-medium color-blue-600">
          Add more info
        </Text>
      </Link>
      <Stack.Screen options={{ headerBackTitle: 'Explore' }} />
      <Text>Device ID: {id}</Text>
      <BLEconnection />
      {/* You can use the 'id' to fetch device data or render specific content */}
    </ScrollView>
  );
}
