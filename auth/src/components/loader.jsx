import { View, ActivityIndicator, Text } from "react-native";
import GlobalColors from "../assets/constants/colors";

function Loader() {

    return <View className="justify-center items-center" style={{ flex: 1, backgroundColor: GlobalColors.bg }}>
        <ActivityIndicator size="large" color="white" className="m-auto" />
    </View>
}

export default Loader;