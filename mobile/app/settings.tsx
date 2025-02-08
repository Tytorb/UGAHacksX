import { View, StyleSheet, ScrollView, Button, Alert, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlashList } from "@shopify/flash-list";
import { Stack } from 'expo-router';

const DATA = [
  {
    title: "First Item",
  },
  {
    title: "Second Item",
  },
];

export default function Profile() {
  return (
    <SafeAreaView>
            <Stack.Screen options={{ headerBackTitle: 'Profile' }} />
            <ThemedView>
              <ThemedText type="title">Settings</ThemedText>
            </ThemedView>
            
            <ThemedView>
              <ThemedText type="title">About</ThemedText>
            </ThemedView>
            <Button
                onPress={() => Alert.alert('Button with adjusted color pressed')}
                title="Learn More"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />

      <View style={{ height: 200, width: Dimensions.get("screen").width }}>
          <FlashList
            data={DATA}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            estimatedItemSize={200}
          />
      </View>
    </SafeAreaView>      
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});

const MyList = () => {
  return (
    <FlashList
      data={DATA}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      estimatedItemSize={200}
    />
  );
};
