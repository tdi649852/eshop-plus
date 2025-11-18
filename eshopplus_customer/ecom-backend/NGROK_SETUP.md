# ngrok Setup Guide for Mock API

This guide explains how to expose your local mock API to the internet using ngrok, perfect for testing on physical devices or sharing with team members.

## Why Use ngrok?

- ✅ Test on physical devices without local network setup
- ✅ Share your mock API with remote team members
- ✅ Test webhooks and external integrations
- ✅ No firewall or router configuration needed

## Setup Steps

### 1. Install ngrok

**Windows/Mac/Linux:**
```bash
# Download from https://ngrok.com/download
# Or use package managers:
# Windows (Chocolatey): choco install ngrok
# Mac (Homebrew): brew install ngrok
# Linux: snap install ngrok
```

### 2. Start Your Mock Server

```bash
cd mock-api
npm run dev
```

Server should be running on `http://localhost:3000`

### 3. Create ngrok Tunnel

Open a **new terminal** and run:

```bash
ngrok http 3000
```

You'll see output like:

```
Session Status                online
Account                       your@email.com
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

### 4. Copy the Public URL

Copy the `https://` URL (e.g., `https://abc123.ngrok-free.app`)

### 5. Update Flutter Config

Edit `lib/core/configs/appConfig.dart`:

```dart
// Remove trailing slash!
const String baseUrl = "https://abc123.ngrok-free.app";
```

**Important**: No trailing slash at the end!

### 6. Restart Your Flutter App

```bash
flutter run
```

## ✅ Verification

Test the ngrok URL in your browser:

- Root: `https://abc123.ngrok-free.app/`
  - Should return: `{"message":"eShop Plus mock API is running.",...}`

- API endpoint: `https://abc123.ngrok-free.app/api/get_stores`
  - Should return store data

## 🔧 Common Issues & Solutions

### Issue 1: "ngrok-skip-browser-warning" Error

**Symptom**: App shows "Something went wrong" or browser warning page

**Solution**: Already fixed in `apiService.dart`:

```dart
headers = {
  "ngrok-skip-browser-warning": "true",  // ✅ Bypasses ngrok warning
};
```

If you still see issues, verify this header exists in `lib/core/api/apiService.dart` (line 36).

### Issue 2: Double Slashes in URLs

**Symptom**: URLs like `https://abc.ngrok-free.app//api/get_stores`

**Solution**: Remove trailing slash from `baseUrl`:

```dart
// ❌ Wrong
const String baseUrl = "https://abc123.ngrok-free.app/";

// ✅ Correct
const String baseUrl = "https://abc123.ngrok-free.app";
```

### Issue 3: ngrok Tunnel Expired

**Symptom**: "Tunnel not found" or connection refused

**Solution**: Free ngrok tunnels expire after 2 hours. Restart ngrok:

```bash
# Stop ngrok (Ctrl+C)
# Start again
ngrok http 3000
# Copy the NEW URL and update appConfig.dart
```

### Issue 4: CORS Errors

**Symptom**: CORS policy errors in browser/app

**Solution**: Already configured in `server.js`:

```javascript
app.use(cors());  // ✅ CORS enabled
```

If issues persist, check ngrok dashboard for blocked requests.

### Issue 5: Slow Response Times

**Symptom**: API calls take 5-10 seconds

**Solution**: 
- Free ngrok adds latency (~100-500ms)
- Use paid ngrok for faster speeds
- Or use local network IP instead (see FLUTTER_INTEGRATION.md)

## 📊 ngrok Dashboard

Access the ngrok web interface at: `http://localhost:4040`

Features:
- View all HTTP requests in real-time
- Inspect request/response details
- Replay requests
- Check for errors

## 🔐 Security Notes

### Free Tier Limitations
- Tunnel URL changes on restart
- 2-hour session limit
- Limited bandwidth
- Public URL (anyone with link can access)

### Best Practices
1. **Don't commit ngrok URLs** to git
2. **Use for development only** (not production)
3. **Regenerate URL daily** for security
4. **Monitor ngrok dashboard** for suspicious activity

## 🚀 Pro Tips

### 1. Custom Subdomain (Paid Feature)

```bash
ngrok http 3000 --subdomain=myeshop-mock
# URL: https://myeshop-mock.ngrok-free.app
```

### 2. Save ngrok Config

Create `~/.ngrok2/ngrok.yml`:

```yaml
authtoken: YOUR_AUTH_TOKEN
tunnels:
  eshop-mock:
    proto: http
    addr: 3000
```

Then run:
```bash
ngrok start eshop-mock
```

### 3. Keep Tunnel Alive

Use a process manager to auto-restart:

```bash
# Install PM2
npm install -g pm2

# Start both services
pm2 start "npm run dev" --name mock-api
pm2 start "ngrok http 3000" --name ngrok-tunnel
```

## 🔄 Switching Back to Local

To switch back to localhost:

```dart
// For emulator
const String baseUrl = "http://localhost:3000";

// For physical device on same network
const String baseUrl = "http://192.168.1.XXX:3000";

// For production
const String baseUrl = "https://eshop-pro.eshopweb.store";
```

## 📱 Testing Checklist

Before testing with ngrok:

- [ ] Mock server running (`npm run dev`)
- [ ] ngrok tunnel active (`ngrok http 3000`)
- [ ] ngrok URL copied (no trailing slash)
- [ ] `appConfig.dart` updated with ngrok URL
- [ ] Flutter app restarted
- [ ] Test in browser first
- [ ] Check ngrok dashboard for requests

## 🆘 Still Having Issues?

1. **Check ngrok dashboard**: `http://localhost:4040`
2. **View server logs**: Check terminal running `npm run dev`
3. **Test with curl**:
   ```bash
   curl -H "ngrok-skip-browser-warning: true" https://abc123.ngrok-free.app/api/get_stores
   ```
4. **Verify header in code**: Check `apiService.dart` line 36

## 📚 Additional Resources

- [ngrok Documentation](https://ngrok.com/docs)
- [ngrok Dashboard](https://dashboard.ngrok.com/)
- [Flutter Integration Guide](./FLUTTER_INTEGRATION.md)
- [Mock API README](./README.md)

---

**Ready to test!** Your mock API is now accessible from anywhere. 🌍

