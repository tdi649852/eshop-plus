# Flutter Integration Guide

This guide explains how to switch your Flutter eShop app between the live API and the mock API.

## Quick Switch

### Option 1: Update appConfig.dart (Recommended)

Edit `lib/core/configs/appConfig.dart`:

```dart
// For Mock API (Local Development)
const String baseUrl = "http://localhost:3000";

// For Live API (Production)
// const String baseUrl = "https://eshop-pro.eshopweb.store";
```

### Option 2: Use Environment Variables

Create separate config files:

**lib/core/configs/appConfig.dev.dart**
```dart
const String baseUrl = "http://localhost:3000";
const String databaseUrl = "$baseUrl/api/";
```

**lib/core/configs/appConfig.prod.dart**
```dart
const String baseUrl = "https://eshop-pro.eshopweb.store";
const String databaseUrl = "$baseUrl/api/";
```

Then import the appropriate file based on your build configuration.

## Testing on Physical Device

### Option 1: Local Network (Recommended)

If testing on a real Android/iOS device, replace `localhost` with your computer's local IP:

```dart
// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
const String baseUrl = "http://192.168.1.100:3000";
```

Make sure your device and computer are on the same network.

### Option 2: Using ngrok (Public Tunnel)

For remote testing or sharing with team members, use [ngrok](https://ngrok.com/):

1. **Install ngrok** (if not already installed)
2. **Start your mock server**: `npm run dev`
3. **Create tunnel**: `ngrok http 3000`
4. **Copy the URL**: e.g., `https://abc123.ngrok-free.app`
5. **Update Flutter config**:

```dart
const String baseUrl = "https://abc123.ngrok-free.app";
```

**Important**: The ngrok header bypass is already configured in `apiService.dart`:

```dart
headers = {
  "ngrok-skip-browser-warning": "true",  // ✅ Already added
};
```

This header prevents ngrok's browser warning page from blocking API requests.

## Testing on Emulator/Simulator

### Android Emulator
```dart
const String baseUrl = "http://10.0.2.2:3000";
```

### iOS Simulator
```dart
const String baseUrl = "http://localhost:3000";
```

## Verify Mock API is Running

Before running your Flutter app, ensure the mock server is active:

```bash
cd mock-api
npm run dev
```

You should see: `Mock API server listening on http://localhost:3000`

## Test Endpoints

Visit these URLs in your browser to verify:

- http://localhost:3000/ - Server status
- http://localhost:3000/api/get_stores - Sample data
- http://localhost:3000/api/get_settings - App settings

## Common Issues

### CORS Errors
The mock API has CORS enabled by default. If you still face issues, check the browser console.

### Connection Refused
- Ensure the mock server is running (`npm run dev`)
- Check the port (default: 3000)
- Verify firewall settings

### Empty/Wrong Responses
- Check if the mock JSON file exists in `mockData/`
- Run `npm run sync:mocks` to refresh data from live API
- Check server logs for errors

## Development Workflow

1. **Start Mock Server**: `cd mock-api && npm run dev`
2. **Update Flutter Config**: Set `baseUrl` to `http://localhost:3000`
3. **Run Flutter App**: `flutter run`
4. **Sync Mock Data** (when needed): `npm run sync:mocks`

## Switching Back to Live API

Simply change the `baseUrl` back to the production URL:

```dart
const String baseUrl = "https://eshop-pro.eshopweb.store";
```

No other code changes needed!

