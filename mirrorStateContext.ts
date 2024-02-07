import { createContext } from "react";
import { MirrorContextType, MirrorState } from "./types";

export const defaultMirrorStateValue: MirrorState = {
    connected: false,
    lastConnected: new Date(),
    isMirrorOn: false
}

export const MirrorConnectionContext = createContext<MirrorContextType>({
    state: defaultMirrorStateValue,
    setMirrorConnection: (connected) => {},
    setMirrorPower: (power) => {}
})