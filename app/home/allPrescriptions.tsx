import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import useApi from "@/CustomHooks/useCallAPI";
import { BackSVG } from "@/assets/svgComponents/generalSVGs";
import GlobalStyleSheet from "../globalStyle";

interface Prescription {
    id: number;
    created_at: string;
    updated_at: string;
    complaints: string[];
    history_of_illness: string[];
    notes: string[];
    allergy: string[];
    diagnosis: string[];
    advice: string[];
    patient_id: number;
}

const AllPrescriptions = () => {
    const { callApi } = useApi();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    const { doctorId, doctorName, patientId } = useLocalSearchParams<{
        doctorId: string;
        doctorName: string;
        patientId: string;
    }>();

    const fetchPrescriptions = async () => {
        const res = await callApi({
            url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/common/prescriptions?doctorId=${doctorId}`,
            method: "GET",
            headers: {
                "Patient-Id": String(patientId)
            }
        });

        if (res?.data) {
            setPrescriptions(res.data);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const openPrescription = (item: Prescription) => {
        router.push({
            pathname: "/home/prescriptionWebView",
            params: {
                prescription: JSON.stringify({ ...item, "doctorName": doctorName })
            }
        });
    };

    const renderItem = ({ item }: { item: Prescription }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => openPrescription(item)}
        >
            <View style={styles.rowBetween}>
                <Text style={styles.title}>Prescription #{item.id}</Text>
                <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>

            <Text style={styles.subText}>
                Last Updated: {new Date(item.updated_at).toLocaleDateString()}
            </Text>

            <View style={styles.tag}>
                <Text style={styles.tagText}>Tap to view</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={GlobalStyleSheet.header}>
                <TouchableOpacity
                    style={GlobalStyleSheet.backBtn}
                    onPress={() => router.back()}
                >
                    <BackSVG style={GlobalStyleSheet.backIcon} />
                </TouchableOpacity>

                <Text style={GlobalStyleSheet.mainHeading}>Prescriptions</Text>
            </View>

            {prescriptions.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>
                        No prescriptions found
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={prescriptions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 14,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111"
    },
    date: {
        fontSize: 12,
        color: "#6B7280"
    },
    subText: {
        fontSize: 12,
        color: "#555",
        marginTop: 6
    },
    tag: {
        alignSelf: "flex-start",
        marginTop: 10,
        backgroundColor: "#E0F2FE",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20
    },
    tagText: {
        fontSize: 11,
        color: "#0284C7",
        fontWeight: "500"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyText: {
        color: "#9CA3AF",
        fontSize: 16
    }
});


export default AllPrescriptions;
