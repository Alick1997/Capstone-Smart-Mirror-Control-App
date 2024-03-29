import { Device } from "react-native-ble-plx";

export type MirrorState = {
    connected: boolean;
    lastConnected: Date;
    isMirrorOn: boolean;
    device?: Device;
    location?: LocationType;
}

export type MirrorContextType = {
    state: MirrorState;
    setMirrorConnection: (device: Device) => void;
    setMirrorPower: (power: boolean) => void
}

export type LocationType = {
        accuracy: number | null;
        altitude: number | null;
        latitude: number | null;
        longitude: number | null;
}