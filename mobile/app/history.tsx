import {
    View,
    StyleSheet,
    ScrollView,
    Button,
    Alert,
    Text,
    Dimensions,
    Pressable,
  } from 'react-native';
  import { Image } from 'expo-image';
  import { ThemedText } from '@/components/ThemedText';
  import { ThemedView } from '@/components/ThemedView';
  import { SafeAreaView } from 'react-native-safe-area-context';
  
  import { FlashList } from '@shopify/flash-list';
  import { Stack, Slot, useRouter } from 'expo-router';
  
  import { Auth0Provider, useAuth0 } from 'react-native-auth0';
  
  import Feather from '@expo/vector-icons/Feather';
  
  // Import your global CSS file
  import "../global.css";
  import ListItemNoImg from '@/components/ListItemNoImg';
import DeviceCard from '@/components/DeviceCard';
  


const HISTDATA = [
    {
      title: 'Name',
      subheading: 'Date',
      hint: 'Hint',
    },
]


  export default function History() {
    const { clearSession } = useAuth0();
  
    const onLogout = async () => {
      try {
        await clearSession();
        Alert.alert('Logged out', 'You have been logged out successfully.');
      } catch (e) {
        console.log('Log out cancelled', e);
        Alert.alert('Error', 'Log out cancelled.');
      }
    };
  
  
    return (
      <Auth0Provider
      domain="YOUR_AUTH0_DOMAIN"
      clientId="YOUR_AUTH0_CLIENT_ID"
    >
      <SafeAreaView className='bg-white h-full'>
        <ScrollView className='flex-col p-8 pt-0'>
          <HistList />
        </ScrollView>
      </SafeAreaView>
      </Auth0Provider>
    );
  }



const HistList = () => {
const router = useRouter();
return (
    <FlashList
    className="mt-4"
    data={HISTDATA}
    renderItem={({ item }) => {
        return (
        <View className="mb-4">
            <ListItemNoImg
            title={item.title}
            subheading={item.subheading}
            hint={item.hint}

        />
        </View>
        );
    }}
    estimatedItemSize={200}
    />
);
};
