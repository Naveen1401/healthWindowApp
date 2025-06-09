import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null;
  userID : string | null;
  imageURL: string | null,
  name: string | null,
  setToken: (token: string | null) => void;
  setUserID: (userID : string | null) => void;
  setImageURL: (imageURL: string | null) => void;
  setName: (name: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userID: null,
  imageURL: null,
  name: null,
  setUserID: () =>{},
  setToken: () => {},
  setImageURL: () => {},
  setName: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storeUserID = await AsyncStorage.getItem("userID");
      const storedImageURL = await AsyncStorage.getItem("imageURL");
      const storedName = await AsyncStorage.getItem("name");

      setUserID(storeUserID);
      setToken(storedToken);
      setImageURL(storedImageURL);
      setName(storedName);
    };
    loadAuthData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("imageURL");
    setToken(null);
    setUserID(null);
    setImageURL(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userID, imageURL, name, setToken, setUserID, setImageURL, setName, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
