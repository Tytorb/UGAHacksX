import { PermissionsAndroid, Platform, TextInput, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useEffect, useState } from 'react';
import { manager } from '@/hooks/manager';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import React from 'react';
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
  const [textName, onChangeTextName] = React.useState(user?.nickname);

  requestBluetoothPermission();
  return (
    <>
      <ThemedText>
        It's time to leave your mark Help this MateOnTour continue his journey
        by hidding him somewhere cool
      </ThemedText>
      <TextInput
        onChangeText={onChangeTextName}
        value={textName}
      />
      <TextInput
        onChangeText={onChangeTextName}
        value={textName}
        placeholder="Your clue"
      />
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