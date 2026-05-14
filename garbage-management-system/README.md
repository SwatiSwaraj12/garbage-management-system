# ♻️ Garbage Management System

A full-stack web application for managing garbage collection requests.
Built with **React** (Frontend) + **Spring Boot** (Backend) + **MySQL** (Database).

---

## 📁 Project Structure

```
garbage-management-system/
├── backend/                         ← Spring Boot (Java)
│   ├── pom.xml                      ← Maven dependencies
│   └── src/main/java/com/garbage/
│       ├── GarbageManagementApplication.java  ← Entry point
│       ├── config/
│       │   ├── DataSeeder.java      ← Seeds default data on startup
│       │   ├── JwtUtil.java         ← JWT token generation & validation
│       │   ├── JwtAuthFilter.java   ← Validates JWT on every request
│       │   └── SecurityConfig.java  ← Spring Security + CORS config
│       ├── controller/
│       │   ├── AuthController.java          ← /api/auth/register, /login
│       │   ├── GarbageRequestController.java ← /api/requests/**
│       │   ├── UserController.java          ← /api/admin/users/**
│       │   └── WasteTypeController.java     ← /api/waste-types/**
│       ├── model/
│       │   ├── User.java            ← users table entity
│       │   ├── WasteType.java       ← waste_types table entity
│       │   └── GarbageRequest.java  ← garbage_requests table entity
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── WasteTypeRepository.java
│       │   └── GarbageRequestRepository.java
│       └── service/
│           ├── AuthService.java
│           ├── UserService.java
│           └── GarbageRequestService.java
│
├── frontend/                        ← React App
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.js                   ← Routes
│       ├── index.js                 ← Entry point
│       ├── index.css                ← Global styles
│       ├── components/
│       │   ├── Sidebar.js + .css    ← Navigation sidebar
│       │   ├── Navbar.js + .css     ← Top bar
│       │   └── StatusBadge.js       ← Colored status badges
│       ├── pages/
│       │   ├── LoginPage.js         ← /login
│       │   ├── RegisterPage.js      ← /register
│       │   ├── UserDashboard.js     ← /dashboard
│       │   ├── RequestForm.js       ← /request/new
│       │   ├── TrackingPage.js      ← /track
│       │   ├── AdminDashboard.js    ← /admin
│       │   ├── AdminRequestsPage.js ← /admin/requests
│       │   └── AdminUsersPage.js    ← /admin/users
│       └── services/
│           ├── api.js               ← Axios instance with JWT header
│           ├── authService.js       ← login, register, logout helpers
│           └── requestService.js    ← All API calls for requests/users
│
└── database/
    └── schema.sql                   ← MySQL schema + sample data
```

---

## ✅ Prerequisites

| Tool        | Version  | Download |
|-------------|----------|----------|
| Java JDK    | 17+      | https://adoptium.net |
| Maven       | 3.8+     | https://maven.apache.org |
| Node.js     | 18+      | https://nodejs.org |
| MySQL       | 8.0+     | https://dev.mysql.com/downloads |
| VS Code     | Latest   | https://code.visualstudio.com |

---

## 🗄️ Step 1 — Setup MySQL Database

1. Open MySQL Workbench or MySQL CLI
2. Run the schema file:

```sql
-- In MySQL CLI:
mysql -u root -p < database/schema.sql

-- OR paste contents of database/schema.sql in MySQL Workbench and execute
```

This creates:
- `garbage_db` database
- All tables: `users`, `waste_types`, `garbage_requests`
- Sample data including default admin

---

## ⚙️ Step 2 — Configure Backend

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/garbage_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD    ← Change this!
```

---

## 🚀 Step 3 — Run the Backend

```bash
cd backend

# Build and run (first time takes 2-3 minutes to download dependencies)
mvn spring-boot:run

# You should see:
# ✅ Garbage Management System Backend Started on http://localhost:8080
# ✅ Waste types seeded.
# ✅ Admin user seeded: admin@garbage.com / admin123
```

**Test the backend is running:**
Open browser → http://localhost:8080/api/waste-types  
You should see a JSON array of waste types.

---

## 💻 Step 4 — Run the Frontend

Open a NEW terminal:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start React development server
npm start

# Browser opens automatically at http://localhost:3000
```

---

## 🔑 Default Login Credentials

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | admin@garbage.com     | admin123  |
| User  | rajesh@example.com    | admin123  |
| User  | priya@example.com     | admin123  |

> All sample users share the password `admin123`

---

## 🌐 API Endpoints Reference

### Auth (Public)
| Method | URL                    | Description       |
|--------|------------------------|-------------------|
| POST   | /api/auth/register     | Register new user |
| POST   | /api/auth/login        | Login (get token) |

### Requests (Authenticated)
| Method | URL                           | Role        | Description               |
|--------|-------------------------------|-------------|---------------------------|
| POST   | /api/requests/create          | USER/ADMIN  | Create new request        |
| GET    | /api/requests/user/{userId}   | USER/ADMIN  | Get user's requests       |
| GET    | /api/requests/admin/all       | ADMIN       | Get all requests          |
| PUT    | /api/requests/admin/update/{id}| ADMIN      | Update status & assign    |
| GET    | /api/requests/admin/stats     | ADMIN       | Dashboard statistics      |

### Users (Admin Only)
| Method | URL                            | Description           |
|--------|--------------------------------|-----------------------|
| GET    | /api/admin/users               | Get all users         |
| GET    | /api/admin/users/{id}          | Get single user       |
| PUT    | /api/admin/users/{id}/toggle-status | Activate/Deactivate |

### Waste Types
| Method | URL                    | Role   | Description          |
|--------|------------------------|--------|----------------------|
| GET    | /api/waste-types       | Public | Get active types     |
| GET    | /api/waste-types/all   | ADMIN  | Get all types        |
| POST   | /api/waste-types       | ADMIN  | Add new type         |

---

## 🔧 Common Issues & Fixes

**❌ "Connection refused" on frontend**
→ Make sure backend is running on port 8080

**❌ "Access denied for user 'root'"**  
→ Update password in `application.properties`

**❌ "npm install" fails**  
→ Try `npm install --legacy-peer-deps`

**❌ CORS error in browser console**  
→ Backend CORS is configured for `http://localhost:3000` — ensure frontend runs on that port

**❌ JWT token errors**  
→ Clear `localStorage` in browser (DevTools → Application → Local Storage → Clear All)

---

## 🚀 Future Improvements (Major Project Ideas)

1. **Email Notifications** — Send confirmation emails using Spring Mail + Gmail SMTP
2. **Real-time Updates** — Use WebSockets so status updates appear instantly
3. **Google Maps Integration** — Show pickup locations and collector routes on map
4. **Mobile App** — Build React Native app for field collectors
5. **Payment Integration** — Razorpay/Stripe for paid premium pickup slots
6. **Analytics Dashboard** — Charts with Chart.js (waste by zone, monthly trends)
7. **QR Code Bins** — Citizens scan QR on bins to raise requests instantly
8. **Multi-city Support** — Add city/zone management for large municipalities
9. **Collector App** — Separate login for garbage collectors to see their route
10. **SMS Alerts** — Twilio integration for SMS status updates to citizens
