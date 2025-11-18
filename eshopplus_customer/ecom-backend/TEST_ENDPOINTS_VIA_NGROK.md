# Testing Mock API Endpoints via ngrok

## Issue
User reports that only "Exclusive Sale" products section is visible on the home page for every store.

## Endpoints Working (Verified via ngrok)

### ✅ Categories
```bash
curl -H "ngrok-skip-browser-warning: true" "https://d9b9e5f8c0e7.ngrok-free.app/api/get_categories?store_id=38&limit=15&offset=0"
```
**Result**: Returns 6 categories successfully

### ✅ Slider Images  
```bash
curl -H "ngrok-skip-browser-warning: true" "https://d9b9e5f8c0e7.ngrok-free.app/api/get_slider_images?store_id=38"
```
**Result**: Returns 3 slider images successfully

### ✅ Brands
```bash
curl -H "ngrok-skip-browser-warning: true" "https://d9b9e5f8c0e7.ngrok-free.app/api/get_brands?store_id=38"
```
**Result**: Returns 4 brands successfully

## Troubleshooting Steps for Flutter App

### 1. Clear App Cache & Restart
The Flutter app may have cached the old error responses. Try:

```bash
# Stop the app
flutter clean

# Rebuild and run
flutter pub get
flutter run
```

### 2. Check if API calls are being made
Add this to `lib/ui/home/homeScreen.dart` after line 82:

```dart
context.read<CategoryCubit>().fetchCategories(storeId: storeId);
print("🔍 Fetching categories for store: $storeId"); // ADD THIS
```

### 3. Check Category Cubit State
Look for error messages in the console. The CategorySection widget only renders if state is `CategoryFetchSuccess`.

### 4. Verify API Service Headers
Check `lib/core/api/apiService.dart` - ensure the `ngrok-skip-browser-warning` header is being sent (line 36).

### 5. Test a Specific Endpoint in Flutter DevTools
Open Flutter DevTools → Network tab and look for:
- `/api/get_categories` requests
- Check if they return 200 OK
- Check the response body

### 6. Force Hot Restart (Not Hot Reload)
- Press `R` (capital R) in the terminal running Flutter
- Or stop and restart the app completely

### 7. Check if Sections are Hidden by Conditions
The widgets return `SizedBox.shrink()` when:
- State is not `FetchSuccess`
- Data array is empty
- API call failed

### 8. Verify Store ID
Check which store is actually being used:
```dart
// In homeScreen.dart, add logging
int storeId = context.read<StoresCubit>().getDefaultStore().id!;
print("📍 Current Store ID: $storeId");
print("📍 Store Name: ${context.read<StoresCubit>().getDefaultStore().name}");
```

## Expected Behavior

After fixing, the home page should show:
1. ✅ **AddDeliveryLocationWidget** - Location selector
2. ✅ **CategorySection** - 6 horizontal categories
3. ✅ **SliderSection** - 3 carousel images
4. ✅ **FeaturedSellerSection** - Featured sellers
5. ✅ **BrandSection** - 4 brands
6. ✅ **CategorySliderSection** - Category-specific sliders
7. ✅ **MostSellingProductSection** - Most selling products
8. ✅ **OfferSection** - Offer banners
9. ✅ **BestSellerSection** - Best sellers
10. ✅ **FeaturedSectionContainer** - Exclusive Sale section (currently showing)

## Quick Fix Checklist

- [ ] Verify ngrok is running and forwarding to port 3000
- [ ] Verify mock API server is running (`npm start` in mock-api/)
- [ ] Clear Flutter app cache (`flutter clean`)
- [ ] Hot restart Flutter app (press R)
- [ ] Check console for API errors
- [ ] Verify store_id=38 is being used (default store)
- [ ] Check Network tab in Flutter DevTools

## If Still Not Working

The issue might be:
1. **App is offline/network error**: Check internet connectivity widget
2. **BLoC state not updating**: Check if setState() is being called
3. **Widget tree not rebuilding**: Verify BlocConsumer is properly set up
4. **API authentication**: Check if auth token is required and valid
5. **Data structure mismatch**: Compare mock data with live API response structure

## Contact Info
If none of these work, please share:
1. Flutter console output (any error messages)
2. Network tab from DevTools showing the API calls
3. Current store_id being used
4. Screenshot of the home page

