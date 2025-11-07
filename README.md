# Guitar Practice PWA

This is the Progressive Web App (PWA) version of Guitar Practice. It can be installed on mobile devices and works offline!

## Features

- **Installable**: Add to home screen like a native app
- **Offline Support**: Works without internet connection
- **Cross-Device Sync**: Your data syncs across all your devices via Firebase
- **Full Screen**: Launches without browser UI
- **Fast**: Service worker caching for instant loading
- **Same Experience**: All features from the web version

## Firebase Setup (Required for Cross-Device Sync)

To enable data synchronization across your devices, you'll need to set up Firebase:

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can disable Google Analytics for this project)

### 2. Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left menu
2. Click "Create database"
3. Start in **production mode** (we'll set up security rules next)
4. Choose a Firestore location closest to you

### 3. Set Up Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

### 4. Enable Authentication

1. Click "Authentication" in the left menu
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable **Anonymous** authentication:
   - Click "Anonymous"
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google** authentication (recommended):
   - Click "Google"
   - Toggle "Enable"
   - Enter a support email (your email)
   - Click "Save"

### 5. Get Your Firebase Configuration

1. In Project Settings (gear icon), scroll to "Your apps"
2. Click the web icon (`</>`) to add a web app
3. Register your app (you can name it "Guitar Practice PWA")
4. Copy the configuration values

### 6. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 7. Install Dependencies and Run

```bash
npm install
npm run dev
```

Your app will now sync data across all devices where you're signed in!

### How It Works

The app offers two authentication options:

**Option 1: Google Sign-In (Recommended)**
- Sign in with your Google account
- Access your data on ANY device by signing in
- Data persists even if you clear browser data
- Perfect for practicing on multiple devices (PC, phone, tablet)

**Option 2: Anonymous Authentication**
- No sign-in required
- Each browser gets a unique anonymous user ID
- Data syncs across devices while using the same browser
- If you clear browser data, you'll lose access to your data
- Good for single-device users or those who prefer not to sign in

**Upgrading:** You can start with anonymous and upgrade to Google Sign-In later from the account menu!

### Data Storage

- Data is stored at `users/{userId}/data` in Firestore
- Works offline - changes sync when you're back online
- Local backup is always maintained in localStorage
- Export/import functionality available for manual backups

### Migrating Existing Data

If you have existing data in localStorage:
1. The app will automatically upload your local data to Firebase on first sign-in
2. Your data will then be available based on your authentication choice:
   - **Google Sign-In**: Available on all devices where you sign in
   - **Anonymous**: Available on devices using the same browser

## Development

```bash
# Install dependencies (if not already installed)
npm install

# Run development server with network access
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Installing on Your Phone

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. Tap "Add"

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

## Testing the PWA

After running `npm run dev`, open the network URL on your phone:
- The app will be accessible at the network address shown (e.g., http://192.168.x.x:5173)
- Make sure your phone is on the same WiFi network

## PWA Files

- `public/manifest.json` - App manifest (name, icons, colors)
- `public/sw.js` - Service worker (offline caching)
- `public/icon-*.png` - App icons (can be customized)
- `index.html` - Updated with PWA meta tags

## Customizing Icons

To create custom app icons:

1. Create a 512x512 PNG image
2. Use an online tool like [PWA Asset Generator](https://www.pwabuilder.com/generate) to generate all sizes
3. Replace `icon-192.png` and `icon-512.png` in the `public` folder

## Deployment

When deploying to production:

1. Build the app: `npm run build`
2. The `dist` folder contains all files needed
3. Serve the `dist` folder with HTTPS (required for PWA)
4. Recommended hosts:
   - Vercel
   - Netlify
   - GitHub Pages
   - Firebase Hosting

## Differences from Web Version

The PWA version includes:
- Service worker for offline support
- App manifest for installation
- PWA meta tags for mobile optimization
- Network-enabled dev server by default

The web version in `../guitar-practise-website` remains unchanged and can be hosted separately.
