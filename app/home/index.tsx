import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ImageSourcePropType, Pressable, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { HeathDataType } from "@/util/type";
import HealthDataWidget from "@/components/HealthDataWidget";
import MedicationWidget from "@/components/MedicationWidget";
import ConsultationWidget from "@/components/ConsultationWidget";
import ReportWidget from "@/components/ReportWidget";
import { useHomeRefresh } from "@/context/HomeRefreshContext";
import OPSWidget from "@/components/OPDWidget";


export default function HomeScreen() {
  const { triggerRefresh, refreshingCount } = useHomeRefresh();

  const refreshing = refreshingCount > 0;

  const onRefresh = () => {
    triggerRefresh();
  };

  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [selectedChart, setSelectedChart] = useState<HeathDataType>('weight');

  const screenHeader = (
    <View style={styles.welcomeContainer}>
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
  );

  const myDoctors = (
    <TouchableOpacity onPress={() => router.push('/home/myDoctor')}>
      <View style={styles.myDoctors}>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={[styles.heroText, { marginBottom: 5 }]}>
            Connect with
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.heroText}>
              Doctors
            </Text>
            <View style={styles.chevronContainer}>
              <Text style={[styles.heroText, { lineHeight: 26 }]}>
                &rsaquo;
              </Text>
            </View>
          </View>
          <Text style={{ color: '#fff', fontSize: 10 }}>
            View all Doctors
          </Text>
        </View>
        <Image
          source={require('../../assets/images/doctor.png')}
          style={styles.imageStyle}
        />
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0064f7"       // iOS spinner color
            colors={["#0064f7"]}     // Android spinner color
          />
        }
        >
        {screenHeader}
        <View style={styles.widgetContainer}>
          {myDoctors}
          <HealthDataWidget />
          <MedicationWidget />
          <ConsultationWidget />
          <ReportWidget/>
          <OPSWidget/>
          {/* Add some bottom padding for better scrolling */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  welcomeContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: "#292d33",
    borderWidth: 3
  },
  profileIcon: {
    position: "absolute",
    right: 20
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  dropdown: {
    height: 30,
    width: 150,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  widgetContainer: {
    padding: 16,
  },
  bottomSpacing: {
    height: 20, // Add some space at the bottom for better scrolling
  },
  myDoctors:{
    width: '100%',
    height: 200,
    backgroundColor: '#0064f7',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10
  },
  imageStyle: {
    width: 140, 
    height: 200, 
    transform: [{ scaleX: -1 }]
  },
  heroText:{
    fontSize: 25,
    fontWeight: 800,
    color: '#fff',
  },
  chevronContainer: { 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    borderRadius: 50, 
    height: 30, 
    width: 30, 
    justifyContent:'center',
    alignItems: 'center',
    marginLeft: 8,
  }
});