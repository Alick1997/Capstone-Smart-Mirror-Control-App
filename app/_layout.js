import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navBar";
import { MirrorConnectionContext, defaultMirrorStateValue } from "../mirrorStateContext";
import { useState, useEffect } from "react";
import { manager, requestAllPermissionsForBle } from "../utils/bleManager";
import { State } from "react-native-ble-plx";
import * as Location from 'expo-location';

export default function MainLayout() {

    const [mirrorState, setMirrorState] = useState(defaultMirrorStateValue)

    async function updateMirrorConnectionState(device) {

        if(!device) {
            setMirrorState({
                ...mirrorState,
                connected: false,
                device: null,
                isMirrorOn: false,
                location: undefined
            })
            return
        }
        const location = await getUserLocation()
        
        setMirrorState({
            ...mirrorState,
            connected: true,
            device,
            lastConnected: new Date(),
            isMirrorOn: false,
            location: location.coords
        })

    }

    function updateMirrorPowerState(isMirrorOn) {
        setMirrorState({
            ...mirrorState,
            isMirrorOn
        })
    }

    async function getUserLocation() {
        try{
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status)
            if (status !== 'granted') {
              alert('Permission to access location was denied');
              return;
            }
            return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        } catch(e) {
            alert('error getting Location')
        }
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
            console.log(e)
        }
    }

    useEffect(()=>{
        initBle()
    },[])

    useEffect(()=>{
        if(mirrorState.device) {
            const sub = manager.onDeviceDisconnected(mirrorState.device.id,
                (e, dev) => {
                    if(e) {
                        console.log(e)
                    }
                    updateMirrorConnectionState(null)
                })
            return () => {
                sub()
            }
        }
    },[mirrorState])

    return (
        <SafeAreaView className = "flex-1 flex-col items-center" edges={['top', 'left', 'right']}>
            <MirrorConnectionContext.Provider value={{state: mirrorState, setMirrorConnection: updateMirrorConnectionState, setMirrorPower: updateMirrorPowerState}}>
                <NavBar />
                <Slot />
            </MirrorConnectionContext.Provider>
        </SafeAreaView>
    )
}