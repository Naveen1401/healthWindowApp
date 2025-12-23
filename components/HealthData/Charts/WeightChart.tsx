import { isoConverter } from "@/util/DateTimeFormet";
import { useMemo,useState } from "react";
import { View, Dimensions } from "react-native"
import { LineChart } from "react-native-gifted-charts";


interface dataPoint {
    value: number,
    label: string
}

const WeightChart = (props: { data: any[], height?: number }) => {
    const {data, height} = props;
    const [parentWidth, setParentWidth] = useState(Dimensions.get("window").width);


    const handleWith = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setParentWidth(width);
    }

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
        <View style={{ backgroundColor: "#fff", padding:10, borderRadius: 10}} onLayout={handleWith}>
            <LineChart
                width={parentWidth*0.8}
                color1="#338a43"
                color2="#4782ba"
                color3="#b03c3c"
                height={height??300}
                data={weightData}
                yAxisOffset={0}
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