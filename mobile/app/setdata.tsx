import { PermissionsAndroid, Platform, TextInput, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useEffect, useState } from 'react';
import { manager } from '@/hooks/manager';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import { useAuth0 } from 'react-native-auth0';

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
      </View>
      <View>
        Date Hidden:{' '}
        {new Date().toLocaleDateString('en-US', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        })}
      </View>
    </>
  );
}

export default setdata;