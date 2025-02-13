import {
  Image,
  StyleSheet,
  Platform,
  Button,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';

import DeviceCard from '../../components/DeviceCard'; // Import the DeviceCard component

import { Auth0Provider, useAuth0 } from 'react-native-auth0';

import '../../global.css';

const MATEDATA = [
  {
    name: 'saved 1',
    hider: 'Owen',
    area: 'Athens, GA',
    origin: 'New York City, NY',
    goal: 'San Jose, CA',
    clue: 'At the coolest event in athens, by a table with a sign...',
    id: '0000001',
    imgsrc: require('@/assets/images/rocker4.png'),
  },
  {
    name: 'saved 2',
    hider: 'Theo',
    area: 'Athens, GA',
    origin: 'New York City, NY',
    goal: 'San Jose, CA',
    clue: 'Look under a rock by the river...',
    id: '0000002',
    imgsrc: require('@/assets/images/rocker3.png'),
  },
  {
    name: 'My Name (item 3)',
    hider: 'Theo',
    area: 'Ontario, CA',
    origin: 'Omaha, NE',
    goal: 'Panama City, FL',
    clue: 'Look under a rock by the river...',
    id: '0000003',
    imgsrc: require('@/assets/images/rocker2.png'),
  },
  {
    name: 'My Name (item 4)',
    hider: 'Theo',
    area: 'Athens, GA',
    origin: 'New York City, NY',
    goal: 'San Jose, CA',
    clue: 'Look under a rock by the river...',
    id: '0000004',
    imgsrc: require('@/assets/images/rocker1.png'),
  },
];

export default function HomeScreen() {
  const { authorize, clearSession, user, error, isLoading } = useAuth0();

  const onLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  // if (isLoading) {
  //   return (
  //     <View>
  //       <Text>Loading</Text>
  //     </View>
  //   );
  // }

  const loggedIn = user !== undefined && user !== null;

  return !loggedIn ? (
    <View style={styles.container}>
      {!loggedIn && <Text>You are not logged in</Text>}
      {error && <Text>{error.message}</Text>}

      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
  ) : (
    <SafeAreaView className="bg-white">
      <ScrollView className="p-8">
        <View>
          <Text className="text-black text-5xl font-medium">Saves</Text>
        </View>

        <View className="w-full h-full">
          <MyList />
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MyList = () => {
  const router = useRouter();
  return (
    <FlashList
      className="mt-4"
      data={MATEDATA}
      renderItem={({ item }) => {
        return (
          <View className="mb-4">
            <DeviceCard
              name={item.name}
              clue={item.clue}
              hider={item.hider}
              origin={item.origin}
              area={item.area}
              goal={item.goal}
              id={item.id}
              imgsrc={item.imgsrc}
            />
          </View>
        );
      }}
      estimatedItemSize={200}
    />
  );
};
