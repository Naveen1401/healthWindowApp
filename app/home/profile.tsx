// ProfileScreen.tsx

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
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@/context/AuthContext";

// If you’re using React Navigation, you can place this screen in a stack and
// the headerRight will be handled via navigation.setOptions. Otherwise,
// we simply render a header row ourselves.

export default function Profile({ navigation }: any) {
  // Initial "hard‐coded" values:
  const [firstName, setFirstName] = useState("Naveen");
  const [lastName, setLastName] = useState("Mahanwal");
  const [email] = useState("naveen011214@gmail.com"); // readonly

    const { logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(
    "https://lh3.googleusercontent.com/a/ACg8ocKyG6kdnwvpXvceblZRgY8nivtAJWG1UJnXhNyFB2DK5hsbozkTaw=s96-c"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // If using React Navigation: set header button via navigation options
  useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                saveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, isEditing, firstName, lastName, profileImage]);

  // If NOT using React Navigation, you can comment out the above useLayoutEffect
  // and uncomment the header row in the render below.

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    // ✅ FIX: check if it was canceled (correct spelling) and narrow the type
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setProfileImage(selectedAsset.uri);
    }
  };
  

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Placeholder API endpoint—replace with your real URL
      const API_URL = "https://your-api.com/updateProfile";

      const body = {
        firstName,
        lastName,
        profileImage,
        // email is not sent/edited (read-only); if you need to send it, include here
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // You can inspect the JSON if the API sends back updated user object:
      // const json = await response.json();

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              saveProfile();
            } else {
              setIsEditing(true);
            }
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (isEditing) {
            pickImageFromGallery();
          }
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

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={[styles.value, { color: "#555" }]}>{email}</Text>
      </View>

      <Button title="Log Out" color={"red"} onPress={logout} />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
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
  cameraText: {
    color: "#FFF",
    fontSize: 12,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#111827",
  },
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
});
