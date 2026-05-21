# Deployment Guide

Complete guide to deploying the Mall and Home Utility Services Aggregator to production.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Setup](#database-setup)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Scaling](#scaling)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

## ✅ Pre-Deployment Checklist

Before deploying to production:

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript compilation errors
- [ ] No ESLint warnings
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Performance benchmarks acceptable

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] Deployment documented
- [ ] Known issues documented
- [ ] Change log updated

### Security
- [ ] No hardcoded secrets
- [ ] All sensitive data in environment variables
- [ ] HTTPS configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place

### Performance
- [ ] Production build created
- [ ] Bundle size optimized
- [ ] Database indexes created
- [ ] Caching configured
- [ ] CDN ready

### Infrastructure
- [ ] Database backed up
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Error tracking enabled
- [ ] Backup restoration tested

## 🔧 Environment Setup

### Create Production Environment

1. **Create production branch** (optional but recommended):
```bash
git checkout -b production
git push origin production
```

2. **Create `.env` files**:
```bash
# Frontend .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME="Mall and Home Utility Services"
NEXT_PUBLIC_ENVIRONMENT=production

# Backend .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_very_secure_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Never commit `.env` files** to version control

---

## 🚀 Frontend Deployment

### Option 1: Vercel (Recommended for Next.js)

#### Setup
1. **Connect GitHub repository**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Import repository

2. **Configure environment**:
   - Go to Project Settings → Environment Variables
   - Add production environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://api.yourdomain.com
     NEXT_PUBLIC_ENVIRONMENT=production
     ```

3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

#### Deployment
```bash
# Automatic deployment on push to main
git push origin main

# Manual deployment via Vercel CLI
npx vercel --prod
```

#### Verify Deployment
- Check Vercel dashboard for build status
- Verify production URL is live
- Test key functionality

### Option 2: Docker + Kubernetes

#### Create Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Push
```bash
# Build image
docker build -t registry/mall-services-frontend:latest .

# Push to registry
docker push registry/mall-services-frontend:latest

# Deploy to Kubernetes
kubectl apply -f k8s-frontend.yml
```

#### k8s-frontend.yml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: registry/mall-services-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://api.yourdomain.com"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Option 3: Traditional VPS/Server

#### Setup Node Environment
```bash
# SSH into server
ssh user@your-server.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
npm install -g pm2
```

#### Deploy Application
```bash
# Clone repository
git clone https://github.com/your-repo.git
cd Mall-and-Home-Utility-Services-Aggregator

# Install dependencies
pnpm install

# Create production build
npm run build

# Start with PM2
pm2 start "npm start" --name "mall-services-frontend"
pm2 save
pm2 startup
```

#### Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🗄️ Backend Deployment

### Option 1: Heroku

#### Setup
```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create app
heroku create mall-services-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set CLOUDINARY_CLOUD_NAME=your_name
```

#### Deploy
```bash
# Push to Heroku
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: Docker + Kubernetes

#### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### Build and Deploy
```bash
# Build image
docker build -t registry/mall-services-backend:latest ./backend

# Push to registry
docker push registry/mall-services-backend:latest

# Deploy to Kubernetes
kubectl apply -f k8s-backend.yml
```

### Option 3: VPS/Server Deployment

#### Setup
```bash
# SSH into server
ssh user@your-backend-server.com

# Clone backend only
git clone https://github.com/your-repo.git
cd Mall-and-Home-Utility-Services-Aggregator/backend

# Install dependencies
pnpm install

# Create .env file
nano .env
# Add production environment variables

# Start with PM2
pm2 start server.js --name "mall-services-backend"
pm2 save
pm2 startup
```

#### Setup Nginx for Backend
```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)

1. **Create cluster**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Create cluster
   - Configure backup

2. **Create database user**:
```bash
Username: db_user
Password: strong_password_here
```

3. **Get connection string**:
```
mongodb+srv://db_user:password@cluster0.mongodb.net/dbname?retryWrites=true&w=majority
```

4. **Update .env**:
```
MONGODB_URI=mongodb+srv://db_user:password@cluster0.mongodb.net/dbname
```

### Local MongoDB (Self-hosted)

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Create backup
mongodump --out /backups/mongo/$(date +%Y%m%d)

# Create indexes
mongo < backend/utils/create-indexes.js
```

---

## 🔒 SSL/TLS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check renewal
sudo certbot renew --dry-run
```

### SSL Configuration in Nginx
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Strong SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
# Install PM2 Plus
pm2 install pm2-auto-pull

# Monitor
pm2 monit

# View logs
pm2 logs mall-services-backend

# Memory/CPU threshold
pm2 set pm2-auto-pull exec_mode fork
```

### Server Logs
```bash
# Frontend logs
pm2 logs mall-services-frontend

# Backend logs
pm2 logs mall-services-backend

# System logs
tail -f /var/log/syslog

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Monitoring Tools
- **New Relic**: Application Performance Monitoring
- **DataDog**: Infrastructure & Application Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards

### Error Tracking
- **Sentry**: JavaScript error tracking
- **LogRocket**: Frontend monitoring
- **Rollbar**: Application error monitoring

---

## 📈 Scaling

### Horizontal Scaling

#### Load Balancing with Nginx
```nginx
upstream backend_cluster {
    least_conn;
    server backend1.internal:5000;
    server backend2.internal:5000;
    server backend3.internal:5000;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://backend_cluster;
    }
}
```

#### Kubernetes Autoscaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Upgrade database plan
- Optimize database indexes

### Caching Strategy
- Redis for session caching
- CDN for static assets
- Browser caching headers

---

## 🔄 Rollback Procedures

### Frontend Rollback (Vercel)
1. Go to Vercel dashboard
2. Select deployment to rollback to
3. Click "Promote to Production"

### Backend Rollback (PM2)
```bash
# View deployment history
pm2 show mall-services-backend

# Rollback with git
git revert HEAD
git push origin main

# Restart application
pm2 restart mall-services-backend
```

### Database Rollback
```bash
# MongoDB backup restore
mongorestore --drop --uri mongodb+srv://user:pass@cluster/db /backup/path

# Verify restore
mongo < verify-restore.js
```

---

## 🔧 Troubleshooting

### Frontend Issues

**Blank page or 404 errors**:
```bash
# Check build output
npm run build

# Verify environment variables
cat .env.local

# Check Vercel logs
vercel logs --prod
```

**Slow performance**:
```bash
# Analyze bundle
npm run analyze

# Check Next.js performance metrics
npm run telemetry
```

### Backend Issues

**Cannot connect to database**:
```bash
# Test connection
node -e "require('mongoose').connect(process.env.MONGODB_URI)"

# Check network access in MongoDB Atlas
# Whitelist server IP address
```

**Memory leak**:
```bash
# Analyze heap
pm2 trigger mall-services-backend "pm2:heap-analysis"

# Check process memory
pm2 show mall-services-backend
```

**High CPU usage**:
```bash
# Check running processes
top

# Monitor Node process
node --inspect server.js
# Open chrome://inspect in browser
```

### General Debugging

```bash
# Check services status
systemctl status nginx
systemctl status mongod
pm2 status

# Check ports in use
netstat -tuln | grep LISTEN

# Check DNS resolution
nslookup yourdomain.com

# Test API endpoint
curl -H "Authorization: Bearer token" https://api.yourdomain.com/api/users/profile
```

---

## 📋 Post-Deployment Checklist

After deploying to production:

- [ ] Test all critical user flows
- [ ] Verify payment processing
- [ ] Check email notifications
- [ ] Monitor error tracking
- [ ] Review analytics
- [ ] Test backup and restore
- [ ] Document deployment
- [ ] Notify team members
- [ ] Update monitoring dashboards
- [ ] Schedule post-deployment review

---

## 🆘 Getting Help

- Check application logs
- Review monitoring dashboards
- Consult deployment documentation
- Contact infrastructure team

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: May 22, 2026
