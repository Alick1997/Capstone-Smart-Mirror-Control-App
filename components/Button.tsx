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
            <TouchableOpacity className={buttonClass} {...purgeProps(props)} >
                <AnimatedSpinner />
            </TouchableOpacity>
        )
    }
    return (
       <TouchableOpacity 
       className={buttonClass}
        {...props}
       />
    )
}

export default Button

const buttonClass = "bg-blue-700 rounded p-4 m-2 items-center"