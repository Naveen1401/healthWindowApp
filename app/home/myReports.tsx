import { Text, SafeAreaView, StyleSheet, View } from 'react-native'
import React from 'react'
import AllReports from '@/components/AllReports'
import GlobalStyleSheet from '../globalStyle'

const MyReports = () => {
    return (
        <SafeAreaView style={style.myReportsMainContainer}>
            <Text style={GlobalStyleSheet.mainHeading}>My Reports</Text>
            <AllReports searchFlag={true} />
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    myReportsMainContainer: {
        backgroundColor: "#dce6fc",
        height: "100%",
    }
});

export default MyReports