import { Device } from "react-native-ble-plx";

export type MirrorState = {
    connected: boolean;
    lastConnected: Date;
    isMirrorOn: boolean;
    device?: Device;
}

export type MirrorContextType = {
    state: MirrorState;
    setMirrorConnection: (device: Device) => void;
    setMirrorPower: (power: boolean) => void
}