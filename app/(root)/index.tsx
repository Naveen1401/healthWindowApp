import { Text, View } from "react-native";
import {Link} from 'expo-router'

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-bold">Whelcome to Health Window</Text>
      <Link href='/sign-in'>Sign In</Link>
      <Link href='/profile'>Profile</Link>
    </View>
  );
}