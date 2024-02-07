import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navBar";
import { MirrorConnectionContext, defaultMirrorStateValue } from "../mirrorStateContext";
import { useState } from "react";

export default function MainLayout() {

    const [mirrorState, setMirrorState] = useState(defaultMirrorStateValue)

    function updateMirrorConnectionState(connected) {
        setMirrorState({
            ...mirrorState,
            connected: connected,
            lastConnected: new Date(),
            isMirrorOn: false
        })
    }

    function updateMirrorPowerState(isMirrorOn) {
        setMirrorState({
            ...mirrorState,
            isMirrorOn
        })
    }

    return (
        <SafeAreaView className = "flex-1 flex-col items-center" edges={['top', 'left', 'right']}>
            <MirrorConnectionContext.Provider value={{state: mirrorState, setMirrorConnection: updateMirrorConnectionState, setMirrorPower: updateMirrorPowerState}}>
                <NavBar />
                <Slot />
            </MirrorConnectionContext.Provider>
        </SafeAreaView>
    )
}