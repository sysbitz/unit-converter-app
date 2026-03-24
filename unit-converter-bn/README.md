# ইউনিট রূপান্তরকারী — Unit Converter App

A full-stack Bengali unit converter app built with Expo SDK 54, React Native (web + mobile), Supabase, and BDApps OTP authentication.

---

## 📁 Project Structure

```
├── app/
│   ├── _layout.tsx           # Root layout with AuthProvider
│   ├── index.tsx             # Auth redirect
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx         # Phone number entry
│   │   └── verify.tsx        # OTP verification
│   └── (tabs)/
│       ├── _layout.tsx       # Tab bar
│       ├── index.tsx         # Converter screen
│       ├── history.tsx       # Conversion history
│       └── profile.tsx       # User profile
├── constants/
│   ├── Colors.ts             # Light/dark theme tokens
│   └── units.ts              # All 8 unit categories in Bengali
├── context/
│   └── AuthContext.tsx       # BDApps OTP + Supabase auth
├── hooks/
│   ├── useHistory.ts         # Supabase conversion history
│   └── useTheme.ts           # Theme helper
├── lib/
│   └── supabase.ts           # Supabase client
├── supabase/
│   └── schema.sql            # DB schema — run in Supabase SQL editor
├── send_otp.php              # Updated with CORS headers
├── verify_otp.php            # Updated with CORS headers
├── .env.example              # Environment variable template
├── app.json
├── babel.config.js
├── metro.config.js
├── package.json
└── tsconfig.json
```

---

## 🚀 Setup Steps

### 1. Install dependencies
```bash
npm install
```

### 2. Download Bengali font
Download **Hind Siliguri** from Google Fonts:
👉 https://fonts.google.com/specimen/Hind+Siliguri

Place these 4 files in `assets/fonts/`:
- `HindSiliguri-Regular.ttf`
- `HindSiliguri-Medium.ttf`
- `HindSiliguri-SemiBold.ttf`
- `HindSiliguri-Bold.ttf`

### 3. Configure environment variables
Copy `.env.example` to `.env.local` and fill in:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_PHP_BASE_URL=https://yourdomain.com/api
```

### 4. Set up Supabase
1. Go to your Supabase project → SQL Editor
2. Run the entire contents of `supabase/schema.sql`
3. Go to **Auth → Providers → Email** and make sure it's enabled
4. Optionally disable email confirmation (Auth → Settings → Disable email confirmation)

### 5. Configure BDApps PHP files
In both `send_otp.php` and `verify_otp.php`, fill in:
```php
"applicationId" => "YOUR_BDAPPS_APP_ID",
"password"      => "YOUR_BDAPPS_PASSWORD",
```
Upload them to your server under the path you set in `EXPO_PUBLIC_PHP_BASE_URL`.

### 6. Run the app
```bash
# Web
npm run web

# Android
npm run android

# iOS
npm run ios
```

---

## 📦 Unit Categories (all in Bengali)

| Category | Bengali | Units |
|----------|---------|-------|
| Length | দৈর্ঘ্য | mm, cm, m, km, inch, foot, yard, mile |
| Weight | ওজন/ভর | mg, g, kg, ton, lb, oz, তোলা, মণ |
| Temperature | তাপমাত্রা | Celsius, Fahrenheit, Kelvin |
| Area | ক্ষেত্রফল | sqmm, sqcm, sqm, sqkm, sqft, acre, বিঘা, কাঠা |
| Volume | আয়তন | ml, l, m³, gallon, pint, fl.oz |
| Speed | গতিবেগ | m/s, km/h, mph, knot, mach |
| Time | সময় | ms, s, min, hour, day, week, month, year |
| Data | ডেটা স্টোরেজ | bit, byte, KB, MB, GB, TB |

---

## 🔐 Auth Flow

1. User enters Bangladeshi mobile number (01XXXXXXXXX)
2. App calls your hosted `send_otp.php` → BDApps API
3. User enters 6-digit OTP
4. App calls `verify_otp.php` → BDApps verifies
5. On success, app signs user into Supabase using a deterministic email (`88{mobile}@bdapps.local`)
6. Supabase profile created/fetched; user enters the app

---

## 🎨 Theme

- **Light** (default): Blue `#1B6CA8` primary, clean white surfaces
- **Dark**: Soft blue `#4DA3E8` primary, dark navy backgrounds
- Follows system preference automatically via `useColorScheme()`
- Font: **Hind Siliguri** (Bengali-optimized, Google Fonts)
