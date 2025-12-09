// Medication.tsx (updated)
import MedicationTab from '@/components/MedicationTab';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ExpandableCalendar, CalendarProvider, AgendaList } from 'react-native-calendars';
import MedicationModal from '../../components/MedicationModal';
import {DateFormat} from '@/util/DateTimeFormet';
import { useNavigation, useRouter } from 'expo-router';
import useApi from '@/CustomHooks/useCallAPI';
import { AuthContext } from '@/context/AuthContext';
import { BackSVG } from '@/assets/svgComponents/generalSVGs';
import GlobalStyleSheet from '../globalStyle';

interface AgendaItem {
    intakeTime: string;
    dosage: string;
    medicationName: string;
    medicationID: number;
    medicationScheduleID: number;
    isTaken?: boolean;
}

interface AgendaSection {
    title: string;
    data: AgendaItem[];
}

interface Medicine {
    medicine_name: string;
    description: string;
    dosage: string;
    start_date: string;
    end_date: string;
    intake_time_list: string[];
}

const Medication = () => {
    const todayDate = DateFormat(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [agendaItems, setAgendaItems] = useState<AgendaSection[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(todayDate);
    const router = useRouter();
    const { callApi: callMedicationApi, loading: loadingMedication } = useApi();
    const { callApi } = useApi();
    const {user} = useContext(AuthContext);
    const navigate = useNavigation();

    const [medicine, setMedicine] = useState<Medicine>({
        medicine_name: '',
        description: '',
        dosage: '',
        start_date: '',
        end_date: '',
        intake_time_list: ['']
    });

    const sendMedicationData = async (medData: Medicine) => {
        try{
            const response = await callApi({
                url: process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/addMedicationSchedule',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": user?.id ?? '-1',
                },
                body: JSON.stringify(medData),
            });

            Alert.alert('Success', 'Medication added successfully');
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    const handleSave = async (medData: Medicine) => {
        const success = await sendMedicationData(medData);
        if (success) {
            setModalVisible(false);
            dateChangeHandler(selectedDate); // Refresh the data
        }
    };

    const AgendaItemsHandler = (json: any, date: string) => {
        const transformedData: AgendaItem[] = json.data.schedule.map((scheduleItem: any) => {
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
            .sort((a: AgendaItem, b: AgendaItem) => {
                return a.intakeTime.localeCompare(b.intakeTime);
            });

        const agendaSection: AgendaSection = {
            title: date,
            data: transformedData
        };

        setAgendaItems(prevItems => {
            const existingIndex = prevItems.findIndex(item => item.title === date);

            if (existingIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingIndex] = agendaSection;
                return updatedItems;
            } else {
                return [agendaSection];
            }
        });
    };

    const handleStatusChange = (medicationID: number, medicationScheduleID: number, newStatus: boolean) => {
        setAgendaItems(prevItems => {
            return prevItems.map(section => {
                const updatedData = section.data.map(item => {
                    if (item.medicationID === medicationID && item.medicationScheduleID === medicationScheduleID) {
                        return {
                            ...item,
                            isTaken: newStatus
                        };
                    }
                    return item;
                });
                return {
                    ...section,
                    data: updatedData
                };
            });
        });
    };

    const dateChangeHandler = async (date: string) => {
        setSelectedDate(date);
        try {
            const response = await callMedicationApi({
                url: process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/getMedicationSchedule',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": user?.id??'-1',
                },
                body: JSON.stringify({ date }),
            });
            console.log("Medication response: ",response);
            
            AgendaItemsHandler(response, date);
        } catch (error) {
            console.error('Error fetching medication schedule:', error);
            Alert.alert('Error', 'Failed to load medication schedule');
        }
    };

    useEffect(() => {
        dateChangeHandler(todayDate);
    }, []);

    if (loadingMedication && agendaItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <ActivityIndicator/>
                </View>
            </SafeAreaView>
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
                <Text style={GlobalStyleSheet.mainHeading}>Medication Record</Text>
                <TouchableOpacity style={GlobalStyleSheet.addBtn} onPress={() => setModalVisible(true)}>
                    <Text style={{ color:'#2563EB', fontSize: 16}}>Add +</Text>
                </TouchableOpacity>
            </View>
            <CalendarProvider
                date={selectedDate}
                onDateChanged={(date) => { dateChangeHandler(date) }}
                showTodayButton
            >
                <ExpandableCalendar />
                <TouchableOpacity style={styles.allmedications} onPress={() => router.push('/home/myMedication')}>
                    <Text style={{ color: '#007bff', fontSize: 18, marginLeft: 15 }}>All Medications</Text>
                </TouchableOpacity>
                {agendaItems.length > 0 ? <AgendaList
                    sections={agendaItems}
                    renderItem={(item: { item: AgendaItem }) => {
                        return (
                            <MedicationTab
                                medicationName={item.item.medicationName}
                                dosage={item.item.dosage}
                                intakeTime={item.item.intakeTime}
                                medicationID={item.item.medicationID}
                                medicationScheduleID={item.item.medicationScheduleID}
                                istaken={item.item.isTaken}
                                onStatusChange={handleStatusChange}
                                selectedDate={selectedDate}
                            />
                        );
                    }}
                /> : <></>}
            </CalendarProvider>
            <MedicationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    medicationheader: {
        backgroundColor: 'white',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    allmedications:{
        backgroundColor: 'white',
        alignItems: 'flex-end',
        paddingHorizontal: 20
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Medication;