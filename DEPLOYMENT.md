# Deployment Guide

## Overview
This guide covers deploying the Ameen e-commerce website with Next.js frontend and Express.js backend.

## Prerequisites
- Node.js 20+
- MongoDB or PostgreSQL database
- Vercel account (for frontend)
- AWS account (for backend) or alternative hosting

## Environment Variables

### Frontend (.env)
```bash
# Application
NEXT_PUBLIC_BRAND_NAME=Ameen Store
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Contact
NEXT_PUBLIC_CONTACT_EMAIL=hello@your-domain.com
NEXT_PUBLIC_CONTACT_PHONE=+1 (555) 000-0000
NEXT_PUBLIC_SUPPORT_HOURS=Mon-Fri, 9am-5pm EST
```

### Backend (.env)
```bash
# Database
DATABASE_URL=mongodb://localhost:27017/ameen_store

# Authentication
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES_IN=7d

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Deployment Steps

### 1. Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or use GitHub integration:
# 1. Push code to GitHub
# 2. Import project in Vercel dashboard
# 3. Set environment variables
# 4. Deploy
```

### 2. Backend (AWS EC2)

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/your-repo/ameen-website.git
cd ameen-website/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env  # Edit with your values

# Build backend
npm run build:backend

# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start dist/server.js --name ameen-backend
pm2 save
pm2 startup
```

### 3. Database Setup

#### MongoDB Atlas (Recommended)
1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Set up database user
4. Whitelist IP addresses
5. Get connection string
6. Add to DATABASE_URL

#### Local MongoDB
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 4. CI/CD (GitHub Actions)

The `.github/workflows/ci-cd.yml` file is already configured. To enable:

1. Add secrets in GitHub repository settings:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

2. Push to main branch to trigger deployment

## SSL/HTTPS Setup

### Frontend (Vercel)
Vercel automatically provides SSL certificates.

### Backend (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d api.your-domain.com

# Set up auto-renewal
sudo certbot renew --dry-run
```

## Monitoring & Logs

### Frontend
Monitor in Vercel dashboard:
- Real-time logs
- Performance metrics
- Error tracking

### Backend
```bash
# View PM2 logs
pm2 logs ameen-backend

# Monitor processes
pm2 monit

# View error logs
pm2 logs ameen-backend --err
```

## Scaling

### Frontend
Vercel automatically scales based on traffic.

### Backend
1. Use load balancer (AWS ALB)
2. Add multiple EC2 instances
3. Consider AWS Lambda for serverless scaling

## Backup

### Database
```bash
# MongoDB backup
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://..." /backup/20240101
```

### Code
- Use Git for version control
- Regular commits and tags
- Automated backups via CI/CD

## Troubleshooting

### Frontend won't build
- Check Node.js version (20+)
- Clear .next cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Backend connection errors
- Verify DATABASE_URL is correct
- Check firewall rules
- Ensure MongoDB is running
- Verify JWT_SECRET is set

### Payment integration issues
- Confirm API keys are correct
- Check Stripe/PayPal webhook URLs
- Verify callback URLs match domain

## Performance Optimization

1. Enable caching headers
2. Use CDN for static assets
3. Implement Redis for session management
4. Add database indexes
5. Enable compression
6. Optimize images

## Security Checklist

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ JWT tokens expire
- ✅ Input validation on all forms
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Secure headers (helmet.js)

## Support

For deployment issues:
- Check logs first
- Review error messages
- Consult documentation
- Contact support team
