import { View, Text, Alert, ActivityIndicator } from "react-native"
import WidgetHeader from "./Widgets/WidgetHeader";
import { useRouter } from "expo-router";
import WidgetCard from "./Widgets/WidgetCard";
import useApi from "@/CustomHooks/useCallAPI";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import MedicationTab from "./MedicationTab";
import { DateFormat } from "@/util/DateTimeFormet";

interface ListItem {
    intakeTime: string;
    dosage: string;
    medicationName: string;
    medicationID: number;
    medicationScheduleID: number;
    isTaken?: boolean;
}

type MedicationWidgetProps = {
    onDragStart?: () => void;
};

const MedicationWidget:React.FC<MedicationWidgetProps> = ({onDragStart}) => {
    const router = useRouter();
    const { callApi } = useApi();
    const { user } = useContext(AuthContext);
    const [todayMedications, setTodayMedications] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const todayDate = DateFormat(new Date());

    const listItemHandler = (json: any, date: string) => {
        const transformedData: ListItem[] = json.data.schedule.map((scheduleItem: any) => {
            const medicationInfo = json.data.medication_info_map.find(
                (med: any) => med.id === scheduleItem.medication_id
            );

            return {
                intakeTime: scheduleItem.intake_time,
                dosage: medicationInfo?.dosage || '',
                medicationName: medicationInfo?.medicineName || '',
                medicationID: scheduleItem.medication_id,
                medicationScheduleID: scheduleItem.medication_schedule_id,
                isTaken: (scheduleItem.intake_status === 'VOID' || scheduleItem.intake_status === "NOT_TAKEN") ? false : true
            };
        })
            .sort((a: ListItem, b: ListItem) => {
                return a.intakeTime.localeCompare(b.intakeTime);
            });

        setTodayMedications(transformedData);
        setLoading(false);
    };

    const medicationData = async (date: string) => {
        setLoading(true);
        try {
            const response = await callApi({
                url: process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/getMedicationSchedule',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": user?.id ?? '-1',
                },
                body: JSON.stringify({ date }),
            });

            listItemHandler(response, date);
        } catch (error) {
            console.error('Error fetching medication schedule:', error);
            Alert.alert('Error', 'Failed to load medication schedule');
            setLoading(false);
        }
    };

    // FIXED: handleStatusChange for flat array
    const handleStatusChange = (medicationID: number, medicationScheduleID: number, newStatus: boolean) => {
        setTodayMedications(prevItems => {
            return prevItems.map(item => {
                if (item.medicationID === medicationID && item.medicationScheduleID === medicationScheduleID) {
                    return {
                        ...item,
                        isTaken: newStatus
                    };
                }
                return item;
            });
        });

    };

    useEffect(() => {
        medicationData(todayDate);
    }, []);

    const header = (
        <WidgetHeader
            title="Medication"
            onHeaderPress={() => router.push('/home/medication')}
            onDragStart={onDragStart}
        />
    );

    const content = loading ? (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2563EB" />
        </View>
    ) : (
        <View style={{paddingTop: 10}}>
            {
                todayMedications.map((item: ListItem, index: number) => (
                    <MedicationTab
                        key={`${item.medicationID}-${item.medicationScheduleID}-${index}`}
                        medicationName={item.medicationName}
                        dosage={item.dosage}
                        intakeTime={item.intakeTime}
                        medicationID={item.medicationID}
                        medicationScheduleID={item.medicationScheduleID}
                        istaken={item.isTaken}
                        onStatusChange={handleStatusChange}
                        selectedDate={todayDate}
                    />
                ))
            }
        </View>
    );

    return (
        <WidgetCard
            header={header}
            content={content}
            hasData={todayMedications.length > 0}
            height = {150}
            emptyStateComponent={
                <View style={{ alignItems: 'center' }}>
                    <Text>No medication scheduled for today</Text>
                </View>
            }
        />
    );
}

export default MedicationWidget;