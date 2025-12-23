import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { BackSVG } from "@/assets/svgComponents/generalSVGs";
import GlobalStyleSheet from "../globalStyle";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export interface User {
    id: string;
    name: string;
    email: string;
    imageURL: string;
    phoneNo: string;
}

export default function PrescriptionWebView() {
    const { prescription } = useLocalSearchParams<{ prescription: string }>();
    const data = JSON.parse(prescription!);
    const {user} = useContext(AuthContext)

    const html = generatePrescriptionHTML(user, data);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={GlobalStyleSheet.header}>
                <TouchableOpacity
                    style={GlobalStyleSheet.backBtn}
                    onPress={() => router.back()}
                >
                    <BackSVG style={GlobalStyleSheet.backIcon} />
                </TouchableOpacity>

                <Text style={GlobalStyleSheet.mainHeading}>
                    Prescription #{data.id}
                </Text>
            </View>

            {/* HTML Prescription */}
            <WebView
                originWhitelist={["*"]}
                source={{ html }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const generatePrescriptionHTML = (user: User | null, prescription: any) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:20px; font-family:Arial, sans-serif; color:#333;">

<h1 style="
  text-align:center;
  padding:12px;
  background-color:#71B1CE;
  font-size:20px;
  color:#152B37;
">
  CONSULTATION SUMMARY
</h1>

<div style="display:flex; justify-content:space-between; margin:20px 0; font-size:14px;">
  <div style="width:48%;">
    <p><b>Consultation Date:</b> ${new Date(prescription.created_at).toLocaleString()}</p>
    <p><b>Consultant:</b> Dr. ${prescription.doctorName}</p>
  </div>

  <div style="width:48%;">
    <p><b>Patient MRN:</b> ${prescription.patient_id}</p>
    <p><b>Patient Name:</b> ${user?.name}</p>
  </div>
</div>

${section("Chief Complaints", prescription.complaints)}
${section("History of Illness", prescription.history_of_illness)}
${section("Notes", prescription.notes)}
${section("Allergy", prescription.allergy)}
${section("Diagnosis", prescription.diagnosis)}
${section("Advice", prescription.advice)}

<div style="
  border-top:1px solid #ccc;
  margin-top:40px;
  padding-top:10px;
  font-size:12px;
  color:#666;
">
  Printed On: ${new Date().toLocaleString()}
</div>

</body>
</html>
`;

const section = (title: string, items: string[]) => `
<div style="margin-bottom:20px;">
  <h3 style="
    font-size:16px;
    border-bottom:1px solid #ccc;
    padding-bottom:4px;
  ">
    ${title}
  </h3>
  <ul style="padding-left:20px;">
    ${items.map(i => `<li>${i}</li>`).join("")}
  </ul>
</div>
`;
