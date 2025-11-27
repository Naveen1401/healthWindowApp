import { SafeAreaView, View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import {healthDataTabData} from '@/util/SystemData'
import GlobalStyleSheet from "../globalStyle";
import { router, useNavigation } from "expo-router";
import { BackSVG } from "@/assets/svgComponents/generalSVGs";

const HealthDataTab = (props : {svgName:string, title:string, healthType:string}) => {
    const { svgName, title, healthType } = props;
    const SvgComponent = require('@/assets/svgComponents/healthDataSVGs')[svgName];

    const handleTabPress = () => {
        router.push({
            pathname: '/home/healthDataScreen',
            params: { healthType, title },
        });
    }

    return (
        <Pressable style={style.tabMainContainer} onPress={handleTabPress}>
                <SvgComponent height={80} width={80} />
                <Text style={{textAlign:"center"}}>{title}</Text>
        </Pressable>
    );
};

const HealthData = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <View style={GlobalStyleSheet.header}>
                {/* Back Button */}
                <TouchableOpacity
                    style={GlobalStyleSheet.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <BackSVG style={GlobalStyleSheet.backIcon} />
                </TouchableOpacity>

                {/* Title */}
                <Text style={GlobalStyleSheet.mainHeading}>Health Data</Text>
            </View>
        <SafeAreaView style = {style.mainContainer}>
            {healthDataTabData.map((item)=>(
                <HealthDataTab key={item.id} svgName={item.svgName} title={item.title} healthType={item.id}/>
            ))}
        </SafeAreaView>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    mainContainer : {
        flexDirection : 'row',
        flexWrap : 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 10
    },
    tabMainContainer : {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: '#d2d2d2',
        justifyContent: 'center',
        alignItems : 'center',
        marginBottom: 10,
    },
})

export default HealthData;