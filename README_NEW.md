# Ameen E-commerce Dropshipping Website

A professional, full-stack e-commerce dropshipping platform built with Next.js, React, Express.js, and MongoDB.

![E-commerce Platform](https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80)

## 🚀 Features

### Frontend (Next.js 16 + React 19)
- ✅ Modern, responsive design with TailwindCSS
- ✅ Server-side rendering (SSR) for SEO optimization
- ✅ Product catalog with filtering and search
- ✅ Shopping cart with real-time updates
- ✅ Secure checkout flow
- ✅ Blog section for content marketing
- ✅ Support/FAQ pages
- ✅ Enhanced About and Contact pages
- ✅ Newsletter subscription
- ✅ Mobile-responsive navigation

### Backend (Express.js + MongoDB)
- ✅ RESTful API architecture
- ✅ JWT authentication
- ✅ OAuth integration skeleton (Google, Facebook)
- ✅ Product management endpoints
- ✅ Order processing and tracking
- ✅ Inventory management
- ✅ Distributor feed integration (TD SYNNEX InTouch)
- ✅ Payment gateway integration (Stripe, PayPal)
- ✅ User role management (admin, customer)

### Core Functionalities
- ✅ Complete cart system with persistence
- ✅ Secure checkout with multiple payment options
- ✅ Admin dashboard for managing orders and inventory
- ✅ Real-time inventory sync with distributor feeds
- ✅ Product search and filtering
- ✅ SEO-optimized pages with meta tags
- ✅ JSON-LD structured data

### Infrastructure
- ✅ GitHub Actions CI/CD pipeline
- ✅ Vercel deployment ready
- ✅ AWS backend deployment support
- ✅ Comprehensive environment configuration
- ✅ Security best practices (helmet, CORS, input validation)

## 📋 Prerequisites

- Node.js 20+
- MongoDB or PostgreSQL
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yahyashhah/ameen-website.git
cd ameen-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database**
```bash
npm run db:seed
```

## 🚦 Development

### Run Frontend (Next.js)
```bash
npm run dev
```
Frontend will be available at `http://localhost:3000`

### Run Backend (Express.js)
```bash
npm run dev:backend
```
Backend API will be available at `http://localhost:5000`

### Run Both Together
```bash
npm run dev:all
```

## 📁 Project Structure

```
ameen-website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── products/          # Product listing and details
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── admin/             # Admin dashboard
│   ├── blog/              # Blog section
│   ├── support/           # Support/FAQ
│   └── api/               # Next.js API routes
├── backend/               # Express.js backend
│   ├── config/           # Database configuration
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & validation
│   └── utils/            # Helper functions
├── components/           # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterSidebar.tsx
│   ├── Newsletter.tsx
│   ├── StripeCheckout.tsx
│   └── PayPalCheckout.tsx
├── lib/                  # Shared utilities
│   ├── db.ts            # Local database (lowdb)
│   ├── store.ts         # Product store functions
│   ├── cart-local.ts    # Cart management
│   ├── api/             # API client
│   └── seo.ts           # SEO utilities
├── scripts/             # Data pipeline scripts
│   ├── build-shopify-csv.ts
│   ├── build-inventory-csv.ts
│   └── import-distributor.ts
├── .github/workflows/   # CI/CD pipelines
└── data/               # Product data and exports
```

## 🔐 Authentication

The platform supports multiple authentication methods:

### JWT Authentication
- Email/password registration and login
- Secure token-based sessions
- Token expiration and refresh

### OAuth (Ready for Configuration)
- Google OAuth integration
- Facebook OAuth integration
- Add credentials in `.env`

## 💳 Payment Integration

### Stripe
Ready for integration - add your keys:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
```

### PayPal
Ready for integration - add your keys:
```env
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

## 🔄 Distributor Integration

Supports TD SYNNEX InTouch and similar distributor feeds:

1. **Import Products**
```bash
npm run import:distributor
```

2. **Sync Inventory**
```bash
npm run pipeline:inventory
```

3. **Update Product Data**
```bash
npm run pipeline:products
```

## 📦 Deployment

Detailed deployment instructions are available in [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy to Vercel
```bash
vercel --prod
```

### Backend Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for AWS EC2, Lambda, or other hosting options.

## 🛡️ Security

- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- Password hashing with bcryptjs
- JWT token encryption
- SQL injection prevention
- XSS protection

## 📊 Admin Dashboard

Access at `/admin` (requires admin authentication):
- Order management and fulfillment
- Inventory tracking and updates
- Product management
- Customer data
- Analytics (coming soon)

## 🎨 Design Inspiration

Following design principles from:
- NomadGoods
- Logitech
- Anker
- Satechi

Clean, modern, professional aesthetic with focus on:
- Product imagery
- Clear navigation
- Trust signals
- Conversion optimization

## 📈 SEO Optimization

- Server-side rendering (SSR)
- Meta tags on all pages
- Open Graph tags
- Twitter Card support
- JSON-LD structured data
- Sitemap generation
- robots.txt configuration
- Fast loading times
- Mobile optimization

## 🧪 Testing

```bash
# Run linter
npm run lint

# Run tests (when added)
npm test

# Build for production
npm run build
```

## 🔧 Configuration

Key environment variables:

```env
# Application
NEXT_PUBLIC_BRAND_NAME=Your Store Name
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Database
DATABASE_URL=mongodb://localhost:27017/your_db

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Payment
STRIPE_SECRET_KEY=sk_...
PAYPAL_CLIENT_ID=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:handle` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders (admin)
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Payments
- `POST /api/payments/stripe/create-intent` - Create Stripe payment
- `POST /api/payments/paypal/create-order` - Create PayPal order

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support and questions:
- Email: support@your-domain.com
- Documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Issues: GitHub Issues

## 🗺️ Roadmap

- [ ] Customer reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Email marketing automation
- [ ] Multi-currency support
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] AI-powered product recommendations

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Open Icecat for product content
- TD SYNNEX for distributor integration

---

Built with ❤️ for modern e-commerce
