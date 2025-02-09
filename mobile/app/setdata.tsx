import { PermissionsAndroid, Platform, Text, TextInput, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useEffect, useState } from 'react';
import { manager } from '@/hooks/manager';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import { useAuth0 } from 'react-native-auth0';
import Entypo from '@expo/vector-icons/Entypo';

async function saveDataToEsp(dayHidden: string, hiderName: string) {
  const devices = await manager.connectedDevices(["4fafc201-1fb5-459e-8fcc-c5c9c331914b"])
  
  if(devices.length === 0) {
    console.error("no device found")
    return;
  } else {
    const device = devices[0];

    // Day hidden (to day)
    device.writeCharacteristicWithoutResponseForService(
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        '489954f8-92c2-4449-b3d7-6ac3e41bcce8',
        atob(dayHidden)
    )
    
    // Hider name
    device.writeCharacteristicWithoutResponseForService(
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        '489954f8-92c2-4449-b3d7-6ac3e41bcce8',
        atob(hiderName)
    )
  }
}

function setdata(props: {}) {
  const {user} = useAuth0();
  const [textClue, onTextClueChange] = useState("");

  const submitFn = () => {
    saveDataToEsp((new Date()).toLocaleDateString(), user?.name!)
  }

  requestBluetoothPermission();
  return (
    <>
      <ThemedText>
        It's time to leave your mark help this band continue thier tour around the country
        by hidding them somewhere cool.
      </ThemedText>
      <View className='m-8 items-center justify-center align-center bg-white'>
      <TextInput className='m-4 text-xl bg-gray-100 rounded-full p-4'
        style={{ padding: 16 }}
        value={user?.name}
        editable={false}
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
      <Entypo.Button
        onPress={submitFn}
        backgroundColor="#fff"
        color={'#000'}
        accessibilityLabel="Submit"
        size={24}
        name="check"
      />
    </>
  );
}

export default setdata;