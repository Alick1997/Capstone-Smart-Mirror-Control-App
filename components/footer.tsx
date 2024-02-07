import { View, Text, TouchableOpacity } from "react-native";
import Icons from '@expo/vector-icons/FontAwesome'
import colors from "tailwindcss/colors";
import { useContext } from "react";
import { MirrorConnectionContext } from "../mirrorStateContext";

export default function Footer() {

    const {state, setMirrorPower} = useContext(MirrorConnectionContext)

    return (
        <View className="flex flex-row w-full items-center justify-between px-4 mb-6 border-blue-600 border-t">
            <View className="flex flex-row justify-around items-center border-r border-blue-600 flex-1 pt-4 pb-4">
                <Text className="text-blue-600">Profile</Text>
                <Icons name = 'user-circle' size={25} color={colors.blue[600]} />
            </View>
            <TouchableOpacity onPress = {()=> setMirrorPower(!state?.isMirrorOn)} className="flex flex-row justify-around items-center flex-1 pt-4 pb-4">
                <Text className={state?.isMirrorOn ? 'text-blue-700' : 'text-gray-500'}>Power</Text>
                <Icons name = 'power-off' size={25} color={state?.isMirrorOn ? colors.blue[600] : colors.gray[500]} />
            </TouchableOpacity>
        </View>
    )
}