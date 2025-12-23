import DropdownComponent from "@/components/DropDownComponent";
import useKeyboardHeight from "@/CustomHooks/useKeyboardHeight";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import Button from "@/components/Button";

interface GlucoseType {
    glucose: number;
    patient_state: string;
    insulin_units: number
}

const AddGlucose = (props: {
    visible: boolean;
    setVisible: (state: boolean) => void;
    onSave: (data: GlucoseType) => void;
}) => {
    const { visible, setVisible, onSave } = props;
    const [healthRecord, setHealthRecord] = useState<Partial<GlucoseType>>({});
    const [selectedDropDownValue, setSelectedDropDownValue] = useState<string | null>(null);
    const keyboardHeight = useKeyboardHeight();

    const handleChange = (field: keyof GlucoseType, value: string) => {
        setHealthRecord((prev) => ({
            ...prev,
            [field]: Number(value),
        }));
    };

    const handleClose = () => {
        setVisible(false);
        setHealthRecord({});
        setSelectedDropDownValue(null);
    };

    const data = [
        { label: 'Fasting', value: 'FASTING' },
        { label: 'After meal', value: 'POSTPRANDIAL' },
        { label: 'Random', value: 'RANDOM' }
    ];

    const handleSave = () => {
        if (
            !healthRecord.glucose ||
            isNaN(healthRecord.glucose) || healthRecord.glucose<0 ||
            !selectedDropDownValue ||
            selectedDropDownValue === ""
        ) {
            Alert.alert("Validation Error", "Please enter valid glucose and meal info.");
            return;
        }

        onSave({ glucose: healthRecord.glucose, patient_state: selectedDropDownValue, insulin_units: 0.1 });
        handleClose();
    };

    return (
        // <View style={styles.container}>
            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleClose}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.modalOverlay, Platform.OS === 'android' && {
                        paddingBottom: keyboardHeight > 0 ? keyboardHeight : 0
                    }]}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.keyboardAvoidingView}
                        >

                            <View style={styles.modalContent}>
                                <Text style={styles.title}>Add Glucose Data</Text>
                                <Text style={styles.label}>Glucose</Text>
                                <TextInput
                                    onChangeText={(text) => handleChange("glucose", text)}
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Glucose (e.g. 140mg/dL)"
                                    placeholderTextColor="#999" 
                                />
                                <Text style={styles.label}>Meal Information</Text>
                                <DropdownComponent
                                    data={data}
                                    value={selectedDropDownValue}
                                    setValue={setSelectedDropDownValue}
                                    placeholder={"Meal Info"}
                                />
                                {/* <TextInput
                                    onChangeText={(text) => handleChange("insulin_units", text)}
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Insulin units (e.g. 0.2)"
                                /> */}
                                <View style={styles.buttonContainer}>
                                    <Button size="small" variant="danger-inverted" title="Cancel"  onPress={handleClose} />
                                    <Button size="small" variant="primary-inverted" title="Save" onPress={handleSave} />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        // </View>
    );
};

export default AddGlucose;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginVertical: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContent: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        maxHeight: '100%',
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        color: '#000',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
    },
});
