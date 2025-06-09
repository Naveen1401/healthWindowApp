import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    ActivityIndicator,
} from "react-native";
import GlobalStyleSheet from "../globalStyle";
import { useEffect, useState } from "react";
import useApi from "@/CustomHooks/useCallAPI";
import { useLocalSearchParams } from "expo-router";
import HealthDataList from "@/components/HealthData/HealthDataList";
import AddGlucose from "@/components/HealthData/AddForm/AddGlucose";
import AddInsuline from "@/components/HealthData/AddForm/AddInsuline";
import AddBloodPressure from "@/components/HealthData/AddForm/AddBloodPressure";
import AddWeight from "@/components/HealthData/AddForm/AddWeight";
import BloodPressureChart from "@/components/HealthData/Charts/BloodPressureChart";
import GlucoseChart from "@/components/HealthData/Charts/GlucoseChart";
import WeightChart from "@/components/HealthData/Charts/WeightChart";
import InsulineChart from "@/components/HealthData/Charts/InsulineChart";

const HealthDataScreen = () => {
    const { healthType, title } = useLocalSearchParams();
    const [visible, setVisible] = useState<boolean>(false);
    const [healthData, setHealthData] = useState<any[]>([]);
    const { callApi, loading } = useApi();

    const MODAL_COMPONENTS: Record<string, React.FC<any>> = {
        INSULIN: AddInsuline,
        BLOOD_PRESSURE: AddBloodPressure,
        GLUCOSE: AddGlucose,
        WEIGHT: AddWeight,
    };

    const CHART_COMPONRNT: Record<string, React.FC<any>> = {
        INSULIN: InsulineChart,
        BLOOD_PRESSURE: BloodPressureChart,
        GLUCOSE: GlucoseChart,
        WEIGHT: WeightChart,
    }

    const AddDataComponent = MODAL_COMPONENTS[healthType as string];

    const HealthDataChart = CHART_COMPONRNT[healthType as string];

    useEffect(() => {
        getHealthData();
    }, []);

    const getHealthData = async () => {
        const response = await callApi({
            url:
                process.env.EXPO_PUBLIC_BACKEND_SERVER +
                "/patient/getHealthData?type=" +
                healthType,
            headers: { "Patient-Id": "1" },
        });

        setHealthData(response.data);
    };

    const handleDeleteHealthData = async (id: number) => {
        try {
            const response = await callApi({
                method: "POST",
                url: process.env.EXPO_PUBLIC_BACKEND_SERVER + "/patient/deleteHealthData",
                headers: { "Patient-Id": "1" },
                body: {
                    type: healthType,
                    id: id
                }
            });

            Alert.alert("Success", "Record deleted successfully!");

            const updatedData = healthData.filter(item => item.id !== id);
            setHealthData(updatedData); // 👈 update list and chart

        } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Failed to delete health data.");
        }
    };


    const addHealthData = async (data: any) => {
        const payload = {
            type: healthType,
            health_record: { ...data, stamping_time: new Date().toISOString() },
        };

        console.log("Payload : ", payload)

        try {
            const response = await callApi({
                url: process.env.EXPO_PUBLIC_BACKEND_SERVER + "/patient/addHealthData",
                method: "POST",
                body: payload,
                headers: { "Patient-Id": "1" },
            });

            console.log("API response:", response);
            if (response.status !== 201) {
                Alert.alert("Error", "Please try again there is some error");
            } else {
                Alert.alert("Success", "Health data saved successfully!");
            }
            getHealthData(); // Refresh list
        } catch (error) {
            console.error("API error:", error);
            Alert.alert("Error", "Failed to save health data.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={style.headingContainer}>
                    <Text className="relative" style={GlobalStyleSheet.mainHeading}>
                        {title}
                    </Text>
                    <Pressable style={style.addContainer}>
                        <Button title="Add +" onPress={() => setVisible(true)} />
                    </Pressable>
                </View>

                <HealthDataChart data={healthData} />

                <AddDataComponent
                    visible={visible}
                    setVisible={setVisible}
                    onSave={addHealthData}
                />

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <HealthDataList
                            data={healthData}
                            type={healthType as string}
                            onDelete={handleDeleteHealthData}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    headingContainer: {
        justifyContent: "center",
    },
    addContainer: {
        position: "absolute",
        right: 0,
        paddingHorizontal: 20,
    },
});

export default HealthDataScreen;
