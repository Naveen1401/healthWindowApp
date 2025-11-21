import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Camera, CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import { AuthContext } from "@/context/AuthContext";
import useApi from "@/CustomHooks/useCallAPI";

const DoctorAffiliation: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [permission, requestPermission] = useCameraPermissions();
    const [doctorId, setDoctorId] = useState<string>("");
    const [doctorData, setDoctorData] = useState<any>(null);
    const [scanning, setScanning] = useState<boolean>(false);
    const { callApi: callDoctorApi, loading: loadingDocter } = useApi();
    const { callApi } = useApi();

    useEffect(() => {
        if (!permission) requestPermission();
    }, []);

    const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
        setDoctorId(data);
        setScanning(false);
        fetchDoctorDetails(data);
    };

    const fetchDoctorDetails = async (id: string) => {
        if (!id) {
            Alert.alert("Error", "Please enter or scan a doctor code.");
            return;
        }

        try {
            const response = await callDoctorApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/getDoctorById?id=${id}`,
                    method: "GET",
                    headers: {
                        "Patient-Id": user?.id ?? "-1",
                    },
                }
            );

            if (response.status === 200 && response.data) {
                setDoctorData(response.data);
            } else {
                Alert.alert("Error", "Doctor not found.");
                setDoctorData(null);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch doctor details.");
        }
    };

    const sendAffiliationRequest = async () => {
        if (!doctorId) {
            Alert.alert("Error", "Please scan or enter a doctor code first.");
            return;
        }

        try {
            const response = await callApi({
                    url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/doctorAffiliationRequest`,
                    method: "POST",
                    headers: {
                        "Patient-Id": user?.id ?? "-1",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ doctor_id: parseInt(doctorId) }),
                }
            );

            if (response.status === 200) {
                Alert.alert("Success", "Affiliation request sent successfully!");
            } else {
                Alert.alert("Failed", "Could not send affiliation request.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong while sending the request.");
        }
    };

    if (!permission) {
        return (
            <View style={styles.center}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>Camera permission is required to scan QR codes.</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {scanning ? (
                <View style={{ flex: 1 }}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                        onBarcodeScanned={handleBarCodeScanned}
                    />
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setScanning(false)}>
                        <Text style={styles.cancelText}>Cancel Scan</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <Text style={styles.title}>Link with Doctor</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Doctor Code"
                        keyboardType="numeric"
                        value={doctorId}
                        onChangeText={setDoctorId}
                    />

                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => setScanning(true)}
                    >
                        <Text style={styles.scanButtonText}>📷 Scan QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.fetchButton}
                        onPress={() => fetchDoctorDetails(doctorId)}
                    >
                        <Text style={styles.fetchButtonText}>Fetch Doctor Details</Text>
                    </TouchableOpacity>

                    {loadingDocter && <ActivityIndicator size="large" style={{ marginVertical: 10 }} />}

                    {doctorData && (
                        <View style={styles.doctorCard}>
                            <Image source={{ uri: doctorData.image_url }} style={styles.image} />
                            <Text style={styles.name}>
                                {doctorData.first_name} {doctorData.last_name}
                            </Text>
                            <Text>Email: {doctorData.email}</Text>
                            <Text>Experience: {doctorData.doctor_details.yrs_of_exp} years</Text>
                            <Text>Status: {doctorData.status}</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.sendButton} onPress={sendAffiliationRequest}>
                        <Text style={styles.sendButtonText}>Send Request</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default DoctorAffiliation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    scanButton: {
        backgroundColor: "#2e86de",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    scanButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    fetchButton: {
        backgroundColor: "#4cd137",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    fetchButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    doctorCard: {
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f5f6fa",
        borderRadius: 15,
        marginBottom: 20,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
    sendButton: {
        backgroundColor: "#e84118",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    sendButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },
    cancelButton: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "#e84118",
        padding: 10,
        borderRadius: 10,
    },
    cancelText: {
        color: "#fff",
        fontSize: 16,
    },
    permissionButton: {
        backgroundColor: "#2e86de",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    permissionText: {
        color: "#fff",
        fontWeight: "500",
    },
});
