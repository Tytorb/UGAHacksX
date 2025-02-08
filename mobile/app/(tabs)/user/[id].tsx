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
        <ScrollView>
            <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ThemedText type="title"> </ThemedText>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Feather.Button
                onPress={() => router.push("settings")}
                backgroundColor="#fff"
                color={"#000"}
                accessibilityLabel="Open settings"
                size={24}
                name="edit"
            />
              <Feather.Button
                onPress={() => router.push("settings")}
                backgroundColor="#fff"
                color={"#000"}
                accessibilityLabel="Open settings"
                size={24}
                name="settings"
            />
            </View>
            </ThemedView>

            <ThemedView style={{flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>

            <Feather.Button
                onPress={() => router.push("doesntexist")}
                backgroundColor="#fff"
                color={"#000"}
                accessibilityLabel="Open settings"
                size={64}
                name="user"
            />
                <ThemedView>
                <ThemedText type="title">John Doe</ThemedText>
                </ThemedView>
            </ThemedView>
        </ScrollView>

    
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