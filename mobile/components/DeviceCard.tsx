// filepath: /c:/Users/owenl/projects/UGAHacksX/mobile/components/DeviceCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router, Router } from 'expo-router';

const DeviceCard = ({ name, clue, area, hider, goal, origin, id }) => {
  return (
    <Pressable className='flex-col gap-0 mb-4' onPress={() => router.push(`device/${id}`, { id: id })}>
        <View className='bg-green-300 h-56 mb-2 rounded-2xl'><Text>photo</Text></View>
        <View className='flex-row justify-between'>
      <Text className='text-lg font-medium'>{name}</Text>
        </View>
      <Text className='text-lg text-gray-500'>{clue}</Text>
      <View className='flex-row justify-between'>
        <View className='flex-row'>
            <Text className='text-lg text-gray-500'>Hidden by {hider} near {area}</Text>
        </View>
      </View>
      <View className='flex-row gap-4'>
            <Text className='text-lg text-black'>{origin}</Text>
            <Text className='text-lg text-black font-extrabold'>➝</Text>
            <Text className='text-lg text-black text-left'>{goal}</Text>
        </View>
        {/*<Text className='text-lg text-red-600 text-left'>{id}</Text>*/}
    </Pressable>
  );
};

export default DeviceCard;