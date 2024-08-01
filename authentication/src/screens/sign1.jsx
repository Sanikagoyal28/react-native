import { KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import GlobalColors from "../assets/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useDispatch } from "react-redux";
import { SignupThunk, SignupVerifyThunk, setUsername } from "../redux/authSlice";

function SignOne({ routes, navigation }) {

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const nameRegex = /^[a-z ,.'-]+$/i;
    const dispatch = useDispatch()
    const [isApi, setIsApi] = useState(false)

    const [inputs, setInputs] = useState({
        name: {
            value: "",
            isValid: true,
            error: ""
        },
        email: {
            value: "",
            isValid: true,
            error: "",
            isFocus: false
        },
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

    useEffect(() => {
        if (nameRegex.test(inputs.name.value)) {
            handleError("name", "", true)
        }
        else if (inputs.name.value) {
            handleError("name", "Name should consists of alphabets", false)
        }
    }, [inputs.name.value])

    useEffect(() => {
        if (emailRegex.test(inputs.email.value)) {
            handleError("email", "", true)
        }
        else if (inputs.email.value) {
            handleError("email", "Invalid Email Address", false)
        }
    }, [inputs.email.value])

    function handleSubmit() {
        if (!inputs.name.value) {
            handleError("name", "Username is required", false)
            return
        }
        if (!inputs.email.value) {
            handleError("email", "Email is required", false)
            return
        }
        if (inputs.name.value && inputs.email.value && inputs.name.isValid && inputs.email.isValid) {
            const data = {
                name: inputs.name.value,
                email: inputs.email.value
            }
            setIsApi(true)
            dispatch(SignupThunk(data.email))
                .then((res) => {
                    setIsApi(false)
                    if (res.payload.data.success) {
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Success',
                            textBody: res.payload.data.msg,
                        })
                        dispatch(setUsername(data.name))
                        navigation.navigate("Otp Verification", { title: "Email Verification", email: data.email, identifier: "signUp" })
                    }
                    else {
                        Toast.show({
                            type: ALERT_TYPE.ERROR,
                            title: 'Error',
                            textBody: res.payload.data.msg,
                        })
                    }
                })
        }
    }

    function handleLogin() {
        navigation.navigate("Login")
    }

    if (isApi) {
        return <Loader />
    }

    return <>
        <AlertNotificationRoot>
            {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior="position"> */}
            <View style={{ backgroundColor: GlobalColors.bg, flex: 1 }}>
                <View className="py-24 px-8 flex flex-col justify-center items-center">
                    <Text className="text-4xl mb-8 text-white font-extrabold text-center uppercase leading-[58px]">SIGN UP</Text>

                    <View className="mb-5 w-full">
                        <Text className="text-gray-200 text-base">Username</Text>
                        <TextInput className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200" placeholder="Enter your username" placeholderTextColor='rgb(156 163 175)' onChangeText={(value) => handleOnchange("name", value)} value={inputs.name.value} />
                        {!inputs.name.isValid && <Text className="text-sm mt-1" style={{ color: GlobalColors.error }}>
                            <Ionicons name="warning" size={16} color={GlobalColors.error} />
                            {inputs.name.error}</Text>}
                    </View>

                    <View className="mb-5 w-full">
                        <Text className="text-gray-200 text-base">Email Address</Text>
                        <TextInput className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200" placeholder="Enter your email" placeholderTextColor='rgb(156 163 175)' onChangeText={(value) => handleOnchange("email", value)} value={inputs.email.value} keyboardType="email-address" />
                        {!inputs.email.isValid && <Text className="text-sm mt-1" style={{ color: GlobalColors.error }}>
                            <Ionicons name="warning" size={16} color={GlobalColors.error} />
                            {inputs.email.error}</Text>}
                    </View>

                    <View className="rounded-lg px-2 py-3 w-full mt-10 mb-2" style={{ backgroundColor: GlobalColors.primary }}>
                        <Pressable onPress={handleSubmit}>
                            <Text className="text-white text-center font-semibold">Continue</Text>
                        </Pressable>
                    </View>

                    <View className="w-full flex flex-row items-center gap-2">
                        <Text className="text-gray-300">Already have an Account</Text>
                        <Pressable onPress={handleLogin}>
                            <Text className="font-bold text-white">Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            {/* </KeyboardAvoidingView> */}
        </AlertNotificationRoot>
    </>
}

export default SignOne;
