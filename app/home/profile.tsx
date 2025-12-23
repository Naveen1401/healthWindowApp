import React, { useState, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@/context/AuthContext";
import useApi from "@/CustomHooks/useCallAPI";
import { BackSVG } from "@/assets/svgComponents/generalSVGs";
import { useNavigation } from "expo-router";
import GlobalStyleSheet from "../globalStyle";
import Button from "@/components/Button";

export default function Profile({ navigation }: any) {
  const { user, logout, setUserData } = useContext(AuthContext);

  const name = user?.name?.split(" ") || ["", ""];
  const phoneNo = user?.phoneNo || "";
  const [firstName, setFirstName] = useState(name[0]);
  const [lastName, setLastName] = useState(name[1]);
  const email = user?.email || "";

  const [phoneNumber, setPhoneNumber] = useState(phoneNo);

  const { callApi, loading } = useApi();
  const [profileImage, setProfileImage] = useState(user?.imageURL || "");

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigation();

  // 🔹 Top Navigation Buttons: Cancel on Left, Save/Edit on Right
  useLayoutEffect(() => {
    if (!navigation) return;

    navigation.setOptions({
      headerLeft: () =>
        isEditing ? (
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              resetForm(); // reset to original data
            }}
            style={styles.headerButton}
          >
            <Text style={[styles.headerButtonText, { color: "red" }]}>Cancel</Text>
          </TouchableOpacity>
        ) : null,

      headerTitle: "Profile", // centered automatically
      headerTitleAlign: "center",

      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (isEditing) saveProfile();
            else setIsEditing(true);
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing, firstName, lastName, profileImage, phoneNumber]);

  const resetForm = () => {
    setFirstName(name[0]);
    setLastName(name[1]);
    setProfileImage(user?.imageURL || "");
    setPhoneNumber(phoneNo); // reset phone
  };

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access gallery is needed!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [1, 1],
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    try {
      const body = {
        first_name: firstName,
        last_name: lastName,
        phone_no: phoneNumber || null,
      };

      console.log(body);
      

      await callApi({
        url:
          process.env.EXPO_PUBLIC_BACKEND_SERVER +
          "/patient/updatePatientDetails",
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "patient-Id": user?.id??"-1"
        },
        body: JSON.stringify(body),
      });

      setUserData(firstName, lastName, phoneNumber);

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Centered Profile Title for fallback layout (non-navigation mode) */}
      {!navigation && (
        <View style={GlobalStyleSheet.header}>
            {!isEditing?(
              <TouchableOpacity
                style={GlobalStyleSheet.backBtn}
                onPress={() => navigate.goBack()}
              >
                <BackSVG style={GlobalStyleSheet.backIcon} />
              </TouchableOpacity>
            ):(
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setIsEditing(false);
                  resetForm();
                }}
              >
                <Text style={[styles.headerButtonText, { color: "red" }]}>Cancel</Text>
              </TouchableOpacity>
            )}

            {/* Title */}
            <Text style={GlobalStyleSheet.mainHeading}>Medication Record</Text>
          <TouchableOpacity style={GlobalStyleSheet.addBtn} onPress={() => {
                if (isEditing) saveProfile();
                else setIsEditing(true);
          }}>
              <Text style={{ color: '#2563EB', fontSize: 16 }}>{isEditing ? "Save" : "Edit"}</Text>
            </TouchableOpacity>
        </View>
      )}
      <View style={{padding:20}}>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) pickImageFromGallery();
          }}
          activeOpacity={isEditing ? 0.7 : 1}
          style={styles.imageWrapper}
        >
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          {isEditing && (
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraText}>Change</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Patient ID</Text>
          <Text style={styles.value}>{user?.id}</Text>
        </View>
          
        {/* First Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>First Name</Text>
          {isEditing ? (
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>{firstName}</Text>
          )}
        </View>

        {/* Last Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Last Name</Text>
          {isEditing ? (
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>{lastName}</Text>
          )}
        </View>

        {/* Phone Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#999" 
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>{phoneNumber || "Not provided"}</Text>
          )}
        </View>

        {/* Email (not editable) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={[styles.value, { color: "#555" }]}>{email}</Text>
        </View>

        <Button title="Log Out" variant='danger-inverted' onPress={logout} />

        {loading && (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 24 }} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#F9FAFB" 
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  headerButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "500",
  },

  imageWrapper: {
    alignSelf: "center",
    marginBottom: 24,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    padding: 4,
  },
  cameraText: { color: "#FFF", fontSize: 12 },

  fieldContainer: { marginBottom: 18 },
  label: { fontSize: 14, color: "#374151", marginBottom: 4 },
  value: { fontSize: 16, color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFF",
  },
  cancelBtn: {
    position: "absolute",
    left: 16,   // distance from left
    justifyContent: "center",
    alignItems: "center",
  },
});
