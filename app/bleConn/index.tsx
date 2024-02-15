import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { manager } from "../../utils/bleManager";
import { MirrorConnectionContext } from "../../mirrorStateContext";
import { scanAvailableMirrors, attemptConnectToMirror } from "../../utils/bleManager";
import {LinearGradient} from 'expo-linear-gradient'
import colors from 'tailwindcss/colors'
import { Device } from "react-native-ble-plx";
import ConnectedDevice from "../../components/connectedDevice";
import Button from "../../components/Button";
import { router } from "expo-router";

export default function BleConn(): React.ReactElement {

    const { state, setMirrorConnection } = useContext(MirrorConnectionContext)
    const [deviceOptions, setDeviceOptions] = useState<Device[]>([])
    const [fetcherState, setFetcherState] = useState<"idle" | "scanning" | "connecting">(state.device ? 'idle' : 'scanning')
    const [deviceConn, setDeviceConn] = useState<Device | null>(null)

    async function connectToDevice(device: Device) {
        try{
            setFetcherState("connecting")
            setDeviceConn(device)
            await attemptConnectToMirror(device.id)
            setMirrorConnection(device)
            manager.stopDeviceScan()
            router.replace('/')
        } catch(e) {
            alert(e)
            setDeviceConn(null)
        } finally {
            setFetcherState("idle")
        }
    }

    function setStateWithTimeout(newState: Device[]) {
        setTimeout(()=>{
            setDeviceOptions(newState)
        },500)
    }

    function scanDevices() {
        scanAvailableMirrors( async (dev)=> {
            setDeviceOptions(prevOptions => {
                if(prevOptions.some(device=> device.id === dev.id)) {
                    return prevOptions
                }
                return[...prevOptions, dev]
            })
        }, e => {
            alert(e)
            manager.stopDeviceScan()
            setFetcherState("idle")
        })
    }

    useEffect(()=>{
        if(!state.device) {
            scanDevices()
        }
    },[])

    function renderItems({item}: {item: Device}) {

        return (
            <TouchableOpacity className="rounded bg-blue-600 p-4 w-full my-2" onPress = {()=> connectToDevice(item)}>
                <Text className="text-xl text-white">{item.name ?? item.localName}</Text>
            </TouchableOpacity>
        )
    }
    
    return(
        <LinearGradient colors={[colors.white, colors.blue[300]]} style = {styles.containerStyle}>
            <Text className="text-black text-3xl font-bold">Connect To Your Mirror</Text>
            { state.device ?
                <ConnectedDevice device={state.device} /> :
                fetcherState === "connecting" ? 
                <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator />
                    <Text className="text-2xl">Connecting to {deviceConn?.name || deviceConn?.localName}</Text>
                </View> :
                fetcherState === 'idle' ?
                <Button onPress = {scanDevices}>
                    <Text className="text-white">Start Scanning</Text>
                </Button> :
                fetcherState === "scanning" ?
                <View style = {{flex:1, alignItems:'center'}}>
                    <View>
                        <ActivityIndicator />
                        <Text>Scanning for devices...</Text>
                    </View>
                    <FlatList 
                    style = {{flex:1}}
                    data = {deviceOptions}
                    renderItem={renderItems}
                    />
                </View> : null
            }
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    columnStyle: {marginHorizontal:2, marginVertical:7, alignContent:'center'},
    halfThumbnailStyle: {width:'47%', marginHorizontal:2},
    fullThumbnailStyle: {width:'100%'},
    containerStyle: {flex:1, flexDirection:'column', alignItems:'center', alignContent:'center', width:'100%', paddingBottom:20}
})