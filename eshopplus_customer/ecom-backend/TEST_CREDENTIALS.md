# Test Credentials & Mock Data

This document lists all test credentials and sample data available in the mock API.

## 🔐 Login Credentials

### Phone Login

**Primary Test Account:**
- **Phone**: `6395901821`
- **Password**: `Pass@123456`
- **User ID**: 101
- **Balance**: ₹500.00
- **Referral Code**: MOCK123

**Alternative Account:**
- **Phone**: `9999999999`
- **Password**: `123456`
- **User ID**: 101
- **Balance**: ₹500.00

### Demo App Credentials (from appConfig.dart)
- **Phone**: `9898765432`
- **Password**: `123456`

**Note**: All phone login attempts will return the same mock user (ID: 101) regardless of which phone number you use.

## 👤 Mock User Details

After successful login, you'll receive:

```json
{
  "id": 101,
  "username": "mockuser",
  "email": "mock.user@example.com",
  "mobile": "6395901821",
  "country_code": "+91",
  "balance": 500.00,
  "referral_code": "MOCK123",
  "active": 1,
  "type": "phone",
  "is_notification_on": 1
}
```

## 🛒 Sample Cart Data

The mock user has 2 items in cart:
1. **Velvet Armchair** - Qty: 2, Price: ₹249.00 each
2. **Modern Coffee Table** - Qty: 1, Price: ₹449.00

**Cart Total**: ₹994.35 (including tax)

## 📦 Sample Orders

The mock user has 3 orders:

### Order 1 (Delivered)
- **Order Number**: ORD-2024-001
- **Total**: ₹1,044.35
- **Status**: Delivered
- **Payment**: COD

### Order 2 (Processing)
- **Order Number**: ORD-2024-002
- **Total**: ₹1,363.95
- **Status**: Processing
- **Payment**: Online

### Order 3 (Pending)
- **Order Number**: ORD-2024-003
- **Total**: ₹521.45
- **Status**: Pending
- **Payment**: COD

## 📍 Sample Addresses

The mock user has 2 saved addresses:

### Address 1 (Default)
- **Name**: Mock User
- **Mobile**: 9999999999
- **Address**: 123 Main Street, Apartment 4B
- **City**: Mumbai
- **Area**: Andheri West
- **Pincode**: 400058

### Address 2
- **Name**: Mock User
- **Mobile**: 9999999999
- **Address**: 456 Park Avenue, Building C
- **City**: Mumbai
- **Area**: Bandra East
- **Pincode**: 400051

## ❤️ Favorites

The mock user has 3 favorite products:
1. Velvet Armchair with Wood Legs - ₹249.00
2. Modern Coffee Table - ₹449.00
3. Designer Sofa Set - ₹1,299.00

## 🔔 Notifications

The mock user has 4 notifications:
1. Order Delivered (Read)
2. Special Offer (Unread)
3. Order Processing (Unread)
4. New Arrivals (Unread)

## 🏪 Available Stores

The mock API returns 3 stores:

### Store 1: New Pharmacy (ID: 44)
- **Type**: Pharmacy
- **Delivery**: Global delivery charge
- **Min Free Delivery**: ₹100

### Store 2: Prime Pantry (ID: 41)
- **Type**: Grocery
- **Delivery**: Product-wise delivery charge
- **Deliverability**: Zipcode-wise

### Store 3: LuxeLine - eCommerce (ID: 38) ⭐ Default
- **Type**: Fashion
- **Delivery**: City-wise delivery charge (₹150)
- **Min Free Delivery**: ₹499
- **Deliverability**: City-wise

## 🎨 Product Data

The mock API includes:
- **54 products** from LuxeLine store
- Categories: Furniture, Fashion, Accessories
- Price range: ₹0.01 - ₹1,548
- Filters: Color (White, Grey), Size (S, M, L)

## 🔄 How Mock Data Works

### Authentication Endpoints
All authentication endpoints (`login`, `register_user`, `verify_user`) return the same mock user (ID: 101) with a token.

### User-Specific Endpoints
Endpoints like `get_user_cart`, `get_orders`, `get_address` always return the same mock data regardless of the user token.

### Public Endpoints
Endpoints like `get_stores`, `get_products`, `get_categories` return real data synced from the live API.

## 🧪 Testing Scenarios

### Test Login Flow
1. Use phone `6395901821` and password `Pass@123456`
2. Should receive token and user details
3. Navigate to home screen
4. See stores, products, and categories

### Test Cart Flow
1. Login with test credentials
2. View cart (2 items pre-loaded)
3. Add/remove items
4. Proceed to checkout

### Test Order Flow
1. Login with test credentials
2. View orders (3 orders pre-loaded)
3. Check order details
4. View order status

### Test Profile Flow
1. Login with test credentials
2. View profile (balance: ₹500)
3. View addresses (2 addresses)
4. View favorites (3 items)

## 📝 Customizing Mock Data

To customize the mock data:

1. **Edit JSON files** in `mockData/` directory
2. **Restart server** (nodemon auto-reloads)
3. **Test changes** in the app

### Example: Change User Balance

Edit `mockData/login.json`:

```json
{
  "user": {
    "balance": 1000.00  // Change from 500.00
  }
}
```

### Example: Add More Orders

Edit `mockData/get_orders.json` and add more order objects to the `data` array.

## 🔐 Security Note

**Important**: These are mock credentials for development only. Never use these in production!

- All passwords are visible in plain text
- No actual authentication is performed
- Token validation is not enforced
- Data is not persisted

## 🆘 Troubleshooting

### Login Returns Error
- Check that `login.json` has correct structure
- Verify `user` object (not nested in `data`)
- Ensure all required fields are present

### Null Type Error
- Check that numeric fields like `created_on`, `last_login`, `active`, `bonus`, `cash_received` are numbers (not strings)
- Ensure `fcm_id` is an array `[]` (not empty string)
- Verify `balance` is a number

### Token Not Working
- Mock API doesn't validate tokens
- Any token will work for authenticated endpoints
- Check that `ngrok-skip-browser-warning` header is set

## 📚 Related Documentation

- [README.md](./README.md) - Main API documentation
- [FLUTTER_INTEGRATION.md](./FLUTTER_INTEGRATION.md) - Flutter setup
- [NGROK_SETUP.md](./NGROK_SETUP.md) - ngrok configuration

---

**Happy Testing!** 🎉

