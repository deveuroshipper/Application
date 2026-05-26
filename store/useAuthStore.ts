import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: async (token, user) => {
    await AsyncStorage.setItem("access_token", token);
    await AsyncStorage.setItem("user_data", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("user_data");
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadFromStorage: async () => {
    const token = await AsyncStorage.getItem("access_token");
    const userRaw = await AsyncStorage.getItem("user_data");
    if (token && userRaw) {
      const user: User = JSON.parse(userRaw);
      set({ token, user, isAuthenticated: true });
    }
  },
}));
