import { isoConverter } from "@/util/DateTimeFormet";
import { useMemo, useState } from "react";
import { View, Dimensions } from "react-native"
import { LineChart } from "react-native-gifted-charts";

interface dataPoint {
    value: number,
    label: string,
    dataPointText: string
}

const GlucoseChart = (props: { data: any[], height?:number }) => {
    const { data, height } = props;
    const [parentWidth, setParentWidth] = useState(Dimensions.get("window").width);
    
    const handleWith = (event: any) => {
        const { width} = event.nativeEvent.layout;
        setParentWidth(width);
    }

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
        <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 10 }} onLayout={handleWith}>
            <LineChart
                width={parentWidth*0.8}
                color1="#338a43"
                color2="#4782ba"
                color3="#b03c3c"
                height={height??300}
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