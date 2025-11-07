# Guitar Practice PWA

This is the Progressive Web App (PWA) version of Guitar Practice. It can be installed on mobile devices and works offline!

## Features

- **Installable**: Add to home screen like a native app
- **Offline Support**: Works without internet connection
- **Full Screen**: Launches without browser UI
- **Fast**: Service worker caching for instant loading
- **Same Experience**: All features from the web version

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
