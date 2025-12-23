import { StyleSheet, View, ScrollView, Platform } from "react-native";

export interface CardWidgetProps {
    header: React.ReactNode,
    content: React.ReactNode,
    footer?: React.ReactNode
    minHeight?: number,
    maxHeight?: number,
    hasData: boolean,
    height?: number,
    emptyStateComponent: React.ReactNode,
}

const WidgetCard: React.FC<CardWidgetProps> = ({
    header,
    content,
    footer,
    minHeight = 50,
    height = 200,
    maxHeight = 300,
    hasData,
    emptyStateComponent,
}) =>{
    
    return(
        <View style={{ ...styles.container, maxHeight: maxHeight }}>
            <View style={styles.header}>
                {header}
            </View>
            {hasData?
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={[styles.contentContainer, { height: height }]}>
                    {content}
                </ScrollView>:
                <View style={[styles.emptyStateContainer, {height: minHeight}]}>
                    {emptyStateComponent}
                </View>
            }
            {footer&&
                <View style={styles.footer}>
                    {footer}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    header:{
        height: 50,
        backgroundColor: '#dedede',
        paddingHorizontal:10,
        borderTopRightRadius: 16,
        borderTopLeftRadius:16,
        justifyContent: 'center'
    },
    container: {
        backgroundColor:'#fff',
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
                shadowColor: '#000',
            },
        }),
        marginBottom:16,
        borderWidth: 1,
        borderColor: "#dbdbdb"
    },
    contentContainer:{
        height: 200,
        overflow: 'scroll',
        borderRadius: 10,
        // margin:10
    },
    emptyStateContainer:{
        borderRadius: 10,
        justifyContent:'center',
        alignItems: 'center'
    },
    footer:{
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fafbfc',
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
    }
})

export default WidgetCard;