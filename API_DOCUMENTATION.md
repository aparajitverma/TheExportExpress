# ExportExpress Pro API Documentation

## Overview

The ExportExpress Pro API provides a comprehensive RESTful interface for managing export operations, products, users, and market intelligence.

## Base URL

```
Production: https://api.exportexpress.com
Development: http://localhost:5000
```

## Authentication

All API requests require JWT token authentication.

### Getting a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Using the Token

```http
Authorization: Bearer <your_jwt_token>
```

## Error Handling

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Admin (Admin Only)

- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### File Upload

- `POST /api/upload/product-image` - Upload product image
- `POST /api/upload/product-images` - Upload multiple images

### Inquiries

- `GET /api/inquiries` - Get all inquiries
- `POST /api/inquiries` - Create inquiry
- `PUT /api/inquiries/:id/status` - Update inquiry status

### Bulk Operations

- `POST /api/bulk/import-products` - Bulk import products
- `GET /api/bulk/export-products` - Bulk export products

### Market Intelligence

- `GET /api/market/analysis` - Get market analysis
- `GET /api/market/predictions` - Get price predictions
- `GET /api/market/news` - Get market news

## WebSocket Events

- `price_update` - Real-time price updates
- `order_status_update` - Order status changes
- `market_alert` - Market alerts and notifications

## Rate Limiting

- Authentication: 5 requests/minute
- Products: 100 requests/minute
- Admin: 50 requests/minute
- Upload: 10 requests/minute

## Support

- Documentation: https://docs.exportexpress.com/api
- GitHub Issues: https://github.com/PearlShadowww/TheExportExpress/issues
- Email: api-support@exportexpress.com

---

**API Version**: 1.0.0
**Last Updated**: January 2024 