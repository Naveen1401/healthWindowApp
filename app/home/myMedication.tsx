import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, TextInput } from 'react-native';
import MedicationModal from '../../components/MedicationModal';
import { FormatTimeDisplay } from '@/util/DateTimeFormet';
import useApi from '@/CustomHooks/useCallAPI';
import { AuthContext } from '@/context/AuthContext';

interface Medication {
    id ?: number;
    medicine_name: string;
    description: string;
    dosage: string;
    start_date: string;
    end_date: string;
    intake_time_list: string[];
}

const MyMedication = () => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const {callApi: callFetchMedicationApi, loading: loadingMedications} = useApi(); 
    const {callApi} = useApi();
    const {user} = useContext(AuthContext);

    const fetchMedications = async () => {
        try {
            const response = await callFetchMedicationApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/getAllMedicationSchedules`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": user?.id??'-1',
                },
            });

            const formattedData = response.data.map((item: any) => ({
                id: item.medication_id,
                medicine_name: item.medicine_name,
                description: item.description,
                dosage: item.dosage,
                start_date: item.start_date,
                end_date: item.end_date,
                intake_time_list: item.intake_time_list
            }));
            
            setMedications(formattedData);
            setFilteredMedications(formattedData);
        } catch (error) {
            console.error('Error fetching medications:', error);
            Alert.alert('Error', 'Failed to load medications');
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    const handleEdit = (medication: Medication) => {
        setSelectedMedication(medication);
        setModalVisible(true);
    };

    const handleDelete = (medication: Medication) => {
        Alert.alert(
            'Delete Medication',
            `Are you sure you want to delete ${medication.medicine_name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const response = await callApi({
                                url:`${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/deleteMedicationSchedules?medicationId=${medication.id}`,
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Patient-Id": user?.id??'-1',
                                }
                            });

                            setMedications(prev => prev.filter(med => med.id !== medication.id));
                            setFilteredMedications(prev => prev.filter(med => med.id !== medication.id));

                            Alert.alert('Success', 'Medication deleted successfully');
                        } catch (error) {
                            console.error('Error deleting medication:', error);
                            Alert.alert('Error', 'Failed to delete medication');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleSave = async (updatedData: Medication) => {
        
        if (!selectedMedication) return;

        try {
            const response = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/addMedicationSchedule`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": user?.id??'-1',
                },
                body: JSON.stringify({
                    medication_id: selectedMedication.id,
                    medicine_name: updatedData.medicine_name,
                    description: updatedData.description,
                    dosage: updatedData.dosage,
                    start_date: updatedData.start_date,
                    end_date: updatedData.end_date,
                    intake_time_list: updatedData.intake_time_list
                }),
            });
            
            setMedications(prev => prev.map(med =>
                med.id === selectedMedication.id ? {
                    ...med,
                    dosage: updatedData.dosage,
                    end_date: updatedData.end_date,
                    intake_time_list: updatedData.intake_time_list
                } : med
            ));

            setFilteredMedications(prev => prev.map(med =>
                med.id === selectedMedication.id ? {
                    ...med,
                    dosage: updatedData.dosage,
                    end_date: updatedData.end_date,
                    intake_time_list: updatedData.intake_time_list
                } : med
            ));

            Alert.alert('Success', 'Medication updated successfully');
            setModalVisible(false);
            setSelectedMedication(null);
        } catch (error) {
            console.error('Error updating medication:', error);
            Alert.alert('Error', 'Failed to update medication');
        }
    };

    const handleSearch = useCallback((text: string) => {
        if(text.length === 0) {
            setFilteredMedications(medications);
            return;
        }
        setFilteredMedications(medications.filter(item => (
            item.medicine_name.toLowerCase().includes(text.toLowerCase()) ||
            item.description.toLowerCase().includes(text.toLowerCase()) ||
            item.dosage.toLowerCase().includes(text.toLowerCase())
        )));
    }, [medications]);

    const renderMedicationItem = ({ item }: { item: Medication }) => (
        <View style={styles.itemContainer}>
            <View style={styles.infoContainer}>
                <Text style={styles.medicineName}>{item.medicine_name}</Text>
                <Text style={styles.dosageText}>Dosage: {item.dosage}</Text>
                <Text style={styles.timeText}>
                    Times: {item.intake_time_list.length > 0
                        ? item.intake_time_list.map(FormatTimeDisplay).join(', ')
                        : 'No times set'}
                </Text>
                <Text style={styles.dateText}>
                    {item.start_date} to {item.end_date}
                </Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(item)}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity><TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item)}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>My Medications</Text>
            <TextInput
                placeholder='Search medications...'
                style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 10, marginHorizontal: 20 }}
                onChangeText= {(text)=>{handleSearch(text)}}
            />
            {loadingMedications ? (
                <Text style={styles.loadingText}>Loading medications...</Text>
            ) : filteredMedications.length === 0 ? (
                <Text style={styles.emptyText}>No medications found</Text>
            ) : (
                        <FlatList
                            data={filteredMedications}
                            renderItem={renderMedicationItem}
                            keyExtractor={(item, index) => {
                                if (item.id) return item.id.toString();
                                return `temp-${index}`;
                            }}
                            contentContainerStyle={styles.listContainer}
                        />
            )}

            <MedicationModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedMedication(null);
                }}
                onSave={handleSave}
                initialData={selectedMedication || undefined}
                isEditMode={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoContainer: {
        flex: 1,
    },
    medicineName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        color: '#2c3e50',
    },
    dosageText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 14,
        color: '#34495e',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#95a5a6',
        fontStyle: 'italic',
    },
    editButton: {
        backgroundColor: '#3498db',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
        alignItems: 'center',
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontWeight: '500',
        
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#7f8c8d',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#95a5a6',
        fontSize: 16,
    },
});

export default MyMedication;