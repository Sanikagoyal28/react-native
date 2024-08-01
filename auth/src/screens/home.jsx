import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({route, navigation}) => {
  // Access token from AsyncStorage
  const [token, settoken] = useState("");
  const getAsyncStorageToken = async () => {
    try {
      const asyncStorageToken = await AsyncStorage.getItem("authToken");
      settoken(asyncStorageToken);
      return asyncStorageToken;
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
      return null;
    }
  };

  async function handleStoreClear() {
    await AsyncStorage.clear();
    navigation.navigate("Login")
  }

  return (
    <>
      <View className="flex-1 py-24 px-24">
        <Pressable onPress={getAsyncStorageToken}>
          <Text>Get token</Text>
        </Pressable>

        <Text>{token}</Text>

        <Pressable onPress={handleStoreClear}>
          <Text>clear store</Text>
        </Pressable>
      </View>
    </>
  );
};

export default Home;
