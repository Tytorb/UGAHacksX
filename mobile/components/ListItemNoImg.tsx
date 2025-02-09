import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router, Router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

const ListItem = ({ title, subheading, hint }) => {
  return (
    <View className='flex-col gap-0 mb-8'>
          <View className='justify-left flex-row gap-4 content-center'>
          <View className='justify-left flex-col'>
            <Text className="text-black text-lg font-medium">{title}</Text>
            <Text className="text-gray-500 text-lg">{subheading}</Text>
            <Text className="text-gray-500 text-lg">{hint}</Text>
          </View>
          </View>
    </View>
  );
};

export default ListItem;