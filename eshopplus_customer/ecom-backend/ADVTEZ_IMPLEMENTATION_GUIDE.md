# Advtez Platform MVP - Implementation Guide

## Overview

This document provides comprehensive guidance for implementing and integrating the Advtez Platform MVP REST API backend.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Database Migration](#database-migration)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [Business Logic](#business-logic)
6. [Integration Guide](#integration-guide)

---

## Setup Instructions

### Prerequisites

- Node.js >= 16.x
- MySQL >= 8.0
- npm or yarn

### Installation Steps

1. **Clone and Install Dependencies**
   ```bash
   cd eshopplus_customer/ecom-backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials and configuration
   ```

3. **Setup Database**
   ```bash
   # Import base schema
   mysql -u root -p eshopplus_hyperlocal < ecom-backend.sql

   # Apply Advtez marketplace extensions
   mysql -u root -p eshopplus_hyperlocal < advtez-migration.sql
   ```

4. **Start Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

5. **Verify Installation**
   ```bash
   curl http://localhost:3000/health
   ```

---

## Database Migration

### Base Schema
The base eCommerce schema (`ecom-backend.sql`) includes:
- Users & Authentication
- Retailers & Products
- Categories & Cities
- Cart & Wishlist
- Orders & Addresses

### Advtez Extensions
The marketplace extension (`advtez-migration.sql`) adds:

**New Tables:**
- `branches` - Retailer branch locations
- `brands` - Product brands
- `discounts` - Unified discount system
- `hot_deals` - Promotional deals
- `bank_offers` - Bank-specific offers
- `wallet_transactions` - Wallet system
- `withdrawal_requests` - Withdrawal management
- `advertisements` - Advertisement platform
- `banners` - Homepage carousel banners
- `retailer_followers` - Customer-retailer relationships
- `wishlist_retailers` - Retailer wishlisting
- `order_parcels` - Parcel tracking
- `notifications` - Push notification system
- `support_tickets` - Customer support
- `support_ticket_messages` - Support ticket conversations

**Modified Tables:**
- `products` - Added multi-language fields (name_hi, name_ar, description_hi, description_ar), brand_id, mrp, article_number, status
- `retailers` - Added unique_id, business_type, pan_number, kyc_status, subscription_tier, brand fields, discount settings
- `orders` - Added order_number, commission tracking, return management
- `users` - Added date_of_birth, gender, wallet_balance

---

## API Endpoints

### Authentication & Users

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "phone": "9876543210",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "customer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": { ... }
  }
}
```

### Retailer Management

#### Onboard Retailer
```http
POST /api/retailer/onboard
Authorization: Bearer {token}
Content-Type: application/json

{
  "storeName": "Fashion Hub",
  "businessType": "Retail",
  "gstNumber": "29ABCDE1234F2Z5",
  "panNumber": "ABCDE1234F",
  "brandName": "FH Brand",
  "addressLine1": "123 Main Street",
  "cityId": 1,
  "pincode": "110001",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "phone": "9876543210",
  "description": "Premium fashion retailer"
}

Response:
{
  "success": true,
  "message": "Retailer onboarding request submitted successfully",
  "data": {
    "id": "uuid",
    "uniqueId": "MR20246AZJL",
    "status": "pending",
    ...
  }
}
```

#### Get Retailer Profile
```http
GET /api/retailer/profile
Authorization: Bearer {token}
```

#### Create Branch
```http
POST /api/retailer/branch
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Downtown Branch",
  "mobile": "9876543211",
  "addressLine1": "456 Market Street",
  "cityId": 1,
  "pincode": "110002",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "images": ["url1.jpg", "url2.jpg"]
}
```

### Discount System

#### Set Store-Wide Discount
```http
PUT /api/retailer/discount/store
Authorization: Bearer {token}
Content-Type: application/json

{
  "discountPercentage": 15
}
```

#### Create Hot Deal
```http
POST /api/retailer/discount/hot-deal
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mega Sale - 50% Off",
  "description": "Limited time offer on all products",
  "imageUrl": "https://example.com/deal.jpg",
  "externalLink": "https://store.com/sale",
  "validityStart": "2025-11-20T00:00:00Z",
  "validityEnd": "2025-11-30T23:59:59Z"
}
```

#### Create Category Discount
```http
POST /api/retailer/discount/category
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryIds": [1, 2, 3],
  "discountPercentage": 20,
  "validityStart": "2025-11-20T00:00:00Z",
  "validityEnd": "2025-12-31T23:59:59Z"
}
```

#### Create Product Discount
```http
POST /api/retailer/discount/product
Authorization: Bearer {token}
Content-Type: application/json

{
  "productIds": ["uuid1", "uuid2"],
  "discountPercentage": 25,
  "validityStart": "2025-11-20T00:00:00Z",
  "validityEnd": "2025-11-30T23:59:59Z"
}
```

#### Create Bank Offer
```http
POST /api/retailer/discount/bank-offer
Authorization: Bearer {token}
Content-Type: application/json

{
  "bankName": "HDFC Bank",
  "offerDetails": "10% instant discount on HDFC credit cards",
  "discountPercentage": 10,
  "validityStart": "2025-11-20T00:00:00Z",
  "validityEnd": "2025-12-31T23:59:59Z",
  "termsConditions": "Minimum transaction value ₹2000"
}
```

### Wallet System

#### Get Wallet Balance
```http
GET /api/wallet/balance
Authorization: Bearer {token}
```

#### Add Money to Wallet
```http
POST /api/wallet/add-money
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "paymentGatewayResponse": {
    "razorpay_payment_id": "pay_xxx",
    "razorpay_order_id": "order_xxx"
  }
}
```

#### Request Withdrawal
```http
POST /api/wallet/withdraw
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 5000,
  "bankName": "State Bank of India",
  "accountNumber": "1234567890",
  "ifscCode": "SBIN0001234",
  "accountHolderName": "John Doe"
}
```

#### Get Wallet Transactions
```http
GET /api/wallet/transactions?type=credit&page=1&limit=20
Authorization: Bearer {token}
```

### Advertisement System

#### Create Advertisement
```http
POST /api/ads/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "category_top",
  "categoryId": 1,
  "cityId": 1,
  "durationDays": 30,
  "designImageUrl": "https://example.com/ad.jpg",
  "externalLink": "https://store.com",
  "description": "Premium ad placement"
}

Response:
{
  "success": true,
  "message": "Advertisement created successfully. Pending approval.",
  "data": {
    "advertisement": { ... },
    "amountToPay": 15000
  }
}
```

#### Get My Advertisements
```http
GET /api/ads/my-ads
Authorization: Bearer {token}
```

#### Get Advertisement Report
```http
GET /api/ads/{id}/report
Authorization: Bearer {token}
```

### Home & Discovery

#### Get Home Page Data
```http
GET /api/home?cityId=1&latitude=28.7041&longitude=77.1025

Response:
{
  "success": true,
  "data": {
    "banners": [...],
    "featuredRetailers": [...],
    "categories": [...],
    "hotDeals": [...],
    "nearbyRetailers": [...]
  }
}
```

#### Explore Retailers
```http
GET /api/explore/retailers?cityId=1&categoryId=2&discountActive=true&page=1&limit=20
```

#### Get Retailer Public Profile
```http
GET /api/retailers/{id}/profile
```

#### Unified Search
```http
GET /api/search?q=fashion&type=all&cityId=1&page=1&limit=20
```

### Analytics

#### Get Retailer Analytics
```http
GET /api/retailer/analytics?period=monthly
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "period": "monthly",
    "totalSales": "125000.00",
    "totalOrders": 156,
    "commissionEarned": "6250.00",
    "salesByDay": [...],
    "mostSellingCategory": { ... }
  }
}
```

### Notifications & Support

#### Get Notifications
```http
GET /api/notifications?unreadOnly=true&page=1&limit=20
Authorization: Bearer {token}
```

#### Mark Notification as Read
```http
PUT /api/notifications/{id}/read
Authorization: Bearer {token}
```

#### Create Support Ticket
```http
POST /api/support/ticket
Authorization: Bearer {token}
Content-Type: application/json

{
  "issueType": "order",
  "subject": "Order not received",
  "message": "I haven't received my order #1234",
  "attachments": ["image1.jpg", "image2.jpg"]
}
```

#### Get Support Tickets
```http
GET /api/support/tickets?status=open&page=1&limit=20
Authorization: Bearer {token}
```

### Order Extensions

#### Create Order Parcel
```http
POST /api/orders/{id}/parcel
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Shipment 1",
  "trackingNumber": "TRK123456",
  "courierName": "Delhivery"
}
```

#### Get Order Parcels
```http
GET /api/orders/{id}/parcels
Authorization: Bearer {token}
```

#### Request Return
```http
POST /api/orders/{id}/return
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Product damaged"
}
```

#### Cancel Order
```http
PUT /api/orders/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Changed mind"
}
```

### Admin Endpoints

#### Get Pending Retailers
```http
GET /api/admin/retailers/pending
Authorization: Bearer {admin_token}
```

#### Approve Retailer
```http
PUT /api/admin/retailers/{id}/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "notes": "All documents verified"
}
```

#### Create Category
```http
POST /api/admin/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic items",
  "iconUrl": "https://example.com/icon.png",
  "parentId": null
}
```

#### Create Banner
```http
POST /api/admin/banner
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Sale Banner",
  "imageUrl": "https://example.com/banner.jpg",
  "linkUrl": "https://store.com/sale",
  "linkType": "external",
  "cityId": 1,
  "displayOrder": 1,
  "startDate": "2025-11-20T00:00:00Z",
  "endDate": "2025-11-30T23:59:59Z"
}
```

---

## Authentication & Authorization

### JWT Token System

- **Access Token**: Valid for 24 hours
- **Refresh Token**: Valid for 7 days
- **Storage**: Store securely in Flutter app (e.g., flutter_secure_storage)

### Authorization Headers

```http
Authorization: Bearer {access_token}
```

### Roles

1. **customer** - Regular customers
2. **retailer** - Store owners
3. **admin** - Platform administrators

---

## Business Logic

### Discount Priority System

When calculating final price:
1. **Product-specific discount** (highest priority)
2. **Category discount**
3. **Store-wide discount** (lowest priority)
4. **Bank offers** (applied on top)

Example:
```
MRP: ₹1000
Product Discount: 20% → ₹800
Bank Offer: 10% → ₹720 (Final Price)
```

### Commission Calculation

- Default commission: 5-10% (configurable)
- Calculated on order total
- Credited to platform, debited from retailer payout

```
Order Total: ₹10,000
Commission (5%): ₹500
Retailer Receives: ₹9,500
```

### Wallet System

**Credit Events:**
- Add money via payment gateway
- Order refunds
- Commission earnings (for retailers)

**Debit Events:**
- Order payment
- Advertisement purchases
- Withdrawal requests

### Order Number Format

Format: `#{timestamp}{random}`
Example: `#16271` (last 4 digits of timestamp + random digit)

### Retailer Unique ID Format

Format: `MR{year}{6-char-random}`
Example: `MR20246AZJL`

---

## Integration Guide for Flutter Team

### Setup

1. **Base URL Configuration**
   ```dart
   const String baseUrl = 'http://your-api-url.com/api/v1';
   ```

2. **Authentication Service**
   ```dart
   class AuthService {
     Future<AuthResponse> login(String email, String password) async {
       final response = await http.post(
         Uri.parse('$baseUrl/auth/login'),
         body: json.encode({'email': email, 'password': password}),
         headers: {'Content-Type': 'application/json'},
       );
       return AuthResponse.fromJson(json.decode(response.body));
     }
   }
   ```

3. **API Client with Token**
   ```dart
   class ApiClient {
     final String? token;

     Future<Response> get(String endpoint) async {
       return await http.get(
         Uri.parse('$baseUrl$endpoint'),
         headers: {
           'Content-Type': 'application/json',
           if (token != null) 'Authorization': 'Bearer $token',
         },
       );
     }
   }
   ```

### Error Handling

API returns standardized error responses:
```json
{
  "success": false,
  "error": true,
  "message": "Error description"
}
```

### Pagination

APIs return pagination info:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### File Upload

For image uploads, use multipart/form-data:
```dart
var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/upload'));
request.files.add(await http.MultipartFile.fromPath('image', file.path));
request.headers['Authorization'] = 'Bearer $token';
var response = await request.send();
```

---

## Testing

### Test Credentials

**Admin:**
- Email: admin@eshopplus.local
- Password: Admin@123

**Retailer:**
- Email: retailer-1@eshopplus.local
- Password: Retailer@123

**Customer:**
- Email: customer@eshopplus.local
- Password: Customer@123

### Postman Collection

Import the provided Postman collection (`advtez-api.postman_collection.json`) for testing all endpoints.

---

## Rate Limiting

- **Authentication endpoints**: 5 requests/minute
- **General API endpoints**: 60 requests/minute
- Exceeded limits return HTTP 429 (Too Many Requests)

---

## Support

For integration support or issues:
- Check API logs in `logs/` directory
- Review error responses for details
- Contact backend team with error details

---

## Security Best Practices

1. **Never log sensitive data** (passwords, tokens, payment info)
2. **Validate all user inputs** on client and server
3. **Use HTTPS** in production
4. **Store tokens securely** (flutter_secure_storage)
5. **Implement token refresh** before expiration
6. **Handle unauthorized responses** (401/403) gracefully

---

## Future Enhancements (Post-MVP)

- Real-time notifications (WebSocket/FCM)
- Advanced analytics dashboard
- Product reviews & ratings
- Multi-currency support
- In-app chat system
- Advanced search filters
- Recommendation engine

---

## License

© 2025 Advtez Platform. All rights reserved.
