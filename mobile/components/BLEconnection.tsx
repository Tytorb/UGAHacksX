import BleManager from "react-native-ble-manager";
import { ThemedText } from "./ThemedText";
import { useEffect, useState } from "react";

export function BLEconnection(props: {}) {
    const [scanState, setScanState] = useState("scan not started");


    BleManager.start({ showAlert: false }).then(() => {
        // Success code
        console.log("Module initialized");

        BleManager.scan(["4fafc201-1fb5-459e-8fcc-c5c9c331914b"], 20, true).then(
            () => {
                // Success code
                setScanState("scaning")
                console.log("Scan started");
            }
        );
    });
    
    useEffect(() => {
    const onDiscoverPeripheral = BleManager.onDiscoverPeripheral((args) => {
        setScanState(JSON.stringify(args));
    });

    return () => {
        onDiscoverPeripheral.remove();
    };
        
    }, []);
    
    return (
        <>
            <ThemedText>Connect to the found travelers</ThemedText>
            <ThemedText>{scanState}</ThemedText>
        </>
    );
}
