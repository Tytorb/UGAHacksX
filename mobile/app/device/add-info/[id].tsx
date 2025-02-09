import { StyleSheet, Image, Platform, View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import { Stack, useLocalSearchParams } from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function Saves() {
    const { id } = useLocalSearchParams();

    return (
      <ScrollView className='p-8'>
        <View className='bg-yellow-400 h-64 mb-2 rounded-2xl'>
            <Text>photo carousel</Text>
        </View>
              <Link href={'../' + id}><Text className='text-2xl font-medium color-blue-600'>get information from this device</Text></Link>
        
        <Text>add-info page. ID: {id}</Text>
      </ScrollView>
    );
  }
