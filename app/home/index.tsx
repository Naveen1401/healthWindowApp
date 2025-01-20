import React, {useContext} from "react";
import { SafeAreaView, Text, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView>
      <Text>Welcome to the Home Screen</Text>
      <Button title="Profile" onPress={() => router.push('/home/profile')} />
        <TouchableOpacity onPress={logout}>
        <Text style={{ color: 'blue', marginTop: 20 }}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
