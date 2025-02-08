import { Image, StyleSheet, Platform, Button, Text, View, Dimensions, Pressable } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useRouter } from "expo-router";

const MATEDATA = [
  {
    title: "My Name (item 1)",
    hider: "User",
    id: "0000001"
  },
  {
    title: "My name (item 2)",
    hider: "User that hid me",
    id: "0000002"
  },
];


export default function HomeScreen() {
  
  return (
    <SafeAreaView>
            <ThemedView>
              <ThemedText type="title">Index</ThemedText>
            </ThemedView>
=
      <View style={{ height: 200, width: Dimensions.get("screen").width }}>
          <MyList          />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

const MyList = () => {
  const router = useRouter();
  return (
    <FlashList
      data={MATEDATA}
      renderItem={({ item }) =>{return (<Pressable onPress={() => router.push(`device/${item.id}`, { id: item.id })}>
          <ThemedText type="subtitle">{item.title}</ThemedText>
          <Text>{item.hider}</Text>
          </Pressable>)}}
      estimatedItemSize={200}
    />
  );
};
