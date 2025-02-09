import { PermissionsAndroid, Platform } from "react-native";
import { ThemedText } from "./ThemedText";
import { useEffect, useState } from "react";
import { manager } from "@/hooks/manager";
import { requestBluetoothPermission } from "@/hooks/requestPerms";



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

