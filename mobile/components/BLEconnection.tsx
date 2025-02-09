import { Text, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useEffect, useRef, useState } from 'react';
import { manager } from '@/hooks/manager';
import { BleError, Characteristic, Device } from 'react-native-ble-plx';
import { requestBluetoothPermission } from '@/hooks/requestPerms';
import Entypo from '@expo/vector-icons/Entypo';
import { Link, router } from 'expo-router';

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

      const moniter =
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
      <ThemedText>Connect to the Rock'n Riddles band on tour</ThemedText>
      <ThemedText>Scanned {scanCount} devices</ThemedText>
      <View>
        {messages.map((message, key) => {
          return <Text key={key}>{JSON.stringify(message)}</Text>;
        })}
      </View>
      <Entypo.Button
        onPress={() => router.push('/setdata')}
        backgroundColor="#fff"
        color={'#000'}
        accessibilityLabel="Create this Rock'n Riddle's Next Location"
        size={24}
        name="edit"
      />
    </>
  );
}
