import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: String;
  role: String;
  status: String;
  profileImage: null | String;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  login: async (token, user) => {
    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profileImage: user.profileImage,
    };
    try {
      await AsyncStorage.multiSet([
        ["access_token", token],
        ["user_data", JSON.stringify(userData)],
      ]);
      set({ token, user: userData, isAuthenticated: true });
    } catch {
      // Storage write failed — do not update in-memory state
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["access_token", "user_data"]);
    set({ token: null, user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),

  loadFromStorage: async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userRaw = await AsyncStorage.getItem("user_data");
      if (token && userRaw) {
        const user: User = JSON.parse(userRaw);
        set({ token, user, isAuthenticated: true });
      }
    } catch {
      try {
        await AsyncStorage.multiRemove(["access_token", "user_data"]);
      } catch {}
    } finally {
      set({ isHydrated: true });
    }
  },
}));
