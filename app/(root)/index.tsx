import { Text, View } from "react-native";
import {Link} from 'expo-router'
import SignIn from "../sign-in";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className='h-full flex justify-center items-center'
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-bold">Whelcome to Health Window</Text>
      {/* <Link href='/sign-in'>Sign In</Link>
      <Link href='/profile'>Profile</Link> */}
      <SignIn/>
    </SafeAreaView>
  );
}