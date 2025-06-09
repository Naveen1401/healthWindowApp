import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Checkbox } from 'react-native-paper'
import React from 'react'

type SelectionBoxProps = {
    listText: string,
    status: boolean,
    pressHandler: () => void
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ listText, status, pressHandler }) => {
    return (
        <Pressable style={style.selectionContainer} onPress={pressHandler}>
            <View style={style.checkboxContainer}>
                <Checkbox
                    status={status ? 'checked' : 'unchecked'}
                    color="#4CAF50"
                />
            </View>
            <Text style={style.text}>{listText}</Text>
        </Pressable>
    )
}

const style = StyleSheet.create({
    selectionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        borderRadius: 10,
        padding: 10,
    },
    checkboxContainer: {
        backgroundColor: "#f7f7f7",
        borderRadius: 100,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    text: {
        fontSize: 16,
    }
})

export default SelectionBox