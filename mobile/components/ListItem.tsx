import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router, Router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

const ListItem = ({ icon, title, subheading, goto }) => {
  return (
    <Pressable className='flex-col gap-0 mb-8' onPress={() => router.push(`goto`, { id: goto })}>
          <View className='justify-left flex-row gap-4 content-center'>
          <Feather size={32} name={icon} className="color-black self-center" />
          <View className='justify-left flex-col'>
            <Text className="text-black text-lg font-medium">{title}</Text>
            <Text className="text-gray-500 text-lg">{subheading}</Text>
          </View>
          </View>
    </Pressable>
  );
};

export default ListItem;