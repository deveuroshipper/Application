# APK Size Optimization Notes

This repo is an Expo / React Native app with a generated `android/` project. The biggest APK-size wins are likely Android build settings and native dependency cleanup, not screen-level code.

## Highest Impact

1. Prefer AAB for production instead of APK
   - Current `eas.json` preview build uses:
     ```json
     "preview": {
       "android": {
         "buildType": "apk"
       }
     }
     ```
   - APKs include every CPU architecture in one file, so they are much larger.
   - For Play Store production, use the default Android App Bundle (`.aab`) from the `production` profile.
   - Keep APK only for direct testing/internal installs.

2. Limit APK CPU architectures for internal APK builds
   - Current `android/gradle.properties` includes four ABIs:
     ```properties
     reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
     ```
   - `x86` and `x86_64` are mainly emulator targets and make APKs bigger.
   - For real-device APKs, use:
     ```properties
     reactNativeArchitectures=arm64-v8a
     ```
   - If you still support older 32-bit devices, use:
     ```properties
     reactNativeArchitectures=armeabi-v7a,arm64-v8a
     ```

3. Enable R8 minification and resource shrinking for release
   - `android/app/build.gradle` already supports these flags, but `android/gradle.properties` does not enable them.
   - Add:
     ```properties
     android.enableMinifyInReleaseBuilds=true
     android.enableShrinkResourcesInReleaseBuilds=true
     ```
   - This removes unused Java/Kotlin bytecode and unused Android resources.
   - Test checkout, Google sign-in, push notifications, and deep links after enabling because native SDKs sometimes need ProGuard keep rules.

4. Remove `expo-dev-client` from production builds if not needed
   - `expo-dev-client` is useful for development builds, but it should not be included in production unless required.
   - Current dependency:
     ```json
     "expo-dev-client": "~6.0.21"
     ```
   - If production does not need a custom dev client, remove it from `dependencies` and rebuild native projects.
   - Also consider disabling this development-only flag in release builds:
     ```properties
     EX_DEV_CLIENT_NETWORK_INSPECTOR=true
     ```

## Dependency Cleanup

Audit these dependencies and remove any that are not used in runtime code. Each native dependency can add Android resources, Java/Kotlin classes, and native libraries.

Likely unused based on import scan:

- `npm`
  - This is almost never needed as an app runtime dependency.
  - `node_modules/npm` is about `16M` locally.
  - Move it out of `dependencies` or remove it.

- `i`
  - No runtime imports found.
  - Remove unless there is a hidden build reason.

- `expo-image`
  - No imports found.
  - The app currently uses React Native `Image`.
  - Remove if not planned.

- `expo-haptics`
  - No imports found.
  - Remove if haptic feedback is not used.

- `expo-checkbox`
  - No imports found.
  - Remove if no checkbox UI uses it.

- `expo-symbols`
  - No imports found.
  - Remove unless iOS symbol support is required.

- `expo-web-browser`
  - No imports found.
  - Remove if not needed for auth or external links.

- `expo-skeleton-loading`
  - No imports found.
  - It also installs its own nested `expo-linear-gradient` and `react-native-reanimated`.
  - Remove if unused.

- `react-native-reanimated-skeleton`
  - No imports found.
  - Remove if unused.

Dependencies that appear used and should stay unless product scope changes:

- `@stripe/stripe-react-native`
  - Used in `app/index.tsx` and `DetailsAndPayment.tsx`.
  - Keep if Stripe checkout remains native.

- `expo-notifications` and `expo-device`
  - Used in `app/index.tsx`.
  - Keep if push notifications are required.

- `socket.io-client`
  - Used in `screens/MainScreens/SupportChat.tsx`.
  - Keep if real-time support chat is required.

- `expo-apple-authentication`, `@react-native-google-signin/google-signin`, `expo-linear-gradient`
  - Imported in app code.
  - Keep unless those flows/UI are removed.

After dependency cleanup, run:

```sh
npm install
npx expo prebuild --clean
```

Then rebuild Android and compare output size.

## Asset Cleanup

Current local asset size:

- `assets/` total: about `8.5M`
- `assets/images/user.jpg`: about `2.7M`, `3648 x 3648`
- Intro images: about `1.8M` total
- `assets/images/transperentLogo.png`: about `704K`, `1438 x 1126`

Recommended actions:

1. Delete accidental macOS metadata files
   - These are present:
     ```text
     assets/.DS_Store
     assets/images/.DS_Store
     assets/images/boxes/.DS_Store
     ```
   - They should not be committed or packaged.
   - Add `.DS_Store` to `.gitignore`.

2. Remove unused template/default assets
   - No code references found for these Expo/template-looking files:
     ```text
     assets/images/react-logo.png
     assets/images/react-logo@2x.png
     assets/images/react-logo@3x.png
     assets/images/partial-react-logo.png
     assets/images/favicon.png
     assets/images/splash-icon.png
     assets/images/android-icon-background.png
     assets/images/android-icon-foreground.png
     assets/images/android-icon-monochrome.png
     assets/images/splash.png
     assets/images/user.jpg
     ```
   - Verify visually before deleting, but these are good cleanup candidates.

3. Resize or replace oversized images
   - `assets/images/user.jpg` is `3648 x 3648`; this is far larger than a mobile avatar/profile placeholder needs.
   - If kept, resize to around `512 x 512` or replace with a compressed WebP/JPEG.
   - `assets/images/transperentLogo.png` is large for a splash/logo asset. Export closer to the rendered size and use PNG only if alpha is required.

4. Compress PNG assets
   - The intro/welcome/splash PNGs are used and not huge individually, but compression can still help.
   - Good candidates:
     ```text
     assets/images/Intro/step1.png
     assets/images/Intro/step2.png
     assets/images/Intro/step3.png
     assets/images/Intro/step4.png
     assets/images/Welcome.png
     assets/images/SplashBg.png
     assets/images/letsBegin.png
     assets/images/transperentLogo.png
     ```
   - Use `pngquant`, `oxipng`, or export WebP variants where React Native support is acceptable.

## Android/Expo Config Cleanup

1. Remove duplicate `expo-build-properties` plugin entry
   - `app.json` currently has both:
     ```json
     "expo-build-properties"
     ```
     and a configured `expo-build-properties` plugin block.
   - Keep only the configured block.

2. Disable unused image format support if possible
   - Current `android/gradle.properties`:
     ```properties
     expo.gif.enabled=true
     expo.webp.enabled=true
     expo.webp.animated=false
     ```
   - GIF support is small, but if the app does not load GIFs, set:
     ```properties
     expo.gif.enabled=false
     ```
   - Keep WebP enabled if you convert assets to WebP.

3. Keep Hermes enabled
   - Current:
     ```properties
     hermesEnabled=true
     ```
   - This is good for React Native release apps and should stay enabled.

## Measurement Checklist

Use this process so every change has a measured result:

1. Build current baseline APK/AAB.
2. Record file size.
3. Enable one optimization category at a time.
4. Rebuild and compare.
5. Smoke test:
   - app launch
   - login / Google / Apple auth
   - push notification registration
   - support chat
   - order creation
   - coupon/payment checkout

Useful commands:

```sh
cd android
./gradlew :app:assembleRelease
```

For a detailed APK breakdown, use Android Studio APK Analyzer or:

```sh
apkanalyzer files list app-release.apk
apkanalyzer apk summary app-release.apk
```

## Suggested Priority Order

1. Use AAB for production.
2. For APK testing, remove x86/x86_64 ABIs.
3. Enable minify/resource shrink.
4. Remove unused dependencies, especially `npm`, `i`, unused Expo modules, and unused skeleton packages.
5. Delete unused assets and `.DS_Store`.
6. Compress/resize large used assets.
7. Rebuild and compare sizes after each step.
