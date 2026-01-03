import { AuthContext } from "@/context/AuthContext";
import useApi from "@/CustomHooks/useCallAPI";
import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalStyleSheet from "../globalStyle";
import { BackSVG } from "@/assets/svgComponents/generalSVGs";
import { useNavigation } from "expo-router";

export type ConsultationItem = {
    id: number;
    doctor_id: number;
    patient_id: number;
    title: string;
    google_event_id: string;
    google_meet_link: string;
    description: string;
    start_time: string;
    end_time: string;
    time_zone: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
};

const MyConsultations = () => {
    const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
    const [error, setError] = useState("");
    const {user} = useContext(AuthContext);
    const {callApi, loading} = useApi();
    const navigate = useNavigation();


    const fetchConsultations = async () => {
        try {
            const reaponse = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/consultationSchedules`,
                method: "GET",
                headers: {
                    "Patient-Id": user?.id??"-1"
                }
            })
            console.log("Consultation: ", reaponse);
            
            if (reaponse.status === 200) {
                setConsultations(reaponse.data);
            } else {
                setError(reaponse.msg || "Something went wrong");
            }
        } catch (err) {
            setError("Network error, please try again");
        }
    };

    useEffect(() => {
        fetchConsultations();
    }, []);

    const formatDateTime = (iso: string) => {
        const date = new Date(iso);

        return {
            day: date.toLocaleDateString("en-IN", { weekday: "long" }),
            fullDate: date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            time: date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const renderItem = ({ item }: { item: ConsultationItem }) => {
        const start = formatDateTime(item.start_time);
        const end = formatDateTime(item.end_time);

        return (
            <View style={styles.card}>
                {/* Title */}
                <Text style={styles.title}>{item.title}</Text>

                {/* Description */}
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{item.description}</Text>

                {/* Date */}
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{start.day}, {start.fullDate}</Text>

                {/* DoctorID */}
                <Text style={styles.label}>Docter ID</Text>
                <Text style={styles.value}>{item.doctor_id}</Text>

                {/* Time */}
                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>
                    {start.time} → {end.time} ({item.time_zone})
                </Text>

                {/* Google Meet Button */}
                <TouchableOpacity
                    style={styles.meetBtn}
                    onPress={() => Linking.openURL(item.google_meet_link)}
                >
                    <Text style={styles.meetText}>Join Google Meet</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading your consultations…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyleSheet.header}>
                {/* Back Button */}
                <TouchableOpacity
                    style={GlobalStyleSheet.backBtn}
                    onPress={() => navigate.goBack()}
                >
                    <BackSVG style={GlobalStyleSheet.backIcon} />
                </TouchableOpacity>

                {/* Title */}
                <Text style={GlobalStyleSheet.mainHeading}>Scheduled Consultations</Text>
            </View>
            {consultations.length===0?
                <View style={styles.center}>
                    <Text style={{ color: "grey", fontSize: 16 }}>To consultation Scheduled yet</Text>
                </View>: 
                <FlatList
                    data={consultations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            }
        </SafeAreaView>
    );
};

export default MyConsultations;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F6FB",
    },
    header: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 20,
        color: "#1A3C5E",
        textAlign: "center",
        letterSpacing: 0.3,
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 18,
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E9ECF2",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
        color: "#1B4D8F",
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        marginTop: 8,
        color: "#4A4A4A",
    },
    value: {
        fontSize: 14,
        color: "#333",
        marginTop: 2,
    },
    meetBtn: {
        marginTop: 14,
        backgroundColor: "#0B66C3",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    meetText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#555",
    }
});
