# Temco Customer Portal

React frontend for Temco Bank customer self-service portal. Built with Vite, React, TypeScript, and TailwindCSS.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│     Nginx       │────▶│   SSOService    │
│  (Static Files) │     │  (Reverse Proxy)│     │   (Auth API)    │
└─────────────────┘     └─────────────────┘     ├─────────────────┤
                                                │  FinanceApp API │
                                                │ (Student Lookup)│
                                                └─────────────────┘
```

- **Frontend**: React + TypeScript + TailwindCSS (built as static files)
- **Web Server**: Nginx (serves static files, proxies API calls)
- **Auth**: SSOService on port 8085 (independent SSO provider)
- **APIs**: FinanceApp Node.js API on port 8086 (student lookup)

## Project Structure

```
customer-portal/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # State management (Zustand)
│   │   └── lib/              # Utilities and API clients
│   └── vite.config.ts
├── nginx/
│   └── customer-portal.conf  # Nginx configuration
├── docker-compose.base.yml
├── docker-compose.local.yml
├── docker-compose.prod.yml
├── nginx.conf                # Docker Nginx config
└── Dockerfile
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

   Dev server runs on port **3003**.

### Building for Production

```bash
npm run build
```

This creates a `dist/` folder with static files ready for Nginx deployment.

## Deployment

### Docker (Recommended)

```bash
# Local dev
docker-compose -f docker-compose.base.yml -f docker-compose.local.yml up -d

# Production
docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml up -d
```

Production container runs on port **8092**.

### Manual

1. Build the application:
   ```bash
   cd frontend && npm run build
   ```

2. Copy `dist/` contents to `/var/www/customer-portal/`

3. Copy Nginx config and reload:
   ```bash
   sudo cp nginx/customer-portal.conf /etc/nginx/sites-available/
   sudo ln -sf /etc/nginx/sites-available/customer-portal.conf /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

## API Endpoints

### Authentication (via SSOService)
- `POST /api/v1/customer/auth/login` - Login
- `POST /api/v1/customer/auth/logout` - Logout
- `GET /api/v1/customer/auth/me` - Get current user

### Student Lookup (via FinanceApp API)
- `GET /api/students` - List students
- `GET /api/student-lookup` - Search students

## Pages

- **Dashboard** - Member portal overview
- **Student Lookup** - Search student records
- **Settings** - User settings and preferences
- **Support** - Help and support

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Client-side routing
- **Lucide React** - Icons
- **Zustand** - State management
