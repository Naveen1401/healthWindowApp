import { HeathDataType } from "@/util/type";
import { StyleSheet, Text, View } from "react-native";
import BloodPressureChart from "../HealthData/Charts/BloodPressureChart";
import GlucoseChart from "../HealthData/Charts/GlucoseChart";
import InsulineChart from "../HealthData/Charts/InsulineChart";
import WeightChart from "../HealthData/Charts/WeightChart";

export interface WidgetChartProp {
    type: HeathDataType,
    data: any[],
}

const containerHeight:number = 160;

const WidgetChart: React.FC<WidgetChartProp> = ({ type, data }) => {

    switch (type) {
        case 'bloodPressure':
            return (
                <View style={styles.chartContainer}>
                    <BloodPressureChart data={data} height={containerHeight} />
                </View>
            )
        case 'glucose':
            return (
                <View style={styles.chartContainer}>
                    <GlucoseChart data={data} height={containerHeight} />
                </View>
            )
        case 'insulin':
            return (
                <View style={styles.chartContainer}>
                    <InsulineChart data={data} height={containerHeight} />
                </View>
            )
        case 'weight':
            return (
                <View style={styles.chartContainer}>
                    <WeightChart data={data} height={containerHeight} />
                </View>
            )
        default:
            break;
    }
}

const styles = StyleSheet.create({
    chartContainer: {
        borderRadius:10
    }
})

export default WidgetChart;