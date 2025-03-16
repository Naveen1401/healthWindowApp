import { SafeAreaView, Text, Alert, ActivityIndicator, Pressable, StyleSheet, View, VirtualizedList, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AccessibilityAndAffiliationForReport from './AccessibilityAndAffiliationForReport';

const RecentReports = () => {
    const { userID } = useContext(AuthContext);
    const [selectedReportID, setSelectedReportID] = useState<number | null>(null);
    const [openModel, setOpneModel] = useState(false);

    const handleReportClick = (reportID: number) => {
        setSelectedReportID(reportID);
        setOpneModel(true);
    };

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
            <SafeAreaView style={style.recentReportsContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    // Show error message if fetching fails
    if (isError) {
        return (
            <SafeAreaView style={style.recentReportsContainer}>
                <Text>Error: {error.message}</Text>
            </SafeAreaView>
        );
    }

    // Show message if userID is not defined
    if (!userID) {
        return (
            <SafeAreaView style={style.recentReportsContainer}>
                <Text>User is not defined. Please log in.</Text>
            </SafeAreaView>
        );
    }

    // Render the fetched data
    return (
        <SafeAreaView style={style.recentReportsContainer}>
            <Text style={style.recentReportHeading}>Recent Reports:</Text>
            <ScrollView style={style.recentReportListContainer}>
                {data.map((rep: any) => (
                    <View key={rep.id} style={style.reportTab}>
                        <Pressable
                            key={rep.id}
                            onPress={() => handleReportClick(rep.id)}
                            style={style.reportDetails}
                        >
                            <Text className='text-[#5288d9]'>{rep.reportName.toString()}</Text>
                            <Text className='text-[#5288d9]'>{rep.reportDate}</Text>
                        </Pressable>
                        <Pressable onPress={()=>(console.log("View report" + rep.id))} style = {style.eyeContainer}>
                            <Text className='text-[#5288d9]'>Eye</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
            {selectedReportID && (
                <AccessibilityAndAffiliationForReport openModel={openModel} setOpenModel={setOpneModel} uploadedReportID={selectedReportID} id={1} />
            )}
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    recentReportsContainer: {
        margin: 10,
        height: "50%"
    },
    recentReportHeading: {
        fontSize: 16,
        fontWeight: "500",
        padding: 10,
    },
    recentReportListContainer: {
        paddingHorizontal: 10
    },
    reportTab : {
        display:"flex",
        flexDirection: "row",
        width: "100%",
        padding:10,
        borderRadius: 10,
        borderColor: "#d8d8d8",
        backgroundColor: "white",
        borderWidth:2,
        marginBottom:10,
    },
    reportDetails : {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 8,
        borderRightWidth: 1,
        paddingRight: 7
    },
    eyeContainer : {
        display: "flex",
        flexDirection: "row",
        flex:1,
        justifyContent: "center",
        
    }
});

export default RecentReports;