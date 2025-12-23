import { Text, Modal, Pressable, StyleSheet, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { ReportType } from '@/util/type';
import { handleViewReport } from '@/util/helper';
import { AuthContext } from '@/context/AuthContext';
import useApi from '@/CustomHooks/useCallAPI';
import { useRouter } from 'expo-router';
import Button from './Button';

interface Report {
    id: number;
    reportName: string;
    reportDate: string;
}

type ReportListItemProps = {
    report: ReportType,
    handleDelete: (report: ReportType) => void,
    handleEdit: (report:ReportType)=>void,
}

const ReportListItem:React.FC<ReportListItemProps> = ({report, handleDelete, handleEdit}) => {
    const [visibility, setVisibility] = useState(false);
    const {user} = useContext(AuthContext);
    const {callApi} = useApi();
    const router = useRouter();

    const handleOptionSelect = (action: 'delete' | 'edit' | 'cancel') => {
        setVisibility(false);

        switch (action) {
            case 'delete':
                handleDelete(report);
                break;
            case 'edit':
                handleEdit(report);
                break;
            case 'cancel':
                break;
        }
    };

    return (
        <View>
            <View style={style.reportTab}>
                <Pressable
                    onPress={() => handleViewReport(report, user, callApi, router)}
                    style={style.reportDetails}
                >
                    <Text className='text-[#5288d9]'>{report.reportName}</Text>
                    <Text className='text-[#506c96]' style={{ paddingLeft: 5, fontSize :12 }}>({report.reportDate})</Text>
                </Pressable>
                <Pressable onPressIn={() => setVisibility(true)}>
                    <Text>⋮</Text>
                </Pressable>
            </View>

            <Modal visible={visibility}
                transparent={true}
                animationType="slide"
            > 
                <View style={style.modalOverlay}>
                    <View style={style.menuContainer}>
                        <View style={style.menuItem}><Button size='small' variant='danger-inverted' title='Delete' onPress={() => handleOptionSelect('delete')} /></View>
                        <View style={style.menuItem}><Button size='small' variant='primary-inverted' title='Edit Access' onPress={() => handleOptionSelect('edit')} /></View>
                        <View style={{ padding: 5 }}><Button size='small' variant='secondary-inverted' title='Cancel' onPress={() => handleOptionSelect('cancel')} /></View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const style = StyleSheet.create({
    reportTab : {
        display:"flex",
        flexDirection: "row",
        width: "100%",
        padding:10,
        borderRadius: 10,
        borderColor: "#d8d8d8",
        backgroundColor: "white",
        borderWidth:2,
        marginBottom:10,
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    reportDetails : {
        flex: 1,
        flexDirection: "row",
        paddingRight: 7,
        alignItems: "baseline",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    menuContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        maxHeight: '20%',
        paddingBottom: 30
    },
    menuItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
});

export default ReportListItem;