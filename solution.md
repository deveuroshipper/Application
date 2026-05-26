# App Crash Fix — APK Stops After Splash Screen

## Root Cause

**`app/_layout.tsx` is completely empty (0 bytes).**

Your `package.json` uses `"main": "expo-router/entry"`, which means **Expo Router is the app's entry point**. Expo Router *requires* `app/_layout.tsx` to export a valid React component as the root layout. Because it exports nothing, Expo Router cannot initialize, the navigation never mounts, and the app freezes/crashes after the native splash screen.

This can silently pass in Expo Go during development (error overlays hide it), but a production APK has no safety net — it just crashes.

---

## Fix 1 — Restore `app/_layout.tsx` (Critical)

Open [app/_layout.tsx](app/_layout.tsx) and replace the empty file with:

```tsx
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
```

**Why this works:**
- `<Slot />` tells Expo Router to render the current route's content — which is your `app/index.tsx` (the full React Navigation stack).
- `GestureHandlerRootView` is **required at the root** for React Navigation gestures to work in production APK builds. Without it, swipe-back and other gestures will crash.

---

## Fix 2 — Disable Experimental Features in `app.json` (Recommended)

In [app.json](app.json), under `"experiments"`, two features are enabled that can cause unpredictable crashes in production:

```json
"experiments": {
  "typedRoutes": true,
  "reactCompiler": true   ← remove or set to false
}
```

`reactCompiler` is still experimental and is known to cause crashes in React Native production builds. Set it to `false` or remove it:

```json
"experiments": {
  "typedRoutes": true
}
```

---

## Fix 3 — LinearGradient `locations` Mismatch in `GetStartedScreen.tsx`

In [screens/GetStartedScreen.tsx](screens/GetStartedScreen.tsx) line 15:

```tsx
// WRONG: 2 colors, 3 location values
colors={["rgba(15, 23, 41, 0.2),rgba(15, 23, 41, 0.6)", "#0F1729"]}
locations={[0.4, 0.8, 1]}
```

The `colors` array has **2 items** but `locations` has **3 values** — they must match. This can crash on Android. Fix:

```tsx
colors={["rgba(15, 23, 41, 0.2)", "rgba(15, 23, 41, 0.6)", "#0F1729"]}
locations={[0.4, 0.8, 1]}
```

---

## Summary of Changes

| File | Change | Priority |
|------|--------|----------|
| [app/_layout.tsx](app/_layout.tsx) | Add `GestureHandlerRootView` + `<Slot />` root layout | **Critical — app won't open without this** |
| [app.json](app.json) | Remove/disable `reactCompiler: true` | High |
| [screens/GetStartedScreen.tsx](screens/GetStartedScreen.tsx) | Fix `colors`/`locations` count mismatch | Medium |

---

## After Making Changes

Rebuild the APK from scratch — do not use a cached build:

```bash
# If using EAS Build:
eas build --platform android --profile preview --clear-cache

# If building locally:
expo run:android --no-bundler
```

The `--clear-cache` / fresh build is important because the old broken bundle may be cached.
