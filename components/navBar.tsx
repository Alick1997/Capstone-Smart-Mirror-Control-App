import { Pressable, View } from "react-native";
import Icons from '@expo/vector-icons/FontAwesome'
import IconsFeather from '@expo/vector-icons/Feather'
import colors from "tailwindcss/colors";
import { useContext, useEffect, useState } from "react";
import { MirrorConnectionContext } from "../mirrorStateContext";
import { router, usePathname } from "expo-router";


export default function NavBar() {

    const { state } = useContext(MirrorConnectionContext)    
    const [canGoBack, toggleCanGoBack] = useState(router.canGoBack())

    useEffect(()=>{
        toggleCanGoBack(router.canGoBack())
    },[usePathname()])
    
    return (
        <View className="flex flex-row w-full items-center justify-between px-4 mb-6">
            { canGoBack &&
            <Icons name = 'long-arrow-left' size={20} color={colors.blue[600]} onPress = {()=> router.back()}/> 
            }
            <Pressable onPress = {()=> router.push('/bleConn')}>
                { state?.connected ? 
                <IconsFeather name = 'wifi' size = {20} color={colors.blue[600]} /> :
                <IconsFeather name = 'wifi-off' size = {20} color={colors.blue[600]} /> 
                }
            </Pressable>

        </View>
    )
}