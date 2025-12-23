import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";
import { FormatTimeDisplay } from "@/util/DateTimeFormet";
import useApi from "@/CustomHooks/useCallAPI";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

type MedicationTabProps = {
    selectedDate: string;
    intakeTime: string;
    dosage: string;
    medicationName: string;
    medicationScheduleID: number;
    medicationID: number;
    istaken?: boolean;
    onStatusChange: (medicationID: number, medicationScheduleID: number, newStatus: boolean) => void;
}

const MedicationTab: React.FC<MedicationTabProps> = ({
    medicationID, 
    selectedDate,
    medicationName, 
    dosage,
    intakeTime, 
    istaken, 
    medicationScheduleID,
    onStatusChange
}) => {
    const getLocalTime = () => {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const {callApi} = useApi(); 
    const {user} = useContext(AuthContext);

    const intake_time = getLocalTime();

    const getLocalDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const intake_date = getLocalDate(); 
    
    const medicationTakenHandler = async () => {
        const newStatus = !istaken;
        onStatusChange(medicationID, medicationScheduleID, newStatus);
        
        const bodyData = {
            "medication_id": medicationID,
            "medication_schedule_id": medicationScheduleID,
            "intake_date": intake_date,
            "intake_time": intake_time,
            "medication_taken": newStatus
        };

        const response = await callApi({
            url: process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/upsertMedicationIntakeRecord',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Patient-Id": user?.id ?? "-1",
            },
            body: JSON.stringify(bodyData),
        });
        console.log(response);  
    }

    return (
        <View style={style.container}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{ marginRight: 10 }}>{FormatTimeDisplay(intakeTime.substring(0,5))}</Text>
                <Text>{medicationName} ({dosage})</Text>
            </View>
            <View style={style.checkBox}>
                <Checkbox disabled = {selectedDate!==intake_date} status={istaken ? 'checked' : 'unchecked'} onPress={medicationTakenHandler}/>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        marginHorizontal: 10,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    checkBox: {
        borderColor: '#404040',
        borderWidth: 1,
        borderRadius: 100,
        transform: [{ scale: 0.7 }],
    }
})

export default MedicationTab;