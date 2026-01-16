import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export interface User {
  id: string;
  name: string;
  email: string;
  user_id: string;
  imageURL: string;
  phoneNo: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  setAuthData: (user: User, access: string, refresh: string) => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  logout: () => Promise<void>;
  setUserData: (firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isLoggedIn = !!accessToken && !!user;

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedAccess = await AsyncStorage.getItem("accessToken");
        const storedRefresh = await AsyncStorage.getItem("refreshToken");

        if (storedUser && storedAccess && storedRefresh) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
        }
      } catch (err) {
        console.log("Auth restore error", err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const setUserData = async (
    firstName: string,
    lastName: string,
    phoneNumber: string
  ) => {
    try {
      if (!user) return; // If no user logged in, do nothing

      // Create updated user object
      const updatedUser: User = {
        ...user,
        name: `${firstName} ${lastName}`,
        phoneNo: phoneNumber,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);

      console.log("Updated user: ", updatedUser);
    } catch (err) {
      console.log("Error updating user data:", err);
    }
  };


  const setAuthData = async (user: User, access: string, refresh: string) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);

      setUser(user);
      setAccessToken(access);
      setRefreshToken(refresh);

      router.replace('/home');

      console.log("User: ", user);
      console.log('refresh : ', refresh),
      console.log('access : ', access)
    } catch (err) {
      console.log("Auth save error", err);
    }
  };

  // Refresh token method — used on 401 response
  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;

    console.log("Refresh token :: ", refreshToken);
    

    try {
      const request = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      const responce = await request.json();

      console.log("Responce for the refresh token :", responce);
      
      if (!responce?.data?.accessToken) return null;

      await AsyncStorage.setItem("accessToken", responce?.data?.accessToken);
      setAccessToken(responce?.data?.accessToken);
      setRefreshToken(responce?.data?.refreshToken);

      return responce?.data?.accessToken;
    } catch (err) {
      console.log("Refresh error", err);
      return null;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
    try {
      await GoogleSignin.signOut();
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      router.replace('/auth');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        isLoggedIn,
        setAuthData,
        refreshAccessToken,
        logout,
        setUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
