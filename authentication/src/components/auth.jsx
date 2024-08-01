import { Text, TextInput, View } from "react-native";
import GlobalColors from "../assets/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

function AuthComp(props) {

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const [inputs, setInputs] = useState({
        email: {
            value: "",
            isValid: true,
            error: "",
            isFocus: false
        },
        password: {
            value: "",
            isValid: true,
            error: "",
            isFocus: false
        }
    })

    function handleOnchange(identifier, value) {
        setInputs((currInput) => {
            return {
                ...currInput,
                [identifier]: { value: value }
            }
        })
    }

    function handleError(identifier, msg, bool) {
        setInputs((currInput) => {
            return {
                ...currInput,
                [identifier]: {
                    ...currInput[identifier],
                    error: msg, isValid: bool
                }
            }
        })
    }

    // validation
    useEffect(() => {
        if (emailRegex.test(inputs.email.value)) {
            handleError("email", "", true)
        }
        else if (inputs.email.value) {
            handleError("email", "Invalid Email Address", false)
        }
    }, [inputs.email.value])

    useEffect(() => {
        if (pwdRegex.test(inputs.password.value)) {
            handleError("password", "", true)
        }
        else if (inputs.password.value) {
            handleError("password", "Password must include a minimum eight characters, at least 1 uppercase, 1 lowercase, 1 numeric and 1 special character.", false)
        }
    }, [inputs.password.value])

    function handleSubmit() {
        if (!inputs.email.value) {
            handleError("email", "Email is required", false)
        }
        if (!inputs.password.value) {
            handleError("password", "Password is required", false)
        }
        if (inputs.email.isValid && inputs.password.isValid) {
            const data = {
                email: inputs.email.value,
                password: inputs.password.value
            }
            console.log(data)
        }
    }

    return <> 
            <View className="mb-5 w-full">
                <Text className="text-gray-200 text-base">{props.label}</Text>
                <TextInput className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200" placeholder={props.placeholder} placeholderTextColor='rgb(156 163 175)' onChangeText={(value) => handleOnchange("email", value)} value={inputs.email.value} keyboardType="email-address" />
                {!props && <Text className="text-sm mt-1" style={{ color: GlobalColors.error }}>
                    <Ionicons name="warning" size={16} color={GlobalColors.error} />
                    {inputs.email.error}</Text>}
            </View>
    </>
}

export default AuthComp;
