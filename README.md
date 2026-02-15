# E-Commerce Microservices with API Gateway

A microservices-based E-commerce Backend System built with **Node.js (Express)** and **MongoDB**.

## Architecture

```
                AUTHSERVICE(5001)
                      ↑
                      |
                APIGATEWAY(5000)
                      |
                      ↓
              PRODUCTSERVICE(5002)
```

**Clients communicate ONLY with the API Gateway (Port 5000).** Direct access to services is not allowed.

---

## Services

| Service        | Port | Description                                |
|----------------|------|--------------------------------------------|
| API Gateway    | 5000 | Routes requests, JWT validation             |
| Auth Service   | 5001 | User registration, login, JWT generation    |
| Product Service| 5002 | CRUD operations for products               |

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (or use Docker)
- npm

### Option 1: Run with Docker (Recommended)

```bash
# From project root
docker-compose up --build
```

- **API Gateway**: http://localhost:5000
- **Swagger (Gateway)**: http://localhost:5000/api-docs

### Option 2: Run Locally

1. **Start MongoDB** (2 instances or 2 databases):

   - Auth DB: `mongodb://localhost:27017/auth_db`
   - Product DB: `mongodb://localhost:27017/product_db`

2. **Install & Run each service**:

```bash
# Auth Service
cd auth-service && npm install && npm start

# Product Service (new terminal)
cd product-service && npm install && npm start

# API Gateway (new terminal)
cd api-gateway && npm install && npm start
```

---

## API Endpoints (via Gateway)

All requests go to `http://localhost:5000`

### Auth (no token required for register/login)

| Method | Endpoint           | Description      |
|--------|--------------------|------------------|
| POST   | /auth/register     | Register user    |
| POST   | /auth/login        | Login, get JWT   |
| GET    | /auth/validate-token | Validate JWT (Bearer token) |

### Products

| Method | Endpoint      | Auth        | Description       |
|--------|---------------|------------|-------------------|
| GET    | /products     | Public     | Get all products  |
| GET    | /products/:id | Public     | Get product by ID |
| POST   | /products     | Required   | Create product    |
| PUT    | /products/:id | Required   | Update product    |
| DELETE | /products/:id | **ADMIN only** | Delete product  |

---

## Testing Demo

### 1. Register user

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456","role":"USER"}'
```

### 2. Register ADMIN user

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"123456","role":"ADMIN"}'
```

### 3. Login and get JWT

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

Save the `token` from the response.

### 4. Access product APIs via gateway

**Get all products (public):**

```bash
curl http://localhost:5000/products
```

**Create product (with token):**

```bash
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Laptop","description":"Gaming laptop","price":999}'
```

**Blocked access without token:**

```bash
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Phone","price":599}'
# Returns 401 Unauthorized
```

**Delete product (ADMIN only):**

```bash
# Login as admin, get admin token
curl -X DELETE http://localhost:5000/products/PRODUCT_ID \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

---

## Swagger Documentation

- **Gateway (unified)**: http://localhost:5000/api-docs
- **Auth Service**: http://localhost:5001/api-docs
- **Product Service**: http://localhost:5002/api-docs

---

## Project Structure

```
Microservices/
├── api-gateway/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js      # Env & constants
│   │   │   └── swagger.js    # Swagger spec
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT validation
│   │   ├── routes/
│   │   │   ├── index.js      # Proxy routes
│   │   │   └── docs.js       # Swagger JSDoc
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── Dockerfile
│   └── package.json
├── auth-service/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js      # Env & constants
│   │   │   ├── db.js         # MongoDB connection
│   │   │   └── swagger.js    # Swagger spec
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── auth.js
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── Dockerfile
│   └── package.json
├── product-service/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js      # Env & constants
│   │   │   ├── db.js         # MongoDB connection
│   │   │   └── swagger.js    # Swagger spec
│   │   ├── models/
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   └── products.js
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── Dockerfile
│   └── package.json
├── .env
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (jsonwebtoken)
- **bcrypt** (password hashing)
- **http-proxy-middleware** (gateway)
- **Swagger** (API docs)
- **Docker** + **Docker Compose**

---

## Environment Variables

Copy `.env.example` to `.env` at the project root. All services load from this single file.

| Variable            | Service  | Description                |
|---------------------|----------|----------------------------|
| PORT_AUTH           | Auth     | Auth service port (5001)   |
| MONGO_URI_AUTH      | Auth     | Auth MongoDB URI           |
| PORT_PRODUCT        | Product  | Product service port (5002)|
| MONGO_URI_PRODUCT   | Product  | Product MongoDB URI        |
| PORT_GATEWAY        | Gateway  | Gateway port (5000)        |
| AUTH_SERVICE_URL    | Gateway  | Auth service URL           |
| PRODUCT_SERVICE_URL | Gateway  | Product service URL        |
| JWT_SECRET          | Auth/Gateway | Shared JWT secret      |
| JWT_EXPIRES         | Auth     | Token expiry (e.g. 7d)     |
