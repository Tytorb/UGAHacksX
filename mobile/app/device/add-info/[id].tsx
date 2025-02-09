import { StyleSheet, Image, Platform, View, Text } from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function Saves() {
    const { id } = useLocalSearchParams();

    return (
      <View>
        <Text>add-info page. ID: {id}</Text>
      </View>
    );
  }
