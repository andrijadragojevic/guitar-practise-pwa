# Firebase Setup Quick Guide

This guide will help you set up Firebase for cross-device sync in about 15 minutes.

## Prerequisites

- A Google account
- This app running locally or deployed

## Step-by-Step Setup

### 1. Create Firebase Project (2 min)

1. Visit: https://console.firebase.google.com/
2. Click "Add project"
3. Name it: "Guitar Practice" (or any name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore (2 min)

1. Click "Firestore Database" in the sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location near you (e.g., us-central, europe-west)
5. Click "Enable"

### 3. Set Firestore Security Rules (1 min)

1. In Firestore, click the "Rules" tab
2. Copy and paste these rules:

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

**What this does:** Only authenticated users can read/write their own data.

### 4. Enable Authentication (2 min)

1. Click "Authentication" in the sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable **Anonymous** authentication:
   - Click "Anonymous"
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google** authentication:
   - Click "Google"
   - Toggle "Enable"
   - Enter a support email (your email)
   - Click "Save"

**What this does:**
- **Anonymous**: Users can use the app without signing in (data stays on device)
- **Google**: Users can sign in with Google to sync data across all devices

### 5. Get Your Config (2 min)

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app name: "Guitar Practice PWA"
6. Click "Register app"
7. Copy the config values (you'll need them next)

### 6. Configure Your App (2 min)

1. In your project folder, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and paste your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

## Using the App

When you first open the app, you'll see a sign-in screen with two options:

### Option 1: Sign in with Google (Recommended)
- Your data syncs across ALL devices
- Sign in on any device with your Google account to access your data
- Even if you clear browser data, your data is safe in the cloud
- Best for users who practice on multiple devices

### Option 2: Continue without account
- Uses anonymous authentication
- Data syncs across devices BUT only while using the same browser
- If you clear browser data, you'll lose access to your data
- Good for users who only use one device or prefer not to sign in

### Upgrading from Anonymous to Google
If you start with anonymous and change your mind, you can upgrade later:
1. Click the user icon in the header
2. Click "Upgrade to Google Account"
3. Your existing data will be preserved!

## Testing Cross-Device Sync (Google Sign-In)

1. Open the app on your PC
2. Sign in with Google
3. Add some exercises and routines
4. Open the same URL on your phone (use the network URL shown in terminal)
5. Sign in with the same Google account
6. You should see the same data!
7. Make changes on either device - they sync automatically

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that your `.env` file exists and has all variables filled
- Restart the dev server after creating `.env`

### "Missing or insufficient permissions"
- Verify Firestore security rules are set correctly
- Ensure Anonymous auth is enabled

### Data not syncing
- Check your browser console for errors
- Verify you're using the same Firebase project on all devices
- Make sure you're online (the app shows "Offline" when disconnected)

### Changes don't appear on other devices
- Wait a few seconds - sync happens automatically
- Check the Firebase console to see if data is being written
- Look for "(Offline)" indicator in the app header

## Free Tier Limits

Firebase free tier is generous for personal use:

- **Storage**: 1 GB
- **Reads**: 50,000 per day
- **Writes**: 20,000 per day
- **Deletes**: 20,000 per day

For a personal guitar practice app, you'll likely never hit these limits!

## Security Notes

- Each device has a unique anonymous user ID
- Your data is only accessible to you (enforced by security rules)
- Data is encrypted in transit (HTTPS)
- Anonymous users persist across sessions (stored in browser)
- If you clear browser data, you'll get a new anonymous ID (and lose access to old data)

## Backing Up Your Data

The app provides multiple ways to protect your data:

### Google Sign-In (Built-in)
- Your data is automatically backed up to Firebase
- Access it from any device by signing in with Google
- Survives browser data clearing

### Anonymous Users
- Export your data using the "Backup & Restore" button in the app
- Import it on a new device or after clearing browser data
- Consider upgrading to Google Sign-In for automatic backup

### Manual Backups
- Click the backup icon in the header
- Click "Export Backup" to download a JSON file
- Keep this file safe - you can import it anytime

## Need Help?

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Check browser console for detailed error messages
