import { PermissionsAndroid, Platform, TextInput, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useEffect, useState } from 'react';
import { manager } from '@/hooks/manager';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import React from 'react';

function scanAndConnect(setScan: (arg0: string) => void) {
  setScan('started scan');
}

function setdata(props: {}) {
  const [scanState, setScanState] = useState('scan not started');
  const [textName, onChangeTextName] = React.useState('');

  requestBluetoothPermission();

  useEffect(() => {
    scanAndConnect((str) => setScanState(str));
  }, [setScanState]);
  return (
    <>
      <ThemedText>
        It's time to leave your mark Help this MateOnTour! continue his journey
        by hidding him somewhere cool.
      </ThemedText>
      <View className='m-8 items-center justify-center align-center bg-white'>
      <ThemedText>{scanState}</ThemedText>
      <TextInput className='m-4 text-xl bg-gray-100 rounded-full p-4'
        style={{ padding: 16 }}
        onChangeText={onChangeTextName}
        value={textName}
        placeholder="Your Name"
      />
      <TextInput className='m-4 text-xl bg-gray-100 rounded-full p-4'
        style={{ padding: 16 }}
        onChangeText={onChangeTextName}
        value={textName}
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