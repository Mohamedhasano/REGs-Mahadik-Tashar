# 🕌 REGs Global - Shariah-Compliant Crypto Exchange

## 🌟 Overview

**REGs Global** is the world's first Sharia-compliant Real World Assets (RWA) exchange platform, supporting 10,000+ halal digital tokens. Built under the **Sidra Start initiative** on the **Sidra Chain** ecosystem, combining Islamic financial principles with cutting-edge blockchain technology.

> **"خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا"**  
> *"Take from their wealth a charity to purify and sanctify them with it"* - Quran 9:103

---

## ✨ Features

### 🔐 Security & Authentication
- **3-Level KYC Verification** (Personal Info, Document Upload, AI Face Verification)
- **Two-Factor Authentication (2FA)** with TOTP
- **Login Sessions Management** - Track and manage devices
- **Password Management** - Secure password change with validation
- **JWT Authentication** - Secure API access

### 💰 Islamic Finance Tools
- **Zakat Calculator** - Calculate Islamic wealth tax (2.5%)
  - Nisab calculation (Gold/Silver)
  - Multiple asset types support
  - Hawl (lunar year) tracking
  - Calculation history

### 👤 User Management
- **Profile Verification System**
  - Email & Phone verification
  - Social media integration (Twitter, Facebook, Instagram)
  - Security settings
- **VIP System** - Trading volume-based rewards
- **Referral System** - Earn rewards for inviting users

### 💼 Trading & Assets
- **Spot Trading** - Buy/sell halal cryptocurrencies
- **Asset Management** - Track your portfolio
- **Market Analysis** - Real-time price charts
- **Halal Compliance Indicators** - 100% Shariah-compliant

### 🎯 User Roles
1. **Traders/End Users** - Trade, stake, calculate Zakat
2. **Admins** - Manage platform, users, assets
3. **Shariah Board** - Review and approve compliance
4. **Support Team** - Help users, moderate forums
5. **Projects/Startups** - Submit for Launchpad

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State Management:** Zustand
- **UI Library:** Tailwind CSS + Shadcn UI
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **API Client:** Axios
- **Notifications:** Sonner (Toast)

### Backend
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Bcrypt
- **2FA:** Speakeasy (TOTP)
- **File Upload:** Multer
- **Validation:** Express Validator
- **Environment:** dotenv

### DevOps & Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Development Server:** Nodemon (Backend), Vite (Frontend)
- **Code Quality:** ESLint + TypeScript

---

## 📦 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas)
- **Git**

### Clone Repository
```bash
git clone https://github.com/Mohamedhasano/REGs-Mahadik-Tashar.git
cd REGs-Mahadik-Tashar
```

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# MONGODB_URI=mongodb://localhost:27017/regs-global
# JWT_SECRET=your-secret-key
# PORT=5000

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Frontend Setup

```bash
# From root directory
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🗄️ Database Schema

### User Model
```typescript
{
  email: String,
  password: String (hashed),
  name: String,
  role: 'trader' | 'admin' | 'shariah_board' | 'support' | 'project',
  isVerified: Boolean,
  kycLevel: Number (0-3),
  twoFactorEnabled: Boolean,
  vipLevel: 'Regular' | 'VIP1' | 'VIP2' | 'VIP3' | 'VIP4' | 'VIP5',
  referralCode: String,
  socialLinks: { twitter, facebook, instagram, website }
}
```

### Zakat Calculation Model
```typescript
{
  userId: ObjectId,
  assets: [{ type, name, amount, valueUSD }],
  totalWealthUSD: Number,
  nisabValueUSD: Number,
  zakatDueUSD: Number,
  isPaid: Boolean
}
```

### Login Session Model
```typescript
{
  userId: ObjectId,
  deviceName: String,
  browser: String,
  os: String,
  ipAddress: String,
  isActive: Boolean,
  expiresAt: Date
}
```

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/validate-referral/:code - Validate referral code
```

### KYC Verification
```
GET    /api/kyc/status           - Get KYC status
POST   /api/kyc/level1           - Submit Level 1 (Personal Info)
POST   /api/kyc/level2           - Submit Level 2 (Documents)
POST   /api/kyc/level3           - Submit Level 3 (Face Verification)
```

### Zakat Calculator
```
GET    /api/zakat/nisab          - Get Nisab values
POST   /api/zakat/calculate      - Calculate Zakat
GET    /api/zakat/history        - Get calculation history
POST   /api/zakat/mark-paid/:id  - Mark Zakat as paid
```

### Two-Factor Authentication
```
GET    /api/2fa/status           - Get 2FA status
POST   /api/2fa/setup            - Setup 2FA
POST   /api/2fa/enable           - Enable 2FA
POST   /api/2fa/disable          - Disable 2FA
```

### Password Management
```
GET    /api/password/info        - Get password info
POST   /api/password/change      - Change password
```

### Login Sessions
```
GET    /api/sessions             - Get active sessions
DELETE /api/sessions/:id         - Logout from device
POST   /api/sessions/logout-all  - Logout from all devices
```

### Social Links
```
GET    /api/social-links         - Get social links
PUT    /api/social-links         - Update social links
DELETE /api/social-links/:platform - Remove social link
```

### VIP System
```
GET    /api/vip/status           - Get VIP status
POST   /api/vip/add-volume       - Add trading volume
```

---

## 🎨 Screenshots

### Home Page
![Home Page](/public/regs-logo.jpg)

### Zakat Calculator
```
🕌 Zakat Calculator
Calculate your Islamic wealth tax (2.5%)

[Nisab Threshold Display]
[Asset Input Form]
[Calculation Results]
```

### Profile Verification
```
Profile Verification
- Email Verification ✅
- Phone Verification ⏳
- 2FA Security ✅
- Social Media Links 🔗
- Login Sessions 📱
```

---

## 🕌 Islamic Compliance

### Shariah-Compliant Features
- ✅ **No Interest (Riba)** - All transactions interest-free
- ✅ **Halal Tokens Only** - Vetted by Shariah Board
- ✅ **Zakat Calculation** - Built-in Islamic tax calculator
- ✅ **Transparent Fees** - No hidden charges
- ✅ **Ethical Trading** - No gambling or speculation

### Zakat Guidelines
- **Rate:** 2.5% of qualifying wealth
- **Nisab:** 85g gold (~$5,525) or 595g silver (~$505)
- **Hawl:** Must hold wealth for one lunar year
- **Assets:** Cash, gold, silver, crypto, stocks

---

## 📚 Documentation

- **[KYC System](KYC_VERIFICATION_SYSTEM.md)** - Complete KYC guide
- **[Zakat Calculator](ZAKAT_CALCULATOR_SYSTEM.md)** - Zakat system docs
- **[2FA System](2FA_SYSTEM_DOCUMENTATION.md)** - Two-factor authentication
- **[Password System](PASSWORD_SYSTEM_DOCUMENTATION.md)** - Password management
- **[Login Sessions](LOGIN_SESSIONS_SYSTEM.md)** - Session management
- **[Social Links](SOCIAL_MEDIA_LINKS_SYSTEM.md)** - Social media integration
- **[VIP System](VIP_SYSTEM_BACKEND.md)** - VIP rewards program

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm test
```

### Manual Testing
1. Register new user
2. Complete KYC verification
3. Calculate Zakat
4. Enable 2FA
5. Link social media accounts
6. Test trading features

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Deploy with Git
```

### Database (MongoDB Atlas)
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style
- Use TypeScript
- Follow ESLint rules
- Add comments for complex logic
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Mohammed Hassan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Team

- **Developer:** Mohammed Hassan ([@Mohamedhasano](https://github.com/Mohamedhasano))
- **Organization:** GLNs Global
- **Project:** REGs Global
- **Initiative:** Sidra Start
- **Blockchain:** Sidra Chain

---

## 🔗 Links

- **GitHub:** https://github.com/Mohamedhasano/REGs-Mahadik-Tashar
- **Website:** https://regsglobal.com (coming soon)
- **Sidra Chain:** https://sidrachain.com
- **Documentation:** See `/docs` folder

---

## 📞 Contact & Support

- **GitHub Issues:** https://github.com/Mohamedhasano/REGs-Mahadik-Tashar/issues
- **Email:** support@regsglobal.com (coming soon)
- **Twitter:** @REGsGlobal (coming soon)

---

## 🙏 Acknowledgments

- **Sidra Chain** - Blockchain infrastructure
- **GLNs Global** - Development support
- **Islamic Scholars** - Shariah compliance guidance
- **Open Source Community** - Libraries and tools

---

## ⚠️ Disclaimer

This platform is for educational and demonstration purposes. Always consult with certified Islamic scholars regarding Zakat and Shariah compliance. Trading cryptocurrencies involves risk.

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Mohamedhasano/REGs-Mahadik-Tashar&type=Date)](https://star-history.com/#Mohamedhasano/REGs-Mahadik-Tashar&Date)

---

## 📊 Project Stats

- **Lines of Code:** 50,000+
- **Files:** 200+
- **Components:** 80+
- **API Endpoints:** 50+
- **Languages:** TypeScript, JavaScript
- **Database Collections:** 8+

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] User Authentication & KYC
- [x] Zakat Calculator
- [x] 2FA Security
- [x] Login Sessions Management
- [x] Social Media Integration
- [x] VIP System

### Phase 2 (In Progress) 🚧
- [ ] Spot Trading Implementation
- [ ] Wallet Integration
- [ ] Payment Gateway (Fiat/Crypto)
- [ ] Mobile App (React Native)

### Phase 3 (Planned) 📋
- [ ] Staking & Yield Farming
- [ ] Launchpad for Projects
- [ ] P2P Trading
- [ ] Advanced Trading Charts
- [ ] Multi-language Support (Arabic, English, Urdu)

### Phase 4 (Future) 🚀
- [ ] Shariah-compliant DeFi
- [ ] Real World Assets (RWA) Tokenization
- [ ] Islamic Finance Products
- [ ] Global Expansion

---

**Built with ❤️ for the Muslim community**

**🕌 الحمد لله - May Allah accept our efforts**

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** 🚀 Active Development

---

## ⭐ If you find this project useful, please give it a star!

```bash
# Share the project:
https://github.com/Mohamedhasano/REGs-Mahadik-Tashar
```

**جزاكم الله خيراً - May Allah reward you!**
