import { loginRequest, registerRequest } from "@/services/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  lastUpdated?: number;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "TASKIT_AUTH";
const USER_PROFILE_KEY = "TASKIT_USER_PROFILE";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 🔥 Load auth on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "true") {
          setIsLoggedIn(true);
          // Load user profile
          const profile = await AsyncStorage.getItem(USER_PROFILE_KEY);
          if (profile) {
            setUserProfile(JSON.parse(profile));
          }
        }
      } catch (e) {
        console.log("Auth load error", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginRequest(email, password);

      if (!data.status) {
        throw new Error(data.message);
      }

      const user = data.user;

      const profile: UserProfile = {
        name: user.name,
        email: user.email,
        avatar:
          user.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name,
          )}&background=random&color=fff&bold=true&size=128`,
        lastUpdated: Date.now(),
      };

      setUserProfile(profile);
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));

      setIsLoggedIn(true);
      await AsyncStorage.setItem(STORAGE_KEY, "true");
    } catch (err: any) {
      console.log("Login failed:", err.message);
      throw err; // 🔥 important for UI error handling
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=random&color=fff&bold=true&size=128`;

      const data = await registerRequest({
        name,
        email,
        password,
        password_confirmation: password,
        avatar,
      });

      if (!data.status) {
        throw new Error(data.message);
      }

      const user = data.user;

      const profile: UserProfile = {
        name: user.name,
        email: user.email,
        avatar: user.avatar || avatar, // fallback if backend doesn't return
        lastUpdated: Date.now(),
      };

      setUserProfile(profile);
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));

      setIsLoggedIn(true);
      await AsyncStorage.setItem(STORAGE_KEY, "true");
    } catch (err: any) {
      console.log("Register failed:", err.message);
      throw err; // 🔥 pass error to UI
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    const updated = {
      ...profile,
      avatar:
        profile.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random&color=fff&bold=true&size=128`,
      lastUpdated: Date.now(),
    };

    setUserProfile(updated);
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        login,
        register,
        logout,
        userProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
