# REGs Global - Backend API

Node.js Express backend API for the REGs Global Shariah-Compliant Crypto Exchange.

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts                # Application entry point
│   ├── config/
│   │   └── database.ts         # MongoDB connection
│   │
│   ├── models/                 # Mongoose models
│   │   ├── User.model.ts       # User schema
│   │   ├── Asset.model.ts      # Asset schema
│   │   ├── Transaction.model.ts # Transaction schema
│   │   └── Project.model.ts    # Project schema
│   │
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── trader.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── shariah.controller.ts
│   │   ├── support.controller.ts
│   │   └── project.controller.ts
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.routes.ts
│   │   ├── trader.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── shariah.routes.ts
│   │   ├── support.routes.ts
│   │   └── project.routes.ts
│   │
│   └── middleware/             # Middleware
│       ├── auth.ts             # JWT authentication
│       └── errorHandler.ts     # Error handling
│
├── dist/                       # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB 6.0 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
```

### Environment Variables

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/regs-global

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Health Check

```
GET /health
Response: { status: 'ok', message: 'Server is running' }
```

### Authentication Routes

#### Register User
```
POST /api/auth/register
Body: {
  email: string,
  password: string,
  name: string,
  role?: 'trader' | 'admin' | 'shariah_board' | 'support' | 'project'
}
Response: {
  user: User,
  token: string
}
```

#### Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  user: User,
  token: string
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user: User }
```

### Trader Routes (Protected, Role: trader)

#### Get Portfolio
```
GET /api/trader/portfolio
Headers: Authorization: Bearer <token>
Response: { portfolio: Object }
```

#### Get Transaction History
```
GET /api/trader/transactions
Headers: Authorization: Bearer <token>
Response: { transactions: Transaction[] }
```

#### Create Order
```
POST /api/trader/order
Headers: Authorization: Bearer <token>
Body: {
  type: 'buy' | 'sell',
  asset: string,
  amount: number,
  price: number
}
Response: { transaction: Transaction }
```

#### Calculate Zakat
```
GET /api/trader/zakat
Headers: Authorization: Bearer <token>
Response: {
  totalWealth: number,
  zakatAmount: number,
  nisabThreshold: number,
  isZakatDue: boolean
}
```

#### Get Staking Pools
```
GET /api/trader/staking/pools
Headers: Authorization: Bearer <token>
Response: { pools: Pool[] }
```

#### Stake Assets
```
POST /api/trader/staking/stake
Headers: Authorization: Bearer <token>
Body: {
  asset: string,
  amount: number,
  poolId: string
}
Response: { transaction: Transaction }
```

### Admin Routes (Protected, Role: admin)

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <token>
Response: { users: User[], total: number }
```

#### Update User Status
```
PATCH /api/admin/users/:id/status
Headers: Authorization: Bearer <token>
Body: {
  kycStatus?: 'pending' | 'approved' | 'rejected',
  isVerified?: boolean
}
Response: { user: User, message: string }
```

#### Get All Assets
```
GET /api/admin/assets
Headers: Authorization: Bearer <token>
Response: { assets: Asset[], total: number }
```

#### Create Asset
```
POST /api/admin/assets
Headers: Authorization: Bearer <token>
Body: {
  symbol: string,
  name: string,
  type: 'crypto' | 'commodity' | 'token',
  ...
}
Response: { asset: Asset, message: string }
```

#### Update Asset
```
PATCH /api/admin/assets/:id
Headers: Authorization: Bearer <token>
Body: { ...asset fields }
Response: { asset: Asset, message: string }
```

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Headers: Authorization: Bearer <token>
Response: {
  stats: {
    totalUsers: number,
    totalAssets: number,
    totalTransactions: number,
    pendingKYC: number,
    totalVolume: number
  }
}
```

### Shariah Board Routes (Protected, Role: shariah_board)

#### Get Pending Assets
```
GET /api/shariah/assets/pending
Headers: Authorization: Bearer <token>
Response: {
  assets: Asset[],
  projects: Project[]
}
```

#### Review Asset
```
PATCH /api/shariah/assets/:id/review
Headers: Authorization: Bearer <token>
Body: {
  complianceStatus: 'approved' | 'rejected' | 'under_review',
  complianceNotes: string
}
Response: { asset: Asset, message: string }
```

#### Issue Fatwa
```
POST /api/shariah/assets/:id/fatwa
Headers: Authorization: Bearer <token>
Body: { fatwa: string }
Response: { asset: Asset, message: string }
```

#### Get Compliance Reports
```
GET /api/shariah/reports
Headers: Authorization: Bearer <token>
Response: {
  assets: {
    approved: number,
    rejected: number,
    pending: number
  },
  projects: {
    approved: number,
    rejected: number,
    pending: number
  }
}
```

### Support Routes (Protected, Role: support)

#### Get Tickets
```
GET /api/support/tickets
Headers: Authorization: Bearer <token>
Response: { tickets: Ticket[] }
```

#### Respond to Ticket
```
POST /api/support/tickets/:id/respond
Headers: Authorization: Bearer <token>
Body: { message: string }
Response: { success: boolean, message: string }
```

#### Get Forum Posts
```
GET /api/support/forum
Headers: Authorization: Bearer <token>
Response: { posts: Post[] }
```

#### Create Announcement
```
POST /api/support/announcements
Headers: Authorization: Bearer <token>
Body: {
  title: string,
  content: string,
  type: string
}
Response: { announcement: Announcement, message: string }
```

### Project Routes (Protected, Role: project)

#### Get My Projects
```
GET /api/projects/my-projects
Headers: Authorization: Bearer <token>
Response: { projects: Project[] }
```

#### Create Project
```
POST /api/projects
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  symbol: string,
  description: string,
  businessModel: string,
  ...
}
Response: { project: Project, message: string }
```

#### Update Project
```
PATCH /api/projects/:id
Headers: Authorization: Bearer <token>
Body: { ...project fields }
Response: { project: Project, message: string }
```

#### Submit Project for Review
```
POST /api/projects/:id/submit
Headers: Authorization: Bearer <token>
Response: { project: Project, message: string }
```

## 🔐 Authentication & Authorization

### JWT Authentication

The API uses JWT for authentication:

1. User registers or logs in
2. Server generates JWT token with user ID
3. Client includes token in Authorization header: `Bearer <token>`
4. Server validates token on protected routes

### Middleware

#### `protect` Middleware
Validates JWT token and adds user to request object.

```typescript
import { protect } from '../middleware/auth';
router.get('/protected', protect, handler);
```

#### `authorize` Middleware
Checks if user has required role(s).

```typescript
import { protect, authorize } from '../middleware/auth';
router.get('/admin-only', protect, authorize('admin'), handler);
```

## 🗄️ Database Models

### User Model
```typescript
{
  email: string (unique),
  password: string (hashed),
  name: string,
  role: 'trader' | 'admin' | 'shariah_board' | 'support' | 'project',
  isVerified: boolean,
  kycStatus: 'pending' | 'approved' | 'rejected',
  kycDocuments: string[],
  phone?: string,
  country?: string,
  avatar?: string,
  twoFactorEnabled: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Asset Model
```typescript
{
  symbol: string (unique, uppercase),
  name: string,
  type: 'crypto' | 'commodity' | 'token',
  complianceStatus: 'pending' | 'approved' | 'rejected' | 'under_review',
  shariahApprovedBy?: ObjectId,
  shariahApprovedAt?: Date,
  fatwa?: string,
  complianceNotes?: string,
  marketCap?: number,
  price?: number,
  volume24h?: number,
  isActive: boolean,
  icon?: string,
  description?: string,
  website?: string,
  whitepaper?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```typescript
{
  userId: ObjectId (ref: User),
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'stake' | 'unstake' | 'zakat' | 'sadaqah',
  asset: string,
  amount: number,
  price?: number,
  totalValue: number,
  fee: number,
  status: 'pending' | 'completed' | 'failed' | 'cancelled',
  txHash?: string,
  fromAddress?: string,
  toAddress?: string,
  network?: string,
  notes?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```typescript
{
  name: string,
  symbol: string (uppercase),
  description: string,
  ownerId: ObjectId (ref: User),
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'launched',
  website?: string,
  whitepaper?: string,
  businessModel: string,
  tokenomics?: any,
  roadmap?: any,
  team?: any[],
  submittedDocuments: string[],
  shariahReviewNotes?: string,
  reviewedBy?: ObjectId,
  reviewedAt?: Date,
  launchDate?: Date,
  targetRaise?: number,
  currentRaise: number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Helmet for HTTP security headers
- ✅ Input validation
- ⚠️ Add rate limiting in production
- ⚠️ Add request size limits
- ⚠️ Implement HTTPS
- ⚠️ Regular dependency updates

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build TypeScript
npm run build

# Output in dist/ directory

# Start production server
npm start
```

## 🚀 Deployment

### Environment Setup

```bash
# Set NODE_ENV to production
NODE_ENV=production

# Use strong JWT secret
JWT_SECRET=<generate-strong-secret>

# Use MongoDB Atlas or production MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Configure CORS for production domain
CORS_ORIGIN=https://your-domain.com
```

### Deployment Platforms

- **Heroku**: Use Procfile
- **Railway**: Auto-detect and deploy
- **Render**: Auto-deploy from Git
- **DigitalOcean App Platform**
- **AWS EC2 / Elastic Beanstalk**
- **Google Cloud Platform**

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

### JWT Secret Warning
Always use a strong, random secret in production:
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

For frontend documentation, see `../frontend/README.md`

