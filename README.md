# Tawfir Web Application - Frontend

This is the repository containing all the frontend code of the Tawfir Restaurant and Admin Portals

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Routing:** React Router DOM v6
- **UI Components:** Radix UI (via Shadcn UI)
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form with Zod validation
- **State Management:** React Query (TanStack Query)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Notifications:** Sonner

## Installation
Follow these steps to run the application locally on your machine.

### 1. Install Dependencies
```sh
npm i
```

### 2 Start Development Servers
```sh
npm run dev
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following:

**Development (.env):**
```env
# Backend API Configuration
VITE_API_URL=http://localhost:8080

# Environment
VITE_APP_ENV=development
```

**Production (.env):**
```env
# Backend API Configuration
VITE_API_URL=https://your-production-api-url.com

# Environment
VITE_APP_ENV=production
```

### 4. Access the application

- **Admin Panel:** http://localhost:3000/admin/login
- **Restaurant Panel:** http://localhost:3000/login

**Login Credentials:**
Admin portal (/admin/login)
- Email: admin@example.com
- Password: password

Restaurant portal (/login)
- Email: restaurant@example.com
- Password: password

## Environment Configuration

The frontend uses environment variables prefixed with `VITE_` to configure the API endpoint. These are read at build time by Vite.

- **Development:** Points to `http://localhost:8080` (local backend)
- **Production:** Points to your production backend URL

The API configuration is centralized in `src/config/api.ts` which you can import and use throughout the application:

```typescript
import { getApiEndpoint, API_CONFIG } from '@/config/api';

// Get full API URL for an endpoint
const loginUrl = getApiEndpoint('/auth/login');
// Returns: http://localhost:8080/api/auth/login

// Or use the base config
const baseUrl = API_CONFIG.BASE_URL;
```

## Notes

- The frontend runs on port **3000** (development)
- The backend should run on port **8080** (development)
- Make sure both servers are running when developing
- The application is configured to run on HTTP in local environment (not HTTPS)
- Assets are automatically compiled by Vite in watch mode