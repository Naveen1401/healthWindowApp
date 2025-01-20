import { Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
    const config = {
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
    };

    const router = useRouter();

    console.log(config);

    const [request, response, promptAsync] = Google.useAuthRequest(config);

    const handleUserSign = async (user:any) =>{
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER +'/patient/getOrCreatePatient', {
                method: 'POST',
                body : JSON.stringify(user),
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            });
            const apiresponse = await response.json();
            router.replace('/profile');
            console.log("APIResponse : ", apiresponse);

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
            console.log("Google User : ",user);
        }catch(error){
            console.log(error);
        }
    }

    const handleToken = () =>{
        if(response?.type==='success'){
            const {authentication} = response;
            const token = authentication?.accessToken;
            console.log("Token : ", token);
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

export default SignIn