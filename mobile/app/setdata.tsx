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
    <View className='bg-white p-8 h-full'>
      <ThemedText>
        It's time to leave your mark help this band continue their tour around the country
        by hiding them somewhere cool.
      </ThemedText>
      <View className='m-8 items-center justify-center align-center bg-white'>
      <TextInput className='m-4 text-xl bg-gray-100 rounded-full p-4'
        style={{ padding: 16 }}
        value={textName}
        onChangeText={(e) => onTextNameChange(e)} // Update state on text change
        editable={true}
      />
      <TextInput className='m-4 text-xl bg-gray-100 rounded-full p-4'
        style={{ padding: 16 }}
        onChangeText={(e) => onTextClueChange(e)}
        value={textClue}
        placeholder="Your clue"
      />
      <View className='m-8 text-l bg-gray-100 rounder-full p-4'>
        <Text>Date Hidden:{(new Date()).toLocaleDateString()}</Text>
      </View>
      </View>
      <Pressable className='flex-col gap-0 p-3 rounded-full items-center justify-center bg-blue-600' onPress={submitFn} accessibilityLabel="Submit data">
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