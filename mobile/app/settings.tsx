import { View, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function Profile() {
  return (
    <SafeAreaView>
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