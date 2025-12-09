import React, {useContext} from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ImageSourcePropType, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ReportSVG, MedicationSVGs, HealthDataSVG, MedicationTrackerSVG } from "@/assets/svgComponents/generalSVGs";
import { AuthContext } from "@/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const {user} = useContext(AuthContext);

  return (
    <SafeAreaView>
      <View style={styles.welcomeContainer}>
        <Pressable style={styles.addDocter}>
          <Button title="Add +" onPress={() => router.push('/home/docterAffiliation')} />
        </Pressable>
        <Text style={styles.mainHeading}>Hey {user?.name.split(" ")[0]}! 👋🏽 </Text>
        <TouchableOpacity style={styles.profileIcon} onPress={() => router.push('/home/profile')}>
          <Image 
            source={user?.imageURL
                  ? { uri: user?.imageURL }
                  : require('@/assets/images/profileIcon.png') // fallback to local image
            }
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push('/home/uploadReports')} style={styles.reportsTab}>
        <ReportSVG transform={'rotate(350)'} height={80} width={80} />
        <Text style={{color:"white", fontSize: 20, fontWeight: "600", marginLeft:15}}>Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/home/myconsultation')} style={styles.medicationTrakerTab}>
        <MedicationTrackerSVG transform={'rotate(350)'} height={80} width={80} />
        <Text style={{ color: "white", fontSize: 20, fontWeight: "600", marginLeft: 15 }}>My Consultations </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/home/medication')} style={styles.medicationTab}>
        <MedicationSVGs transform={'rotate(350)'} height={80} width={80} />
        <Text style={{ color: "white", fontSize: 20, fontWeight: "600", marginLeft: 15 }}>Medication </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/home/healthData')} style={styles.healthDataTab}>
        <HealthDataSVG transform={'rotate(350)'} height={80} width={80} />
        <Text style={{ color: "white", fontSize: 20, fontWeight: "600", marginLeft: 15 }}>Health Data</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  welcomeContainer:{
    height: 50,
    justifyContent: "center",
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: "#292d33",
    borderWidth: 3
  },
  profileIcon:{
    position:"absolute",
    right: 20
  },
  addDocter:{
    position: "absolute",
    left: 20
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  reportsTab:{
    backgroundColor:"#00b4d8",
    alignItems:"center",
    flexDirection:"row",
    padding: 20,
    justifyContent:"center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20
  },
  medicationTab: {
    backgroundColor: "#ade8f4",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20
  },
  medicationTrakerTab: {
    backgroundColor: "#90e0ef",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20
  },
  healthDataTab: {
    backgroundColor: "#caf0f8",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20
  }
});