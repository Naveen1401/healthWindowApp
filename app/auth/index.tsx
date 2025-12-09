import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView} from 'react-native-safe-area-context'
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { GoogleSVG, HomeSVG } from "@/assets/svgComponents/generalSVGs";
import {
    useFonts,
    Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';



import {
    GoogleSignin,
    GoogleSigninButton,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID
});

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
    const [fontsLoaded] = useFonts({
        Poppins_600SemiBold
    });
    // const config = {
    //     androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    //     iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    //     webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
    // };

    const { setAuthData } = useContext(AuthContext);

    // const [request, response, promptAsync] = Google.useAuthRequest(config);


    const handleUserSign = async (user: any) => {
        try {
            console.log(process.env.EXPO_PUBLIC_BACKEND_SERVER);
            const backendUser = {
                "email": user.email,
                "family_name": user.familyName,
                "given_name": user.givenName,
                "id": user.id,
                "name": user.name,
                "picture": user.photo,
            }
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/getOrCreatePatient', {
                method: 'POST',
                body: JSON.stringify(backendUser),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            });
            const apiresponse = await response.json();

            if(apiresponse.status === 200){
                setAuthData(
                    { 
                        id: apiresponse?.data?.createdPatient?.id.toString(),
                        name: user.given_name+" "+user.family_name,
                        email: user.email,
                        imageURL: user.picture,
                        phoneNo: apiresponse?.data?.createdPatient?.phone_no
                    },
                    apiresponse?.data?.accessToken,
                    apiresponse?.data?.refreshToken
                )
            }else{
                Alert.alert("Error",apiresponse.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleGoogleSignIn = async () => {
        try{
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                console.log(response.data.user)
                handleUserSign(response.data.user);
            } else {
                // sign in was cancelled by user
            }
        } catch (error) {
            if (isErrorWithCode (error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // Android only, play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }
        }
    }

    // const getUserProfile = async (token: any) => {
    //     if (!token) return;
    //     try {
    //         const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         const user = await response.json();
    //         handleUserSign(user);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // const handleToken = () => {
    //     if (response?.type === 'success') {
    //         const { authentication } = response;
    //         const token = authentication?.accessToken;
    //         getUserProfile(token);
    //     }
    // }

    // useEffect(() => {
    //     handleToken();
    // }, [response])

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
            <TouchableOpacity style={style.signInButton} onPress={handleGoogleSignIn}>
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
