import { useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

interface BPType {
    systolic: number;
    diastolic: number;
    heart_beat_per_min: number;
}

interface Props {
    visible: boolean;
    setVisible: (state: boolean) => void;
    onSave: (data: BPType) => void;
}

const AddBloodPressure = ({ visible, setVisible, onSave }: Props) => {
    const [healthRecord, setHealthRecord] = useState<Partial<BPType>>({});

    const handleChange = (field: keyof BPType, value: string) => {
        setHealthRecord((prev) => ({
            ...prev,
            [field]: Number(value),
        }));
    };

    const handleClose = () => {
        setVisible(false);
        setHealthRecord({});
    };

    const handleSave = () => {
        const { systolic, diastolic, heart_beat_per_min } = healthRecord;

        if (
            typeof systolic !== "number" || isNaN(systolic) ||
            typeof diastolic !== "number" || isNaN(diastolic) ||
            typeof heart_beat_per_min !== "number" || isNaN(heart_beat_per_min)
        ) {
            Alert.alert("Validation Error", "Please fill in all fields with valid numbers.");
            return;
        }

        if (systolic < 60 || systolic > 200 || diastolic < 40 || diastolic > 150) {
            Alert.alert('Confirm', 
            `Provided values are not normal please confirm once 
Systolic : ${systolic}
Diastolic : ${diastolic} 
heart beats per min : ${heart_beat_per_min}`,
                [
                    {
                        text: 'Confirm',
                        onPress: () => {
                            onSave({ systolic, diastolic, heart_beat_per_min });
                            handleClose();
                        }
                    },
                    {
                        text: 'Cancel',
                        style: "cancel"
                    }
                ], { cancelable: false }
            )
        }
        else{
            onSave({ systolic, diastolic, heart_beat_per_min });
            handleClose();
        }
        
    };

    return (
        <View style={styles.container}>
            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Add BP Data</Text>

                        <Text style={styles.label}>Systolic</Text>
                        <TextInput
                            onChangeText={(text) => handleChange("systolic", text)}
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Systolic (e.g. 120)"
                        />

                        <Text style={styles.label}>Diastolic</Text>
                        <TextInput
                            onChangeText={(text) => handleChange("diastolic", text)}
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Diastolic (e.g. 80)"
                        />

                        <Text style={styles.label}>Heart Beats per min</Text>
                        <TextInput
                            onChangeText={(text) => handleChange("heart_beat_per_min", text)}
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Heart Beats/min (e.g. 70)"
                        />

                        <View style={styles.buttonContainer}>
                            <Button title="Save" onPress={handleSave} />
                            <Button title="Cancel" color="grey" onPress={handleClose} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AddBloodPressure;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10
    },
    addButton: {
        backgroundColor: '#4A90E2',
        padding: 10, borderRadius: 8
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        maxHeight: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    button: {
        flex: 1,
        backgroundColor: '#4A90E2',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        justifyContent: "center",
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
});
