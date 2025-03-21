import { 
    Text, 
    SafeAreaView, 
    Modal, 
    Pressable, 
    View, 
    StyleSheet, 
    FlatList 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SelectionBox from './SelectionBox';

type AccessibilityAndAffiliationForReportProps = {
    id: number;
    openModel?: boolean,
    setOpenModel?: (visible:boolean)=>void;
    uploadedReportID : any
};


type Doctor = {
    id: number;
    name: string;
};

const AccessibilityAndAffiliationForReport: React.FC<AccessibilityAndAffiliationForReportProps> = ({ id, openModel, setOpenModel, uploadedReportID }) => {
    const [reportAccessModelVisibility, setReportAccessModelVisibility] = useState(false);
    const [doctorData, setDoctorData] = useState<Doctor[]>([]);
    const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_SERVER + '/patient/myDoctors',{
                method: "GET",
                headers : {
                    "Patient-Id": id.toString(),
                },
                redirect: "follow"
            });
            const json = await response.json();
            const transformedData = json?.data?.map((item:any )=> ({
                id:item.userId,
                name: item.doctorDetails.name
            }))
            console.log(transformedData);
            setDoctorData(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const modelClosingHandler = () =>{
        if(setOpenModel){
            setOpenModel(false);
        }else{
            setReportAccessModelVisibility(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const toggleSelection = (id: number) => {
        if(id===-1){
            selectedDoctors?.length !== doctorData?.length ?setSelectedDoctors(doctorData.map(doc=>doc.id)): setSelectedDoctors([]);
        }else{
            setSelectedDoctors((prevSelected) =>
                prevSelected.includes(id) 
                    ? prevSelected.filter(docId => docId !== id)
                    : [...prevSelected, id] 
            );
        }
        
        console.log(id);
        
    };

    if(doctorData.length===0) return;

    return (
        <Modal
            visible={openModel ?? reportAccessModelVisibility}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Doctors</Text>
                    
                    <SelectionBox 
                        listText="All doctors" 
                        status={selectedDoctors?.length === doctorData?.length} 
                        pressHandler={() => toggleSelection(-1)}
                    />

                    <FlatList
                        data={doctorData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <SelectionBox 
                                listText={`${item.name}`} 
                                status={selectedDoctors.includes(item.id)} 
                                pressHandler={() => toggleSelection(item.id)}
                            />
                        )}
                    />

                    <Pressable style={styles.closeButton} onPress={modelClosingHandler}>
                        <Text style={styles.buttonText}>Close Modal{uploadedReportID}</Text>
                    </Pressable>
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
        position: 'absolute', // Removes it from normal layout flow
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
        height: 500
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
    }
});

export default AccessibilityAndAffiliationForReport;
