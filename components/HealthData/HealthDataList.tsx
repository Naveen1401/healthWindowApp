import useApi from '@/CustomHooks/useCallAPI';
import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Alert } from 'react-native';
import Button from '../Button';

interface HealthDataListProps {
    data: any[];
    type: string;
    onDelete: (id: number) => void; // 👈 New prop
}

const HealthDataList: React.FC<HealthDataListProps> = ({ data, type, onDelete }) => {
    const renderItem = ({ item }: { item: any }) => {
        const formattedTime = new Date(item.stampingTime).toLocaleString();

        let content = '';

        switch (type) {
            case 'INSULIN':
                content = `Insulin: ${item.insulinUnits} units, Name: ${item.insulinName}`;
                break;
            case 'WEIGHT':
                content = `Weight: ${item.weightInKgs} kg`; // fixed typo: weighxtInKgs -> weightInKgs
                break;
            case 'GLUCOSE':
                content = `Glucose: ${item.glucose}, Meal Info: ${item.patientState}`;
                break;
            case 'BLOOD_PRESSURE':
                content = `Systolic: ${item.systolic}, Diastolic: ${item.diastolic}, Heart Rate: ${item.heartBeatPerMin} bpm`;
                break;
            default:
                content = `Unknown data type`;
        }

        return (
            <View style={styles.itemContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.dateText}>{formattedTime}</Text>
                    <Text style={styles.contentText}>{content}</Text>
                </View>
                <Button
                    title="Delete"
                    variant='danger-inverted'
                    size='small'
                    onPress={() => {
                        Alert.alert("Delele", "Are you sure", [
                            {
                                text: "Delete",
                                style: "destructive",
                                onPress: ()=>onDelete(item.id)
                            },
                            {
                                text: "Cancel",
                                style: "cancel",
                            }
                        ])
                    }}
                />
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>No data available</Text>}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "black",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { height: 3, width: 0 }
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    contentText: {
        fontSize: 14,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});

export default HealthDataList;
