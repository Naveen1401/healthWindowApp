// MedicationModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert, Button, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, DateData } from 'react-native-calendars';
import {DateFormat} from '@/util/DateTimeFormet';

interface Medicine {
    id?: number;
    medicine_name: string;
    description: string;
    dosage: string;
    start_date: string;
    end_date: string;
    intake_time_list: string[];
}

interface MedicationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (medicine: Medicine) => void;
    initialData?: Medicine;
    isEditMode?: boolean;
}

const MedicationModal: React.FC<MedicationModalProps> = ({
    visible,
    onClose,
    onSave,
    initialData = {
        medicine_name: '',
        description: '',
        dosage: '',
        start_date: '',
        end_date: '',
        intake_time_list: ['']
    },
    isEditMode = false
}) => {
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [currentTimeIndex, setCurrentTimeIndex] = useState<number | null>(null);
    const [tempTime, setTempTime] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const modelScrollRef = useRef<ScrollView>(null);

    const [medicine, setMedicine] = useState<Medicine>(initialData);
    const [selectedDates, setSelectedDates] = useState({
        startDate: initialData.start_date,
        endDate: initialData.end_date
    });

    useEffect(() => {
        if (visible) {
            setMedicine(initialData);
            setSelectedDates({
                startDate: initialData.start_date,
                endDate: initialData.end_date
            });
        }
    }, [visible]);


    const handleChange = (field: keyof Medicine, value: string) => {
        setMedicine(prev => ({ ...prev, [field]: value }));
    };

    // Date range selection handler
    const handleDayPress = (day: DateData) => {

        if (isEditMode) {
            if (new Date(day.dateString) < new Date()) {
                Alert.alert('Error', 'End date cannot be before today');
                return;
            }
            if (new Date(day.dateString) > new Date(selectedDates.startDate)) {
                const updatedDates = {
                    startDate: selectedDates.startDate,
                    endDate: day.dateString
                };
                setSelectedDates(updatedDates);
                setMedicine(prev => ({
                    ...prev,
                    end_date: day.dateString
                }));
            }
        } else {
            if (!selectedDates.startDate || selectedDates.endDate) {
                setSelectedDates({
                    startDate: day.dateString,
                    endDate: ''
                });
            } else {
                if (new Date(selectedDates.startDate) > new Date(day.dateString)) {
                    Alert.alert('Error', 'End date must be after start date');
                    return;
                }
                const updatedDates = {
                    startDate: selectedDates.startDate,
                    endDate: day.dateString
                };
                setSelectedDates(updatedDates);
                setMedicine(prev => ({
                    ...prev,
                    start_date: updatedDates.startDate,
                    end_date: updatedDates.endDate
                }));
            }
        }
    };

    // Time selection handlers
    const showTimePicker = (index: number) => {
        const currentTime = medicine.intake_time_list[index];
        if (currentTime) {
            const [hours, minutes] = currentTime.split(':');
            const newDate = new Date();
            newDate.setHours(parseInt(hours, 10));
            newDate.setMinutes(parseInt(minutes, 10));
            setTempTime(newDate);
        }
        setCurrentTimeIndex(index);
        setTimePickerVisible(true);
    };

    const handleTimeChange = (index: number, timeString: string) => {
        const updatedTimes = [...medicine.intake_time_list];
        updatedTimes[index] = timeString;
        setMedicine(prev => ({ ...prev, intake_time_list: updatedTimes }));
    };

    const handleTimeConfirm = () => {
        setTimePickerVisible(false);
        if (currentTimeIndex !== null) {
            const timeString = tempTime.toTimeString().substring(0, 8);
            handleTimeChange(currentTimeIndex, timeString);
        }
        setCurrentTimeIndex(null);
    };

    // Form submission
    const handleSave = () => {
        if (!medicine.start_date || !medicine.end_date) {
            Alert.alert('Error', 'Please select both start and end dates');
            return;
        }
        if (new Date(medicine.end_date) < new Date(medicine.start_date)) {
            Alert.alert('Error', 'End date must be after start date');
            return;
        }
        if (medicine.medicine_name.trim() === '' || medicine.dosage.trim() === '' || medicine.intake_time_list.some(t => t.trim() === '')) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }
        onSave(medicine);
        onClose();
    };

    // Calendar marked dates configuration
    const markedDates: { [date: string]: any } = {};
    if (selectedDates.startDate) {
        markedDates[selectedDates.startDate] = {
            startingDay: true,
            color: isEditMode ? '#cccccc' : '#50cebb',
            disabled: isEditMode
        };
    }
    if (selectedDates.endDate) {
        markedDates[selectedDates.endDate] = {
            endingDay: true,
            color: '#50cebb'
        };
    }
    if (selectedDates.startDate && selectedDates.endDate) {
        // Mark dates between start and end
        const start = new Date(selectedDates.startDate);
        const end = new Date(selectedDates.endDate);
        let current = new Date(start);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            if (dateStr !== selectedDates.startDate && dateStr !== selectedDates.endDate) {
                markedDates[dateStr] = {
                    selected: true,
                    color: isEditMode ? '#e6e6e6' : '#50cebb'
                };
            }
            current.setDate(current.getDate() + 1);
        }
    }

    const handleCalendarClose = () => {
        if (selectedDates.startDate.trim() === '') {
            Alert.alert('Error', 'Please select an start date');
            return;
        }
        if (selectedDates.endDate.trim() === '') {
            Alert.alert('Error', 'Please select an end date');
            return;
        }


        setShowCalendar(false);
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView ref={modelScrollRef} onContentSizeChange={() => modelScrollRef.current?.scrollToEnd({ animated: true })}>
                        <Text style={styles.title}>{isEditMode ? 'Edit Medication' : 'Add Medication'}</Text>

                        {/* Medicine Name */}
                        <TextInput
                            placeholder="Medicine Name"
                            style={[styles.input, isEditMode && styles.disabledInput]}
                            value={medicine.medicine_name}
                            onChangeText={(text) => handleChange('medicine_name', text)}
                            editable={!isEditMode}
                        />

                        {/* Description */}
                        <TextInput
                            placeholder="Description"
                            style={[styles.input, isEditMode && styles.disabledInput]}
                            value={medicine.description}
                            onChangeText={(text) => handleChange('description', text)}
                            editable={!isEditMode}
                        />

                        {/* Dosage */}
                        <TextInput
                            placeholder="Dosage (e.g. 1 tab - 250 mg)"
                            style={[styles.input, isEditMode && styles.disabledInput]}
                            value={medicine.dosage}
                            onChangeText={(text) => handleChange('dosage', text)}
                            editable={!isEditMode}
                        />

                        {/* Date Range Picker */}
                        <Text style={styles.label}>Medication Period</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowCalendar(true)}
                        >
                            <Text>
                                {selectedDates.startDate
                                    ? `${formatDate(selectedDates.startDate)} - ${selectedDates.endDate ? formatDate(selectedDates.endDate) : 'Select end date'}`
                                    : 'Select date range'}
                            </Text>
                        </TouchableOpacity>

                        {showCalendar && (
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    current={selectedDates.startDate || DateFormat(new Date())}
                                    minDate={isEditMode ? selectedDates.startDate : DateFormat(new Date())}
                                    onDayPress={handleDayPress}
                                    markingType="period"
                                    markedDates={markedDates}
                                    theme={{
                                        backgroundColor: '#ffffff',
                                        calendarBackground: '#ffffff',
                                        selectedDayBackgroundColor: '#50cebb',
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: '#50cebb',
                                        arrowColor: '#50cebb',
                                        textDisabledColor: '#d9d9d9'
                                    }}
                                />
                                <Button title="Done" onPress={handleCalendarClose} />
                            </View>
                        )}

                        {/* Intake Times */}
                        <Text style={styles.label}>Intake Times</Text>
                        {medicine.intake_time_list.map((time, index) => (
                            <View key={index} style={styles.timeInputContainer}>
                                <TouchableOpacity
                                    style={styles.timeInput}
                                    onPress={() => showTimePicker(index)}
                                >
                                    <Text>{time ? formatTime(time) : 'Select time'}</Text>
                                </TouchableOpacity>
                                {medicine.intake_time_list.length > 1 && (
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => {
                                            const updatedTimes = [...medicine.intake_time_list];
                                            updatedTimes.splice(index, 1);
                                            setMedicine(prev => ({ ...prev, intake_time_list: updatedTimes }));
                                        }}
                                    >
                                        <Text style={styles.removeButtonText}>×</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        {/* Time Picker */}
                        {timePickerVisible && (
                            <View style={styles.timePickerContainer}>
                                <DateTimePicker
                                    value={tempTime}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (date) {
                                            setTempTime(date);
                                        }
                                    }}
                                    is24Hour={false}
                                    minuteInterval={30}
                                />
                                <View style={styles.timePickerButtons}>
                                    <Button title="Cancel" onPress={() => setTimePickerVisible(false)} />
                                    <Button title="OK" onPress={handleTimeConfirm} />
                                </View>
                            </View>
                        )}

                        {/* Add Time Button */}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                setMedicine(prev => ({
                                    ...prev,
                                    intake_time_list: [...prev.intake_time_list, '']
                                }));
                            }}
                        >
                            <Text style={styles.addButtonText}>+ Add Time</Text>
                        </TouchableOpacity>

                        {/* Form Buttons */}
                        <View style={styles.buttonContainer}>
                            <Button title="Save" onPress={handleSave} />
                            <Button title="Cancel" color="grey" onPress={onClose} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// Helper functions
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHours = hourNum % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
};

// Styles
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        justifyContent: 'center',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#9c9c9c'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    timeInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        justifyContent: 'center',
    },
    removeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#dce6fc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timePickerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    timePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default MedicationModal;