import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Linking, StyleSheet } from "react-native"
import WidgetCard from "./Widgets/WidgetCard"
import WidgetHeader from "./Widgets/WidgetHeader"
import { useRouter } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/AuthContext"
import useApi from "@/CustomHooks/useCallAPI"
import WidgetList from "./Widgets/WidgetList"

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

type ConsultationWidgetProps = {
    onDragStart?: () => void;
};

const ConsultationWidget: React.FC<ConsultationWidgetProps> = ({onDragStart}) => {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const { callApi, loading } = useApi();
    const [todayConsultations, setTodayConsultations] = useState<ConsultationItem[]>([]);
    const [error, setError] = useState("");

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Format time from ISO string
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Check if a consultation is today
    const isToday = (dateString: string) => {
        const consultationDate = new Date(dateString).toISOString().split('T')[0];
        return consultationDate === getTodayDate();
    };

    // Fetch consultations
    const fetchConsultations = async () => {
        try {
            const response = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/consultationSchedules`,
                method: "GET",
                headers: {
                    "Patient-Id": user?.id ?? "-1"
                }
            });

            if (response.status === 200) {
                // Filter only today's consultations
                const todayItems = response.data.filter((item: ConsultationItem) =>
                    isToday(item.start_time)
                );
                setTodayConsultations(todayItems);
            } else {
                setError(response.msg || "Failed to load consultations");
                Alert.alert("Error", response.msg || "Something went wrong");
            }
        } catch (err) {
            setError("Network error, please try again");
            Alert.alert("Error", "Network error, please try again");
        }
    };

    useEffect(() => {
        fetchConsultations();
    }, []);

    const handleJoinMeeting = (meetLink: string) => {
        if (meetLink) {
            Linking.openURL(meetLink).catch(err => {
                Alert.alert("Error", "Could not open the meeting link");
            });
        } else {
            Alert.alert("Error", "No meeting link available");
        }
    };

    const header = (
        <WidgetHeader
            title="Today's Consultations"
            onHeaderPress={() => router.push('/home/myconsultation')}
            onDragStart={onDragStart}
        />
    );

    const content = loading ? (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ marginTop: 10, color: '#666' }}>Loading consultations...</Text>
        </View>
    ) : (
        <View style={{ padding: 8 }}>
            {todayConsultations.length > 0 ? (
                todayConsultations.map((consultation, index) => {
                    const now = new Date();
                    const startTime = new Date(consultation.start_time);
                    const endTime = new Date(consultation.end_time);
                    const isOngoing = now >= startTime && now <= endTime;
                    const isUpcoming = now < startTime;

                    return (
                        <WidgetList
                            key={consultation.id}
                            index={formatTime(consultation.start_time)}
                            value={consultation.title}
                            actionComponent={
                                <TouchableOpacity
                                    style={[
                                        styles.joinButton,
                                        isOngoing && styles.ongoingButton,
                                        isUpcoming && styles.upcomingButton
                                    ]}
                                    onPress={() => handleJoinMeeting(consultation.google_meet_link)}
                                    disabled={!isOngoing && !isUpcoming}
                                >
                                    <Text style={styles.joinButtonText}>
                                        {isOngoing ? 'JOIN NOW' : isUpcoming ? 'Join' : 'Ended'}
                                    </Text>
                                </TouchableOpacity>
                            }
                        />
                    );
                })
            ) : (
                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#666', fontSize: 14 }}>
                        No consultations scheduled for today
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <WidgetCard
            header={header}
            content={content}
            hasData={!loading && todayConsultations.length > 0}
            height={150}
            emptyStateComponent={
                <View style={{ alignItems: 'center' }}>
                    <Text>No consultations today</Text>
                </View>
            }
            // footer={
            //     <TouchableOpacity onPress={() => router.push('/home/myconsultation')}>
            //         <Text style={styles.scheduleButtonText}>View All Consultations</Text>
            //     </TouchableOpacity>
            // }
        />
    );
};

const styles = StyleSheet.create({
    joinButton: {
        backgroundColor: '#4dabf7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        minWidth: 80,
        alignItems: 'center',
    },
    ongoingButton: {
        backgroundColor: '#40c057', // Green for ongoing
    },
    upcomingButton: {
        backgroundColor: '#4dabf7', // Blue for upcoming
    },
    joinButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    scheduleButtonText: {
        color: '#2563EB',
    },
});

export default ConsultationWidget;