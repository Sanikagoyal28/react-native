import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../screens/home";
import Login from "../screens/login";
import RstPwd from "../screens/rstPwd";
import SignTwo from "../screens/sign2";
import SignOne from "../screens/sign1";
import Otp from "../screens/otp";
import FgtPwd from "../screens/fgtPwd";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

export default function PrivateNavigator() {
  const Stack = createStackNavigator();
  const reducer = useSelector((state) => state.authReducer);
  console.log("reducer", reducer);
  const [token, setToken] = useState("");

  //   useEffect(() => {
  //     async function getToken() {
  //       try {
  //         const storedToken = await AsyncStorage.getItem("authToken");
  //         setToken(storedToken);
  //       } catch (error) {
  //         console.error("Error retrieving token from AsyncStorage:", error);
  //       }
  //     }
  //     getToken();
  //   }, []);

  useEffect(() => {
    setToken(reducer?.accessToken);
  }, [reducer]);

  console.log("token", token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Forgot Password" component={FgtPwd} />
            <Stack.Screen name="Reset Password" component={RstPwd} />
            <Stack.Screen name="Otp Verification" component={Otp} />
            <Stack.Screen name="Register" component={SignOne} />
            <Stack.Screen name="Signup" component={SignTwo} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
