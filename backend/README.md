# alfatihah Backend

Express.js + TypeScript backend template with production-ready JWT authentication, Prisma ORM, and Redis token management. Optimized for reliability and developer efficiency.

## Tech Stack

| Category   | Library                          |
| ---------- | -------------------------------- |
| Framework  | Express.js 5                     |
| Language   | TypeScript                       |
| ORM        | Prisma 7 (PostgreSQL)            |
| Auth       | JWT + bcryptjs                   |
| Validation | Zod                              |
| Cache      | Redis (ioredis)                  |
| Email      | Nodemailer                       |
| Upload     | Multer                           |
| Security   | Helmet, CORS, express-rate-limit |
| Testing    | Jest + ts-jest                   |
| Dev        | ts-node-dev                      |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit: DATABASE_URL, REDIS_URL, JWT_SECRET, REFRESH_TOKEN_SECRET, SMTP_*

# 3. Generate Prisma client & run migrations
npm run prisma:generate
npm run prisma:migrate

# 4. Start development server (auto-restart enabled)
npm run dev

# 5. Run tests
npm test
```

## Project Structure (Standardized)

This project follows a strict layered architecture pattern. AI Agents should strictly follow this structure:

```
src/
├── config/                  # Global environmental & service configs
│   ├── index.ts             # Env vars validation
│   ├── prisma.ts            # PrismaClient singleton
│   ├── redis.ts             # Redis (ioredis) instance
│   └── mailer.ts            # Nodemailer transport
├── middleware/              # Global Express middlewares
│   ├── auth.middleware.ts    # JWT & Blacklist verification
│   └── rate-limiter.ts      # Endpoint protection
├── features/                # Domain-driven feature modules
│   └── [feature_name]/      # e.g., auth, user, project
│       ├── controllers/     # HTTP layer: parse request, call service
│       ├── service/         # Business logic layer: logic & validation
│       ├── repositories/    # Data layer: direct Prisma queries
│       ├── routers/         # Express router & feature middlewares
│       ├── validation/      # Zod DTOs/Schemas
│       └── utils/           # Feature-specific helpers (e.g., token gen)
├── router/
│   └── index.ts             # Main router aggregator
├── utils/                   # Shared utility functions
│   └── apiResponse.ts       # Unified success/error response helpers
├── __tests__/               # Global test suites
└── index.ts                 # Application entry point
```

## AI Agent & Development Conventions (MCP)

Strictly adhere to these conventions. Any violations will break consistency.

### 1. Naming Conventions

- **Files**: `feature.layer.ts` (e.g., `auth.controller.ts`, `auth.service.ts`).
- **Folders**: Lowercase (e.g., `controllers`, `service`).
- **Classes**: PascalCase (e.g., `class AuthService`).
- **Methods/Functions**: camelCase (e.g., `async function login()`).

### 2. Architectural Rules

- **Flow**: `Router` -> `Controller` -> `Service` -> `Repository`.
- **Controllers**: NEVER handle business logic. Only validate params/body (using validation layer) and call services.
- **Service**: Dedicated to business logic. Should return data (not Response objects).
- **Repository**: Only handle raw database operations (Prisma). Use singular repository per major entity.

### 3. API Response Format

All API responses MUST use the `apiResponse.ts` helpers:

- **Success**: `{ "success": true, "message": "...", "data": { ... } }`
- **Error**: `{ "success": false, "message": "...", "errors": [ ... ] }`

### 4. Validation

Every input (params, query, body) MUST have a corresponding Zod schema in the `validation/` subfolder.

## Scripts

| Script                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `npm run dev`            | Start dev server with **ts-node-dev**     |
| `npm run build`          | Compile TypeScript to production `dist/`  |
| `npm start`              | Run compiled build from `dist/`           |
| `npm run prisma:migrate` | Run migrations and generate prisma client |
