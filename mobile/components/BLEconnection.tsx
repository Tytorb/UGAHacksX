import { PermissionsAndroid, Platform } from "react-native";
import { ThemedText } from "./ThemedText";
import { useEffect, useState } from "react";
import { manager } from "@/hooks/manager";

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

function scanAndConnect(setScan: (arg0: string) => void) {
    setScan("started scan")
    manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return;
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device?.name?.startsWith("MateOnTour")) {
            // Stop scanning as it's not necessary if you are scanning for one device.
            manager.stopDeviceScan();
            // Proceed with connection.
            setScan(JSON.stringify(device));
        }
    });
}

export function BLEconnection(props: {}) {
    const [scanState, setScanState] = useState("scan not started");

  requestBluetoothPermission();

    scanAndConnect((str)=> setScanState(str));
    return (
        <>
            <ThemedText>Connect to the found travelers</ThemedText>
            <ThemedText>{scanState}</ThemedText>
        </>
    );
}
