import { PermissionsAndroid, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useEffect, useState } from 'react';
import { manager } from '@/hooks/manager';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import { useAuth0 } from 'react-native-auth0';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

async function saveDataToEsp(dayHidden: string, hiderName: string) {
  const devices = await manager.connectedDevices(['4fafc201-1fb5-459e-8fcc-c5c9c331914b'])

  if(devices.length === 0) {
    console.error("no device found")
    return;
  } else {
    const device = devices[0];
    
    // Day hidden (to day)
    await device.writeCharacteristicWithoutResponseForService(
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        '489954f8-92c2-4449-b3d7-6ac3e41bcce8',
        btoa(dayHidden).slice(0, 19)
    )
    
    // Hider name
    await device.writeCharacteristicWithoutResponseForService(
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        'beb5483e-36e1-4688-b7f5-ea07361b26a8',
        btoa(hiderName).slice(0, 19)
    )
  }
}

function setdata(props: {}) {
  const {user} = useAuth0();
  const [textClue, onTextClueChange] = useState("");
  const [textName, onTextNameChange] = useState(user?.name || ""); // Initialize with user name

  const submitFn = async () => {
    await saveDataToEsp((new Date()).toLocaleDateString(), textName);
    router.push("/")
  }

  requestBluetoothPermission();
  return (
    <View className='bg-white p-8 h-full pt-48'>
      <Text className='text-2xl font-medium'>
        Help this band make it by moving them one step closer to their destination! Remember to leave a clue.
      </Text>
      <View className='my-8 items-center justify-center align-center bg-white gap-4'>
      <TextInput className='flex-col p-3 rounded-xl items-center justify-center bg-gray-100 w-full'
        style={{ padding: 16 }}
        value={textName}
        onChangeText={(e) => onTextNameChange(e)} // Update state on text change
        editable={true}
      />
      <TextInput className='flex-col p-3 rounded-xl items-center justify-center bg-gray-100 w-full'
        style={{ padding: 16 }}
        onChangeText={(e) => onTextClueChange(e)}
        value={textClue}
        placeholder="Your clue"
      />
      <Text className='flex-col p-3 rounded-xl items-center justify-center bg-transparent'>Date Hidden:{(new Date()).toLocaleDateString()}</Text>
      </View>
      <Pressable className='flex-col p-3 rounded-xl items-center justify-center bg-blue-600' onPress={submitFn} accessibilityLabel="Submit data">
        <View className='justify-left flex-row gap-4 content-center'>
        <Feather size={28} name='send' className="self-center" color="white" />
        <Text className="text-white text-xl font-medium" style={{ lineHeight: 28 }}>Submit</Text>
        </View>
      </Pressable>

    <View/>
    </View>
  );
}

export default setdata;