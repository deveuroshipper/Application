# Notification Screen UI — Design Spec

**Date:** 2026-05-27  
**File:** `screens/MainScreens/NotificationScreen.tsx`  
**Status:** Approved

---

## Overview

Replace the current "No New Notification" empty-only screen with a full notification list UI that groups items by date (**Today**, **Yesterday**, **Earlier**). The empty-state is preserved and shown when there are no notifications.

---

## Screen Structure

```
ScreenWrapper (KeyboardAvoiding=false)
  └─ View (flex-1, px-8, pb-8)
       ├─ Header Row
       │    └─ BackButton
       └─ ScrollView (flex-1)
            ├─ Section: "Today"
            │    ├─ Section Label
            │    └─ NotificationItem × N
            ├─ Section: "Yesterday"
            │    ├─ Section Label
            │    └─ NotificationItem × N
            └─ Section: "Earlier"
                 ├─ Section Label
                 └─ NotificationItem × N
```

If all sections have zero items → render existing empty state (notNotification image + "No New Notification" text) centered in flex-1.

---

## Data Types

```ts
type Notification = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: string; // key from Icon component
};

type NotificationSection = {
  label: "Today" | "Yesterday" | "Earlier";
  data: Notification[];
};
```

Static `MOCK_NOTIFICATIONS: NotificationSection[]` declared at top of file. Non-empty by default to show the list UI.

---

## Mock Data (matches Figma design)

| Section    | Title                        | Subtitle                                            | Time     | Icon        |
|------------|------------------------------|-----------------------------------------------------|----------|-------------|
| Today      | Shipment Picked Up           | Order #87858452 has been picked up from the origin warehouse. | 10:30 AM | Ship        |
| Today      | In Transit                   | Your order #87858452 is on the way.                 | 10:30 AM | ShipOutline |
| Today      | Payment Confirmed            | Your payment has been received.                     | 10:30 AM | Check       |
| Yesterday  | Created Shipment Order       | Order #87858452 has been picked up from the origin warehouse. | 10:30 AM | Box         |
| Yesterday  | Shipment Started At Warehouse| Order #87858452 has been picked up from the origin warehouse. | 10:30 AM | Box         |
| Earlier    | Account Created              | Your account is ready to use.                       | 10:30 AM | User        |

---

## NotificationItem Component

Defined inline in the same file (not exported). Props: `item: Notification`, `isLast: boolean`.

### Layout

```
[ Icon Circle 48×48 ]   [ Title            ]   [ time ]
                        [ Subtitle (2 lines max) ]
```

### Styling

| Element       | Classes / Style                                                  |
|---------------|------------------------------------------------------------------|
| Row container | `flex-row items-start py-4 gap-4` + `border-b border-primary/10` (hidden if `isLast`) |
| Icon circle   | `h-12 w-12 rounded-full bg-gold/20 items-center justify-center` |
| Icon          | `<Icon name={item.icon} size={22} color="#E0A31D" />`           |
| Text block    | `flex-1`                                                         |
| Title         | `text-csm font-inter-bold text-primary`                          |
| Subtitle      | `text-cxs font-inter text-primary/50` numberOfLines={2}          |
| Time          | `text-cxs font-inter text-primary/40`                            |

---

## Section Label

```tsx
<Text className="text-cno font-inter-bold text-primary mb-2 mt-6">
  {section.label}
</Text>
```

First section (Today) gets `mt-4` instead of `mt-6` for tighter spacing from the header.

---

## Conditional Rendering Logic

```ts
const hasNotifications = MOCK_NOTIFICATIONS.some(s => s.data.length > 0);

if (!hasNotifications) → empty state view
else → ScrollView with sections
```

---

## Files Changed

| File | Change |
|------|--------|
| `screens/MainScreens/NotificationScreen.tsx` | Full replacement — add types, mock data, NotificationItem, conditional render |

No new files, no new dependencies.

---

## Out of Scope

- API integration (static mock only)
- Read/unread state
- Swipe-to-dismiss
- Push notification handling
