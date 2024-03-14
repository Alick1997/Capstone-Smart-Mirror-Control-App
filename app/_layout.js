import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navBar";
import { MirrorConnectionContext, defaultMirrorStateValue } from "../mirrorStateContext";
import { useState, useEffect } from "react";
import { manager, requestAllPermissionsForBle } from "../utils/bleManager";
import { State } from "react-native-ble-plx";
import * as Location from 'expo-location';
import * as Calendar from 'expo-calendar';

export async function getUserCalendarEvents() {
    try {
        const { status } = await Calendar.requestCalendarPermissionsAsync()
        const remindersStat = await Calendar.requestRemindersPermissionsAsync()
        if(status !== 'granted' || remindersStat.status !== 'granted') {
            alert('Permission to calendar was denied')
            return
        }
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
        const calendarIds = calendars.map(cal => cal.id)
        const now = new Date()
        const tm = new Date(now)
        tm.setDate(now.getDate() + 1)
        return await Calendar.getEventsAsync(calendarIds, now,tm )
    } catch(e) {
        console.log(e)
        alert('Error retreiving calendar events')
    }
}

export default function MainLayout() {

    const [mirrorState, setMirrorState] = useState(defaultMirrorStateValue)

    async function updateMirrorConnectionState(device) {

        if(!device) {
            setMirrorState({
                ...mirrorState,
                connected: false,
                device: null,
                isMirrorOn: false,
                location: undefined,
                events: []
            })
            return
        }
        const location = await getUserLocation()
        const events = await getUserCalendarEvents()
        setMirrorState({
            ...mirrorState,
            connected: true,
            device,
            lastConnected: new Date(),
            isMirrorOn: false,
            location: location.coords,
            events
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