import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import GlobalColors from "../assets/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignInThunk from "../redux/authSlice";
import Loader from "../components/loader";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

function Login({ route, navigation }) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const dispatch = useDispatch();
  const [isApi, setIsApi] = useState(false);
  const reducer = useSelector((state) => state.authReducer);

  const [inputs, setInputs] = useState({
    email: {
      value: "",
      isValid: true,
      error: "",
      isFocus: false,
    },
    password: {
      value: "",
      isValid: true,
      error: "",
      isFocus: false,
    },
  });
  const [secure, setSecure] = useState(true)

  function handleOnchange(identifier, value) {
    setInputs((currInput) => {
      return {
        ...currInput,
        [identifier]: {
          value: value,
          isValid: true,
        },
      };
    });
  }

  function handleError(identifier, msg, bool) {
    setInputs((currInput) => {
      return {
        ...currInput,
        [identifier]: {
          ...currInput[identifier],
          error: msg,
          isValid: bool,
        },
      };
    });
  }

  useEffect(() => {
    if (emailRegex.test(inputs.email.value)) {
      handleError("email", "", true);
    } else if (inputs.email.value) {
      handleError("email", "Invalid Email Address", false);
    }
  }, [inputs.email.value]);

  function handleSubmit() {

    if (!inputs.email.value) {
      return handleError("email", "Email is required", false);
    }
    if (!inputs.password.value) {
      return handleError("password", "Password is required", false);
    }
    if (inputs.email.isValid && inputs.password.isValid) {
      setIsApi(true);
      const data = {
        email: inputs.email.value,
        password: inputs.password.value,
      };
      dispatch(SignInThunk(data)).then((res) => {
        setIsApi(false);
        if (res.payload.data.sucess) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: res.payload.data.msg,
          });
          navigation.navigate("Home");
        } else {
          Toast.show({
            type: ALERT_TYPE.ERROR,
            title: "Error",
            textBody: res.payload.data.msg,
          });
        }
      });
    }

    setInputs({
      ...inputs,
      email: {
        ...inputs.email,
        value: "",
      },
      password: {
        ...inputs.password,
        value: "",
      },
    });
  }

  //   console asyncstorage value
  //   function handleAsyncStorage() {

  //     AsyncStorage.getAllKeys().then(async (asyncKeys) => {
  //       const values = await AsyncStorage.multiGet(asyncKeys);
  //       console.log("AsyncStorage contents:", values);
  //     });
  //   }
  //   handleAsyncStorage();

  function handleRegister() {
    navigation.navigate("Register");
  }

  function handleFgtPwd() {
    navigation.navigate("Forgot Password");
  }

  if (isApi) {
    return <Loader />;
  }

  return (
    <>
      <AlertNotificationRoot>
        {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior="position"> */}
        <View style={{ backgroundColor: GlobalColors.bg, flex: 1 }}>
          <View className="py-24 px-8 flex flex-col justify-center items-center">
            <Text className="text-4xl mb-8 text-white font-extrabold text-center uppercase leading-[58px]">
              Login
            </Text>
            <View className="mb-5 w-full">
              <Text className="text-gray-200 text-base">Email Address</Text>
              <TextInput
                className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200"
                placeholder="Enter your email"
                placeholderTextColor="rgb(156 163 175)"
                onChangeText={(value) => handleOnchange("email", value)}
                value={inputs.email.value}
                keyboardType="email-address"
              />
              {!inputs.email.isValid && (
                <Text
                  className="text-sm mt-1"
                  style={{ color: GlobalColors.error }}
                >
                  <Ionicons
                    name="warning"
                    size={16}
                    color={GlobalColors.error}
                  />
                  {inputs.email.error}
                </Text>
              )}
            </View>

            <View className="mb-2 w-full">
              <Text className="text-gray-200 text-base">Password</Text>
              <View className="flex flex-row items-center w-full">
              <TextInput
                className="flex-1 px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200"
                style={[
                  { backgroundColor: " rgb(55 65 81)" },
                  inputs.password.isFocus && {
                    backgroundColor: "rgb(31 41 50)",
                  },
                  {
                    marginRight:0,
                    borderBottomRightRadius:0,
                    borderTopRightRadius:0
                  }
                ]}
                placeholder="Enter your password"
                placeholderTextColor="rgb(156 163 175)"
                onFocus={() => {
                  setInputs({
                    ...inputs,
                    password: {
                      ...inputs.password,
                      isFocus: true,
                    },
                  });
                }}
                onChangeText={handleOnchange.bind(this, "password")}
                value={inputs.password.value}
                secureTextEntry={secure}
              />
              <TouchableOpacity className="flex-1 justify-center px-2 rounded-lg mt-1 bg-gray-700 text-gray-200" 
               style={{borderBottomLeftRadius:0, borderTopLeftRadius:0}} onPress={()=>{setSecure(!secure)}}>
                <Ionicons name={secure ? "eye": "eye-off"} size={22} color="white" className="relative top-5" />
              </TouchableOpacity>
              </View>
              {!inputs.password.isValid && (
                <Text
                  className="text-sm mt-1"
                  style={{ color: GlobalColors.error }}
                >
                  <Ionicons
                    name="warning"
                    size={16}
                    color={GlobalColors.error}
                  />
                  {inputs.password.error}
                </Text>
              )}
            </View>

            <View className="flex flex-row justify-end w-full">
              <Pressable
                onPress={() => {
                  handleFgtPwd();
                }}
              >
                <Text className="underline underline-offset-4 text-gray-200">
                  Forgot Password ?
                </Text>
              </Pressable>
            </View>

            <View
              className="rounded-lg px-2 py-3 w-full mt-12 mb-2"
              style={{ backgroundColor: GlobalColors.primary }}
            >
              <Pressable onPress={handleSubmit}>
                <Text className="text-white text-center font-semibold">
                  Continue
                </Text>
              </Pressable>
            </View>

            <View className="w-full flex flex-row items-center gap-2">
              <Text className="text-gray-300">Don't have an Account?</Text>
              <Pressable onPress={handleRegister}>
                <Text className="font-bold text-white">Register</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </AlertNotificationRoot>
      {/* </KeyboardAvoidingView> */}
    </>
  );
}

export default Login;
