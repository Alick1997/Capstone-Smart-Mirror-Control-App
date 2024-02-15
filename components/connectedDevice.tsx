import { View, Text } from "react-native"
import { Device } from "react-native-ble-plx"
import { useState } from "react";
import Button from "./Button";

type Props = {
    device: Device;
    className?: string;
}

const ConnectedDevice: React.FC<Props> = ({device, className}) => {

    const [state, setState] = useState<"pending" | "idle">("idle")

    async function disconnect() {
        try{
            setState("pending")
            await device.cancelConnection()
        } catch(e) {
            alert("Error disconnecting from device" + e)
        } finally {
            setState("idle")
        }
    }

    return(
        <View className={"w-full bg-blue-700 p-2 flex items-center " + className}>
            <Text>{device.name}</Text>
            <Button onPress = {disconnect} loading = {state === "pending"} className="bg-red rounded w-full items-center text-white p-4">
                <Text>Disconnect</Text>
            </Button>
        </View>
    )
}

export default ConnectedDevice