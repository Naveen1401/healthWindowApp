import { isoConverter } from "@/util/DateTimeFormet";
import { useMemo } from "react";
import { View, Dimensions } from "react-native"
import { LineChart } from "react-native-gifted-charts";

interface dataPoint {
    value:number,
    label: string
}

const BloodPressureChart = (props:{data:any[]}) => {
    const {data} = props;
    const screenWidth = Dimensions.get("window").width;

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
        <View style={{ backgroundColor: "#e0e0e0", paddingVertical:10, borderRadius: 10}}>
            <LineChart
                width={screenWidth}
                color1="#338a43"
                color2="#4782ba"
                color3="#b03c3c"
                height={300}
                data={systolicData}
                data2={diastolicData}
                data3={heartbeatData}
                yAxisOffset={30}
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
                // stepValue={10}
                // noOfSections={15}
            />
        </View>
    )
}

export default BloodPressureChart;