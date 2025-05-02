import { SafeAreaView, Alert,Text, Modal, ActivityIndicator, Pressable, StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Button } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AccessibilityAndAffiliationForReport from './AccessibilityAndAffiliationForReport';

interface Report {
    id: number;
    reportName: string;
    reportDate: string;
}

const AllReports = (props: { length?: number, title?: string, searchFlag?: boolean }) => {
    const { length, title, searchFlag } = props;
    const { userID } = useContext(AuthContext);
    const [selectedReportID, setSelectedReportID] = useState<number | null>(null);
    const [openModel, setOpneModel] = useState(false);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [reportData, setReportData] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibility, setVisibility] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const handleReportClick = (reportID: number) => {
        setSelectedReportID(reportID);
        setOpneModel(true);
    };

    const fetchReports = async () => {
        try {
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
            if (Array.isArray(result.data)) {
                setFilteredReports(result.data);
                setReportData(result.data);
            } else {
                throw new Error('Invalid response format: expected an array');
            }
            setIsLoading(false);
        } catch (e:any) {
            setError(e.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);


    const handleSearch = (text: string) => {
        if (text.length === 0) {
            setFilteredReports(reportData);
            return;
        }
        const filtered = reportData.filter((report: Report) => {
            return report.reportName.toLowerCase().includes(text.toLowerCase());
        });
        setFilteredReports(filtered);
    }

    const handleOptionSelect = (action: 'delete' | 'edit' | 'cancel') => {
        setVisibility(false);
        if (!selectedReport) return;

        switch (action) {
            case 'delete':
                Alert.alert(
                    'Delete Report',
                    `Are you sure you want to delete ${selectedReport.reportName}?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => console.log(selectedReport.id) }
                    ]
                );
                break;
            case 'edit':
                handleReportClick(selectedReport.id);
                break;
            case 'cancel':
                setSelectedReport(null);
                break;
        }
    };

    // Show loading indicator while fetching data
    if (isLoading) {
        return (
            <SafeAreaView style={style.recentReportsContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    // Show error if there was a problem fetching data
    if (error) {
        return (
            <SafeAreaView style={style.recentReportsContainer}>
                <Text>Error: {error}</Text>
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

    // Show message if no reports are available
    if (reportData.length === 0) {
        return (
            <SafeAreaView style={style.recentReportsContainer}>
                {title && <Text style={style.recentReportHeading}>{title}</Text>}
                <Text>No reports available</Text>
            </SafeAreaView>
        );
    }

    // Render the fetched data
    return (
        <SafeAreaView style={style.recentReportsContainer}>
            {title && <Text style={style.recentReportHeading}>{title}</Text>}
            {searchFlag && (
                <TextInput
                    placeholder='Search reports...'
                    style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 10, marginHorizontal: 10 }}
                    onChangeText={handleSearch}
                />
            )}
            <ScrollView style={style.recentReportListContainer} keyboardShouldPersistTaps="handled">
                {filteredReports?.slice(0,length).map((rep: Report) => (
                    <View key={rep.id} style={style.reportTab}>
                        <Pressable
                            onPress={() => handleReportClick(rep.id)}
                            style={style.reportDetails}
                        >
                            <Text className='text-[#5288d9]'>{rep.reportName.toString()}</Text>
                            <Text className='text-[#506c96]' style={{ paddingLeft: 5, fontSize :12 }}>({rep.reportDate})</Text>
                        </Pressable>
                        <Pressable onPress={() => setSelectedReport(rep)} onPressIn={() => setVisibility(true)}>
                            <Text>⋮</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
            {selectedReportID && (
                <AccessibilityAndAffiliationForReport
                    openModel={openModel}
                    setOpenModel={setOpneModel}
                    uploadedReportID={selectedReportID}
                    id={1}
                />
            )}
            <Modal visible={visibility}
                transparent={true}
                animationType="slide"
            > 
                <View style={style.modalOverlay}>
                    <View style={style.menuContainer}>
                        <View style={style.menuItem}><Button color='red' title='Delete' onPress={() => handleOptionSelect('delete')} /></View>
                        <View style={style.menuItem}><Button title='Edit' onPress={() => handleOptionSelect('edit')} /></View>
                        <View style={{padding:5}}><Button title='Cancel' onPress={() => handleOptionSelect('cancel')} /></View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
const style = StyleSheet.create({
    recentReportsContainer: {
        margin: 10,
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
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    reportDetails : {
        flex: 1,
        flexDirection: "row",
        paddingRight: 7,
        alignItems: "baseline",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    menuContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4, // Negative for shadow above the modal
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        maxHeight: '20%',
        paddingBottom: 30
    },
    menuItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
});

export default AllReports;