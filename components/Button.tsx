import { ComponentProps } from "react"
import { TouchableOpacity } from "react-native"
import AnimatedSpinner from "./animatedSpinner"

interface Props extends ComponentProps<typeof TouchableOpacity> {
    loading?: boolean
}

function purgeProps(props: Props) {
    return {...props, children: undefined, onPress: undefined}
}

const Button: React.FC<Props> = (props) => {

    if(props.loading) {
        return (
            <TouchableOpacity {...purgeProps(props)} >
                <AnimatedSpinner />
            </TouchableOpacity>
        )
    }
    return (
       <TouchableOpacity 
        {...props}
       />
    )
}

export default Button