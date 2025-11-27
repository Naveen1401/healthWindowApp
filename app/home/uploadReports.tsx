import { Text, SafeAreaView, StyleSheet, View, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
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

interface ReportType {
  id: number,
  patientId: number,
  reportName: string,
  fileExtension: string,
  reportDate: string,
  createdAt: string,
  updatedAt: string,
  deleted: boolean
}

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
  const { callApi: callReportsApi, loading: loadingReports, error: reportsError } = useApi();
  const { callApi} = useApi();


  const { reportData, setReportData } = useContext(ReportDataContext);
  const { doctorData, setDoctorData } = useContext(DoctorDataContext);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [selectedReportID, setSelectedReportID] = useState<number>(-1);
  const navigate = useNavigation();

  const { user } = useContext(AuthContext);

  const fetchReports = async () => {
    try{
      const request = await callReportsApi({
        url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/myReports`,
        method: "GET",
        headers: {
          "Patient-Id": user?.id ?? "-1"
        }
      })
      console.log(request);
      setReportData(request.data);
    }catch(err){
      console.log(err);
    }
  }

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
    fetchReports();
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
              setReportData(prev => prev?.filter(r => r.id !== report.id) ?? null);
              console.log("Delete successful:", request);
            } catch (error) {
              console.error("Delete failed:", error);
              fetchReports();
            }
          },
        },
      ]
    );
  };

  const handleViewReport = async (report: ReportType) => {
    const urlString = `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/common/s3UrlGenerator?key=reports/${user?.id}/${report.reportDate}/${report.reportName}.pdf`;
      try{
        const request = await callApi({
          url: urlString,
          method: "GET",
          headers: {
            "Patient-Id": user?.id ?? "-1"
          },
        })
        
        const presignedUrl = request.data;

        router.push({
          pathname: '/home/pdfViewer',
          params: { url: encodeURIComponent(presignedUrl) },
        });
      }
      catch(err){
        console.log(err);
      }
  }

  const handleUploadSuccess = (report: ReportType) => {
    fetchReports();
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
      {loadingReports ? (
        <ActivityIndicator />
      ) : (
        reportData && reportData.length > 0 ? <View style={{ height: '100%'}}>
              <Text style={style.recentReportHeading}>Recent Reports</Text>
              <View style={style.recentReportsContiner}>
                {reportData?.slice(0, 6)?.map((report) => (
                  <ReportListItem key={report.id}
                    report={report}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleView={handleViewReport} />
                ))}
              </View>
              {reportData.length > 6 ? <Button
                title="load more ..."
                onPress={() => {
                  router.push('/home/myReports')
                }}
              /> : <></>}
        </View> : <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color:"#424242", marginTop: 10}}>No reports available</Text>
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

export default UploadReports