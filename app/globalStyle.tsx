import { StyleSheet } from "react-native";

const GlobalStyleSheet = StyleSheet.create({
    mainHeading:{
        fontSize:20,
        fontWeight:"bold",
        margin: "auto",
        paddingBottom: 20, 
        paddingTop: 10,
        color: "black"
    },
    subHeading:{
        fontSize:16,
        fontWeight:"500",
        margin: "auto",
        paddingVertical: 10,
        color:"white"
    },
    reportTab : {
        display:"flex",
        flexDirection: "row",
        width: "100%",
        justifyContent:"space-between",
        padding:10,
        borderRadius: 10,
        borderColor: "#d8d8d8",
        backgroundColor: "white",
        borderWidth:2,
        marginBottom:10,
    },
});

export default GlobalStyleSheet;