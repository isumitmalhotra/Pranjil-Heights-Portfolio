# Pranijheightsindia - Backend API

Backend API server for Pranijheightsindia PVC Panel B2B Portfolio website.

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken + bcryptjs)
- **Validation:** express-validator
- **Email:** Nodemailer
- **Security:** Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other settings.

3. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database and re-run migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Admin login | Public |
| POST | `/api/auth/logout` | Logout | Public |
| POST | `/api/auth/register` | Register new admin | Super Admin |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password/:token` | Reset password | Public |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | List all products | Public |
| GET | `/api/products/featured` | Get featured products | Public |
| GET | `/api/products/search` | Search products | Public |
| GET | `/api/products/category/:slug` | Products by category | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | List all categories | Public |
| GET | `/api/categories/:slug` | Get category by slug | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Contact Inquiries
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/contact` | Submit contact form | Public |
| GET | `/api/contact` | List all inquiries | Admin |
| GET | `/api/contact/:id` | Get inquiry details | Admin |
| PUT | `/api/contact/:id/status` | Update inquiry status | Admin |
| DELETE | `/api/contact/:id` | Delete inquiry | Admin |

### Quote Requests
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/quotes` | Submit quote request | Public |
| GET | `/api/quotes` | List all quotes | Admin |
| GET | `/api/quotes/:id` | Get quote details | Admin |
| PUT | `/api/quotes/:id/status` | Update quote status | Admin |
| DELETE | `/api/quotes/:id` | Delete quote | Admin |

### Dealer Applications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/dealers/apply` | Submit dealer application | Public |
| GET | `/api/dealers` | List all applications | Admin |
| GET | `/api/dealers/:id` | Get application details | Admin |
| PUT | `/api/dealers/:id/status` | Update application status | Admin |
| DELETE | `/api/dealers/:id` | Delete application | Admin |

### Newsletter
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter | Public |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe | Public |
| GET | `/api/newsletter/subscribers` | List subscribers | Admin |
| GET | `/api/newsletter/stats` | Get newsletter stats | Admin |

### Testimonials
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/testimonials` | Get active testimonials | Public |
| GET | `/api/testimonials/all` | Get all testimonials | Admin |
| POST | `/api/testimonials` | Create testimonial | Admin |
| PUT | `/api/testimonials/:id` | Update testimonial | Admin |
| DELETE | `/api/testimonials/:id` | Delete testimonial | Admin |

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding
├── src/
│   ├── config/
│   │   ├── database.js    # Prisma client
│   │   └── email.js       # Email configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── contact.controller.js
│   │   ├── quote.controller.js
│   │   ├── dealer.controller.js
│   │   ├── newsletter.controller.js
│   │   └── testimonial.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js
│   │   └── validators.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── contact.routes.js
│   │   ├── quote.routes.js
│   │   ├── dealer.routes.js
│   │   ├── newsletter.routes.js
│   │   └── testimonial.routes.js
│   └── server.js          # Express app entry point
├── .env                   # Environment variables
├── .env.example           # Example environment file
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `SMTP_HOST` | Email server host (Titan: smtp.titan.email) | - |
| `SMTP_PORT` | Email server port | 587 |
| `SMTP_USER` | Email username | - |
| `SMTP_PASS` | Email password | - |
| `EMAIL_FROM` | From email address | - |
| `NOTIFICATION_EMAILS` | Comma-separated notification recipients | - |
| `ADMIN_EMAIL` | Fallback notification email if NOTIFICATION_EMAILS is empty | - |

## Default Admin Credentials

After running `npm run db:seed`:

- **Email:** admin@pranijheightsindia.com
- **Password:** admin123

⚠️ **Important:** Change these credentials immediately in production!

## License

ISC © Pranijheightsindia
