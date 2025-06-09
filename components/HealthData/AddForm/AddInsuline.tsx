import DropdownComponent from "@/components/DropDownComponent";
import { useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

interface InsulinType {
    insulin_units: number;
    insulin_name: string;
}

interface Props {
    visible: boolean;
    setVisible: (state: boolean) => void;
    onSave: (data: InsulinType) => void;
}

const AddInsuline = ({ visible, setVisible, onSave }: Props) => {
    const [healthRecord, setHealthRecord] = useState<Partial<InsulinType>>({});
    const [selectedDropDownValue, setSelectedDropDownValue] = useState<string | null>(null);

    const handleChange = (field: keyof InsulinType, value: string) => {
        if (field === "insulin_units") {
            setHealthRecord((prev) => ({
                ...prev,
                [field]: Number(value),
            }));
        } else {
            setHealthRecord((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleClose = () => {
        setVisible(false);
        setHealthRecord({});
        setSelectedDropDownValue(null);
    };

    const data = [
        { label: 'Rapid acting', value: 'Rapid-acting' },
        { label: 'Short acting', value: 'Short-acting' },
        { label: 'Intermediate acting', value: 'Intermediate-acting' },
        { label: 'Long acting', value: 'Long-acting' },
        { label: 'Ultra long acting', value: 'Ultra-long-acting' },
        { label: 'Premixed (70/30, 75/25, etc.)', value: 'Premixed' },
        { label: 'Inhaled insulin', value: 'Inhaled-insulin' },
        { label: 'Other', value: 'other' },
    ];

    const handleSave = () => {
        const insulin_name = selectedDropDownValue;
        const insulin_units = healthRecord.insulin_units;

        if (!insulin_name || insulin_name.trim() === "") {
            Alert.alert("Validation Error", "Please select insulin name.");
            return;
        }

        if (typeof insulin_units !== "number" || isNaN(insulin_units)) {
            Alert.alert("Validation Error", "Please enter a valid insulin unit.");
            return;
        }

        onSave({ insulin_name, insulin_units });
        handleClose();
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
                        <Text style={styles.title}>Add Insulin Data</Text>

                        <Text style={styles.label}>Insulin Name</Text>
                        <DropdownComponent
                            data={data}
                            value={selectedDropDownValue}
                            setValue={setSelectedDropDownValue}
                            label="Insulin Name"
                        />
                        {/* <TextInput
                            onChangeText={(text) => handleChange("insulin_name", text)}
                            style={styles.input}
                            placeholder="Insulin (e.g. Insulin 1)"
                        /> */}

                        <Text style={styles.label}>Insulin Units</Text>
                        <TextInput
                            onChangeText={(text) => handleChange("insulin_units", text)}
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Insulin units (e.g. 0.2)"
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

export default AddInsuline;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
});
