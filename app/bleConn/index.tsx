import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import { manager } from "../../utils/bleManager";
import { MirrorConnectionContext } from "../../mirrorStateContext";
import { MIRROR_AUTH_SERVICE_ID, MIRROR_DATA_SERVICE_ID, scanAvailableMirrors } from "../../utils/bleManager";
import {LinearGradient} from 'expo-linear-gradient'
import colors from 'tailwindcss/colors'
import { Device } from "react-native-ble-plx";
//import { FlashList } from '@shopify/flash-list'

export default function BleConn(): React.ReactElement {

    const { state, setMirrorConnection } = useContext(MirrorConnectionContext)
    const connected = manager.connectedDevices([MIRROR_AUTH_SERVICE_ID, MIRROR_DATA_SERVICE_ID])
    const [deviceOptions, setDeviceOptions] = useState<Device[]>([])
    const [fetcherState, setFetcherState] = useState<"idle" | "scanning">("idle")

    async function connectToDevice(device: Device) {
        try{
            await connectToDevice(device)
            setMirrorConnection(device)
        } catch(e) {
            alert(e)
        }
    }
    useEffect(()=>{
        scanAvailableMirrors((dev)=> {
            setDeviceOptions([...deviceOptions, dev])
        }, e => alert(e))
    },[])

    function renderItems({item}: {item: Device}) {

        return (
            <Pressable className="rounded bg-blue-600 p-2 w-full" onPress = {()=> connectToDevice(item)}>
                <Text>{item.name}</Text>
            </Pressable>
        )
    }
    
    return(
        <LinearGradient colors={[colors.white, colors.blue[300]]} style = {styles.containerStyle}>
            <Text className="text-black text-3xl font-bold">Connect To Your Mirror</Text>
            <FlatList 
            data = {deviceOptions}
            renderItem={renderItems}
            />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    columnStyle: {marginHorizontal:2, marginVertical:7, alignContent:'center'},
    halfThumbnailStyle: {width:'47%', marginHorizontal:2},
    fullThumbnailStyle: {width:'100%'},
    containerStyle: {flex:1, flexDirection:'column', alignItems:'center', alignContent:'center', width:'100%'}
})