import { StyleSheet, Text, View, TouchableOpacity } from "react-native"

export interface HeaderProp{
    title: string,
    actionComponent?: React.ReactNode, // Made optional
    onHeaderPress?: () => void
    onDragStart?: () => void;
}

const WidgetHeader: React.FC<HeaderProp> = ({ title, actionComponent, onHeaderPress, onDragStart }) => {
    
    return(
        <View style={styles.container}>
            <View>
                {onHeaderPress ? (
                    <TouchableOpacity onPress={onHeaderPress} onPressIn={onDragStart} activeOpacity={0.7}>
                        <Text style={styles.title}>≡ {title}</Text>
                    </TouchableOpacity>
                ) : (
                        <Text style={styles.title}>≡ {title}</Text>
                )}
            </View>
            
            {/* Only show actionComponent if provided */}
            {actionComponent && (
                <View>
                    {actionComponent}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2563EB',
    },
})

export default WidgetHeader;