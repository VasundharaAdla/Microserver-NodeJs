/**
 * API Gateway - Unified Swagger Documentation
 * Integrates Auth Service & Product Service APIs
 * All requests are routed through this gateway.
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User registration, login, and token validation
 *   - name: Products
 *     description: Product CRUD operations
 *   - name: Health
 *     description: Service health check
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter JWT from /auth/login. Click Authorize, paste token (no "Bearer " prefix).
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *     AuthResponse:
 *       type: object
 *       required: [message, user, token]
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT for Authorization header
 *     RegisterRequest:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           format: password
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           default: USER
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     ValidateTokenResponse:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *         user:
 *           type: object
 *           properties:
 *             userId: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *             role: { type: string }
 *         expiresAt:
 *           type: string
 *           format: date-time
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         createdBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProductRequest:
 *       type: object
 *       required: [name, price]
 *       properties:
 *         name:
 *           type: string
 *           example: Gaming Laptop
 *         description:
 *           type: string
 *           example: High-performance laptop
 *         price:
 *           type: number
 *           example: 999.99
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         description: { type: string }
 *         price: { type: number }
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status: { type: string }
 *         gateway: { type: string }
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     description: Creates a new user account. Returns JWT token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or email already exists
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     description: Authenticates user and returns JWT. Use the token in Authorize for protected endpoints.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid email or password
 */
/**
 * @swagger
 * /auth/validate-token:
 *   get:
 *     tags: [Auth]
 *     summary: Validate JWT token
 *     description: Validates token from Authorize. Click Authorize, paste JWT, then Execute. No parameters needed.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateTokenResponse'
 *       401:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     description: Returns list of all products (public, no auth required)
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     tags: [Products]
 *     summary: Create product
 *     description: Creates a new product. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - token required
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     description: Returns single product (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     tags: [Products]
 *     summary: Update product
 *     description: Updates a product. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     description: Deletes a product. **ADMIN role required.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Returns gateway status
 *     responses:
 *       200:
 *         description: Gateway is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
