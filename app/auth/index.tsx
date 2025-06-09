import React from "react";
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { GoogleSVG, HomeSVG } from "@/assets/svgComponents/generalSVGs";
import {
    useFonts,
    Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
    const [fontsLoaded] = useFonts({
        Poppins_600SemiBold
    });
    const config = {
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
    };

    const { setToken, setUserID, setImageURL, setName } = useContext(AuthContext);

    const [request, response, promptAsync] = Google.useAuthRequest(config);


    const handleUserSign = async (user: any) => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/getOrCreatePatient', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            });
            const apiresponse = await response.json();

            console.log("Login Info", apiresponse, user);

            const loginUserID: string = await apiresponse?.data?.id.toString();

            await AsyncStorage.setItem("userID", loginUserID);
            await AsyncStorage.setItem("name", user.given_name);
            await AsyncStorage.setItem("imageURL", user.picture);
            console.log("UserID ---->> ", loginUserID);

            setUserID(loginUserID);
            setName(user.given_name);
            setImageURL(user.picture);

        } catch (error) {
            console.log(error);
        }
    }

    const getUserProfile = async (token: any) => {
        if (!token) return;
        await AsyncStorage.setItem("token", token);
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = await response.json();
            handleUserSign(user);

        } catch (error) {
            console.log(error);
        }
    }

    const handleToken = () => {
        if (response?.type === 'success') {
            const { authentication } = response;
            const token = authentication?.accessToken;
            setToken(token ? token : null);
            getUserProfile(token);
        }
    }

    useEffect(() => {
        handleToken();
    }, [response])

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading fonts...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <View style={{ height: "30%", justifyContent: "flex-end", alignItems: "center" }}>
                <Text style={style.headerText}>Health</Text>
                <Text style={style.headerText}>Window</Text>
            </View>
            <HomeSVG height={"50%"} />
            <TouchableOpacity style={style.signInButton} onPress={() => promptAsync()}>
                <GoogleSVG style={{ marginRight: 20 }} height={20} width={20} />
                <Text>SignIn With Google</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    signInButton: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#e3e3e3",
        borderWidth: 2
    },
    headerText: {
        textAlign: "center",
        fontSize: 50,
        color: "#CA515B",
        fontFamily: 'Poppins_600SemiBold'
    }
})
