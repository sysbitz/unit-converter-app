# 📂 File Rename Guide

Files here use **descriptive names** so you know what each one does.
Before dropping them into your Expo project, rename them to the **Expo Router names** in the right column.

---

## app/ (Root)

| File in this zip (descriptive)         | Rename to in your project  | What it does                                      |
|----------------------------------------|----------------------------|---------------------------------------------------|
| `app/root-layout.tsx`                  | `app/_layout.tsx`          | Root layout — wraps everything in AuthProvider, fonts, StatusBar |
| `app/auth-redirect-index.tsx`          | `app/index.tsx`            | Entry point — redirects to login or tabs based on auth state |

---

## app/(auth)/ — Login Flow

| File in this zip (descriptive)         | Rename to in your project  | What it does                                      |
|----------------------------------------|----------------------------|---------------------------------------------------|
| `app/(auth)/auth-group-layout.tsx`     | `app/(auth)/_layout.tsx`   | Auth group layout — wraps login + verify screens  |
| `app/(auth)/login.tsx`                 | `app/(auth)/login.tsx`     | ✅ No rename needed — phone number entry screen   |
| `app/(auth)/verify-otp.tsx`            | `app/(auth)/verify.tsx`    | OTP 6-digit input + BDApps verification           |

---

## app/(tabs)/ — Main App Tabs

| File in this zip (descriptive)         | Rename to in your project  | What it does                                      |
|----------------------------------------|----------------------------|---------------------------------------------------|
| `app/(tabs)/tabs-layout.tsx`           | `app/(tabs)/_layout.tsx`   | Tab bar layout — defines 3 tabs with Bengali labels |
| `app/(tabs)/converter-screen.tsx`      | `app/(tabs)/index.tsx`     | 🏠 Home tab — the main unit converter UI          |
| `app/(tabs)/history-screen.tsx`        | `app/(tabs)/history.tsx`   | 🕐 History tab — shows past conversions from Supabase |
| `app/(tabs)/profile-screen.tsx`        | `app/(tabs)/profile.tsx`   | 👤 Profile tab — name editing, stats, sign out    |

---

## Other Folders (no renaming needed)

| Folder / File                          | What it does                                               |
|----------------------------------------|------------------------------------------------------------|
| `constants/Colors.ts`                  | Light & dark theme color tokens                            |
| `constants/units.ts`                   | All 8 unit categories with Bengali + English names         |
| `context/AuthContext.tsx`              | Global auth state — BDApps OTP + Supabase sign-in          |
| `hooks/useHistory.ts`                  | Supabase conversion history CRUD hook                      |
| `hooks/useTheme.ts`                    | Returns current color scheme (light/dark)                  |
| `lib/supabase.ts`                      | Supabase client setup with AsyncStorage persistence        |
| `supabase/schema.sql`                  | Run this in Supabase SQL Editor to create tables + RLS     |
| `backend/send_otp.php`                 | Upload to your server — sends OTP via BDApps API           |
| `backend/verify_otp.php`               | Upload to your server — verifies OTP via BDApps API        |
| `.env.example`                         | Copy to `.env.local` and fill in your keys                 |
| `package.json`                         | All dependencies for Expo SDK 54                           |
| `app.json`                             | Expo project config                                        |
| `babel.config.js`                      | Babel config with expo-router plugin                       |
| `tsconfig.json`                        | TypeScript config with `@/*` path alias                    |
| `metro.config.js`                      | Metro bundler config for web support                       |

---

## ⚡ Quick Rename Commands

Run this from inside the project folder after copying files:

```bash
# app root
mv app/root-layout.tsx         app/_layout.tsx
mv app/auth-redirect-index.tsx app/index.tsx

# auth group
mv "app/(auth)/auth-group-layout.tsx"  "app/(auth)/_layout.tsx"
mv "app/(auth)/verify-otp.tsx"         "app/(auth)/verify.tsx"

# tabs group
mv "app/(tabs)/tabs-layout.tsx"        "app/(tabs)/_layout.tsx"
mv "app/(tabs)/converter-screen.tsx"   "app/(tabs)/index.tsx"
mv "app/(tabs)/history-screen.tsx"     "app/(tabs)/history.tsx"
mv "app/(tabs)/profile-screen.tsx"     "app/(tabs)/profile.tsx"
```
