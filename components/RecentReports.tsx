import { SafeAreaView, Text, Alert, ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import GlobalStyleSheet from '@/app/globalStyle';

const RecentReports = () => {
    const { userID } = useContext(AuthContext);

    const handleReportClick = (reportID:number) =>{
        Alert.alert("HI", "Report is clicked with ID" + reportID);
    }

    // Fetch all reports using React Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['allReports', userID], // Unique key for the query
        queryFn: async () => {
            const myHeaders = new Headers();
            myHeaders.append("Patient-Id", userID ?? "0");

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/myReports`,
                {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result.data.sort((a: any, b: any) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

        },
        enabled: !!userID, // Only fetch data if userID is available
    });

    // Show loading indicator while fetching data
    if (isLoading) {
        return (
            <SafeAreaView>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    // Show error message if fetching fails
    if (isError) {
        return (
            <SafeAreaView>
                <Text>Error: {error.message}</Text>
            </SafeAreaView>
        );
    }

    // Show message if userID is not defined
    if (!userID) {
        return (
            <SafeAreaView>
                <Text>User is not defined. Please log in.</Text>
            </SafeAreaView>
        );
    }

    // Render the fetched data
    return (
        <SafeAreaView style = {style.recentReportsContainer}>
            <Text style= {style.recentReportHeading}>Recent Reports:</Text>
            <View style = {style.recentReportListContainer}>
                {data.slice(0,5).map((rep:any) => (
                    <Pressable
                        key={rep.id}
                        onPress={() => handleReportClick(rep.id)}
                        style={GlobalStyleSheet.reportTab}
                    >
                        <Text className='text-[#5288d9]'>{rep.reportName.toString()}</Text>
                        <Text className='text-[#5288d9]'>{rep.reportDate}</Text>
                    </Pressable>
                ))}
            </View>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    recentReportsContainer : {
        margin: 10,
        height: "50%"
    },
    recentReportHeading:{
        fontSize:16,
        fontWeight:"500",
        padding: 10,
    },
    recentReportListContainer : {
        paddingHorizontal:10
    },
});

export default RecentReports;