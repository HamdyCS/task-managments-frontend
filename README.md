<div align="center">
  <img src="src/assets/logo.png" alt="WorkPilot Logo" width="200" />
  <h1>WorkPilot</h1>
  <p>A premium SaaS task management platform built for productivity, simplicity, and team collaboration.</p>
</div>

---

## Overview

WorkPilot is a modern task management frontend designed with a clean, professional aesthetic inspired by Linear and GitHub. It provides teams with a fast, intuitive interface for managing workspaces, projects, tasks, and team performance — with full dark mode and RTL support.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| State Management | Redux Toolkit + TanStack React Query |
| Routing | React Router v7 |
| HTTP Client | Axios (with token refresh interceptor) |
| Forms | Formik + Yup validation |
| Charts | Chart.js + react-chartjs-2 |
| Animations | Framer Motion |
| Internationalization | i18next + react-i18next (English + Arabic) |
| Icons | React Icons |

## Features

- **Authentication** — Register, login, email verification, password reset, Google OAuth
- **Dashboard** — KPI cards, task distribution charts, recent activity, active tasks table
- **Workspaces** — Multi-workspace support with workspace switching
- **Notifications** — Real-time notification center with read/unread filtering
- **Dark & Light Mode** — Seamless theme switching with system preference detection
- **RTL Support** — Full Arabic language support with proper bidirectional layout
- **Responsive** — Adaptive layout for desktop, tablet, and mobile
- **Token Refresh** — Automatic JWT refresh with request queue handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see `BackendReadme.md` for API reference)

### Installation

```bash
git clone <repository-url>
cd task-managments-frontend
npm install
```

### Environment Setup

Create a `.env.development` file in the project root:

```
VITE_BASE_API_URL = "https://localhost:7018/api"
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/                  # Axios instances and interceptors
├── assets/               # Static images and logo
├── common/               # Shared utilities
├── components/
│   ├── auth/             # Auth-related components
│   ├── common/           # Reusable common components
│   ├── Dashboard/        # Dashboard layout, sidebar, navbar, sections
│   ├── ui/               # Reusable UI primitives
│   └── website/          # Marketing/landing page sections
│       ├── features/
│       ├── footers/
│       ├── home/
│       ├── layout/
│       ├── navbars/
│       ├── notFound/
│       ├── product/
│       └── solutions/
├── config.ts             # API endpoint configuration
├── dtos/                 # TypeScript DTO interfaces
├── hooks/                # Custom React hooks
│   ├── auth/
│   ├── language/
│   ├── notification/
│   └── workspace/
├── i18n/                 # Internationalization setup + locale files
│   └── locales/          # en/ and ar/ JSON translations
├── layouts/              # Route-level layouts (AuthLayout)
├── pages/                # Route-level components
│   ├── auth/             # Login, Register, Verify, Forgot Password
│   ├── dashboard/        # Dashboard, Notifications
│   └── *.tsx             # Home, Product, Features, Solutions, NotFound
├── providers/            # Context providers (Auth, Language, Theme)
├── routes/               # Route config objects
│   ├── dashboard/
│   └── website/
├── services/             # API service functions
├── store/                # Redux store (auth, theme slices)
├── types/                # Shared TypeScript types
├── utils/                # Utility functions
├── App.tsx               # Root component with route config
├── index.css             # Tailwind v4 theme + custom utilities
└── main.tsx              # App entry point
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Design System

The UI follows a **Corporate / Modern** design language defined in `stitch_task_management/design.md`. Key principles:

- Clean surfaces with soft borders and subtle shadows
- **Inter** font for English, **Cairo** for Arabic
- Consistent 8px spacing grid
- Functional color palette with indigo primary and green secondary
- Tonal layering for depth hierarchy (no glassmorphism)

All designed screens are available in `stitch_task_management/` as reference for implementation.

## Backend Reference

The `BackendReadme.md` file in the project root documents all available API endpoints, DTOs, authentication flow, pagination, roles, and SignalR hub details. Refer to it when working on API integration.

## License

See [LICENSE](LICENSE) for details.
