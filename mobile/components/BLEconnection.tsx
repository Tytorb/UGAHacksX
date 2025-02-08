import { PermissionsAndroid, Platform, Text, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useEffect, useState } from "react";
import { manager } from "@/hooks/manager";
import { BleError, Characteristic } from "react-native-ble-plx";

const requestBluetoothPermission = async () => {
  if (Platform.OS === "ios") {
    return true;
  }
  if (
    Platform.OS === "android" &&
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  ) {
    const apiLevel = parseInt(Platform.Version.toString(), 10);

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    ) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        result["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
  }

  alert("Permission have not been granted");

  return false;
};

function scanAndConnect(
  setScan: (arg0: any) => void,
  scanD: () => void,
  measurementListner: (
    err: BleError | null,
    newMeasurement: Characteristic | null
  ) => void
) {
  setScan("searcing for device");

  manager.startDeviceScan(null, null, async (error, device) => {
    scanD();
    if (error || !device) {
      // Handle error (scanning will be stopped automatically)
      return;
    }

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    if (device.name?.startsWith("MateOnTour")) {
      // Stop scanning as it's not necessary if you are scanning for one device.
      manager.stopDeviceScan();
      setScan("Device Found");

      // Proceed with connection.

      const connectedDevice = await device.connect();

      const deviceServicesAndChar =
        await connectedDevice.discoverAllServicesAndCharacteristics();
      setScan("Device Found" + JSON.stringify(deviceServicesAndChar));

      deviceServicesAndChar.monitorCharacteristicForService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
        "f78ebbff-c8b7-4107-93de-889a6a06d408",
        measurementListner
      );

      deviceServicesAndChar.writeCharacteristicWithResponseForService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
        "0a036069-5526-4023-9b1a-3f1bb713bf68",
        "2"
      );

      //   setScan("Device Found" + JSON.stringify(chars));
    }
  });
}

export function BLEconnection(props: {}) {
  const [device, setDevice] = useState(null);
  const [scanCount, setScanCount] = useState(0);

  const [measurements, setMesurements] = useState<any[]>([]);

  requestBluetoothPermission();

  const addMeaserment = async (characteristic: Characteristic | null) => {
    if (characteristic === null) return;
    const d = characteristic.value;
    setMesurements((prev) => [...prev, d]);
  };

  useEffect(() => {
    manager.stopDeviceScan();
    scanAndConnect(
      (str) => setDevice(str),
      () => setScanCount((prev) => prev + 1),
      (error, characteristic) => addMeaserment(characteristic)
    );
  }, [setDevice, setScanCount]);

  return (
    <>
      <ThemedText>Connect to the found travelers</ThemedText>
      <ThemedText>Scanned {scanCount} devices</ThemedText>
      <ThemedText>{device}</ThemedText>
      <View>
        {measurements.map((measurement, key) => {
          return <Text key={key}>{JSON.stringify(measurement)}</Text>;
        })}
      </View>
    </>
  );
}
