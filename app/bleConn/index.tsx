import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import { manager } from "../../utils/bleManager";
import { MirrorConnectionContext } from "../../mirrorStateContext";
import { scanAvailableMirrors } from "../../utils/bleManager";
import {LinearGradient} from 'expo-linear-gradient'
import colors from 'tailwindcss/colors'
import { Device } from "react-native-ble-plx";
import ConnectedDevice from "../../components/connectedDevice";
import AnimatedSpinner from "../../components/animatedSpinner";
import Button from "../../components/Button";
import { router } from "expo-router";

export default function BleConn(): React.ReactElement {

    const { state, setMirrorConnection } = useContext(MirrorConnectionContext)
    const [deviceOptions, setDeviceOptions] = useState<Device[]>([])
    const [fetcherState, setFetcherState] = useState<"idle" | "scanning">("scanning")

    async function connectToDevice(device: Device) {
        try{
            await connectToDevice(device)
            setMirrorConnection(device)
            manager.stopDeviceScan()
            setFetcherState("idle")
            router.replace('/')
        } catch(e) {
            alert(e)
        }
    }

    function scanDevices() {
        scanAvailableMirrors((dev)=> {
            
            if(deviceOptions.some(device=> device.id === dev.id)) {
                return
            }

            const newArr = deviceOptions
            newArr.push(dev)
            setDeviceOptions(newArr)
        }, e => {
            alert(e)
            manager.stopDeviceScan()
            setFetcherState("idle")
        })
    }

    useEffect(()=>{
        scanDevices()
    },[])

    function renderItems({item}: {item: Device}) {

        return (
            <Pressable className="rounded bg-blue-600 p-2 w-full" onPress = {()=> connectToDevice(item)}>
                <Text>{item.name ?? item.localName}</Text>
            </Pressable>
        )
    }
    
    return(
        <LinearGradient colors={[colors.white, colors.blue[300]]} style = {styles.containerStyle}>
            <Text className="text-black text-3xl font-bold flex-1">Connect To Your Mirror</Text>
            {state.device ?
                <ConnectedDevice device={state.device} /> :
                <>
                    {
                        fetcherState === "scanning" ?
                        <View>
                            <AnimatedSpinner />
                            <Text>Scanning...</Text>
                        </View>
                        :
                        <Button onPress = {scanDevices}>
                            <Text className="text-white">Start Scanning</Text>
                        </Button>
                    }
                    <FlatList 
                    data = {deviceOptions}
                    renderItem={renderItems}
                    />
                </>
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