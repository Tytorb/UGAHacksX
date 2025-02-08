import { View, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { IconSymbol } from '@/components/ui/IconSymbol';


export default function Profile() {

  const router = useRouter();
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <ParallaxScrollView style={{backgroundColor: "#fff", height: 100}}
              headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
              headerImage={
                <IconSymbol
                  size={310}
                  color="#808080"
                  name="chevron.left.forwardslash.chevron.right"
                  style={styles.headerImage}
                />
              }>
        >
            <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ThemedText type="title"> </ThemedText>
              <Feather.Button
                onPress={() => router.push("settings")}
                backgroundColor="#00000000"
                color={"#000"}
                accessibilityLabel="Open settings"
                size={24}
                name="settings"
            />
            </ThemedView>

            <ThemedView style={{flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>

            <Feather.Button
                onPress={() => router.push("doesntexist")}
                backgroundColor="#00000000"
                color={"#000"}
                accessibilityLabel="Open settings"
                size={64}
                name="user"
            />
                <ThemedView>
                <ThemedText type="title">John Doe</ThemedText>
                </ThemedView>
            </ThemedView>
        </ParallaxScrollView>

    
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
  headerImage: {
    width: '100%',
    height: 200,
  },
});