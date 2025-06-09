import { isoConverter } from "@/util/DateTimeFormet";
import { useMemo } from "react";
import { View, Dimensions } from "react-native"
import { LineChart } from "react-native-gifted-charts";


interface dataPoint {
    value: number,
    label: string
}

const WeightChart = (props: { data: any[] }) => {
    const {data} = props;
        const screenWidth = Dimensions.get("window").width;
    
        const weightData = useMemo(()=>{
            const weightData : dataPoint[]  = [];
    
            const reversedData = [...data].slice(0, 7).reverse();
    
            reversedData.forEach((item)=>{
                let label = isoConverter(item.stampingTime);
                weightData.push({ value: item.weightInKgs, label });
            })
    
            return weightData;
        }, [data]);
    return (
        <View style={{ backgroundColor: "#e0e0e0", padding:10, borderRadius: 10}}>
            <LineChart
                width={screenWidth}
                color1="#338a43"
                color2="#4782ba"
                color3="#b03c3c"
                height={300}
                data={weightData}
                yAxisOffset={50}
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

export default WeightChart;