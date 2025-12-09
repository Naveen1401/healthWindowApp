import { Redirect } from "expo-router";
import { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return isLoggedIn ? <Redirect href="/home" /> : <Redirect href="/auth" />;
}
