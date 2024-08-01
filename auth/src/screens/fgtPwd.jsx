import { KeyboardAvoidingView, Pressable, Text, TextInput, View } from "react-native";
import GlobalColors from "../assets/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ForgotPwdThunk } from "../redux/authSlice";
import Loader from "../components/loader";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { TouchableOpacity } from "react-native-gesture-handler";

function FgtPwd({navigation, routes}) {

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const dispatch = useDispatch()
    const [isApi, setIsApi] = useState(false)
    const reducer = useSelector((state) => state.authReducer);
    console.log(reducer, "password");

    const [inputs, setInputs] = useState({
        email: {
            value: "",
            isValid: true,
            error: ""
        }
    })

    function handleOnchange(identifier, value) {
        setInputs((currInput) => {
            return {
                ...currInput,
                [identifier]: { value: value, isValid: true }
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

    function handleSubmit() {
        if (!inputs.email.value) {
            handleError("email", "Email is required", false)
        }
        if (inputs.email.value && inputs.email.isValid) {
            setIsApi(true)
            const data = {
                email: inputs.email.value,
            }
            dispatch(ForgotPwdThunk(data.email))
            .then((res) => {
                setIsApi(false)
                if (res.payload.data.sucess) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Success',
                        textBody: res.payload.data.msg,
                    })
                    navigation.navigate("Otp Verification", {title: "Otp Verification", email: inputs.email.value , identifier: "forgotPwd"})
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

    if (isApi) {
        return <Loader />
    }

    return <>
    <AlertNotificationRoot>
        {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior="position"> */}
        <View style={{ backgroundColor: GlobalColors.bg, flex: 1 }}>
        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          <View className="mx-4 pt-10">
            <Ionicons
              name="arrow-back"
              size={32}
              color="white"
            />
          </View>
          </TouchableOpacity>
        <View className="py-8 px-8 flex flex-col justify-center items-center">
            <Text className="text-4xl mb-8 text-white font-extrabold text-center uppercase leading-[58px]">Forgot Password?</Text>
             <View className="mb-5 w-full">
                <Text className="text-gray-200 text-base">Email Address</Text>
                <TextInput className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200" placeholder="Enter your email" placeholderTextColor='rgb(156 163 175)' onChangeText={(value) => handleOnchange("email", value)} value={inputs.email.value} keyboardType="email-address" />
                {!inputs.email.isValid && <Text className="text-sm mt-1" style={{ color: GlobalColors.error }}>
                    <Ionicons name="warning" size={16} color={GlobalColors.error} />
                    {inputs.email.error}</Text>}
            </View> 

            <View className="rounded-lg px-2 py-3 w-full mt-4 mb-2" style={{ backgroundColor: GlobalColors.primary }}>
                <Pressable onPress={handleSubmit}>
                    <Text className="text-white text-center font-semibold">Continue</Text>
                </Pressable>
            </View>
        </View>
        </View>
        {/* </KeyboardAvoidingView> */}
        </AlertNotificationRoot>
    </>
}

export default FgtPwd;
