import { useState, useEffect, useContext } from "react";
import { View, ActivityIndicator, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { HeathDataType } from "@/util/type";
import WidgetCard from "@/components/Widgets/WidgetCard";
import WidgetHeader from "@/components/Widgets/WidgetHeader";
import WidgetChart from "@/components/Widgets/WidgetChart";
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "@/context/AuthContext";
import useApi from "@/CustomHooks/useCallAPI";
import { useRouter } from "expo-router";
import AddHealthData from "./AddHealthData";
import GlobalStyleSheet from "@/app/globalStyle";

interface HealthDataWidgetProps {
    initialType?: HeathDataType;
    onDragStart?: () => void;
}

const HealthDataWidget: React.FC<HealthDataWidgetProps> = ({
    initialType = 'weight',
    onDragStart
}) => {
    const [selectedType, setSelectedType] = useState<HeathDataType>(initialType);
    const [healthData, setHealthData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const { callApi } = useApi();
    const [visible, setVisible] = useState<boolean> (false);
    const router = useRouter();

    // Fetch data based on selected type
    useEffect(() => {
        fetchHealthData();
    }, [selectedType]);

    const fetchHealthData = async () => {
        setLoading(true);
        try {
            // Convert widget type to API type
            const apiType = getApiType(selectedType);

            const response = await callApi({
                url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/patient/getHealthData?type=${apiType}`,
                headers: { "Patient-Id": user?.id ?? "-1" },
            });

            setHealthData(response.data || []);
        } catch (error) {
            console.error("Failed to fetch health data:", error);
        } finally {
            setLoading(false);
        }
    };

    const addHealthData = async (data: any) => {
        const payload = {
            type: getApiType(selectedType),
            health_record: { ...data, stamping_time: new Date().toISOString() },
        };

        console.log("Payload : ", payload)

        try {
            const response = await callApi({
                url: process.env.EXPO_PUBLIC_BACKEND_SERVER + "/patient/addHealthData",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Patient-Id": user?.id ?? "-1"
                },
                body: JSON.stringify(payload),
            });

            console.log("API response:", response);
            if (response.status !== 201) {
                Alert.alert("Error", "Please try again there is some error");
            } else {
                Alert.alert("Success", "Health data saved successfully!");
            }
            fetchHealthData(); // Refresh list
        } catch (error) {
            console.error("API error:", error);
            Alert.alert("Error", "Failed to save health data.");
        }
    };

    const getApiType = (type: HeathDataType): string => {
        const typeMap = {
            bloodPressure: 'BLOOD_PRESSURE',
            glucose: 'GLUCOSE',
            insulin: 'INSULIN',
            weight: 'WEIGHT'
        };
        return typeMap[type] || 'WEIGHT';
    };

    const chartOptions = [
        { label: 'Blood Pressure', value: 'bloodPressure' },
        { label: 'Insulin', value: 'insulin' },
        { label: 'Weight', value: 'weight' },
        { label: 'Glucose', value: 'glucose' },
    ];

    const header = (
        <WidgetHeader
            title="Health Data"
            actionComponent={
                <Dropdown
                    style={styles.dropdown}
                    data={chartOptions}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Select chart"
                    value={selectedType}
                    onChange={(item) => setSelectedType(item.value)}
                    selectedTextStyle={styles.selectedTextDD}
                />
            }
            onHeaderPress={() => router.push('/home/healthData')}
            onDragStart={onDragStart}
        />
    );

    const content = loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
            <ActivityIndicator size="small" color="#2563EB" />
        </View>
    ) : (
        <WidgetChart type={selectedType} data={healthData} />
    );

    const footer = (
        <View>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Text style={{ color: '#2563EB', fontSize: 16 }}>Add {selectedType} + </Text>
            </TouchableOpacity>
            <AddHealthData type={selectedType} visibility={visible} setVisibility={setVisible} onSave={addHealthData}/>
        </View>
    )

    return (
        <WidgetCard
            header={header}
            content={content}
            footer={footer}
            hasData={healthData.length > 0}
            emptyStateComponent={
                <View>
                    <Text>No {selectedType} data available</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 24,
        width: 130,
        borderColor: '#2563EB',
        borderBottomWidth: 1,
    },
    selectedTextDD:{
        color: '#2563EB',
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    emptyStateButton: {
        marginTop: 12,
    },
});

export default HealthDataWidget;