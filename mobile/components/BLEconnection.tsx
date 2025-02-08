import BLEManager from "react-native-ble-manager";
import { ThemedText } from "./ThemedText";

export function BLEconnection(props: {}) {
    BLEManager.start({ showAlert: false }).then(() => {
    // Success code
    console.log("Module initialized");
    });
  return (
    <>
    <ThemedText>Connect to the found travelers</ThemedText>
    </>
);
}

