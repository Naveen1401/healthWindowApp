import { StyleSheet } from "react-native";

const GlobalStyleSheet = StyleSheet.create({
    mainHeading:{
        fontSize:20,
        fontWeight:"bold",
        textAlign: "center",
        paddingVertical: 10,
        color: "black"
    },
    subHeading:{
        fontSize:16,
        fontWeight:"500",
        margin: "auto",
        paddingVertical: 10,
    },
    header: {
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",

    },
    backBtn: {
        position: "absolute",
        left: 16,   // distance from left
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    backIcon: {
        height: 26,
        width: 26,
    },
    addBtn:{
        position: "absolute",
        right: 16,   // distance from left
        justifyContent: "center",
        alignItems: "center",
    }
});

export default GlobalStyleSheet;