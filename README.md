<div align="center">

<!-- BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=E-Bazaar&fontSize=80&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Multi-Tenant%20E-Commerce%20Platform&descAlignY=60&descSize=22" width="100%"/>

<!-- BADGES ROW 1 -->
<p>
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/React.js-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-PostgreSQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
</p>

<!-- BADGES ROW 2 -->
<p>
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-8E75B2?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/Razorpay-Stripe-0D2137?style=for-the-badge&logo=stripe&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel_%2B_Render-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-Secured-FF6B35?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
</p>

<!-- LIVE LINKS -->
<p>
  <a href="https://e-bazaar-pi.vercel.app/">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Frontend-success?style=for-the-badge"/>
  </a>
  &nbsp;
  <a href="https://e-bazaar-2.onrender.com/swagger-ui/index.html">
    <img src="https://img.shields.io/badge/📘 API Docs-Swagger UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/>
  </a>
  &nbsp;
  <a href="https://e-bazaar-2.onrender.com/actuator/health">
    <img src="https://img.shields.io/badge/💓 Health-Actuator-FF4B4B?style=for-the-badge"/>
  </a>
</p>

<br/>

> **E-Bazaar** is a production-grade, multi-tenant e-commerce ecosystem — built to handle real sellers, real orders, and real scale. From AI-powered recommendations to dual payment gateways, every feature is engineered for a live product experience.

<br/>

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📘 API Documentation](#-api-documentation)
- [📊 Monitoring & Health](#-monitoring--health)
- [🚀 Deployment](#-deployment)
- [🔮 Future Roadmap](#-future-roadmap)
- [🤝 Contributing](#-contributing)
- [👤 Author](#-author)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏪 Multi-Tenant Architecture
- Multiple independent sellers on one platform
- Isolated product & order management per seller
- Role-based dashboards: **Admin / Seller / Customer**
- Scalable backend designed for growth

### 🤖 AI-Powered Personalization
- **Gemini API** integration for smart features
- Personalized product recommendations
- Intelligent AI chatbot for customer support
- Context-aware search & discovery

### 🔐 Secure Authentication
- **JWT-based** stateless authentication
- Role-based access control (RBAC)
- Secure session management
- Protected API endpoints with Spring Security

</td>
<td width="50%">

### 🚚 Advanced Logistics System
- Warehouse & distributor management
- Real-time order tracking dashboard
- Custom delivery network configuration
- Multi-stage order lifecycle management

### 💳 Dual Payment Gateway
- **Razorpay** — Indian payment ecosystem
- **Stripe** — Global card payments
- Secure checkout flow
- Payment status webhooks

### 📊 Admin Control Center
- Full platform oversight dashboard
- User, product & order management
- Real-time monitoring via **Spring Actuator**
- Media management via **Cloudinary**

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Customer UI  │  │  Seller UI   │  │      Admin UI        │  │
│  │  React + TS   │  │  React + TS  │  │     React + TS       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                       │
          └─────────────────┴───────────────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │     REST API Layer      │
                        │   Spring Boot 3 + JWT   │
                        │   Spring Security       │
                        │   Swagger / OpenAPI     │
                        └───────────┬────────────┘
                                    │
          ┌─────────────────────────┼──────────────────────────┐
          │                         │                          │
┌─────────▼──────┐       ┌──────────▼──────┐       ┌──────────▼──────┐
│   Database     │       │  External APIs  │       │   Media / Email │
│  MySQL /       │       │  Gemini AI      │       │  Cloudinary     │
│  PostgreSQL    │       │  Razorpay       │       │  SendGrid       │
│  Spring JPA    │       │  Stripe         │       │                 │
└────────────────┘       └─────────────────┘       └─────────────────┘
```

**Design Principles:**
- **RESTful APIs** — Clean, resource-based endpoint design
- **Stateless JWT** — Scalable, server-independent auth
- **Multi-tenant isolation** — Data scoped per seller
- **Cloud-native** — Render (backend) + Vercel (frontend)

---

## 🛠️ Tech Stack

<table>
<thead>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Frontend</b></td>
<td>React.js 18 + TypeScript</td>
<td>UI framework with type safety</td>
</tr>
<tr>
<td></td>
<td>Redux Toolkit</td>
<td>Global state management</td>
</tr>
<tr>
<td></td>
<td>Vite</td>
<td>Lightning-fast build tooling</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Spring Boot 3</td>
<td>Core REST API framework</td>
</tr>
<tr>
<td></td>
<td>Spring Security + JWT</td>
<td>Authentication & authorization</td>
</tr>
<tr>
<td></td>
<td>Spring Data JPA</td>
<td>ORM & database abstraction</td>
</tr>
<tr>
<td></td>
<td>Spring Boot Actuator</td>
<td>Production monitoring & health</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>MySQL / PostgreSQL</td>
<td>Relational data storage</td>
</tr>
<tr>
<td><b>AI</b></td>
<td>Google Gemini API</td>
<td>Recommendations & chatbot</td>
</tr>
<tr>
<td><b>Payments</b></td>
<td>Razorpay + Stripe</td>
<td>Dual payment gateway</td>
</tr>
<tr>
<td><b>Media</b></td>
<td>Cloudinary</td>
<td>Image upload & CDN delivery</td>
</tr>
<tr>
<td><b>Email</b></td>
<td>SendGrid</td>
<td>Transactional email service</td>
</tr>
<tr>
<td><b>Docs</b></td>
<td>Swagger / OpenAPI</td>
<td>Interactive API documentation</td>
</tr>
<tr>
<td><b>Deploy</b></td>
<td>Vercel + Render</td>
<td>Cloud hosting (frontend + backend)</td>
</tr>
</tbody>
</table>

---

## 📂 Project Structure

```
E-Bazaar/
│
├── 📄 README.md
├── 📐 BuyBaazar.drawio          # Architecture diagram
│
├── 🧩 backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── docker/
│   └── src/
│       ├── main/
│       │   ├── java/com/ebazaar/
│       │   │   ├── controller/       # REST controllers
│       │   │   ├── service/          # Business logic
│       │   │   ├── repository/       # JPA repositories
│       │   │   ├── model/            # Entity classes
│       │   │   ├── dto/              # Data Transfer Objects
│       │   │   ├── security/         # JWT + Spring Security
│       │   │   └── config/           # App configuration
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       └── application-prod.yml
│       └── test/
│
└── 🎨 frontend/
    ├── index.html
    ├── vite.config.js
    ├── vercel.json
    └── src/
        ├── admin/                    # Admin dashboard
        ├── customer/                 # Customer-facing pages
        ├── seller/                   # Seller dashboard
        ├── component/                # Shared components
        ├── State/                    # Redux slices & store
        │   ├── Store.ts
        │   ├── Auth/AuthSlice.ts
        │   ├── Admin/
        │   ├── Customer/
        │   └── Seller/
        ├── types/                    # TypeScript interfaces
        │   ├── auth.ts, cart.ts
        │   ├── order.ts, product.ts
        │   └── user.ts, seller.ts
        ├── config/Api.js             # Axios base config
        ├── data/                     # Static data (categories, brands)
        ├── Util/formatCurrency.js
        └── Theme/customeTheme.js
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
Java 17+         # Backend runtime
Node.js 18+      # Frontend runtime
MySQL/PostgreSQL  # Database
Maven 3.8+       # Build tool
```

### 1. Clone the Repository

```bash
git clone https://github.com/SahilAgroha/E-Bazaar.git
cd E-Bazaar
```

### 2. Backend Setup

```bash
cd backend

# Configure your database in src/main/resources/application-dev.yml
# (see Environment Variables section below)

mvn clean install
mvn spring-boot:run
```

> Backend runs at: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 🔐 Environment Variables

Create your config in `backend/src/main/resources/application-dev.yml` or use a `.env` approach:

```env
# ── DATABASE ──────────────────────────────────
DB_URL=jdbc:mysql://localhost:3306/ebazaar
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# ── SECURITY ──────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# ── PAYMENTS ──────────────────────────────────
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
STRIPE_KEY=sk_test_xxxxxxxxxxxx

# ── AI ────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── MEDIA & EMAIL ─────────────────────────────
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

> ⚠️ **Never commit real secrets.** Add `.env` and `application-prod.yml` to your `.gitignore`.

---

## 📘 API Documentation

Interactive API docs powered by **Swagger / OpenAPI 3.0**

| Resource | URL |
|----------|-----|
| 🖥️ Swagger UI | [/swagger-ui/index.html](https://e-bazaar-2.onrender.com/swagger-ui/index.html) |
| 📄 OpenAPI JSON | [/v3/api-docs](https://e-bazaar-2.onrender.com/v3/api-docs) |

**Features:**
- ✅ Test all endpoints directly in the browser
- ✅ View complete request / response schemas
- ✅ JWT Bearer token authorization built-in
- ✅ Grouped by module: Auth, Products, Orders, Sellers, Admin

---

## 📊 Monitoring & Health

Production monitoring via **Spring Boot Actuator**

| Endpoint | URL | Description |
|----------|-----|-------------|
| 💓 Health | [/actuator/health](https://e-bazaar-2.onrender.com/actuator/health) | App health status |
| 📈 All Metrics | [/actuator](https://e-bazaar-2.onrender.com/actuator) | All available endpoints |

**Exposed Metrics:**
- JVM memory & heap usage
- Active database connections
- HTTP request statistics
- Application startup details
- Environment & configuration info

---

## 🚀 Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| 🎨 Frontend | **Vercel** | [e-bazaar-pi.vercel.app](https://e-bazaar-pi.vercel.app/) |
| ⚙️ Backend | **Render** | [e-bazaar-2.onrender.com](https://e-bazaar-2.onrender.com/) |
| 🗄️ Database | **Cloud** (Supabase / PlanetScale) | — |

### Deploy Your Own

**Frontend → Vercel**
```bash
# Push to GitHub, then connect repo on vercel.com
# Vercel auto-detects Vite — zero config needed
```

**Backend → Render**
```bash
# Connect GitHub repo on render.com
# Build command: mvn clean install -DskipTests
# Start command: java -jar target/ebazaar-*.jar
```

---

## 🔮 Future Roadmap

```
v2.0 — Performance & Scale
 ├── ⚡ Redis caching layer (session + product cache)
 ├── 📨 Kafka event streaming (order events, notifications)
 └── 🏗️ Microservices architecture migration

v2.1 — Observability
 ├── 📊 Prometheus + Grafana monitoring dashboards
 └── 🪵 ELK Stack logging (Elasticsearch + Logstash + Kibana)

v3.0 — Advanced Features
 ├── 🌍 Multi-language & multi-currency support
 ├── 📱 React Native mobile app
 └── 🤖 Advanced AI: visual search & dynamic pricing
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

**Commit Convention:** This project follows [Conventional Commits](https://www.conventionalcommits.org/)

```
feat:     New feature
fix:      Bug fix
docs:     Documentation update
style:    Code formatting
refactor: Code restructure
test:     Adding tests
chore:    Build/config changes
```

---

## 👤 Author

<div align="center">

### Sahil

<p>
  <a href="https://github.com/SahilAgroha">
    <img src="https://img.shields.io/badge/GitHub-sahilagroha-181717?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
  &nbsp;
  <a href="https://linkedin.com/in/sahilagroha">
    <img src="https://img.shields.io/badge/LinkedIn-sahilagroha-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
  &nbsp;
  <a href="https://sahilagroha.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-sahilagroha.vercel.app-FF3E6C?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
</p>

<p>
  <a href="https://leetcode.com/sahilagroha">
    <img src="https://img.shields.io/badge/LeetCode-sahilagroha-FFA116?style=for-the-badge&logo=leetcode&logoColor=black"/>
  </a>
  &nbsp;
  <a href="https://www.codechef.com/users/sahilagroha">
    <img src="https://img.shields.io/badge/CodeChef-sahilagroha-5B4638?style=for-the-badge&logo=codechef&logoColor=white"/>
  </a>
  &nbsp;
  <a href="https://codeforces.com/profile/sahilagroha">
    <img src="https://img.shields.io/badge/Codeforces-sahilagroha-1F8ACB?style=for-the-badge&logo=codeforces&logoColor=white"/>
  </a>
</p>

*BTech Information Technology · Full-Stack Developer · Indore, India*

</div>

---

## ⭐ Support

If E-Bazaar helped you or you find it impressive, please consider:

<div align="center">

**[⭐ Star this repository](https://github.com/SahilAgroha/E-Bazaar)** — it means a lot and helps others discover the project!

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%"/>

</div>