# Auth Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Zustand `useAuthStore` that stores token + user in memory with manual AsyncStorage sync, wired into LoginScreen and _layout.tsx.

**Architecture:** A single Zustand store file (`store/useAuthStore.ts`) exposes `login`, `logout`, and `loadFromStorage` actions. `LoginScreen` calls `login()` after a successful API response and navigates to MainScreens. `_layout.tsx` calls `loadFromStorage()` on mount to rehydrate session across app restarts.

**Tech Stack:** Zustand 5.x, `@react-native-async-storage/async-storage` 2.x, TypeScript, React Native / Expo

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `store/useAuthStore.ts` | **Create** | Auth state + login/logout/loadFromStorage actions |
| `screens/LoginScreen.tsx` | **Modify** | Call `login()` after API success, then navigate |
| `app/_layout.tsx` | **Modify** | Call `loadFromStorage()` on mount |

---

### Task 1: Create the auth store

**Files:**
- Create: `store/useAuthStore.ts`

- [ ] **Step 1: Create the store file**

Create `store/useAuthStore.ts` with this exact content:

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: No errors related to `store/useAuthStore.ts`.

- [ ] **Step 3: Commit**

```bash
git add store/useAuthStore.ts
git commit -m "feat: add useAuthStore with manual AsyncStorage sync"
```

---

### Task 2: Wire LoginScreen to call the store after login

**Files:**
- Modify: `screens/LoginScreen.tsx`

- [ ] **Step 1: Import the store**

Add this import at the top of `screens/LoginScreen.tsx` (after existing imports):

```ts
import { useAuthStore } from "@/store/useAuthStore";
```

- [ ] **Step 2: Replace the `handelSubmit` function**

Replace the existing `handelSubmit` function with:

```ts
const handelSubmit = async () => {
  if (!validate()) return;
  setLoading(true);
  try {
    const response = await loginApiHandler(data.email, data.password);
    console.log("response : ", response);
    await useAuthStore.getState().login(response.accessToken, response.user);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainScreens",
          params: {
            screen: "BottomTabBar",
            params: { screen: "HomeScreen" },
          },
        },
      ],
    });
  } catch (error: any) {
    console.log("error : ", error);
    Toast.show({
      type: "error",
      text1: error,
    });
  } finally {
    setLoading(false);
  }
};
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add screens/LoginScreen.tsx
git commit -m "feat: call useAuthStore.login after successful login and navigate"
```

---

### Task 3: Call loadFromStorage on app boot

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Update `_layout.tsx` to rehydrate auth on mount**

Replace the entire content of `app/_layout.tsx` with:

```tsx
import toastConfig from "@/components/CustomeTost";
import { useAuthStore } from "@/store/useAuthStore";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
      <Toast position="bottom" config={toastConfig} />
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: load auth state from AsyncStorage on app boot"
```

---

### Task 4: Manual end-to-end verification

- [ ] **Step 1: Start the dev server**

```bash
npx expo start
```

- [ ] **Step 2: Test login flow**
  - Enter a valid email + password on LoginScreen
  - Tap **Log in**
  - Expected: navigates to HomeScreen; no errors in console

- [ ] **Step 3: Verify AsyncStorage was written**

Add a temporary log in `handelSubmit` right after `login()`:
```ts
console.log("token stored:", await AsyncStorage.getItem("access_token"));
console.log("user stored:", await AsyncStorage.getItem("user_data"));
```
Expected: both values logged correctly. Remove the logs after verifying.

- [ ] **Step 4: Test session persistence**
  - Kill and reopen the app
  - Expected: `loadFromStorage` fires, `useAuthStore.getState().isAuthenticated` is `true`, `token` and `user` are populated

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: verify auth store end-to-end"
```
