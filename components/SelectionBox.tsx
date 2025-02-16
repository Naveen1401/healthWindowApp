import { View, Text, Pressable } from 'react-native'
import {Checkbox} from 'react-native-paper'
import React from 'react'

type SelectionBoxProps={
    listText:string,
    status:boolean,
    pressHandler: ()=> void
}

const SelectionBox:React.FC<SelectionBoxProps> = ({listText,status, pressHandler}) => {
    return (
        <View>
            <Pressable onPress={pressHandler}>
                <Checkbox status={status?'checked':'unchecked'}/>
                <Text>{listText}</Text>
            </Pressable>
        </View>
    )
}

export default SelectionBox;