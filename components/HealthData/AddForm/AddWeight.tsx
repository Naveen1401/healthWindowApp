import useKeyboardHeight from "@/CustomHooks/useKeyboardHeight";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import Button from "@/components/Button";

interface WeightType {
    weight_in_kgs: number;
}

interface Props {
    visible: boolean;
    setVisible: (state: boolean) => void;
    onSave: (data: WeightType) => void;
}

const AddWeight = ({ visible, setVisible, onSave }: Props) => {
    const [healthRecord, setHealthRecord] = useState<Partial<WeightType>>({});
    const keyboardHeight = useKeyboardHeight();

    const handleChange = (field: keyof WeightType, value: string) => {
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
        const { weight_in_kgs } = healthRecord;

        if (typeof weight_in_kgs !== "number" || isNaN(weight_in_kgs) || weight_in_kgs<0) {
            Alert.alert("Validation Error", "Please enter a valid weight in kgs.");
            return;
        }

        onSave({ weight_in_kgs });
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
                                <Text style={styles.title}>Add Weight</Text>
                                <Text style={styles.label}>Weight</Text>
                                <TextInput
                                    onChangeText={(text) => handleChange("weight_in_kgs", text)}
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Weight (e.g. 65)"
                                    placeholderTextColor="#999" 
                                />

                                <View style={styles.buttonContainer}>
                                    <Button title="Cancel" size="small" variant="danger-inverted" onPress={handleClose} />
                                    <Button title="Save" size="small" variant="primary-inverted" onPress={handleSave} />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        // </View>
    );
};

export default AddWeight;


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
        color: '#000',
        borderRadius: 8,
        marginBottom: 12,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
    },
});
