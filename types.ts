export type MirrorState = {
    connected: boolean;
    lastConnected: Date;
    isMirrorOn: boolean;
}

export type MirrorContextType = {
    state: MirrorState;
    setMirrorConnection: (connected: boolean) => void;
    setMirrorPower: (power: boolean) => void
}