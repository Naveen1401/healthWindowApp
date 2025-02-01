import React from "react";
import { Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
    const config = {
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
    };

    const { setToken, setUserID } = useContext(AuthContext);

    const [request, response, promptAsync] = Google.useAuthRequest(config);
    
    const handleUserSign = async (user:any) =>{
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER +'/patient/getOrCreatePatient', {
                method: 'POST',
                body : JSON.stringify(user),
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            });
            const apiresponse = await response.json();

            const loginUserID:string = await apiresponse?.data?.id.toString();

            await AsyncStorage.setItem("token", loginUserID);
            console.log("token ---->> ", loginUserID);
            
            setUserID(loginUserID);

        }catch(error){
            console.log(error);
        }
    }

    const getUserProfile = async(token:any)=>{
        if(!token) return;
        try{
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = await response.json();
            handleUserSign(user);
            
        }catch(error){
            console.log(error);
        }
    }

    const handleToken = () =>{
        if(response?.type==='success'){
            const {authentication} = response;
            const token = authentication?.accessToken;
            setToken(token?token:null);
            getUserProfile(token);
        }
    }

    useEffect(()=>{
        handleToken();
    }, [response])

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={()=>promptAsync()}>
                <Text>SignIn With Google</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
