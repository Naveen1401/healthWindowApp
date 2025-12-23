import { Text, StyleSheet, TextInput, Alert, ScrollView, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useContext, useEffect, useState } from 'react'
import GlobalStyleSheet from '../globalStyle'
import ReportListItem from '@/components/ReportListItem'
import { ReportDataContext } from '@/context/ReportContext'
import AccessibilityAndAffiliationForReport from '@/components/AccessibilityAndAffiliationForReport'
import { DoctorDataContext } from '@/context/DoctorContext'
import useApi from '@/CustomHooks/useCallAPI'
import { AuthContext } from '@/context/AuthContext'
import { router, useNavigation } from 'expo-router'
import { BackSVG } from '@/assets/svgComponents/generalSVGs'
import { ReportType } from '@/util/type';

const MyReports = () => {
    const { reportData, setReportData } = useContext(ReportDataContext);
    const {doctorData} = useContext(DoctorDataContext);
    const [openModel, setOpenModel] = useState<boolean>(false);
    const [filteredReports, setFilteredReports] = useState<ReportType[] | null>(reportData);
    const [selectedReportID, setSelectedReportID] = useState<number>(-1);
    const { callApi } = useApi();
    const {user} = useContext(AuthContext);
    const navigate = useNavigation();
    

    const handleEdit = (report: ReportType) => {
        setSelectedReportID(report.id);
        setOpenModel(true);
    }

    const handleDelete = async (report: ReportType) => {
        Alert.alert(
            'Confirmation',
            `Are you sure you want to delete ${report.reportName}?`,
            [{
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                try {
                    const request = await callApi({
                    url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/deleteReport?reportId=${report.id}`,
                    method: "DELETE",
                    headers: {
                        "Patient-Id": user?.id ?? "-1"
                    },
                    });

                    setReportData(prev => prev?.filter(r => r.id !== report.id) ?? null);

                    console.log("Delete successful:", request);
                } catch (error) {
                    console.error("Delete failed:", error);
                }
                },
            },
            ]
        );
    };

    const handleSearch = useCallback((searchText: string) => {
        if (searchText.length === 0) {
            setFilteredReports(reportData || null);  // Handle undefined case
            return;
        }
        const filtered = reportData ? reportData.filter(item => (
            item.reportName.toLowerCase().includes(searchText.toLowerCase())
        )) : null;
        setFilteredReports(filtered);
    }, [reportData])

    useEffect(() => {
        setFilteredReports(reportData);
    }, [reportData]);

    return (
        <SafeAreaView style={style.myReportsMainContainer}>
            <View style={GlobalStyleSheet.header}>
                {/* Back Button */}
                <TouchableOpacity
                    style={GlobalStyleSheet.backBtn}
                    onPress={() => navigate.goBack()}
                >
                    <BackSVG style={GlobalStyleSheet.backIcon} />
                </TouchableOpacity>

                {/* Title */}
                <Text style={GlobalStyleSheet.mainHeading}>My Reports</Text>
            </View>
            <TextInput
                placeholder='Search report name...'
                placeholderTextColor="#999" 
                style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 10, marginHorizontal: 20, backgroundColor: "white" }}
                onChangeText= {(text)=>{handleSearch(text)}}
            />
            <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 20}}>
                {filteredReports ? filteredReports?.map((report) => (
                    <ReportListItem key={report.id}
                        report={report}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}/>
                )) : <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color:"#424242", marginTop: 10}}>No reports available</Text>}
            </ScrollView>
            <AccessibilityAndAffiliationForReport doctors={doctorData || []} openModel={openModel} setOpenModel={setOpenModel} reportID={selectedReportID} />
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