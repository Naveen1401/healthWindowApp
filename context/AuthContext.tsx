import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null;
  userID : string | null;
  setToken: (token: string | null) => void;
  setUserID: (userID : string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userID: null,
  setUserID: () =>{},
  setToken: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storeUserID = await AsyncStorage.getItem("userID");
      setUserID(storeUserID);
      setToken(storedToken);
    };
    loadAuthData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userID");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, userID, setToken, setUserID, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
