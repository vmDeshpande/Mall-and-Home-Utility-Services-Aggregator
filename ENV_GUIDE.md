# Environment Variables Guide

Complete reference for configuring environment variables for the Mall and Home Utility Services Aggregator.

## 📋 Table of Contents

- [Overview](#overview)
- [Frontend Environment Variables](#frontend-environment-variables)
- [Backend Environment Variables](#backend-environment-variables)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Security Best Practices](#security-best-practices)

## 🔍 Overview

Environment variables are used to configure different aspects of the application across development, staging, and production environments.

### File Locations

**Frontend**: `.env.local` (Next.js)  
**Backend**: `backend/.env` (Node.js)

### Never commit `.env` files to version control!

Instead:
1. Create `.env.example` or `.env.local.example`
2. Document all required variables
3. Share `.env` examples with team privately
4. Use `.gitignore` to prevent commits:
   ```
   .env
   .env.local
   .env.*.local
   ```

---

## 🖥️ Frontend Environment Variables

### Development Environment

Create `.env.local` in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_TIMEOUT=30000

# Application
NEXT_PUBLIC_APP_NAME=Mall and Home Utility Services
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=development

# Debug
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug

# Feature Flags
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false

# Cloudinary (Optional - for image upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Production Environment

Set in deployment platform (Vercel, Netlify, etc.):

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Application
NEXT_PUBLIC_APP_NAME=Mall and Home Utility Services
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Debug
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_LOG_LEVEL=error

# Feature Flags
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_prod_cloud_name

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_prod_analytics_id
```

### Frontend Variables Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:5000` | Backend API base URL |
| `NEXT_PUBLIC_API_TIMEOUT` | ❌ | `30000` | API request timeout in ms |
| `NEXT_PUBLIC_APP_NAME` | ❌ | `Mall Services` | Application name |
| `NEXT_PUBLIC_APP_VERSION` | ❌ | `1.0.0` | App version |
| `NEXT_PUBLIC_ENVIRONMENT` | ❌ | `development` | Environment: development, staging, production |
| `NEXT_PUBLIC_DEBUG` | ❌ | `true` | Enable debug mode |
| `NEXT_PUBLIC_LOG_LEVEL` | ❌ | `debug` | Log level: debug, info, warn, error |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | ❌ | `true` | Enable payment features |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | ❌ | `true` | Enable analytics tracking |
| `NEXT_PUBLIC_ENABLE_BETA_FEATURES` | ❌ | `false` | Enable beta/experimental features |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ❌ | `my-cloud` | Cloudinary cloud name for images |
| `NEXT_PUBLIC_ANALYTICS_ID` | ❌ | `UA-123456-1` | Google Analytics ID |

### Frontend Usage Example

```typescript
// Access in components
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';

// API client configuration
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
});
```

---

## 🔧 Backend Environment Variables

### Development Environment

Create `backend/.env`:

```bash
# Node Configuration
NODE_ENV=development
PORT=5000
DEBUG=true
LOG_LEVEL=debug

# Database
MONGODB_URI=mongodb://localhost:27017/mall-services-dev
MONGODB_DB_NAME=mall-services-dev

# Authentication
JWT_SECRET=your-super-secret-dev-key-change-in-production
JWT_EXPIRY=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-dev

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# File Upload - Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway (Mock - Development)
PAYMENT_MODE=mock
PAYMENT_SUCCESS_RATE=0.9

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Session
SESSION_SECRET=your-session-secret-dev
SESSION_EXPIRY=24h

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# AWS S3 (Optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name

# Sentry Error Tracking (Optional)
SENTRY_DSN=your_sentry_dsn_here
```

### Production Environment

Set in hosting platform (Heroku, EC2, Docker, etc.):

```bash
# Node Configuration
NODE_ENV=production
PORT=5000
DEBUG=false
LOG_LEVEL=warn

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
MONGODB_DB_NAME=mall-services-prod

# Authentication
JWT_SECRET=your-production-jwt-secret-very-long-random-string
JWT_EXPIRY=24h
REFRESH_TOKEN_SECRET=your-production-refresh-token-secret

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
CORS_CREDENTIALS=true

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASSWORD=your-production-app-password
SMTP_FROM=noreply@yourdomain.com

# File Upload - Cloudinary
CLOUDINARY_CLOUD_NAME=your_prod_cloud_name
CLOUDINARY_API_KEY=your_prod_api_key
CLOUDINARY_API_SECRET=your_prod_api_secret

# Payment Gateway
PAYMENT_MODE=live
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_key

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=very_secure_password_here

# Session
SESSION_SECRET=your-session-secret-production-long-string
SESSION_EXPIRY=24h

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_prod_access_key
AWS_SECRET_ACCESS_KEY=your_prod_secret_key
AWS_S3_BUCKET=your-prod-bucket-name

# Sentry Error Tracking
SENTRY_DSN=your_production_sentry_dsn

# Redis (Production Caching)
REDIS_URL=redis://:password@redis-host:6379/0

# SSL/TLS
SSL_CERT_PATH=/etc/ssl/certs/yourdomain.com.crt
SSL_KEY_PATH=/etc/ssl/private/yourdomain.com.key
```

### Backend Variables Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ✅ | `production` | Environment: development, staging, production |
| `PORT` | ✅ | `5000` | Server port |
| `DEBUG` | ❌ | `false` | Debug mode |
| `LOG_LEVEL` | ❌ | `warn` | Logging level |
| `MONGODB_URI` | ✅ | `mongodb://...` | MongoDB connection string |
| `MONGODB_DB_NAME` | ✅ | `mall-services` | Database name |
| `JWT_SECRET` | ✅ | `secret123...` | JWT signing secret |
| `JWT_EXPIRY` | ❌ | `24h` | Token expiry time |
| `REFRESH_TOKEN_SECRET` | ✅ | `refresh123...` | Refresh token secret |
| `CORS_ORIGIN` | ✅ | `http://localhost:3000` | Allowed CORS origins |
| `CORS_CREDENTIALS` | ❌ | `true` | Allow credentials in CORS |
| `SMTP_HOST` | ❌ | `smtp.gmail.com` | Email server host |
| `SMTP_PORT` | ❌ | `587` | Email server port |
| `SMTP_USER` | ❌ | `email@gmail.com` | Email account |
| `SMTP_PASSWORD` | ❌ | `password` | Email password |
| `SMTP_FROM` | ❌ | `noreply@domain.com` | From email address |
| `CLOUDINARY_CLOUD_NAME` | ❌ | `my-cloud` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ❌ | `key123...` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ❌ | `secret123...` | Cloudinary API secret |
| `PAYMENT_MODE` | ✅ | `mock` | Payment mode: mock, stripe, paypal |
| `STRIPE_SECRET_KEY` | ❌ | `sk_live_...` | Stripe secret key |
| `STRIPE_PUBLIC_KEY` | ❌ | `pk_live_...` | Stripe public key |
| `ADMIN_EMAIL` | ✅ | `admin@example.com` | Admin account email |
| `ADMIN_PASSWORD` | ✅ | `password123` | Admin password |
| `SESSION_SECRET` | ✅ | `secret123...` | Session signing secret |
| `SESSION_EXPIRY` | ❌ | `24h` | Session expiry time |
| `RATE_LIMIT_WINDOW` | ❌ | `15` | Rate limit window (minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | `100` | Max requests per window |
| `AWS_REGION` | ❌ | `us-east-1` | AWS region |
| `AWS_ACCESS_KEY_ID` | ❌ | `key123...` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | ❌ | `secret123...` | AWS secret key |
| `AWS_S3_BUCKET` | ❌ | `my-bucket` | S3 bucket name |
| `SENTRY_DSN` | ❌ | `https://...` | Sentry error tracking DSN |
| `REDIS_URL` | ❌ | `redis://...` | Redis connection URL |

### Backend Usage Example

```javascript
// Access in Node.js
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const isDev = process.env.NODE_ENV === 'development';

// Validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

// MongoDB connection
mongoose.connect(mongoUri, {
  dbName: process.env.MONGODB_DB_NAME,
});
```

---

## 🛠️ Development Setup

### Step 1: Create Environment Files

**Frontend**:
```bash
cd root
cp ENV_GUIDE.md .env.local.example
nano .env.local
```

Paste development variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
```

**Backend**:
```bash
cd backend
cp .env.example .env
nano .env
```

Paste development variables:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mall-services-dev
JWT_SECRET=dev-secret-key-change-in-production
```

### Step 2: Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd root
npm run dev

# Access at http://localhost:3000
```

### Step 3: Verify Configuration

```bash
# Test API connection
curl http://localhost:5000/api/health

# Check frontend environment
curl http://localhost:3000/_next/dev/static/chunks/main.js | grep NEXT_PUBLIC_API_URL
```

---

## 🚀 Production Setup

### Step 1: Generate Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Set Deployment Variables

**Vercel (Frontend)**:
```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_ENVIRONMENT
```

**Heroku (Backend)**:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_generated_secret
heroku config:set MONGODB_URI=mongodb+srv://...
```

**Docker**:
```bash
docker run -e NODE_ENV=production \
           -e JWT_SECRET=your_secret \
           -e MONGODB_URI=mongodb://... \
           your-image:latest
```

### Step 3: Verify Production

```bash
# Check production API
curl https://api.yourdomain.com/api/health

# Verify frontend connection
curl https://yourdomain.com | grep api.yourdomain.com
```

---

## 🔐 Security Best Practices

### Secret Management

1. **Never commit secrets**:
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Use strong, random secrets**:
   ```bash
   # Generate 32-byte random secret
   openssl rand -hex 32
   ```

3. **Rotate secrets regularly**:
   - Change JWT_SECRET every 6 months
   - Rotate database passwords
   - Update API keys

4. **Use secrets management tools**:
   - AWS Secrets Manager
   - HashiCorp Vault
   - 1Password
   - Doppler

### Environment Variable Security

1. **Separate sensitive and non-sensitive**:
   - Prefix non-sensitive with `NEXT_PUBLIC_` (frontend)
   - Keep sensitive variables backend-only

2. **Never log secrets**:
   ```javascript
   // Good
   console.log('Connected to database');
   
   // Bad
   console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
   ```

3. **Validate required variables**:
   ```javascript
   const requiredEnvs = ['JWT_SECRET', 'MONGODB_URI', 'CORS_ORIGIN'];
   requiredEnvs.forEach(env => {
     if (!process.env[env]) {
       throw new Error(`Missing required environment variable: ${env}`);
     }
   });
   ```

4. **Use HTTPS in production**:
   - All API communications encrypted
   - Never send secrets over HTTP

### Access Control

- Limit who can access production secrets
- Use environment-specific access controls
- Audit secret access logs
- Implement principle of least privilege

---

## 🆘 Troubleshooting

### Missing Environment Variables

**Error**: `TypeError: Cannot read property of undefined`

**Solution**:
1. Check `.env` file exists
2. Verify variable names (case-sensitive)
3. Restart application after changing `.env`

### API Connection Failed

**Error**: `ECONNREFUSED` or `CORS error`

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Ensure backend is running
3. Check `CORS_ORIGIN` in backend `.env`

### Database Connection Error

**Error**: `MongoNetworkError` or `ENOENT`

**Solution**:
1. Verify `MONGODB_URI` format
2. Check MongoDB is running (local dev)
3. Verify IP whitelist (MongoDB Atlas)
4. Test connection: `mongo <URI>`

### Secret Rotation Issues

**Solution**:
1. Update in `.env` files
2. Restart applications
3. Clear browser cache
4. Verify new secret works

---

## 📝 Template Files

### .env.local.example (Frontend)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
```

### .env.example (Backend)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mall-services-dev
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

---

**Environment Guide Version**: 1.0.0  
**Last Updated**: May 22, 2026
