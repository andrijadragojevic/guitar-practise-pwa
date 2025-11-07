# How to Install Guitar Practice as a Real App

## Important: Installing vs. Opening in Browser

The PWA will ONLY open like a real app (fullscreen, no browser UI) if you **install it to your home screen**. Simply opening the URL in your browser will not give you the app experience.

---

## Installation Steps

### On Android (Chrome or Edge)

1. Open **Chrome** or **Edge** browser on your Android phone
2. Go to: `http://192.168.210.112:5175/`
3. Wait for the page to fully load
4. Tap the **menu icon (⋮)** in the top-right corner
5. Tap **"Add to Home screen"** or **"Install app"**
6. A popup will appear - tap **"Add"** or **"Install"**
7. The app icon will appear on your home screen
8. **Close the browser completely**
9. **Tap the app icon** from your home screen (not from the browser!)

### On iOS (Safari)

1. Open **Safari** browser on your iPhone/iPad (MUST be Safari, not Chrome)
2. Go to: `http://192.168.210.112:5175/`
3. Wait for the page to fully load
4. Tap the **Share button** (square with arrow pointing up) at the bottom
5. Scroll down and tap **"Add to Home Screen"**
6. Tap **"Add"** in the top-right corner
7. The app icon will appear on your home screen
8. **Close Safari completely**
9. **Tap the app icon** from your home screen (not from Safari!)

---

## How to Know It's Working

When installed correctly, the app should:
- ✅ Launch in **fullscreen** (no browser address bar or navigation)
- ✅ Show **NO browser UI** at all (looks like a native app)
- ✅ Have its own **app switcher entry** (separate from browser)
- ✅ Show the **Guitar Practice icon** and name
- ✅ Work **offline** after first load

## If It Still Opens in Browser

If the app still opens in the browser, it means:
- ❌ You're opening the URL from a bookmark (not the installed app)
- ❌ You're opening it from browser history (not the installed app)
- ❌ You didn't complete the "Add to Home Screen" installation

**Solution:** Delete any bookmarks, and make sure you tap the app icon on your home screen, not a browser link.

---

## Uninstalling the App

### On Android
- Long-press the app icon → Select "Uninstall" or "Remove"

### On iOS
- Long-press the app icon → Select "Remove App" → "Delete App"

---

## Production Deployment (For Permanent URL)

For testing on your local network, use: `http://192.168.210.112:5175/`

For production deployment with a permanent URL:
```bash
npm run build
```

Deploy the `dist/` folder to:
- **Vercel** (recommended) - Free, HTTPS automatic, easy PWA support
- **Netlify** - Free, good PWA support
- **Firebase Hosting** - Google's hosting
- **GitHub Pages** - Free for public repos

⚠️ **Important:** PWA requires HTTPS in production (automatically provided by these hosts).

---

## Testing Checklist

1. ✅ Open URL in browser on phone
2. ✅ Install using "Add to Home Screen"
3. ✅ Close browser completely
4. ✅ Tap app icon from home screen
5. ✅ Verify fullscreen mode (no browser UI)
6. ✅ Turn off WiFi to test offline mode
7. ✅ Check app switcher shows separate entry

---

## Troubleshooting

**Q: It still looks like a browser!**
A: Make sure you installed it via "Add to Home Screen" and are launching from the home screen icon, not from a browser bookmark.

**Q: The icon doesn't appear on my home screen**
A: Try again and make sure you tap "Add" in the installation popup.

**Q: Can I customize the icon?**
A: Yes! Edit `/public/icon-512.png` and `/public/icon-192.png`

**Q: Does it work offline?**
A: Yes! After the first load, the app will work without internet.

**Q: Can I share this with friends?**
A: Yes on local network. For internet sharing, deploy to production.
