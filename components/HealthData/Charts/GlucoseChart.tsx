import { isoConverter } from "@/util/DateTimeFormet";
import { useMemo } from "react";
import { View, Dimensions } from "react-native"
import { LineChart } from "react-native-gifted-charts";

interface dataPoint {
    value: number,
    label: string,
    dataPointText: string
}

const GlucoseChart = (props: { data: any[] }) => {
    const { data } = props;
    const screenWidth = Dimensions.get("window").width

    const { nameData } = useMemo(() => {
        const nameData: dataPoint[] = [];

        const reversedData = [...data].slice(0, 7).reverse();

        reversedData.forEach((item) => {
            let label = isoConverter(item.stampingTime);
            nameData.push({ value: item.glucose, label, dataPointText: item.patientState });
        })

        return { nameData };
    }, [data]);

    return (
        <View style={{ backgroundColor: "#e0e0e0", padding: 10, borderRadius: 10 }}>
            <LineChart
                width={screenWidth}
                color1="#338a43"
                color2="#4782ba"
                color3="#b03c3c"
                height={300}
                data={nameData}
                showVerticalLines
                xAxisLabelTextStyle={
                    { fontSize: 10 }
                }
                yAxisTextStyle={
                    { fontSize: 10 }
                }
            // stepValue={10}
            // noOfSections={15}
            />
        </View>
    )
}

export default GlucoseChart;