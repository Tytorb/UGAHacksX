import { View, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";


export default function Profile() {

  const router = useRouter();
  return (
    <SafeAreaView>
            <ThemedView>
              <ThemedText type="title">User/[ID] Page</ThemedText>
            </ThemedView>
            
            <ThemedView>
              <ThemedText type="title">My Devices</ThemedText>
            </ThemedView>
            <Button
                onPress={() => router.push("settings")}
                title="Settings"
                color="#841584"
                accessibilityLabel="Open settings"
              />

    
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