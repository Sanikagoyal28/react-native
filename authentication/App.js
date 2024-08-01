import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider} from 'react-redux';
import store, { persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import GlobalColors from './src/assets/constants/colors';
import Login from './src/screens/login';
import RstPwd from './src/screens/rstPwd';
import SignTwo from './src/screens/sign2';
import SignOne from './src/screens/sign1';
import Otp from './src/screens/otp';
import FgtPwd from './src/screens/fgtPwd';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  
  const Stack = createStackNavigator();
  return <>
    <View style={{ flex: 1, backgroundColor: GlobalColors.bg }}>
      <StatusBar style="auto" />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
          {/* to hide the header we use headerShown: false */}
            <Stack.Navigator screenOptions={{ headerShown: false }}> 
            {/* <Stack.Navigator> */}
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Forgot Password" component={FgtPwd} />
              <Stack.Screen name="Reset Password" component={RstPwd} />
              <Stack.Screen name="Otp Verification" component={Otp} />
              <Stack.Screen name="Register" component={SignOne} />
              <Stack.Screen name="Signup" component={SignTwo} />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </View>
  </>
}
