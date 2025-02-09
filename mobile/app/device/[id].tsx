import { BLEconnection } from '@/components/BLEconnection';
import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
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
            authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyNzU3OTBkYi1hOWE1LTRiMzMtYjUxYS1lM2M2NjBjYmQzZjYiLCJlbWFpbCI6InR5dG9yYkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmEzZTRiYWUwZjEzZTE3NWRiYWIiLCJzY29wZWRLZXlTZWNyZXQiOiI0ZWM3NTE0ZjU2MTk5Nzk1MmM3ZDQxNGNjYjFhMTk1MTQwNmNhMzBiZDZhODQwYzlkYzUyZDVjNTM1YmRhMzM5IiwiZXhwIjoxNzcwNTMyNDY2fQ.-n7DEPRkfOB5EtQ5eLjwjzPdrqE2HwTe7-EgqhDLaMU',
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
    console.error(user, 'here');
  }, [user]);

  // Render the component based on the 'id'
  return (
    <ScrollView>
      <Link href={'./add-info/' + id}>
        <Text className="text-2xl font-medium color-blue-600">
          Add more info
        </Text>
      </Link>
      <Stack.Screen options={{ headerBackTitle: 'Explore' }} />
      <Text>Device ID: {user?.name}</Text>
      <BLEconnection />
      {/* You can use the 'id' to fetch device data or render specific content */}
    </ScrollView>
  );
}
