import { PermissionsAndroid, Platform, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useEffect, useState } from 'react';
import { manager } from '@/hooks/manager';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import React from 'react';

function scanAndConnect(setScan: (arg0: string) => void) {
  setScan('started scan');
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      // Handle error (scanning will be stopped automatically)
      return;
    }

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    if (device?.name?.startsWith('MateOnTour')) {
      // Stop scanning as it's not necessary if you are scanning for one device.
      manager.stopDeviceScan();
      // Proceed with connection.
      setScan(JSON.stringify(device));
    }
  });
}

export function BLEconnection(props: {}) {
  const [scanState, setScanState] = useState('scan not started');
  const [textName, onChangeTextName] = React.useState('');

  requestBluetoothPermission();

  scanAndConnect((str) => setScanState(str));
  return (
    <>
      <ThemedText>
        It's time to leave your mark Help this MateOnTour continue his journey
        by hidding him somewhere cool
      </ThemedText>
      <ThemedText>{scanState}</ThemedText>
      <TextInput
        onChangeText={onChangeTextName}
        value={textName}
        placeholder="Your Name"
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
