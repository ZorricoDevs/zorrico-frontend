# Frontend Development Environment Guide

This guide explains how to set up and use different environments for frontend development.

## Environment Files

- `.env.development` - Local frontend with local backend (localhost:5000)
- `.env.local` - Local frontend with live backend (Render)
- `.env.production` - Production configuration (Vercel + Render)
- `.env.example` - Template file for reference

## Quick Start Commands

### 🏠 Local Development (Frontend + Backend both local)

```bash
# Start backend locally first (from zorrico-backend folder)
npm run dev

# Start frontend with local backend
npm run start:local
```

### 🌐 Hybrid Development (Local Frontend + Live Backend)

```bash
# Frontend connects to live Render backend
npm run start:live
```

### 🚀 Production Simulation

```bash
# Frontend connects to production backend
npm run start:prod
```

### ℹ️ Check Current Environment

```bash
npm run env:info
```

## Environment Variables

| Variable                   | Purpose              | Example                       |
| -------------------------- | -------------------- | ----------------------------- |
| `REACT_APP_API_URL`        | Backend API endpoint | `http://localhost:5000/api`   |
| `REACT_APP_ENV`            | Environment mode     | `development` or `production` |
| `REACT_APP_DEBUG`          | Enable debug mode    | `true` or `false`             |
| `REACT_APP_ENABLE_LOGGING` | Console API logging  | `true` or `false`             |
| `REACT_APP_FRONTEND_URL`   | Frontend URL         | `http://localhost:3000`       |

## Development Workflow

### Testing New Features

1. **Local Testing**: Use `npm run start:local` to test with local backend
2. **Integration Testing**: Use `npm run start:live` to test with live backend
3. **Deploy**: Push changes to trigger Vercel deployment

### Switching Environments

The frontend automatically detects which backend you're using:

- 🟢 **LOCAL backend**: `localhost:5000` - Shows in console
- 🔵 **LIVE backend**: `onrender.com` - Shows in console

### Development Features

When `REACT_APP_DEBUG=true`:

- ✅ API request/response logging
- ✅ Enhanced error messages
- ✅ Development tools enabled

## Console Output

When running in development mode, you'll see:

```
🔧 Environment Configuration: {
  environment: "development",
  apiUrl: "http://localhost:5000/api",
  backendType: "LOCAL",
  debug: true,
  features: { ... }
}

🔧 API Mode: Using LOCAL backend
🌐 API URL: http://localhost:5000/api

🚀 API Request: POST /auth/login
📤 Request Data: { email: "...", password: "..." }
✅ API Response: POST /auth/login
📥 Response Data: { token: "...", user: { ... } }
```

## Troubleshooting

### Backend Connection Issues

1. Check if backend is running: `curl http://localhost:5000/api`
2. Verify environment variables: `npm run env:info`
3. Check console for API logs

### Environment Not Loading

1. Restart the frontend server
2. Clear browser cache
3. Check `.env` file syntax (no spaces around `=`)

### CORS Issues

- Local backend: Ensure CORS allows localhost:3000
- Live backend: Ensure CORS allows your local IP

## Tips

- Use `.env.local` for temporary environment overrides
- Never commit sensitive values in `.env` files
- Use `console.log()` with `REACT_APP_DEBUG=true` for debugging
- Check Network tab in DevTools for API requests
