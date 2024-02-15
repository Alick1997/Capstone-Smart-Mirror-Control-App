import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navBar";
import { MirrorConnectionContext, defaultMirrorStateValue } from "../mirrorStateContext";
import { useState, useEffect } from "react";
import { manager, requestAllPermissionsForBle } from "../utils/bleManager";
import { State } from "react-native-ble-plx";

export default function MainLayout() {

    const [mirrorState, setMirrorState] = useState(defaultMirrorStateValue)

    function updateMirrorConnectionState(device) {
        setMirrorState({
            ...mirrorState,
            connected: true,
            device,
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

    async function initBle() {
        try{
            if(!await requestAllPermissionsForBle()) {
                return alert("Please turn on bluetooth.")
            }
            await manager.enable()
            if((await manager.state()) != State.PoweredOn) {
                alert("Bluetooth is off")
            }

        } catch(e) {

        }
    }

    useEffect(()=>{
        initBle()
    },[])

    return (
        <SafeAreaView className = "flex-1 flex-col items-center" edges={['top', 'left', 'right']}>
            <MirrorConnectionContext.Provider value={{state: mirrorState, setMirrorConnection: updateMirrorConnectionState, setMirrorPower: updateMirrorPowerState}}>
                <NavBar />
                <Slot />
            </MirrorConnectionContext.Provider>
        </SafeAreaView>
    )
}