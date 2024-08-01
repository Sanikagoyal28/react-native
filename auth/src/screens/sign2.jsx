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
import Loader from "../components/loader";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useDispatch, useSelector } from "react-redux";
import { SignTwoThunk } from "../redux/authSlice";
import { TouchableOpacity } from "react-native-gesture-handler";

function SignTwo({ route, navigation }) {
  const pwdRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const dispatch = useDispatch();
  const [isApi, setIsApi] = useState(false);
  const authReducer = useSelector((state) => state.authReducer);
  const username = authReducer.username ? authReducer.username : "";
  console.log(authReducer);

  const [inputs, setInputs] = useState({
    name: {
      value: "",
      isValid: true,
      error: "",
    },
    password: {
      value: "",
      isValid: true,
      error: "",
    },
    cPassword: {
      value: "",
      isValid: true,
      error: "",
    },
  });

  function handleOnchange(identifier, value) {
    setInputs((currInput) => {
      return {
        ...currInput,
        [identifier]: { value: value, isValid: true },
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
    if (pwdRegex.test(inputs.password.value)) {
      handleError("password", "", true);
    } else if (inputs.password.value) {
      handleError(
        "password",
        "Password must include a minimum eight characters, at least 1 uppercase, 1 lowercase, 1 numeric and 1 special character.",
        false
      );
    }
  }, [inputs.password.value]);

  useEffect(() => {
    if (inputs.password.value == inputs.cPassword.value) {
      handleError("cPassword", "", true);
    } else if (inputs.cPassword.value) {
      handleError(
        "cPassword",
        "Password entered in both fields must be same",
        false
      );
    }
  }, [inputs.cPassword.value]);

  function handleSubmit() {
    if (!inputs.name.value) {
      handleError("name", "Username is required", false);
    }
    if (!inputs.cPassword.value) {
      handleError("cPassword", "Password is required", false);
    }
    if (!inputs.password.value) {
      handleError("password", "Password is required", false);
    }
    if (inputs.password.value != inputs.cPassword.value) {
      handleError(
        "cPassword",
        "Password entered in both fields must be same",
        false
      );
    }
    if (
      inputs.password.value &&
      inputs.cPassword.value &&
      inputs.name.value &&
      inputs.cPassword.isValid &&
      inputs.password.isValid
    ) {
      const data = {
        user_name: inputs.name.value,
        name: username,
        password: inputs.password.value,
      };
      console.log(data);

      dispatch(SignTwoThunk(data)).then((res) => {
        setIsApi(false);
        if (res.payload.data.success) {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: res.payload.data.msg,
          });
          // navigation.navigate("Otp Verification", { title: "Email Verification", email: data.email, identifier: "signUp" })
        } else {
          Toast.show({
            type: ALERT_TYPE.ERROR,
            title: "Error",
            textBody: res.payload.data.msg,
          });
        }
      });
    }
  }

  if (isApi) {
    return <Loader />;
  }

  return (
    <>
      <AlertNotificationRoot>
        {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior="position"> */}
        <View style={{ backgroundColor: GlobalColors.bg, flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View className="mx-4 pt-10">
              <Ionicons name="arrow-back" size={32} color="white" />
            </View>
          </TouchableOpacity>
          <View className="py-8 px-8 flex flex-col justify-center items-center">
            <Text className="text-4xl mb-8 text-white font-extrabold text-center uppercase leading-[58px]">
              SIGN UP
            </Text>

            <View className="mb-5 w-full">
              <Text className="text-gray-200 text-base">Username</Text>
              <TextInput
                className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200"
                placeholder="Enter your username"
                placeholderTextColor="rgb(156 163 175)"
                onChangeText={(value) => handleOnchange("name", value)}
                value={inputs.name.value}
              />
              {!inputs.name.isValid && (
                <Text
                  className="text-sm mt-1"
                  style={{ color: GlobalColors.error }}
                >
                  <Ionicons
                    name="warning"
                    size={16}
                    color={GlobalColors.error}
                  />
                  {inputs.name.error}
                </Text>
              )}
            </View>

            <View className="mb-5 w-full">
              <Text className="text-gray-200 text-base">New Password</Text>
              <TextInput
                className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200"
                placeholder="Enter new password"
                placeholderTextColor="rgb(156 163 175)"
                onChangeText={(value) => handleOnchange("password", value)}
                value={inputs.password.value}
              />
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

            <View className="mb-2 w-full">
              <Text className="text-gray-200 text-base">Confirm Password</Text>
              <TextInput
                className="px-2 py-[9] rounded-lg mt-1 bg-gray-700 text-gray-200"
                placeholder="Enter your password"
                placeholderTextColor="rgb(156 163 175)"
                onChangeText={handleOnchange.bind(this, "cPassword")}
                value={inputs.cPassword.value}
              />
              {!inputs.cPassword.isValid && (
                <Text
                  className="text-sm mt-1"
                  style={{ color: GlobalColors.error }}
                >
                  <Ionicons
                    name="warning"
                    size={16}
                    color={GlobalColors.error}
                  />
                  {inputs.cPassword.error}
                </Text>
              )}
            </View>

            <View
              className="rounded-lg px-2 py-3 w-full mt-8"
              style={{ backgroundColor: GlobalColors.primary }}
            >
              <Pressable onPress={handleSubmit}>
                <Text className="text-white text-center font-semibold">
                  Continue
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        {/* </KeyboardAvoidingView> */}
      </AlertNotificationRoot>
    </>
  );
}

export default SignTwo;
