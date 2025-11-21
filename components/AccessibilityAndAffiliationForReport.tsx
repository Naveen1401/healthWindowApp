import { 
    Text, 
    Modal, 
    View, 
    StyleSheet, 
    FlatList, 
    Button,
    Alert
} from 'react-native';
import React, { useContext, useState } from 'react';
import SelectionBox from './SelectionBox';
import useApi from '@/CustomHooks/useCallAPI';
import { AuthContext } from '@/context/AuthContext';


type AccessibilityAndAffiliationForReportProps = {
    doctors: Doctor[] ;
    openModel?: boolean,
    setOpenModel: (visible:boolean)=>void;
    reportID : number
};

type Doctor = {
    id: number;
    first_name: string;
    last_name: string;
};

const AccessibilityAndAffiliationForReport: React.FC<AccessibilityAndAffiliationForReportProps> = ({ doctors, openModel, setOpenModel, reportID }) => {
    const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
    const {callApi} = useApi();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useContext(AuthContext);

    const toggleSelection = (id: number) => {
        if(id===-1){
            selectedDoctors?.length !== doctors?.length ? setSelectedDoctors(doctors.map(doc=>doc.id)): setSelectedDoctors([]);
        }else{
            setSelectedDoctors((prevSelected) =>
                prevSelected.includes(id) 
                    ? prevSelected.filter(docId => docId !== id)
                    : [...prevSelected, id] 
            );
        }
    };

    if (doctors.length===0) {
        // Alert.alert("Info.", "You don't any doctors affiliated with you to grant access for th reports.")
        return;
    };

    const handleAffiliacation = async () => {
        setIsLoading(true);
        try {
            const response = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/accessibilityAndAffiliationForReport`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": user?.id ?? "-1"
                },
                body: JSON.stringify({
                    report_id: reportID,
                    all_doctors: false,
                    specific_accessibility_doctor_ids: selectedDoctors
                })
            });

            console.log("API Response:", response);
            setOpenModel(false); // Close modal on success
            setSelectedDoctors([]); // Reset selections
        } catch (error) {
            console.error("API Error:", error);
            // Optionally show error to user (e.g., using Alert)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={openModel}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Doctors</Text>
                    
                    <SelectionBox 
                        listText="All doctors" 
                        status={selectedDoctors?.length === doctors?.length} 
                        pressHandler={() => toggleSelection(-1)}
                    />

                    <FlatList
                        data={doctors}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <SelectionBox 
                                listText={`${item.first_name} ${item.last_name}`} 
                                status={selectedDoctors.includes(item.id)} 
                                pressHandler={() => toggleSelection(item.id)}
                            />
                        )}
                    />
                    <View style={styles.activityContainer}>
                        <Button
                            color="red"
                            title='Close'
                            onPress={() => {
                                setOpenModel(false);
                                setSelectedDoctors([]);
                            }}
                            disabled={isLoading}
                        />
                        <Button
                            title={isLoading ? 'Saving...' : 'Save'}
                            onPress={handleAffiliacation}
                            disabled={isLoading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Dark overlay for better visibility
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        height: 500,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    listItemText: {
        fontSize: 16,
        marginLeft: 8,
    },
    openButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FF3B30',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    doctorli:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
    },
    activityContainer:{
        flexDirection:"row",
        justifyContent: "space-between",
    }
});

export default AccessibilityAndAffiliationForReport;
