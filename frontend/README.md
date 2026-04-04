# AgroTrack Frontend

Next.js 16 + TypeScript frontend template with production-ready authentication, Zustand state management, and Tailwind CSS 4 + shadcn/ui.

## Tech Stack

| Category  | Library                       |
| --------- | ----------------------------- |
| Framework | Next.js 16 (App Router)       |
| Language  | TypeScript                    |
| Styling   | Tailwind CSS 4                |
| UI Lib    | **shadcn/ui** (Radix + Lucide) |
| Animation | Framer Motion                 |
| State     | Zustand                       |
| Forms     | Formik + Yup                  |
| Auth      | Cookie-based JWT (js-cookie)  |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit: NEXT_PUBLIC_API_URL

# 3. Start development server
npm run dev
```

## Project Structure (Standardized)

This project follows a modular, feature-based architecture. AI Agents should strictly follow this structure:

```
src/
├── app/                          # Routing & Layouts
│   ├── globals.css               # Tailwind 4 & shadcn variables
│   ├── (auth)/                   # Auth layout (No Sidebar/Navbar)
│   └── (main)/                   # App layout (With Sidebar/Navbar)
├── components/                   # Shared UI components
│   ├── ui/                       # Primitive shadcn components (Button, Input, etc.)
│   └── layout/                   # Global layout pieces (Sidebar, Navbar)
├── features/                     # Domain-driven features
│   └── [feature_name]/           # e.g., auth, dashboard
│       ├── components/           # Feature-specific components
│       ├── hooks/                # Custom hooks (e.g., useLogin)
│       ├── service/              # Zustand store (state & logic)
│       ├── repository/           # API fetch calls (via apiFetch)
│       ├── types/                # TS Interfaces
│       └── validations/          # Yup/Zod form schemas
├── lib/                          # External library instances/configs
│   └── utils.ts                  # shadcn (clsx + tailwind-merge)
├── utils/                        # Core utilities
│   └── api.ts                    # apiFetch wrapper (auto-token, auto-refresh)
└── middleware.ts                 # Next.js Middleware (Route protection)
```

## AI Agent & Development Conventions (MCP)

Strictly adhere to these conventions to maintain codebase integrity.

### 1. Naming Conventions
- **Components**: PascalCase (e.g., `LoginForm.tsx`).
- **Hooks**: camelCase with `use` prefix (e.g., `useLogin.ts`).
- **Layers**: `feature.layer.ts` (e.g., `auth.service.ts`, `auth.repository.ts`).
- **Folders**: Lowercase (e.g., `service`, `repository`).

### 2. Architectural Flow
**Always follow this unidirectional data flow:**
`Component` -> `Hook` -> `Service (Zustand)` -> `Repository` -> `apiFetch` -> `Backend API`

### 3. UI & Styling
- **Primitives**: Use components from `src/components/ui`. If missing, add via `npx shadcn@latest add [component]`.
- **Styling**: Use Tailwind CSS 4 utility classes. Avoid inline styles or CSS modules.
- **Animations**: Use `framer-motion` for transitions and micro-interactions.

### 4. Forms & Validation
- **Form Handling**: Use `Formik`.
- **Schema Validation**: Use `Yup`.

## Auth Flow

1. **Login**: `POST /auth/login` → Tokens stored in `js-cookie`.
2. **Persistence**: `middleware.ts` checks cookies for session protection.
3. **Auto-Refresh**: `apiFetch` interceptor handles `401` errors by calling `/auth/refresh` automatically.
4. **Logout**: Clear cookies and redirect to `/login`.

## Scripts

| Script          | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start Next.js dev server       |
| `npm run build` | Production build               |
| `npx shadcn add`| Add new shadcn/ui components   |
