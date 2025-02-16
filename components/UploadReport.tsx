import React, { useContext, useState } from 'react';
import { View, Text, Button, TextInput, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '@/context/AuthContext';
import AccessibilityAndAffiliationForReport from './AccessibilityAndAffiliationForReport';

const UploadReport = () => {
    const [reportName, setReportName] = useState(''); // State for the report name
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [openModel, setOpneModel] = useState(false);

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

    const onDateChange = (event: any, date?: Date) => {
        setShowDatePicker(false); // Hide the date picker
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

            if (response.ok) {
                Alert.alert('Success', 'File uploaded successfully',[{
                    text: 'ok',
                    onPress: () => setOpneModel(true),
                }]);
                setReportName(''); // Clear input field
                setSelectedFile(null); // Clear selected file
                setSelectedDate(undefined); // Clear selected date
            } else {
                const errorResponse = await response.json();
                Alert.alert('Error', `Upload failed: ${errorResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while uploading the file');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text>Enter Report Name:</Text>
            <TextInput
                value={reportName}
                onChangeText={setReportName}
                placeholder="Enter report name"
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 10,
                    marginVertical: 10,
                    borderRadius: 5
                }}
            />

            <Button title="Select Report" onPress={pickDocument} />

            {selectedFile && (
                <View style={{ marginTop: 20 }}>
                    <Text>Selected File: {selectedFile.name}</Text>
                </View>
            )}

            <Button title="Select Date" onPress={() => setShowDatePicker(true)} />

            {selectedDate && (
                <View style={{ marginTop: 20 }}>
                    <Text>Selected Date: {selectedDate.toLocaleDateString()}</Text>
                </View>
            )}

            {showDatePicker && (
                <View style={{ minWidth: 280, alignSelf: 'center', padding: 10 }}>
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={onDateChange}
                        style={{ width: '100%' }}
                    />
                </View>
            )}

            <Button title="Upload" onPress={uploadData} />
            <AccessibilityAndAffiliationForReport id={1} openModel={openModel} setOpenModel={setOpneModel}/>
        </View>
    );
};

export default UploadReport;
