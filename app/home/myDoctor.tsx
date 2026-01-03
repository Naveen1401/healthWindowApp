import { AuthContext } from "@/context/AuthContext";
import useApi from "@/CustomHooks/useCallAPI";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import GlobalStyleSheet from "../globalStyle";
import { BackSVG } from "@/assets/svgComponents/generalSVGs";


interface Doctor {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    image_url: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    doctor_details: {
        yrs_of_exp: number;
    };
}

const MyDoctors = () => {
    const { user } = useContext(AuthContext);
    const { callApi } = useApi();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [search, setSearch] = useState("");

    const fetchDoctorData = async () => {
        console.log("API Lodded");
        try{
            const response = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/myDoctors`,
                method: "GET",
                headers: {
                    "patient-id": String(user?.id ?? "-1")
                }
            });

            if (response?.data) {
                setDoctors(response.data);
            }
        }catch(err){
            console.log(err);   
        }
    };

    useEffect(() => {
        fetchDoctorData();
    }, []);

    // 🔍 Search by name OR id
    const filteredDoctors = useMemo(() => {
        if (!search) return doctors;

        return doctors.filter((doc) => {
            const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
            return (
                fullName.includes(search.toLowerCase()) ||
                doc.id.toString().includes(search)
            );
        });
    }, [search, doctors]);

    const openPrescriptions = (doctorName: string, doctorId: number) => {
        router.push({
            pathname: "/home/allPrescriptions",
            params: {
                doctorId: doctorId,
                doctorName: doctorName,
                patientId: user?.id
            }
        });

    };

    const renderDoctor = ({ item }: { item: Doctor }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image source={{ uri: item.image_url }} style={styles.avatar} />

                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>
                        Dr. {item.first_name} {item.last_name}
                    </Text>

                    <Text style={styles.meta}>ID: {item.id}</Text>
                    <Text style={styles.meta}>{item.email}</Text>
                    <Text style={styles.meta}>
                        Experience: {item.doctor_details?.yrs_of_exp ?? 0} yrs
                    </Text>
                    <Text style={styles.status}>{item.status}</Text>
                </View>
            </View>

            {/* Prescription Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => openPrescriptions(`${item.first_name} ${item.last_name}`, item.id)}
            >
                <Text style={styles.buttonText}>View Prescriptions</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyleSheet.header}>
                {/* Back Button */}
                <TouchableOpacity
                    style={GlobalStyleSheet.backBtn}
                    onPress={() => router.back()}
                >
                    <BackSVG style={GlobalStyleSheet.backIcon} />
                </TouchableOpacity>

                {/* Title */}
                <Text style={GlobalStyleSheet.mainHeading}>My Doctors</Text>
                <TouchableOpacity style={GlobalStyleSheet.addBtn} onPress={() => router.push('/home/docterAffiliation')}>
                    <Text style={{ color: '#2563EB', fontSize: 16 }}>Add +</Text>
                </TouchableOpacity>
            </View>
            

            {/* Search */}
            <View style={{paddingHorizontal: 10, flex: 1}}>
                <TextInput
                    placeholder="Search by doctor name or ID"
                    placeholderTextColor="#999" 
                    value={search}
                    onChangeText={setSearch}
                    style={styles.search}
                />

                <FlatList
                    data={filteredDoctors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderDoctor}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    header: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10
    },
    search: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB"
    },
    row: {
        flexDirection: "row",
        gap: 12
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E5E7EB"
    },
    name: {
        fontSize: 15,
        fontWeight: "600"
    },
    meta: {
        fontSize: 12,
        color: "#555",
        marginTop: 2
    },
    status: {
        fontSize: 12,
        color: "#16A34A",
        marginTop: 4,
        fontWeight: "500"
    },
    button: {
        marginTop: 12,
        backgroundColor: "#2563EB",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center"
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600"
    }
});


export default MyDoctors;
