import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import store, { persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import GlobalColors from "./src/assets/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrivateNavigator from "./src/navigators/privateNavigator";

export default function App() {
  // Log all keys and values in AsyncStorage
  AsyncStorage.getAllKeys().then(async (asyncKeys) => {
    const values = await AsyncStorage.multiGet(asyncKeys);
    console.log("AsyncStorage contents:", values);
  });

  return (
    <View style={{ flex: 1, backgroundColor: GlobalColors.bg }}>
      <StatusBar style="light" />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
            <PrivateNavigator />
        </PersistGate>
      </Provider>
    </View>
  );
}
