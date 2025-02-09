import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useEffect, useRef, useState } from 'react';
import { manager } from '@/hooks/manager';
import { BleError, Characteristic, Device } from 'react-native-ble-plx';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import Entypo from '@expo/vector-icons/Entypo';
import { Link, router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

function scanAndConnect(message: (arg0: any) => void, scanD: () => void) {
  message('searcing for device');

  manager.startDeviceScan(null, null, async (error, device) => {
    scanD();
    if (error || !device) {
      // Handle error (scanning will be stopped automatically)
      return;
    }

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    if (device.name?.startsWith("Rock'nRiddles")) {
      // Stop scanning as it's not necessary if you are scanning for one device.
      manager.stopDeviceScan();
      message('Device Found');

      // Proceed with connection.

      const connectedDevice = await device.connect();

      const deviceServicesAndChar =
        await connectedDevice.discoverAllServicesAndCharacteristics();
      message(JSON.stringify(deviceServicesAndChar));

      const lastHider =
        await deviceServicesAndChar.readCharacteristicForService(
          '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
          'beb5483e-36e1-4688-b7f5-ea07361b26a8'
        );
      message('Last Hider: ' + atob(lastHider.value!));

      const lastDayHidden =
        await deviceServicesAndChar.readCharacteristicForService(
          '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
          '489954f8-92c2-4449-b3d7-6ac3e41bcce8'
        );
      message('Last Hidden: ' + atob(lastDayHidden.value!));

      await deviceServicesAndChar.monitorCharacteristicForService(
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        'f78ebbff-c8b7-4107-93de-889a6a06d408',
        (error: BleError | null, characteristic: Characteristic | null) => {
          if (error !== null || characteristic === null) {
            return;
          }
          const data = atob(characteristic.value!).split(' ');
          let date: Date = new Date(0);
          date.setUTCSeconds(parseInt(data[0]));
          message(
            'sensorData: ' +
              date.toLocaleTimeString() +
              ' ' +
              data[1] +
              'F ' +
              parseInt(data[2]) / 400 +
              '% brightness'
          );
        }
      );

      await deviceServicesAndChar.writeCharacteristicWithoutResponseForService(
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        '0a036069-5526-4023-9b1a-3f1bb713bf68',
        '24'
      );

      await deviceServicesAndChar.writeCharacteristicWithoutResponseForService(
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        '331f29ef-4396-4a63-a012-496def467096',
        btoa(Math.floor(Date.now() / 1000).toString())
      );
      message("Travler's interal clock was synced");
    }
  });
}

export function BLEconnection(props: {}) {
  const [scanCount, setScanCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [foundDevice, setFoundDevice] = useState(true);

  requestBluetoothPermission();

  const addMessage = async (message: any | null) => {
    if (message === null) return;
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    manager.stopDeviceScan();
    scanAndConnect(addMessage, () => setScanCount((prev) => prev + 1));
  }, [setScanCount]);

  return (
    <>
      <View className='flex-col h-full justify-between'>
        <View className='bg-white rounded-3xl gap-2'>
        <Text className='text-2xl font-medium'>
            Find the next Rock'n Riddle's band location!
        </Text>
        <Text className='text-lg font-regular color-gray-500'>
            This is a riddle, follow these steps.
        </Text>
        <Text className='text-lg font-regular color-gray-500'>
          Scanned {scanCount} devices
        </Text>

        <ScrollView className='h-20 bg-gray-100 rounded-xl pt-2 mb-4 font-italic'>
            {messages.map((message, key) => {
              return <Text key={key} style={styles.monospaceText}>{JSON.stringify(message)}</Text>;
            })}
        </ScrollView>


        <Pressable
          className={'flex-col gap-0 p-3 rounded-xl items-center justify-center bg-gray-100 mb-4'}
          onPress={() => router.push('/history')}
          accessibilityLabel="Open history page"
        >
          <View className="justify-left flex-row gap-4 content-center">
            <Feather
              size={28}
              name="map"
              className="self-center"
              color="black"
            />
            <Text
              className="text-black text-xl font-medium"
              style={{ lineHeight: 28 }}
            >
              Journey
            </Text>
          </View>
        </Pressable>


        <Pressable
          className={
            foundDevice
              ? 'flex-col gap-0 p-3 rounded-xl items-center justify-center bg-blue-600'
              : 'flex-col gap-0 p-3 rounded-xl items-center justify-center bg-blue-100'
          }
          onPress={() => router.push('/setdata')}
          accessibilityLabel="Create this Rock'n Riddle's Next Location"
          disabled={!foundDevice}
        >
          <View className="justify-left flex-row gap-4 content-center">
            <Feather
              size={28}
              name="edit"
              className="self-center"
              color="white"
            />
            <Text
              className="text-white text-xl font-medium"
              style={{ lineHeight: 28 }}
            >
              Record
            </Text>
          </View>
        </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  monospaceText: {
    fontFamily: 'monospace', // Use the monospace font family
  },
});