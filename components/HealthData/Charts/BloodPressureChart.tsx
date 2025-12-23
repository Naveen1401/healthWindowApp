import { isoConverter } from "@/util/DateTimeFormet";
import { useMemo, useState } from "react";
import { View, Dimensions, StyleProp, ViewStyle } from "react-native"
import { LineChart } from "react-native-gifted-charts";

interface dataPoint {
    value:number,
    label: string
}

const BloodPressureChart = (props: { data: any[], height?:number }) => {
    const { data, height } = props;
    const [parentWidth, setParentWidth] = useState(Dimensions.get("window").width);


    const handleWith = (event: any) => {
        const { width} = event.nativeEvent.layout;
        setParentWidth(width);
    }

    const {systolicData, diastolicData, heartbeatData} = useMemo(()=>{
        const systolicData : dataPoint[]  = [];
        const diastolicData : dataPoint[] = [];
        const heartbeatData : dataPoint[] = [];

        const reversedData = [...data].slice(0, 7).reverse();

        reversedData.forEach((item)=>{
            let label = isoConverter(item.stampingTime);
            systolicData.push({ value: item.systolic, label });
            diastolicData.push({ value: item.diastolic, label });
            heartbeatData.push({ value: item.heartBeatPerMin, label });
        })

        return {systolicData, diastolicData, heartbeatData};
    }, [data]);

    return (
        <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 10 }} onLayout={handleWith}>
            <LineChart
                width={parentWidth*0.9}
                color1="#338a43"
                color2="#4782ba"
                color3="#b03c3c"
                height={height ?? 300}
                data={systolicData}
                data2={diastolicData}
                data3={heartbeatData}
                yAxisOffset={10}
                showReferenceLine1
                referenceLine1Position={120}
                referenceLine1Config={{ color: '#338a43' }}
                showReferenceLine2
                referenceLine2Position={80}
                referenceLine2Config={{ color: '#4782ba' }}
                showReferenceLine3
                referenceLine3Position={70}
                referenceLine3Config={{ color:'#b03c3c'}}
                showVerticalLines
                xAxisLabelTextStyle={
                    {fontSize: 10}
                }
                yAxisTextStyle={
                    { fontSize: 10 }
                }
                adjustToWidth
                endSpacing={10}
                scrollToEnd
            />
        </View>
    )
}

export default BloodPressureChart;