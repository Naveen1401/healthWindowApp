import { TouchableOpacity, View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import GlobalStyleSheet from "../globalStyle"
import { BackSVG } from "@/assets/svgComponents/generalSVGs"
import { useNavigation } from "expo-router"
import Button from "@/components/Button"
import useApi from "@/CustomHooks/useCallAPI"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"

const DeleteAccount = () => {
    const navigate = useNavigation();
    const {callApi} = useApi();
    const {user, logout} = useContext(AuthContext);
    const handleDelete = async() => {
        const responce = await callApi({
            url: `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/common/deleteUser?userId=${user?.user_id}`,
            method: "DELETE",
            headers: {
                "Patient-Id": user?.id ?? '-1',
            },
        })
        console.log(responce);
        
        if(responce.status === 200){
            logout();
        }
    }
    return(
        <SafeAreaView>
            <View style={GlobalStyleSheet.header}>
                {/* Back Button */}
                <TouchableOpacity
                    style={GlobalStyleSheet.backBtn}
                    onPress={() => navigate.goBack()}
                >
                    <BackSVG style={GlobalStyleSheet.backIcon} />
                </TouchableOpacity>

                {/* Title */}
                <Text style={GlobalStyleSheet.mainHeading}>Delete account</Text>
            </View>
            <View style={{ padding: 20 }}>
                <Text
                    style={{
                        fontSize: 16,
                        color: "#111827",
                        lineHeight: 22,
                        marginBottom: 12,
                    }}
                >
                    Deleting your account will permanently remove all your data, including
                    reports and profile information.
                </Text>

                <Text
                    style={{
                        fontSize: 14,
                        color: "#6B7280",
                        lineHeight: 20,
                        marginBottom: 20
                    }}
                >
                    You can create a new account later using the same phone number or email,
                    but your previous data cannot be recovered.
                </Text>
                <Button title="Delete account" fullWidth={true} onPress={handleDelete} variant="danger" />
            </View>
        </SafeAreaView>
    )
}

export default DeleteAccount;