import { View, Text } from "react-native"
import { Device } from "react-native-ble-plx"
import { useState } from "react";
import Button from "./Button";
import { manager } from "../utils/bleManager";

type Props = {
    device: Device;
    className?: string;
}

const ConnectedDevice: React.FC<Props> = ({device, className}) => {

    const [state, setState] = useState<"pending" | "idle">("idle")

    async function disconnect() {
        try{
            setState("pending")
            await manager.cancelDeviceConnection(device.id)
        } catch(e) {
            alert("Error disconnecting from device")
        } finally {
            setState("idle")
        }
    }

    return(
        <View className={"bg-blue-700 p-4 flex items-center mb-2 mx-2 w-full " + className}>
            <Text className="text-white font-bold text-2xl">Connected</Text>
            <Text className="text-white text-2xl">{device?.name ?? device?.localName}</Text>
            <Button onPress = {disconnect} loading = {state === "pending"} className="bg-red-500 rounded w-full items-center text-white p-4">
                <Text className="text-white">Disconnect</Text>
            </Button>
        </View>
    )
}

export default ConnectedDevice