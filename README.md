# Flowbit Multi-Tenant Support System 🧩

A Dockerized multi-tenant ticketing platform with n8n workflow integration, tenant-aware authentication, and isolated data for organizations.

---

## 🌟 Features
- 🔐 JWT-based authentication with RBAC (admin/user)
- 🧵 Tenant-isolated ticket creation in MongoDB
- 🪝 n8n workflow for ticket creation and status updates
- 📦 Containerized setup with Docker Compose
- 🧩 Dynamic micro-frontends via Webpack Module Federation
- 📢 Real-time ticket updates via WebSocket
- ⚙️ Admin audit log view
- 📋 Tenant-specific navigation

---

## 🛠 Tech Stack
- **Frontend**: React, Webpack Module Federation (react-shell, support-tickets-app)
- **Backend**: Node.js, Express.js, MongoDB, JWT, Socket.IO
- **Automation**: n8n, ngrok
- **Testing**: Jest (tenant isolation)
- **Containerization**: Docker, Docker Compose

---

## 📁 Project Structure
```
flowbit-multi-tenant/
├── backend/
│   ├── routes/ (auth.route.js, ticket.route.js, user.route.js)
│   ├── controllers/ (authController.js, ticketController.js)
│   ├── cypress/e2e/smoke.cy.js
│   ├── middlewares/authMiddleware.js
│   ├── models/ (user.model.js, ticket.model.js, auditLog.model.js)
│   ├── tests/ (isolation.test.js)
│   ├── (seed.js)
│   ├── registry.json
│   └── index.js
├── react-shell/ (host, port 4001)
│   ├── src/ (App.jsx, App.css, Sidebar.jsx, Login.jsx, Register.jsx, AuditLogs.jsx, RemoteWrapper.jsx)
│   └── webpack.config.js
├── support-tickets-app/ (remote, port 3100)
│   ├── src/ (App.jsx, App.css, SupportTicketsApp.jsx, TicketsList.jsx)
│   └── webpack.config.js
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone & Setup
```bash
git clone https://github.com/Bharat940/flowbit-multi-tenant.git
cd flowbit-multi-tenant
```

### 2️⃣ Environment Variables
Create a .env file in the root directory:
```bash
JWT_SECRET=your_jwt_secret
WEBHOOK_SECRET=your_webhook_secret
NGROK_AUTHTOKEN=your_ngrok_authtoken
```

### 3️⃣ Run Application
```bash
docker-compose up --build
```
---

Access services:
- **React Shell**: http://localhost:4001
- **API**: http://localhost:3000
- **Support Tickets App**: http://localhost:3100
- **n8n**: http://localhost:5678

### 4️⃣ Test Users
- admin@logisticsco.com / password123 (LogisticsCo, admin)
- admin@retailgmbh.com / password123 (RetailGmbH, admin)

### 5️⃣ Test Workflow
1. Login at http://localhost:4001.
2. Navigate to /tickets, create a ticket.
3. Check n8n (http://localhost:5678) for workflow execution.
4. Verify ticket status updates to "closed" in UI (WebSocket).
5. Check audit logs at /admin/audit-logs (admin only).

---

## 📊 Architecture Diagram

![Architecture Diagram](./workflow%20diagram/Screenshot%202025-07-17%20203246.png)

- **React Shell**: Fetches /api/v1/me/screens, renders sidebar, loads support-tickets-app.
- **API**: Handles auth, tickets, audit logs with tenant isolation.
- **SupportTicketsApp**: Ticket UI, WebSocket updates.
- **n8n**: Triggers workflow on ticket creation, calls back to API. **The n8n workflow screenshots are in the repo so you can access it and replicate it yourself.**

---

## 🐞 Known Limitations
- Static registry.json: Tenant screen registry is hardcoded; dynamic fetch/update support not implemented.
- Port conflicts: Be aware of conflicting local services using ports 3000, 3100, 4001, 5678, or 4040
- Basic UI for demonstration purposes"
- JWT stored in localStorage; secure cookie storage can be implemented

---

## 📋 Seed Users
- admin@logisticsco.com (LogisticsCo, admin)
- admin@retailgmbh.com (RetailGmbH, admin)
Password: password123
