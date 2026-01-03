import { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform, Pressable, Modal } from "react-native";
import WidgetCard from "@/components/Widgets/WidgetCard";
import WidgetHeader from "@/components/Widgets/WidgetHeader";
import useApi from "@/CustomHooks/useCallAPI";
import { AuthContext } from "@/context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useHomeRefresh } from "@/context/HomeRefreshContext";

interface OPSItem {
    doctor_name: string;
    hospital_name: string;
    opdVisit: {chiefComplaint: string;}
}

const OPSWidget: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { callApi } = useApi();

    const [opsList, setOpsList] = useState<OPSItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const { refreshVersion, startRefresh, endRefresh } = useHomeRefresh();

    useEffect(() => {
        console.log("Fetching new OPDs");
        const run = async () => {
            startRefresh();
                await fetchOPS();
            endRefresh();
        };

        run();
    }, [date, refreshVersion]);

    

    const fetchOPS = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const response = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/common/listOPDs?hospital_id=1&date=${date.toISOString().split("T")[0]}&page=0&size=10`,
                headers: {
                    "Patient-Id": user.id,
                },
            });
            console.log(response);
            
            setOpsList(response.data || []);
        } catch (error) {
            console.error("Failed to fetch OPS:", error);
        } finally {
            setLoading(false);
        }
    };

    const header = (
        <WidgetHeader
            title="OPD Visits"
            actionComponent={
                <Pressable onPress={() => setShowPicker(true)}>
                    <Text style={styles.dateText}>
                        {date.toDateString()}
                    </Text>
                </Pressable>
            }
        />
    );

    const content = loading ? (
        <View style={styles.center}>
            <ActivityIndicator size="small" color="#2563EB" />
        </View>
    ) : (
        <View>
            {/* Header */}
            <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.colDoctor, styles.headerText]}>Doctor</Text>
                <Text style={[styles.colHospital, styles.headerText]}>Hospital</Text>
                <Text style={[styles.colComplaint, styles.headerText]}>Chief Complaint</Text>
            </View>

            {/* Rows */}
            {opsList.map((item, index) => (
                <View key={index} style={styles.row}>
                    <Text style={styles.colDoctor}>{item.doctor_name}</Text>
                    <Text style={styles.colHospital}>{item.hospital_name}</Text>
                    <Text
                        style={styles.colComplaint}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item.opdVisit.chiefComplaint}
                    </Text>
                </View>
            ))}
        </View>
    );



    return (
        <>
            <WidgetCard
                header={header}
                content={content}
                hasData={opsList.length > 0}
                emptyStateComponent={
                    <View>
                        <Text>No OPD visits found</Text>
                    </View>
                }
            />

            {/* ANDROID */}
            {showPicker && Platform.OS === "android" && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            {/* IOS */}
            {Platform.OS === "ios" && (
                <Modal
                    transparent
                    animationType="slide"
                    visible={showPicker}
                    onRequestClose={() => setShowPicker(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="inline"
                                onChange={(_, selectedDate) => {
                                    if (selectedDate) setDate(selectedDate);
                                }}
                            />

                            <Pressable
                                style={styles.doneButton}
                                onPress={() => setShowPicker(false)}
                            >
                                <Text style={styles.doneText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            )}

        </>
    );
};

const styles = StyleSheet.create({
    center: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    row: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
    },

    headerRow: {
        backgroundColor: "#F3F4F6",
    },

    headerText: {
        fontWeight: "700",
        fontSize: 13,
        color: "#374151",
    },

    /* FIXED COLUMN WIDTHS */
    colDoctor: {
        width: 90,
        fontSize: 13,
        color: "#111827",
    },
    colHospital: {
        width: 90,
        fontSize: 13,
        color: "#111827",
    },
    colComplaint: {
        flex: 1,
        fontSize: 13,
        color: "#111827",
        paddingRight: 8,
    },
    complaint: {
        flex: 2, // more space for text
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },

    pickerContainer: {
        backgroundColor: "#fff",
        paddingTop: 12,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        alignItems: 'center'
    },

    doneButton: {
        padding: 14,
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
    },

    doneText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2563EB",
    },
    dateText: {
        color: "#2563EB",
        fontSize: 14,
    },
});

export default OPSWidget;
