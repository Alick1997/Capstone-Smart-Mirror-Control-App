import { useState, useContext } from "react"
import { Text, View, FlatList, StyleSheet, StyleProp, ViewStyle, Pressable, TouchableOpacity } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import colors from 'tailwindcss/colors'
import {LinearGradient} from 'expo-linear-gradient'
import Footer from "../components/footer"
import MapView, { Marker } from "react-native-maps"
import { MirrorConnectionContext } from "../mirrorStateContext"
import { Link } from "expo-router"
import ConnectedDevice from "../components/connectedDevice"

export default function Page() {
    
    const { state } = useContext(MirrorConnectionContext)

    const data = [
        {
            title: 'Weather', 
            body:
            <>
                <Text className="text-white">-2 C</Text>
                <Text className="text-white">Overcast</Text>
            </>,
            icon: <FontAwesome5 name="cloud-sun-rain" size={24} color="white" />,
            enabled: true,
            style: styles.halfThumbnailStyle
         },
         {
            title: 'Calendar', 
            body:
            <>
                <Text className="text-white">COE70B - 011 - LAB</Text>
                <Text className="text-white">ENG311</Text>
                <Text className="text-white">2 PM</Text>
            </>,
            icon: <FontAwesome5 name = 'square' size={24} color="white"  />,
            enabled: true,
            style: styles.halfThumbnailStyle
         },
         {
            title: 'To-Do List', 
            body:
            <>
                <Text className="text-white">COE70B - 011 - LAB</Text>
                <Text className="text-white">ENG311</Text>
                <Text className="text-white">2 PM</Text>
            </>,
            icon: <FontAwesome5 name = 'square' size={24} color="white"  />,
            enabled: false,
            style: styles.fullThumbnailStyle
         }
    ]
    return (
        <LinearGradient colors={[colors.white, colors.blue[300]]} style = {styles.containerStyle}>
            <Text className="text-black text-3xl font-bold">Hello, Alick.</Text>
            { state.device ?
                <>
                <ConnectedDevice device={state.device} /> 
                    {
                        state.location?.latitude && state.location.longitude ?
                        <MapView
                    region={{
                        latitude: state.location.latitude,
                        longitude: state.location.longitude,
                        latitudeDelta: 0.0022,
                        longitudeDelta: 0.0021
                    }}
                    className="flex-1 w-full" >
                        <Marker coordinate={{  
                        latitude: state.location.latitude,
                        longitude: state.location.longitude
                        }} />
                    </MapView> :
                    <View className="flex-1 w-full">
                        <Text>No location Provided</Text>
                    </View>
                }
                    <FlatList 
                    style = {{alignSelf:'center'}}
                    columnWrapperStyle = {styles.columnStyle}
                    horizontal={false}
                    numColumns={2}
                    data = {data}
                    className="space-x-2"
                    renderItem={item=> 
                    <Thumbnail 
                        title = {item.item.title}
                        body = {item.item.body}
                        enabled = {item.item.enabled}
                        icon = {item.item.icon}
                        style={item.item.style}
                        />}
                    />
                </> :
                <View style = {{flex:1, alignItems:'center', width:'100%', justifyContent:'center'}}>
                    <Text className="font-bold text-center">Connect Your Phone to keep data up to date</Text>
                    <TouchableOpacity className="my-2">
                        <Link href={'/bleConn'} className="flex-row rounded bg-blue-700 p-4 items-center">
                            <Text className="text-white text-xl mr-6">Connect With Bluetooth</Text>
                            <FontAwesome5 name = 'bluetooth' color = {colors.white} size = {20} />
                        </Link>
                    </TouchableOpacity>
                    <Text>Last Synchronized: {state?.lastConnected?.toLocaleString()}</Text>
                </View>
        }
            <Footer />
        </LinearGradient>
    )
}

type ThumbNailProps = {
    title: string;
    icon: React.ReactElement;
    body: React.ReactElement;
    enabled: boolean;
    style?: StyleProp<ViewStyle>;
}
const Thumbnail: React.FC<ThumbNailProps> = ({title, icon, body, enabled, style}) =>{

    const [isEnabled, toggleEnabled] = useState<boolean>(enabled)

    return (
        <Pressable onPress = {()=> toggleEnabled(!isEnabled)} className={"rounded bg-blue-600 p-2 w-auto "} style = {style}>
            <Text className="self-center text-center font-bold text-white">{title}</Text>
            <View className="flex-row justify-between">
                {icon}
                <View className="items-center text-white shrink">
                    {body}
                </View>
            </View>
            <View className="flex-row justify-center items-center bottom-0">
                <FontAwesome5 size={20} name='check-circle' color = {isEnabled ? colors.blue[700] : colors.gray[500]} />
                <Text className="text-white mx-2">{ isEnabled ? 'Enabled' : 'Disabled'}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    columnStyle: {marginHorizontal:2, marginVertical:7, alignContent:'center'},
    halfThumbnailStyle: {width:'47%', marginHorizontal:2},
    fullThumbnailStyle: {width:'100%'},
    containerStyle: {flex:1, flexDirection:'column', alignItems:'center', alignContent:'center', width:'100%'}
})


