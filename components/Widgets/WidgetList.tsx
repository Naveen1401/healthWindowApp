import { StyleSheet, Text, View } from "react-native"

export interface ListProps {
    index: string,
    value: string,
    actionComponent: React.ReactNode,
}

const WidgetList: React.FC<ListProps> = ({ index, value, actionComponent }) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Text style={styles.index}>{index}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
            <View style={styles.rightSection}>
                {actionComponent}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    index: {
        // fontSize: 14,
        // fontWeight: '600',
        // color: '#4dabf7',
        minWidth: 50,
    },
    value: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        marginLeft: 8,
    },
    rightSection: {
        marginLeft: 12,
    }
})

export default WidgetList;