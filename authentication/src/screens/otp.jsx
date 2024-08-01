import { Pressable, Text, TextInput, View } from "react-native";
import GlobalColors from "../assets/constants/colors";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
// import OTPTextView from "react-native-otp-textinput";
import Loader from "../components/loader";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useDispatch } from "react-redux";
import { OtpVerifyThunk, SignupVerifyThunk } from "../redux/authSlice";

function Otp({ navigation, route }) {

    const title = route.params.title ? route.params.title : "Verification"
    const email = route.params.email ? route.params.email : "abcd@gmail.com"
    const identifier = route.params.identifier
    const [otp, setOtp] = useState("")
    const [isValid, setIsValid] = useState(true)
    const [error, setError] = useState("")
    const [isApi, setIsApi] = useState(false)
    const dispatch = useDispatch()

    function handleOnchange(value) {
        setOtp(value)
    }

    function handleError(msg, bool) {
        setIsValid(bool)
        setError(msg)
    }

    function handleSubmit() {
        if (!otp) {
            handleError("Otp is required", false)
        }
        else {
            handleError("", true)
        }
        if (otp && isValid) {
            setIsApi(true)
            const data = {
                email: email,
                otp
            }
            if (identifier == "signUp") {
                dispatch(SignupVerifyThunk(data))
                    .then((res) => {
                        setIsApi(false)
                        if (res.payload.data.success) {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: 'Success',
                                textBody: res.payload.data.msg,
                            })
                            navigation.navigate("Signup")
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
            else {
                dispatch(OtpVerifyThunk(data))
                    .then((res) => {
                        setIsApi(false)
                        if (res.payload.data.success) {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: 'Success',
                                textBody: res.payload.data.msg,
                            })
                            navigation.navigate("Reset Password")
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
    }
    if (isApi) {
        return <Loader />
    }

    return <>
        <AlertNotificationRoot>
            <View style={{ backgroundColor: GlobalColors.bg, flex: 1 }}>
                <View className="py-24 px-8 flex flex-col justify-center items-center">
                    <Text className="text-4xl mb-2 text-white font-extrabold text-center leading-[58px]">{title}</Text>
                    <Text className="text-base text-gray-200 my-4 w-full leading-5">Enter the Otp sent to {email}</Text>
                    <View className="mb-5 w-full">

                        {/* <OTPTextView
                            inputCount={6}
                            handleTextChange={handleOnchange}
                            keyboardType="numeric"
                            tintColor={GlobalColors.primary}
                            inputCellLength={1}
                            textInputStyle={{
                                width: 40,
                                height: 46,
                                borderRadius: 4,
                                borderColor: 'gray',
                                color: 'white',
                                backgroundColor: 'rgb(55 65 81)',
                                fontSize: 20,
                                fontWeight: '600',
                                // padding: 2
                            }} /> */}
                        {!isValid && <Text className="text-sm mt-2" style={{ color: GlobalColors.error }}>
                            <Ionicons name="warning" size={16} color={GlobalColors.error} />
                            {error}</Text>}

                    </View>

                    {/* <View>
                    <Pressable>
                    <Text>Resend Otp </Text>
                    </Pressable>
                    </View> */}

                    <View className="rounded-lg px-2 py-3 w-full mt-4 mb-2" style={{ backgroundColor: GlobalColors.primary }}>
                        <Pressable onPress={handleSubmit}>
                            <Text className="text-white text-center font-semibold">Continue</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </AlertNotificationRoot>
    </>
}

export default Otp;
