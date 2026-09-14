# GreenPath Market API

REST API for **GreenPath Market**, a sustainable products marketplace. Built with **FastAPI**, **SQLAlchemy 2.0 async** (PostgreSQL), **Cloudinary** for image hosting, and **JWT** authentication.

**Version:** 1.1.0

---

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Roles & Permissions](#roles--permissions)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Endpoints Reference](#endpoints-reference)
   - [Register](#1-register)
   - [Login](#2-login)
   - [Users](#3-users)
   - [Shops](#4-shops)
   - [Products](#5-products)
   - [Categories](#6-categories)
   - [Seller Requests](#7-seller-requests)
   - [Penalties](#8-penalties)
   - [Search](#9-search)
   - [Uploads](#10-uploads)
   - [Payments](#11-payments)
7. [Data Schemas](#data-schemas)
8. [Seed Data Reference](#seed-data-reference)
9. [Next.js Integration Examples](#nextjs-integration-examples)
10. [Local Development](#local-development)

---

## Base URL

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:8000` |
| Production | Set your deployed URL (e.g. Render, Railway) |

All endpoints below are relative to the base URL. Example: `POST /login/` means `http://localhost:8000/login/`

**Interactive docs:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

---

## Authentication

Most endpoints require a **JWT Bearer Token** in the `Authorization` header.

### Auth Flow

```
1. POST /register/           → sends verification code to email
2. POST /register/verify     → confirms code, creates user
3. POST /login/              → returns access_token
4. Use token in all protected endpoints
```

### Request Header

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Token Details

- **Algorithm:** HS256
- **Expiration:** 30 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)
- **Payload:** `{ "sub": "<email>", "user_id": <int> }`

---

## Roles & Permissions

| ID | Role | Description |
|----|------|-------------|
| 1 | `cliente` | Customer — can buy, review shops, request to become seller |
| 2 | `vendedor` | Seller — owns a shop, manages products |
| 3 | `admin` | Admin — full access to all resources |

### Document Types (seeded)

| ID | Type | Abbreviation |
|----|------|-------------|
| 1 | Cédula de ciudadanía | CC |
| 2 | Cédula de extranjería | CE |
| 3 | Tarjeta de identidad | TI |
| 4 | Pasaporte | PA |
| 5 | NIT | NIT |

---

## Error Handling

All errors follow the same structure:

```json
{
  "detail": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Success |
| 201 | Created — Resource created |
| 204 | No Content — Deleted successfully |
| 400 | Bad Request — Invalid data |
| 401 | Unauthorized — Missing or invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource doesn't exist |
| 409 | Conflict — Duplicate (email, document, etc.) |
| 429 | Too Many Requests — Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| Default | 100 requests/min |
| Auth endpoints (`/login`, `/register`) | 10 requests/min |
| SSE stream (`/products/stream`) | 5 requests/min |

Rate limiting is applied per IP address using a sliding window.

---

## Endpoints Reference

### 1. Register

#### `POST /register/` — Send Verification Code

**Auth:** None

**Request Body:**

```json
{
  "full_name": "Ana Gomez",
  "birthdate": "1995-02-14",
  "email": "ana@example.com",
  "phone": "3001234567",
  "id_document_type": 1,
  "document_number": "1012345678",
  "user_password": "123456",
  "user_address": "Cra 10 # 12-34"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `full_name` | string | Yes | 1-100 chars |
| `birthdate` | string | Yes | Format: `YYYY-MM-DD` |
| `email` | string | Yes | Valid email |
| `phone` | string | Yes | 2-100 chars |
| `id_document_type` | int | Yes | See [Document Types](#document-types-seeded) |
| `document_number` | string | Yes | Unique |
| `user_password` | string | Yes | Min 6 chars |
| `user_address` | string | No | Min 4 chars |

**Response (200):**

```json
{
  "message": "Código de verificación enviado a tu correo",
  "email": "ana@example.com"
}
```

---

#### `POST /register/verify` — Confirm Email & Create User

**Auth:** None

**Request Body:**

```json
{
  "email": "ana@example.com",
  "code": "123456"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | Same email used in register |
| `code` | string | Yes | 6-digit code from email |

**Response (201):**

```json
{
  "id_user": 1,
  "full_name": "Ana Gomez",
  "birthdate": "1995-02-14",
  "email": "ana@example.com",
  "phone": "3001234567",
  "id_document_type": 1,
  "document_number": "1012345678",
  "id_rol": 1,
  "user_address": "Cra 10 # 12-34",
  "avatar_url": null,
  "avatar_public_id": null,
  "created_at": "2026-08-11T00:00:00",
  "updated_at": "2026-08-11T00:00:00"
}
```

---

### 2. Login

#### `POST /login/` — Authenticate & Get Token

**Auth:** None

**Request Body:**

```json
{
  "email": "ana@example.com",
  "password": "123456"
}
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "user_name": "Ana Gomez",
  "email": "ana@example.com",
  "role_id": 1,
  "message": "Login successful"
}
```

---

### 3. Users

#### `GET /users/me/profile` — Get My Profile

**Auth:** Required

**Response (200):**

```json
{
  "id_user": 1,
  "full_name": "Ana Gomez",
  "birthdate": "1995-02-14",
  "email": "ana@example.com",
  "phone": "3001234567",
  "id_document_type": 1,
  "document_number": "1012345678",
  "id_rol": 1,
  "user_address": "Cra 10 # 12-34",
  "avatar_url": "https://res.cloudinary.com/xxx/image/upload/...",
  "avatar_public_id": "greenpath/users/abc123",
  "created_at": "2026-08-11T00:00:00",
  "updated_at": "2026-08-11T00:00:00"
}
```

---

#### `POST /users/me/avatar` — Upload/Replace Avatar

**Auth:** Required

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `avatar` | file | Yes | Image file |

**Response (200):** Returns full `UserResponse` with updated `avatar_url`.

---

#### `GET /users/` — List All Users (Admin Only)

**Auth:** Required (admin role)

**Query Parameters:**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `skip` | int | 0 | Offset |
| `limit` | int | 100 | Max results |

**Response (200):** Array of `UserResponse`

---

#### `POST /users/` — Create User (Admin Only)

**Auth:** Required (admin role)

**Request Body:**

```json
{
  "full_name": "New User",
  "birthdate": "1990-01-01",
  "email": "new@example.com",
  "phone": "3009999999",
  "id_document_type": 1,
  "document_number": "99999999",
  "user_password": "123456",
  "id_rol": 1,
  "user_address": "Calle 1 # 1-1"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id_rol` | int | Yes | 1=cliente, 2=vendedor, 3=admin |

**Response (200):** `UserResponse`

---

#### `GET /users/{user_id}` — Get User by ID

**Auth:** Required (owner or admin)

**Response (200):** `UserResponse`

---

#### `PUT /users/{user_id}` — Update User

**Auth:** Required (owner only)

**Request Body (all fields optional):**

```json
{
  "full_name": "Ana Maria Gomez",
  "phone": "3109876543",
  "user_address": "Calle 77 # 10-20",
  "avatar_url": "https://...",
  "avatar_public_id": "greenpath/users/..."
}
```

**Response (200):** `UserResponse`

---

#### `DELETE /users/{user_id}` — Delete User

**Auth:** Required (owner only)

**Response (200):**

```json
{
  "message": "Usuario eliminado correctamente"
}
```

---

### 4. Shops

#### `GET /shops/` — List All Shops

**Auth:** None

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| `skip` | int | 0 |
| `limit` | int | 100 |

**Response (200):** Array of `ShopResponse`

---

#### `GET /shops/{shop_id}` — Get Shop by ID

**Auth:** None

**Response (200):**

```json
{
  "id_shop": 1,
  "id_user": 1,
  "shop_name": "Green Market",
  "description": "Sustainable products store",
  "shop_address": "Cra 15 # 20-30",
  "logo_url": "https://res.cloudinary.com/xxx/image/upload/...",
  "logo_public_id": "greenpath/shops/logo123",
  "is_active": true,
  "state": "active",
  "rejection_reason": null,
  "shop_score": 100,
  "created_at": "2026-08-11T00:00:00",
  "updated_at": "2026-08-11T00:00:00",
  "reviews_count": 5
}
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | string | `active`, `solicitud_de_desactivacion_pendiente`, `desactivada_temporalmente`, `rechazada`, `eliminada` |
| `shop_score` | int | Starts at 100, reduced by penalties |
| `reviews_count` | int | Total number of reviews |

---

#### `POST /shops/` — Create Shop (JSON)

**Auth:** Required

**Request Body:**

```json
{
  "id_user": 1,
  "shop_name": "Green Market",
  "description": "Sustainable products store",
  "shop_address": "Cra 15 # 20-30",
  "is_active": true
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id_user` | int | Yes | Owner user ID |
| `shop_name` | string | Yes | 2-100 chars, unique |
| `description` | string | Yes | |
| `shop_address` | string | No | 2-255 chars |
| `is_active` | bool | No | Default: `true` |

**Response (201):** `ShopResponse`

---

#### `POST /shops/upload` — Create Shop with Logo (Multipart)

**Auth:** Required (owner or admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id_user` | int | Yes | Owner user ID |
| `shop_name` | string | Yes | |
| `description` | string | Yes | |
| `shop_address` | string | No | |
| `is_active` | bool | No | Default: `true` |
| `logo` | file | Yes | Image file |

**Response (201):** `ShopResponse`

---

#### `PUT /shops/{shop_id}` — Update Shop (JSON)

**Auth:** Required (owner or admin)

**Request Body (all fields optional):**

```json
{
  "shop_name": "Green Market Updated",
  "description": "New description",
  "shop_address": "New address",
  "is_active": true
}
```

**Response (200):** `ShopResponse`

---

#### `PUT /shops/upload/{shop_id}` — Update Shop with Logo (Multipart)

**Auth:** Required (owner or admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `id_user` | int | Yes |
| `shop_name` | string | Yes |
| `description` | string | Yes |
| `shop_address` | string | No |
| `is_active` | bool | No |
| `logo` | file | No (optional) |

**Response (200):** `ShopResponse`

---

#### `POST /shops/{shop_id}/image` — Replace Shop Logo

**Auth:** Required (owner or admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `logo` | file | Yes |

**Response (200):** `ShopResponse`

---

#### `DELETE /shops/{shop_id}` — Delete Shop

**Auth:** Required (owner or admin)

**Response:** `204 No Content`

---

#### `POST /shops/{shop_id}/reviews` — Create Review

**Auth:** Required (one review per user per shop)

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Great products and fast shipping!"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `rating` | int | Yes | 1-5 |
| `comment` | string | No | Free text |

**Response (201):**

```json
{
  "id_review": 1,
  "id_shop": 1,
  "id_user": 1,
  "full_name": "Ana Gomez",
  "rating": 5,
  "comment": "Great products and fast shipping!",
  "created_at": "2026-08-11T00:00:00"
}
```

---

#### `GET /shops/{shop_id}/reviews` — List Shop Reviews

**Auth:** None

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| `skip` | int | 0 |
| `limit` | int | 10 |

**Response (200):** Array of `ReviewResponse`

---

#### `POST /shops/{shop_id}/request-deactivation` — Request Shop Deactivation

**Auth:** Required (shop owner)

Sends a deactivation request to the admin panel. Shop remains visible until admin approves.

**Response (200):**

```json
{
  "message": "Solicitud de desactivación enviada al panel de administración",
  "shop_state": "solicitud_de_desactivacion_pendiente"
}
```

---

#### `POST /shops/{shop_id}/admin/approve-deactivation` — Admin Approve Deactivation

**Auth:** Required (admin)

**Response (200):**

```json
{
  "message": "Desactivación aprobada por administración",
  "shop_state": "desactivada_temporalmente"
}
```

---

#### `POST /shops/{shop_id}/admin/reject-deactivation` — Admin Reject Deactivation

**Auth:** Required (admin)

**Request Body (optional):**

```json
{
  "state": "rechazada",
  "reason": "Shop does not meet criteria"
}
```

**Response (200):**

```json
{
  "message": "Solicitud de desactivación rechazada. La tienda permanece visible.",
  "shop_state": "rechazada",
  "rejection_reason": "Shop does not meet criteria"
}
```

---

#### `POST /shops/{shop_id}/admin/reactivate` — Admin Reactivate Shop

**Auth:** Required (admin)

**Response (200):**

```json
{
  "message": "Tienda reactivada exitosamente",
  "shop_state": "active"
}
```

---

### 5. Products

#### `GET /products/` — List All Products

**Auth:** None

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| `skip` | int | 0 |
| `limit` | int | 100 |

**Response (200):**

```json
[
  {
    "id_product": 1,
    "id_shop": 1,
    "name_product": "Reusable Bottle",
    "product_description": "Stainless steel bottle",
    "price": 35000.0,
    "stock": 15,
    "image_url": "https://res.cloudinary.com/xxx/image/upload/...",
    "image_public_id": "greenpath/products/abc123",
    "product_star_rate": 4.8,
    "id_category": 1,
    "shop_name": "Green Market",
    "shop_state": "active",
    "images": [
      {
        "id": 1,
        "product_id": 1,
        "image_url": "https://res.cloudinary.com/xxx/image/upload/...",
        "image_public_id": "greenpath/products/img1",
        "position": 0,
        "created_at": "2026-08-11T00:00:00"
      }
    ],
    "created_at": "2026-08-11T00:00:00",
    "updated_at": "2026-08-11T00:00:00"
  }
]
```

---

#### `GET /products/{product_id}` — Get Product by ID

**Auth:** None

**Response (200):** Single `ProductResponse` (same schema as above)

---

#### `GET /products/category/{category_id}` — Products by Category

**Auth:** None

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| `skip` | int | 0 |
| `limit` | int | 100 |

**Response (200):** Array of `ProductWithDetailsResponse`

```json
[
  {
    "id_product": 1,
    "id_shop": 1,
    "name_product": "Reusable Bottle",
    "product_description": "Stainless steel bottle",
    "price": 35000.0,
    "stock": 15,
    "product_star_rate": 4.8,
    "category_name": "Home",
    "image_url": "https://...",
    "image_public_id": "...",
    "shop_name": "Green Market",
    "shop_state": "active",
    "created_at": "2026-08-11T00:00:00",
    "updated_at": "2026-08-11T00:00:00"
  }
]
```

---

#### `GET /products/shop/{shop_id}` — Products by Shop

**Auth:** None

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| `skip` | int | 0 |
| `limit` | int | 100 |

**Response (200):** Array of `ProductResponse`

---

#### `POST /products/` — Create Product (JSON)

**Auth:** None (note: upload endpoint requires auth)

**Request Body:**

```json
{
  "id_shop": 1,
  "name_product": "Reusable Bottle",
  "product_description": "Stainless steel bottle",
  "price": 35000.0,
  "stock": 15,
  "product_star_rate": 4.8,
  "id_category": 1,
  "image_url": "https://...",
  "image_public_id": "..."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id_shop` | int | No | Shop ID (nullable) |
| `name_product` | string | Yes | Max 100 chars |
| `product_description` | string | No | |
| `price` | float | Yes | > 0 |
| `stock` | int | Yes | >= 0 |
| `product_star_rate` | float | Yes | 0-5 |
| `id_category` | int | Yes | Category ID |
| `image_url` | string | No | |
| `image_public_id` | string | No | |

**Response (200):** `ProductResponse`

---

#### `POST /products/upload` — Create Product with Images (Multipart)

**Auth:** Required (shop owner or admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id_shop` | int | Yes | |
| `name_product` | string | Yes | |
| `product_description` | string | No | |
| `price` | float | Yes | |
| `stock` | int | Yes | |
| `product_star_rate` | float | Yes | |
| `id_category` | int | Yes | |
| `images` | file[] | Yes | One or more image files |

**Response (200):** `ProductResponse`

---

#### `POST /products/{product_id}/images` — Add Image to Product

**Auth:** Required (shop owner or admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `image` | file | Yes |

**Response (201):**

```json
{
  "id": 1,
  "product_id": 1,
  "image_url": "https://res.cloudinary.com/xxx/image/upload/...",
  "image_public_id": "greenpath/products/img123",
  "position": 1,
  "created_at": "2026-08-11T00:00:00"
}
```

---

#### `PUT /products/images/{image_id}` — Replace Product Image

**Auth:** Required (shop owner or admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `image` | file | Yes |

**Response (200):** `ProductImageResponse`

---

#### `DELETE /products/images/{image_id}` — Delete Product Image

**Auth:** Required (shop owner or admin)

**Response (200):**

```json
{
  "message": "Imagen eliminada correctamente"
}
```

---

#### `PUT /products/{product_id}` — Update Product

**Auth:** None

**Request Body (all fields optional):**

```json
{
  "name_product": "Updated Bottle",
  "price": 39000.0,
  "stock": 10,
  "product_star_rate": 5.0
}
```

**Response (200):** `ProductResponse`

---

#### `DELETE /products/{product_id}` — Delete Product

**Auth:** None

**Response (200):**

```json
{
  "message": "Producto eliminado correctamente"
}
```

---

#### `GET /products/stream` — Real-time Product Events (SSE)

**Auth:** None

**Response:** `text/event-stream`

Server-Sent Events for real-time product updates:

```
: connected

data: {"type": "created", "product": {...}}

data: {"type": "updated", "product": {...}}

data: {"type": "deleted", "product": {...}}
```

Event types: `created`, `updated`, `deleted`

---

### 6. Categories

#### `GET /categories/` — List All Categories

**Auth:** None

**Response (200):**

```json
[
  {
    "id_category": 1,
    "name_category": "Food",
    "image_url": "https://res.cloudinary.com/xxx/image/upload/...",
    "image_public_id": "greenpath/categories/cat1",
    "created_at": "2026-08-11T00:00:00",
    "updated_at": "2026-08-11T00:00:00"
  }
]
```

---

#### `GET /categories/{category_id}` — Get Category by ID

**Auth:** None

**Response (200):** `CategoryResponse`

---

#### `POST /categories/` — Create Category (Admin Only)

**Auth:** Required (admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name_category` | string | Yes | 1-40 chars |
| `image` | file | Yes | Image file |

**Response (201):** `CategoryResponse`

---

#### `PUT /categories/{category_id}` — Update Category (Admin Only)

**Auth:** Required (admin)

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name_category` | string | No | 1-40 chars |
| `image` | file | No | New image |

At least one field must be provided.

**Response (200):** `CategoryResponse`

---

#### `DELETE /categories/{category_id}` — Delete Category (Admin Only)

**Auth:** Required (admin)

**Response:** `204 No Content`

---

### 7. Seller Requests

#### `POST /seller-requests/` — Request to Become Seller

**Auth:** Required

**Request Body:**

```json
{
  "shop_name": "My Eco Store",
  "description": "I sell sustainable products made from recycled materials",
  "shop_address": "Cra 10 # 15-20",
  "logo_url": "https://res.cloudinary.com/xxx/...",
  "why_seller": "I want to promote sustainable living"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `shop_name` | string | Yes | 2-100 chars |
| `description` | string | Yes | Min 10 chars |
| `shop_address` | string | No | Max 255 chars |
| `logo_url` | string | No | URL from Cloudinary |
| `why_seller` | string | Yes | Min 10 chars |

**Response (200):**

```json
{
  "id_request": 1,
  "id_user": 1,
  "shop_name": "My Eco Store",
  "description": "I sell sustainable products made from recycled materials",
  "shop_address": "Cra 10 # 15-20",
  "logo_url": "https://res.cloudinary.com/xxx/...",
  "why_seller": "I want to promote sustainable living",
  "status": "pending",
  "admin_note": null,
  "created_at": "2026-08-11T00:00:00",
  "updated_at": "2026-08-11T00:00:00"
}
```

---

#### `GET /seller-requests/my` — Get My Seller Request

**Auth:** Required

**Response (200):** `SellerRequestResponse` or `null`

---

#### `GET /seller-requests/` — List All Seller Requests (Admin Only)

**Auth:** Required (admin)

**Query Parameters:**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `status` | string | null | Filter: `pending`, `approved`, `denied` |
| `skip` | int | 0 | |
| `limit` | int | 20 | 1-100 |

**Response (200):**

```json
{
  "total": 5,
  "requests": [
    {
      "id_request": 1,
      "id_user": 1,
      "shop_name": "My Eco Store",
      "description": "...",
      "shop_address": "...",
      "logo_url": "...",
      "why_seller": "...",
      "status": "pending",
      "admin_note": null,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

---

#### `GET /seller-requests/pending` — Get Pending Requests (Admin Only)

**Auth:** Required (admin)

**Response (200):** `SellerRequestListResponse` (filtered to pending)

---

#### `PUT /seller-requests/{request_id}/approve` — Approve Request (Admin Only)

**Auth:** Required (admin)

**Request Body:**

```json
{
  "status": "approved",
  "admin_note": "Welcome to GreenPath!"
}
```

**Response (200):** `SellerRequestResponse` with `status: "approved"`

---

#### `PUT /seller-requests/{request_id}/deny` — Deny Request (Admin Only)

**Auth:** Required (admin)

**Request Body:**

```json
{
  "status": "denied",
  "admin_note": "Does not meet requirements"
}
```

**Response (200):** `SellerRequestResponse` with `status: "denied"`

---

### 8. Penalties

#### `POST /penalties/` — Create Penalty (Admin Only)

**Auth:** Required (admin)

**Request Body:**

```json
{
  "id_shop": 1,
  "reason": "Repeated late shipments",
  "points_deducted": 10
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id_shop` | int | Yes | Shop to penalize |
| `reason` | string | Yes | Min 5 chars |
| `points_deducted` | int | Yes | 1-100 |

**Response (200):**

```json
{
  "id_penalty": 1,
  "id_shop": 1,
  "id_admin": 3,
  "reason": "Repeated late shipments",
  "points_deducted": 10,
  "created_at": "2026-08-11T00:00:00"
}
```

---

#### `GET /penalties/shop/{shop_id}` — Get Penalties by Shop (Admin Only)

**Auth:** Required (admin)

**Response (200):**

```json
{
  "total": 2,
  "penalties": [
    {
      "id_penalty": 1,
      "id_shop": 1,
      "id_admin": 3,
      "reason": "Repeated late shipments",
      "points_deducted": 10,
      "created_at": "2026-08-11T00:00:00"
    }
  ]
}
```

---

#### `DELETE /penalties/{penalty_id}` — Remove Penalty (Admin Only)

**Auth:** Required (admin)

**Response (200):**

```json
{
  "message": "Penalización eliminada correctamente"
}
```

---

### 9. Search

#### `GET /search/` — Search Products

**Auth:** None

**Query Parameters:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `keyword` | string | Yes | Search term |
| `category` | int | No | Category ID filter |
| `min_price` | float | No | Minimum price |
| `max_price` | float | No | Maximum price |

**Example:**

```
GET /search/?keyword=bottle&category=1&min_price=10000&max_price=50000
```

**Response (200):** Array of `ProductWithDetailsResponse`

```json
[
  {
    "id_product": 1,
    "id_shop": 1,
    "name_product": "Reusable Bottle",
    "product_description": "Stainless steel bottle",
    "price": 35000.0,
    "stock": 15,
    "product_star_rate": 4.8,
    "category_name": "Home",
    "image_url": "https://...",
    "image_public_id": "...",
    "shop_name": "Green Market",
    "shop_state": "active",
    "created_at": "2026-08-11T00:00:00",
    "updated_at": "2026-08-11T00:00:00"
  }
]
```

---

### 10. Uploads

#### `POST /uploads/image` — Upload Image to Cloudinary

**Auth:** Required

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `image` | file | Yes | Image file |
| `folder` | string | No | Default: `greenpath/products` |

**Allowed folders:** `greenpath/products`, `greenpath/shops`, `greenpath/users`, `greenpath/categories`

**Response (200):**

```json
{
  "image_url": "https://res.cloudinary.com/xxx/image/upload/v123/...",
  "image_public_id": "greenpath/products/abc123",
  "resource_type": "image",
  "width": 1000,
  "height": 800
}
```

---

### 11. Payments

#### `POST /send/payments` — Send Payment Notification via WhatsApp

**Auth:** None

**Request Body:**

```json
{
  "payments": {
    "name_customer": "Ana Gomez",
    "phone_customer": "+573001234567",
    "amount": 250000,
    "name_seller": "Green Market"
  },
  "phone_seller": "+573009876543"
}
```

| Field | Type | Required |
|-------|------|----------|
| `payments.name_customer` | string | Yes |
| `payments.phone_customer` | string | Yes |
| `payments.amount` | float | Yes |
| `payments.name_seller` | string | Yes |
| `phone_seller` | string | Yes |

**Response (200):**

```json
{
  "status": "ok",
  "message": "Payment request sent to WhatsApp",
  "response": {
    "result": "success"
  }
}
```

---

### System

#### `GET /` — API Status

**Response (200):**

```json
{
  "message": "GreenPath API - Backend con PostgreSQL",
  "status": "running"
}
```

#### `GET /health` — Health Check

**Response (200):**

```json
{
  "status": "healthy",
  "database": "PostgreSQL"
}
```

---

## Data Schemas

### UserResponse

```json
{
  "id_user": 1,
  "full_name": "string",
  "birthdate": "YYYY-MM-DD",
  "email": "string",
  "phone": "string",
  "id_document_type": 1,
  "document_number": "string",
  "id_rol": 1,
  "user_address": "string | null",
  "avatar_url": "string | null",
  "avatar_public_id": "string | null",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### ShopResponse

```json
{
  "id_shop": 1,
  "id_user": 1,
  "shop_name": "string",
  "description": "string | null",
  "shop_address": "string | null",
  "logo_url": "string | null",
  "logo_public_id": "string | null",
  "is_active": true,
  "state": "active",
  "rejection_reason": "string | null",
  "shop_score": 100,
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime",
  "reviews_count": 0
}
```

### ProductResponse

```json
{
  "id_product": 1,
  "id_shop": 1,
  "name_product": "string",
  "product_description": "string | null",
  "price": 35000.0,
  "stock": 15,
  "image_url": "string | null",
  "image_public_id": "string | null",
  "product_star_rate": 4.8,
  "id_category": 1,
  "shop_name": "string | null",
  "shop_state": "string | null",
  "images": ["ProductImageResponse"],
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### ProductImageResponse

```json
{
  "id": 1,
  "product_id": 1,
  "image_url": "string",
  "image_public_id": "string",
  "position": 0,
  "created_at": "ISO datetime"
}
```

### CategoryResponse

```json
{
  "id_category": 1,
  "name_category": "string",
  "image_url": "string | null",
  "image_public_id": "string | null",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### ReviewResponse

```json
{
  "id_review": 1,
  "id_shop": 1,
  "id_user": 1,
  "full_name": "string | null",
  "rating": 5,
  "comment": "string | null",
  "created_at": "ISO datetime"
}
```

### SellerRequestResponse

```json
{
  "id_request": 1,
  "id_user": 1,
  "shop_name": "string",
  "description": "string",
  "shop_address": "string | null",
  "logo_url": "string | null",
  "why_seller": "string",
  "status": "pending | approved | denied",
  "admin_note": "string | null",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### PenaltyResponse

```json
{
  "id_penalty": 1,
  "id_shop": 1,
  "id_admin": 3,
  "reason": "string",
  "points_deducted": 10,
  "created_at": "ISO datetime"
}
```

### RoleResponse

```json
{
  "id_rol": 1,
  "role_name": "cliente",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### DocumentTypeResponse

```json
{
  "id_document_type": 1,
  "document_type": "Cédula de ciudadanía",
  "document_abbreviation": "CC",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### OrderStatusResponse

```json
{
  "id_order_status": 1,
  "name_order_status": "pendiente",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### PaymentOptionResponse

```json
{
  "id_option": 1,
  "payment_option_name": "efectivo",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### ShippingStateResponse

```json
{
  "id_shipping_status": 1,
  "status_name": "preparando",
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

---

## Seed Data Reference

Run seed data to populate reference tables:

```bash
docker compose exec api python -m db.seed
```

### Order Statuses

| ID | Status |
|----|--------|
| 1 | `pendiente` |
| 2 | `pagado` |
| 3 | `enviado` |
| 4 | `entregado` |
| 5 | `cancelado` |

### Payment Options

| ID | Option |
|----|--------|
| 1 | `efectivo` |
| 2 | `tarjeta` |
| 3 | `nequi` |
| 4 | `pse` |
| 5 | `daviplata` |

### Shipping States

| ID | State |
|----|-------|
| 1 | `preparando` |
| 2 | `en_transito` |
| 3 | `entregado` |
| 4 | `devuelto` |

### Categories

| ID | Category |
|----|----------|
| 1 | Alimentos |
| 2 | Belleza |
| 3 | Hogar |
| 4 | Moda |
| 5 | Tecnología |
| 6 | Otros |

---

## Next.js Integration Examples

### API Client Setup

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 204) {
    return null as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data as T;
}

export default apiFetch;
```

### Auth Helper

```typescript
// lib/auth.ts
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function storeToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function getUserFromStorage() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function storeUser(user: {
  user_id: number;
  user_name: string;
  email: string;
  role_id: number;
}): void {
  localStorage.setItem("user", JSON.stringify(user));
}
```

### Login Example

```typescript
// app/login/actions.ts
"use server";

import { redirect } from "next/navigation";

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  user_name: string;
  email: string;
  role_id: number;
  message: string;
}

export async function login(email: string, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  const data: LoginResponse = await response.json();
  return data;
}
```

### Register Example

```typescript
// app/register/actions.ts
"use server";

interface RegisterPayload {
  full_name: string;
  birthdate: string;
  email: string;
  phone: string;
  id_document_type: number;
  document_number: string;
  user_password: string;
  user_address?: string;
}

export async function register(payload: RegisterPayload) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}

export async function verifyEmail(email: string, code: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await fetch(`${API_URL}/register/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Verification failed");
  }

  return response.json();
}
```

### Fetch Products

```typescript
// app/products/actions.ts
"use server";

import apiFetch from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

interface Product {
  id_product: number;
  id_shop: number | null;
  name_product: string;
  product_description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  image_public_id: string | null;
  product_star_rate: number;
  id_category: number;
  shop_name: string | null;
  shop_state: string | null;
  images: {
    id: number;
    product_id: number;
    image_url: string;
    image_public_id: string;
    position: number;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

export async function getProducts(skip = 0, limit = 20): Promise<Product[]> {
  return apiFetch<Product[]>(`/products/?skip=${skip}&limit=${limit}`);
}

export async function getProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function getProductsByCategory(
  categoryId: number,
  skip = 0,
  limit = 20
): Promise<Product[]> {
  return apiFetch<Product[]>(
    `/products/category/${categoryId}?skip=${skip}&limit=${limit}`
  );
}

export async function searchProducts(
  keyword: string,
  category?: number,
  minPrice?: number,
  maxPrice?: number
): Promise<Product[]> {
  const params = new URLSearchParams({ keyword });
  if (category) params.append("category", String(category));
  if (minPrice) params.append("min_price", String(minPrice));
  if (maxPrice) params.append("max_price", String(maxPrice));

  return apiFetch<Product[]>(`/search/?${params.toString()}`);
}
```

### Create Product with Image (Multipart)

```typescript
// Using FormData for file uploads
export async function createProductWithImage(formData: FormData) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/products/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Do NOT set Content-Type — browser sets it with boundary
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create product");
  }

  return response.json();
}

// Usage in a component:
// const formData = new FormData();
// formData.append("id_shop", "1");
// formData.append("name_product", "Eco Bottle");
// formData.append("price", "35000");
// formData.append("stock", "10");
// formData.append("product_star_rate", "4.5");
// formData.append("id_category", "1");
// formData.append("images", fileInput.files[0]);
// await createProductWithImage(formData);
```

### Shop Management

```typescript
import apiFetch from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

interface Shop {
  id_shop: number;
  id_user: number;
  shop_name: string;
  description: string | null;
  shop_address: string | null;
  logo_url: string | null;
  logo_public_id: string | null;
  is_active: boolean;
  state: string;
  rejection_reason: string | null;
  shop_score: number;
  created_at: string;
  updated_at: string;
  reviews_count: number;
}

export async function getShops(skip = 0, limit = 100): Promise<Shop[]> {
  return apiFetch<Shop[]>(`/shops/?skip=${skip}&limit=${limit}`);
}

export async function getShopById(id: number): Promise<Shop> {
  return apiFetch<Shop>(`/shops/${id}`);
}

export async function createShop(data: {
  id_user: number;
  shop_name: string;
  description: string;
  shop_address?: string;
  is_active?: boolean;
}): Promise<Shop> {
  const token = getStoredToken();
  return apiFetch<Shop>("/shops/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateShop(
  id: number,
  data: {
    shop_name?: string;
    description?: string;
    shop_address?: string;
    is_active?: boolean;
  }
): Promise<Shop> {
  const token = getStoredToken();
  return apiFetch<Shop>(`/shops/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteShop(id: number): Promise<void> {
  const token = getStoredToken();
  await apiFetch(`/shops/${id}`, {
    method: "DELETE",
    token,
  });
}
```

### Seller Request

```typescript
import apiFetch from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

interface SellerRequest {
  id_request: number;
  id_user: number;
  shop_name: string;
  description: string;
  shop_address: string | null;
  logo_url: string | null;
  why_seller: string;
  status: "pending" | "approved" | "denied";
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export async function createSellerRequest(data: {
  shop_name: string;
  description: string;
  shop_address?: string;
  logo_url?: string;
  why_seller: string;
}): Promise<SellerRequest> {
  const token = getStoredToken();
  return apiFetch<SellerRequest>("/seller-requests/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function getMySellerRequest(): Promise<SellerRequest | null> {
  const token = getStoredToken();
  return apiFetch<SellerRequest>("/seller-requests/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### User Profile

```typescript
import apiFetch from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

interface User {
  id_user: number;
  full_name: string;
  birthdate: string;
  email: string;
  phone: string;
  id_document_type: number;
  document_number: string;
  id_rol: number;
  user_address: string | null;
  avatar_url: string | null;
  avatar_public_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getMyProfile(): Promise<User> {
  const token = getStoredToken();
  return apiFetch<User>("/users/me/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateProfile(
  userId: number,
  data: {
    full_name?: string;
    phone?: string;
    user_address?: string;
  }
): Promise<User> {
  const token = getStoredToken();
  return apiFetch<User>(`/users/${userId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File): Promise<User> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = getStoredToken();

  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(`${API_URL}/users/me/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to upload avatar");
  }

  return response.json();
}
```

### Review

```typescript
import apiFetch from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

interface Review {
  id_review: number;
  id_shop: number;
  id_user: number;
  full_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export async function getShopReviews(
  shopId: number,
  skip = 0,
  limit = 10
): Promise<Review[]> {
  return apiFetch<Review[]>(
    `/shops/${shopId}/reviews?skip=${skip}&limit=${limit}`
  );
}

export async function createReview(
  shopId: number,
  data: { rating: number; comment?: string }
): Promise<Review> {
  const token = getStoredToken();
  return apiFetch<Review>(`/shops/${shopId}/reviews`, {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}
```

### Categories

```typescript
import apiFetch from "@/lib/api";

interface Category {
  id_category: number;
  name_category: string;
  image_url: string | null;
  image_public_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories/");
}

export async function getCategoryById(id: number): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`);
}
```

### SSE Real-time Products

```typescript
// hooks/useProductStream.ts
"use client";

import { useEffect, useRef, useCallback } from "react";

interface ProductEvent {
  type: "created" | "updated" | "deleted";
  product: Record<string, unknown>;
}

export function useProductStream(onEvent: (event: ProductEvent) => void) {
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const eventSource = new EventSource(`${API_URL}/products/stream`);

    eventSource.onmessage = (event) => {
      if (event.data.startsWith(":")) return; // ping
      try {
        const data = JSON.parse(event.data) as ProductEvent;
        onEvent(data);
      } catch {
        // ignore parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    eventSourceRef.current = eventSource;
  }, [onEvent]);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
    };
  }, [connect]);
}
```

### Admin: Seller Requests Management

```typescript
import apiFetch from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

interface SellerRequestListResponse {
  total: number;
  requests: SellerRequest[];
}

export async function getAllSellerRequests(
  status?: "pending" | "approved" | "denied",
  skip = 0,
  limit = 20
): Promise<SellerRequestListResponse> {
  const token = getStoredToken();
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (status) params.append("status", status);

  return apiFetch<SellerRequestListResponse>(
    `/seller-requests/?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function approveSellerRequest(
  requestId: number,
  adminNote?: string
) {
  const token = getStoredToken();
  return apiFetch(`/seller-requests/${requestId}/approve`, {
    method: "PUT",
    token,
    body: JSON.stringify({ status: "approved", admin_note: adminNote }),
  });
}

export async function denySellerRequest(
  requestId: number,
  adminNote?: string
) {
  const token = getStoredToken();
  return apiFetch(`/seller-requests/${requestId}/deny`, {
    method: "PUT",
    token,
    body: JSON.stringify({ status: "denied", admin_note: adminNote }),
  });
}
```

### Admin: Penalties

```typescript
import apiFetch from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

interface Penalty {
  id_penalty: number;
  id_shop: number;
  id_admin: number;
  reason: string;
  points_deducted: number;
  created_at: string;
}

export async function createPenalty(data: {
  id_shop: number;
  reason: string;
  points_deducted: number;
}): Promise<Penalty> {
  const token = getStoredToken();
  return apiFetch<Penalty>("/penalties/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function getPenaltiesByShop(shopId: number) {
  const token = getStoredToken();
  return apiFetch<{ total: number; penalties: Penalty[] }>(
    `/penalties/shop/${shopId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function removePenalty(penaltyId: number) {
  const token = getStoredToken();
  return apiFetch(`/penalties/${penaltyId}`, {
    method: "DELETE",
    token,
  });
}
```

### Upload Image

```typescript
export async function uploadImage(
  file: File,
  folder = "greenpath/products"
) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = getStoredToken();

  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_URL}/uploads/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Upload failed");
  }

  return response.json();
}
```

---

## Local Development

### With Docker (Recommended)

```bash
cp .env.example .env
# Edit .env with your credentials

docker compose up --build -d

# Seed reference data
docker compose exec api python -m db.seed
```

API available at `http://localhost:8000`

### Without Docker

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements-dev.txt
uvicorn main:app --reload
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PG_USER` | PostgreSQL user | Yes |
| `PG_PASSWORD` | PostgreSQL password | Yes |
| `PG_HOST` | PostgreSQL host | Yes |
| `PG_PORT` | PostgreSQL port | No (default: 5432) |
| `PG_DATABASE` | PostgreSQL database name | Yes |
| `JWT_SECRET_KEY` | JWT signing secret | Yes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration (min) | No (default: 30) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `RESEND_API_KEY` | Resend email API key | Yes |
| `N8N_WEBHOOK_URL` | n8n WhatsApp webhook URL | No |
| `CORS_ORIGINS` | Allowed origins (comma-separated or `*`) | No (default: `http://localhost:3000`) |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | No (default: true) |
| `RATE_LIMIT_DEFAULT_PER_minute` | Default rate limit/min | No (default: 100) |
| `RATE_LIMIT_AUTH_PER_MINUTE` | Auth rate limit/min | No (default: 10) |

### Run Tests

```bash
# With Docker
docker compose exec api sh -c "pip install -r requirements-dev.txt && pytest -q"

# Without Docker
pip install -r requirements-dev.txt
pytest -q
```

---

## Project Structure

```
greenpath-market-api/
├── api/                    # FastAPI route modules
│   ├── categories.py       # /categories/*
│   ├── login.py            # /login/*
│   ├── payments.py         # /send/payments
│   ├── penalties.py        # /penalties/*
│   ├── products.py         # /products/*
│   ├── register.py         # /register/*
│   ├── search.py           # /search/*
│   ├── seller_requests.py  # /seller-requests/*
│   ├── shop.py             # /shops/*
│   ├── uploads.py          # /uploads/*
│   └── users.py            # /users/*
├── config/                 # Settings (pydantic-settings)
│   └── config.py
├── crud/                   # Database operations (SQLAlchemy async)
│   ├── category_crud.py
│   ├── penalty_crud.py
│   ├── product_crud.py
│   ├── seller_request_crud.py
│   ├── shop_crud.py
│   └── user_crud.py
├── db/                     # Async engine + session + seed
│   ├── database.py
│   └── seed.py
├── middleware/              # Auth + rate limiting
│   ├── auth.py
│   └── rate_limit.py
├── models/                 # SQLAlchemy models
│   ├── category.py
│   ├── document_type.py
│   ├── email_verification.py
│   ├── order_detail.py
│   ├── order_status.py
│   ├── payment.py
│   ├── payment_option.py
│   ├── penalty.py
│   ├── product.py
│   ├── product_image.py
│   ├── review.py
│   ├── role.py
│   ├── seller_request.py
│   ├── shipment.py
│   ├── shipping_state.py
│   ├── shop.py
│   ├── user.py
│   └── user_order.py
├── schemas/                # Pydantic v2 request/response
│   ├── category_schemas.py
│   ├── document_type_schemas.py
│   ├── email_verification_schemas.py
│   ├── order_status_schemas.py
│   ├── penalty_schemas.py
│   ├── product_schemas.py
│   ├── pyment_option_schemas.py
│   ├── role_schemas.py
│   ├── seller_request_schemas.py
│   ├── shipping_states_schemas.py
│   ├── shop_schemas.py
│   └── user_schemas.py
├── service/                # External integrations
│   ├── cloudinary_service.py
│   ├── cloudinary.py
│   ├── email_service.py
│   └── events.py
├── test/                   # Tests (pytest + httpx)
├── main.py                 # App entry point
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── requirements.txt
```
