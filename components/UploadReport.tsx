import React, { useContext, useState } from 'react';
import { View,SafeAreaView, Text, Button, TextInput, Alert, Platform, StyleSheet, Pressable, processColor } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '@/context/AuthContext';
import DatePicker from 'react-native-date-picker'
import GlobalStyleSheet from '@/app/globalStyle';

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

const UploadReport = (props : {handleUploadSuccess : (report:ReportType)=>void}) => {
    const {handleUploadSuccess} = props
    const [reportName, setReportName] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [openModel, setOpneModel] = useState(false);
    const [reportID, setReportID] = useState<any>(null);
    const [open, setOpen] = useState(false)

    const {userID} = useContext(AuthContext);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // Limit to only PDFs
            });

            if (!result.canceled) {
                setSelectedFile(result.assets[0]); // Store selected file
                console.log("Picked File ::::::::>", result);
            }
        } catch (error) {
            Alert.alert('Error', 'File selection failed');
        }
    };

    const onDateChange = (date: Date) => {
        console.log(date)
        if (date) {
            setSelectedDate(date);
        }
    };

    const uploadData = async () => {
        if (!reportName.trim() || !selectedFile || !selectedDate) {
            Alert.alert('Error', 'Please enter a report name, select a file, and choose a date');
            return;
        }

        const fileData = {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: selectedFile.mimeType || 'application/pdf', // Ensure MIME type is set
        };

        console.log("New file Data :::::::> ", fileData);
        
        const payloadForm = new FormData();
        payloadForm.append('file', fileData as any);
        
        const uploadReportRequestDto = {
            report_name: reportName.trim(), // Use input value
            report_date: selectedDate.toISOString().split('T')[0],
        };

        payloadForm.append('uploadReportRequestDto', JSON.stringify(uploadReportRequestDto));

        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER +'/patient/uploadReport', {
                method: 'POST',
                headers: {
                    'Patient-Id': userID?userID:""
                },
                body: payloadForm,
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                handleUploadSuccess(responseData.data);
                setReportName('');
                setSelectedFile(null);
                setSelectedDate(new Date());
            } else {
                const errorResponse = await response.json();
                Alert.alert('Error', `Upload failed: ${errorResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while uploading the file');
        }
    };

    return (
        <SafeAreaView style = {style.uploadReportMainContainer}>
            <Text style = {GlobalStyleSheet.subHeading}>Upload Report</Text>
            <Pressable style={style.uploadWidgetContainer} onPress={pickDocument}>
                {!selectedFile?<Text>^ Select Report</Text>:
                <View style={style.selectedFileView}>
                    <Text>{selectedFile.name}</Text>
                    <Button title="x" onPress={()=>(setSelectedFile(null))}/>
                </View>}
            </Pressable>
            <TextInput
                value={reportName}
                onChangeText={setReportName}
                placeholder="Enter report name"
                style={style.reportNameInput}
            />
            <View >
                <Button title={`Report Date: ${selectedDate.toLocaleDateString()}`} onPress={() => setOpen(true)} />
                <DatePicker
                    modal
                    open={open}
                    date={selectedDate}
                    mode='date'
                    onConfirm={(date) => {
                        setOpen(false)
                        onDateChange(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
            </View>

            <Button color="#4ba0eb" title="Upload" onPress={uploadData} />
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    uploadReportMainContainer:{
        margin:20,
        backgroundColor: "white",
        borderRadius:10
    },
    uploadWidgetContainer:{
        paddingVertical: 30,
        marginHorizontal: 20,
        borderRadius:10,
        borderWidth:2,
        borderColor:"gray",
        borderStyle:"dashed",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    reportNameInput:{
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        margin: 20,
        borderRadius: 5,
        textAlign: "center"
    },
    selectedFileView:{
        display:"flex",
        flexDirection: "row",
        alignItems:"center"
    },
});

export default UploadReport;
