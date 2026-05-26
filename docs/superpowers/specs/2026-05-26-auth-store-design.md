# Auth Store Design — EuroShipper
**Date:** 2026-05-26  
**Approach:** Zustand with manual AsyncStorage writes (Option B)

---

## Overview

Introduce a Zustand `useAuthStore` that holds the authenticated user's token and profile in memory, manually syncing to/from AsyncStorage. This replaces ad-hoc state in `LoginScreen` and gives every screen a single source of truth for auth state.

---

## Store File

**Location:** `store/useAuthStore.ts`

### Types

```ts
interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
  loadFromStorage: () => Promise<void>
}
```

### AsyncStorage Keys

| Key | Value |
|-----|-------|
| `access_token` | JWT string (already used by `Api.tsx` interceptor) |
| `user_data` | JSON-stringified `User` object |

### Actions

- **`login(token, user)`** — sets `token`, `user`, `isAuthenticated: true` in state; writes `access_token` and `user_data` to AsyncStorage.
- **`logout()`** — resets `token`, `user`, `isAuthenticated` to null/false; removes both AsyncStorage keys.
- **`loadFromStorage()`** — reads `access_token` and `user_data` from AsyncStorage; if both exist, rehydrates the store (sets token, user, isAuthenticated: true). Called once on app boot.

---

## Integration Points

### 1. `LoginScreen.tsx`
After `loginApiHandler` resolves successfully, extract `accessToken` and `user` from the response and call:
```ts
await useAuthStore.getState().login(response.accessToken, response.user)
```
Then navigate to `MainScreens`.

### 2. `app/_layout.tsx`
On mount, call `loadFromStorage()` so the session persists across app restarts:
```ts
useEffect(() => {
  useAuthStore.getState().loadFromStorage()
}, [])
```

### 3. `helper/Api.tsx`
No changes required. The axios interceptor already reads `access_token` from AsyncStorage on each request.

---

## Out of Scope

- Refresh token logic (commented out in `Api.tsx` — separate task)
- Cart and Order Zustand stores (separate task)
- Token expiry checks

---

## File Checklist

- [ ] `store/useAuthStore.ts` — new file
- [ ] `screens/LoginScreen.tsx` — call `login()` after successful API response, then navigate
- [ ] `app/_layout.tsx` — call `loadFromStorage()` on mount
