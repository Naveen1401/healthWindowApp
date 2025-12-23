import { Text, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useEffect, useState } from 'react'
import UploadReport from '@/components/UploadReport'
import ReportListItem from '@/components/ReportListItem'
import GlobalStyleSheet from '../globalStyle'
import { router, useNavigation } from 'expo-router'
import { useApi } from "@/CustomHooks/useCallAPI"
import { AuthContext } from '@/context/AuthContext'
import { ReportDataContext } from '@/context/ReportContext'
import { DoctorDataContext } from '@/context/DoctorContext'
import AccessibilityAndAffiliationForReport from '@/components/AccessibilityAndAffiliationForReport'
import { BackSVG } from '@/assets/svgComponents/generalSVGs'
import { ReportType } from '@/util/type';
import Button from '@/components/Button';

interface DoctorDetails {
  degree: string;
  "yrs of experience": number;
}

interface Doctor {
  id: number;
  userId: number;
  first_name: string;
  last_name: string;
  affiliatedPatientIds: number[] | null;
  doctorDetails: DoctorDetails;
  requestedAffiliationPatientIds: number[] | null;
  createdAt: string;
  updatedAt: string;
}

const UploadReports = () => {
  const { callApi, loading: loadingDoctors } = useApi();

  const { reportData, setReportData } = useContext(ReportDataContext);
  const { doctorData, setDoctorData } = useContext(DoctorDataContext);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [selectedReportID, setSelectedReportID] = useState<number>(-1);
  const navigate = useNavigation();

  const { user } = useContext(AuthContext);

  // Only fetch reports if context is empty (shouldn't happen if widget loaded first)
  const fetchReportsIfNeeded = async () => {
    if (!reportData) {
      try {
        const request = await callApi({
          url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/myReports`,
          method: "GET",
          headers: {
            "Patient-Id": user?.id ?? "-1"
          }
        });
        setReportData(request.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Refresh reports (called after upload/delete)
  const refreshReports = async () => {
    try {
      const request = await callApi({
        url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/myReports`,
        method: "GET",
        headers: {
          "Patient-Id": user?.id ?? "-1"
        }
      });
      setReportData(request.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const request = await callApi({
        url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/myDoctors`,
        method: "GET",
        headers: {
          "Patient-Id": user?.id ?? "-1"
        }
      })
      setDoctorData(request.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchReportsIfNeeded(); // Only fetch if context is empty
    fetchDoctors();
  }, [])

  const handleEdit = (report: ReportType) => {
    setSelectedReportID(report.id);
    setOpenModel(true);
  }

  const handleDelete = async (report: ReportType) => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to delete ${report.reportName}?`,
      [
        {
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
              // Update context directly
              setReportData(prev => prev?.filter(r => r.id !== report.id) ?? null);
              console.log("Delete successful:", request);
            } catch (error) {
              console.error("Delete failed:", error);
              refreshReports(); // Refresh if delete fails
            }
          },
        },
      ]
    );
  };

  const handleUploadSuccess = (report: ReportType) => {
    refreshReports(); // Refresh reports after upload
    Alert.alert('Success', 'File uploaded successfully', [{
      text: 'ok',
      onPress: () => {
        setSelectedReportID(report.id);
        setOpenModel(true);
        console.log("Uploaded successfully");
      },
    }]);
  }

  return (
    <SafeAreaView style={style.uploadRportsMainContainer}>
      <View style={GlobalStyleSheet.header}>
        <TouchableOpacity
          style={GlobalStyleSheet.backBtn}
          onPress={() => navigate.goBack()}
        >
          <BackSVG style={GlobalStyleSheet.backIcon} />
        </TouchableOpacity>

        <Text style={GlobalStyleSheet.mainHeading}>Upload Reports</Text>
      </View>
      <View style={{ height: '40%' }}><UploadReport handleUploadSuccess={handleUploadSuccess} /></View>

      {/* Show loading only if both reportData is null and we might be fetching */}
      {!reportData && loadingDoctors ? (
        <ActivityIndicator />
      ) : (
        reportData && reportData.length > 0 ?
          <View style={{ height: '100%' }}>
            <Text style={style.recentReportHeading}>Recent Reports</Text>
            <View style={style.recentReportsContiner}>
              {reportData?.slice(0, 6)?.map((report) => (
                <ReportListItem key={report.id}
                  report={report}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit} />
              ))}
            </View>
            {reportData.length > 6 ? <Button
              variant='primary-inverted'
              title="load more ..."
              onPress={() => {
                router.push('/home/myReports')
              }}
            /> : <></>}
          </View> :
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "#424242", marginTop: 10 }}>
            No reports available
          </Text>
      )}
      <AccessibilityAndAffiliationForReport doctors={doctorData || []} openModel={openModel} setOpenModel={setOpenModel} reportID={selectedReportID} />
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  uploadRportsMainContainer: {
    backgroundColor: "#dce6fc",
    height: "100%",
  },
  recentReportsContiner: {
    marginHorizontal: 20,
  },
  recentReportHeading: {
    fontSize: 18,
    marginHorizontal: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
});

export default UploadReports;