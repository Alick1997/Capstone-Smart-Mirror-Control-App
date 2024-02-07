import { Pressable, View } from "react-native";
import Icons from '@expo/vector-icons/FontAwesome'
import IconsFeather from '@expo/vector-icons/Feather'
import colors from "tailwindcss/colors";
import { useContext } from "react";
import { MirrorConnectionContext } from "../mirrorStateContext";

export default function NavBar() {

    const {state, setMirrorConnection} = useContext(MirrorConnectionContext)    

    return (
        <View className="flex flex-row w-full items-center justify-between px-4 mb-6">
            <Icons name = 'navicon' size={20} color={colors.blue[600]} /> 
            <Pressable onPress = {()=> setMirrorConnection(!state?.connected)}>
                { state?.connected ? 
                <IconsFeather name = 'wifi' size = {20} color={colors.blue[600]} /> :
                <IconsFeather name = 'wifi-off' size = {20} color={colors.blue[600]} /> 
                }
            </Pressable>

        </View>
    )
}