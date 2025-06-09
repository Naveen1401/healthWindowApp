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
    }
});

export default GlobalStyleSheet;