import { useEffect, useRef, ComponentProps } from "react";
import { Animated } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'


interface Props extends ComponentProps<typeof Animated.View> {
    iconProps?: ComponentProps<typeof FontAwesome5>
}

function retreiveViewProps(props: Props): ComponentProps<typeof Animated.View> {
    const newProps = {...props}
    delete newProps.iconProps
    delete newProps.style
    return newProps
}

const AnimatedSpinner: React.FC<Props> = (props) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ).start();
    }, [spinValue]);
  
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View style={[props.style,{ transform: [{ rotate: spin }] }]} {...retreiveViewProps(props)} >
            <FontAwesome5 name="spinner" className="text-white text-xl" {...props.iconProps}/>
        </Animated.View>
    )
}

export default AnimatedSpinner