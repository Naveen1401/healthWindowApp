// Medication.tsx (updated)
import MedicationTab from '@/components/MedicationTab';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, Button, ScrollView, SafeAreaView, Alert } from 'react-native';
import { ExpandableCalendar, CalendarProvider, AgendaList } from 'react-native-calendars';
import MedicationModal from '../../components/MedicationModal';
import {DateFormat} from '@/util/DateTimeFormet';

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

    const [medicine, setMedicine] = useState<Medicine>({
        medicine_name: '',
        description: '',
        dosage: '',
        start_date: '',
        end_date: '',
        intake_time_list: ['']
    });

    const sendMedicationData = async (medData: Medicine) => {
        const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/addMedicationSchedule', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Patient-Id": '1',
            },
            body: JSON.stringify(medData),
        });
        const json = await response.json();
        if (response.ok) {
            Alert.alert('Success', 'Medication added successfully');
            return true;
        }
        return false;
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
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/getMedicationSchedule', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": '1',
                },
                body: JSON.stringify({ date }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch medication schedule');
            }

            const json = await response.json();
            AgendaItemsHandler(json, date);
        } catch (error) {
            console.error('Error fetching medication schedule:', error);
            Alert.alert('Error', 'Failed to load medication schedule');
        }
    };

    useEffect(() => {
        dateChangeHandler(todayDate);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.medicationheader}>
                <Text style={{ fontSize: 16 }}>Medication Record</Text>
                <Button title='Add +' onPress={() => setModalVisible(true)} />
            </View>
            <CalendarProvider
                date={todayDate}
                onDateChanged={(date) => { dateChangeHandler(date) }}
                showTodayButton
            >
                <ExpandableCalendar />
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
});

export default Medication;