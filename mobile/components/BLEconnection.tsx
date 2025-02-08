import BLEManager from "react-native-ble-manager";

export function BLEconnection(props: {}) {
    BLEManager.start({ showAlert: false }).then(() => {
    // Success code
    console.log("Module initialized");
    });
  return (
    <>
    <text>Connect to the found travelers</text>
    </>
);
}

