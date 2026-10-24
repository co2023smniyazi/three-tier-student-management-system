# Three-Tier Student Management System with MCP Server

A clean, responsive, and robust three-tier student management application built with React, Node.js/Express, MongoDB Atlas, and an official Model Context Protocol (MCP) server.

## Architecture

```
User / Browser
      │
      ▼
React Frontend (Vercel)
      │
      │ HTTPS REST API
      ▼
Node.js + Express Backend (Render)
      │
      │ Secure Connection
      ▼
MongoDB Atlas (Database: studentDB, Collection: students)
      ▲
      │
MCP Server (stdio transport for Antigravity / Claude Desktop / Cursor)
Accesses shared backend REST API / database service
```

## Technology Stack

- **Frontend:** React 18, Vite, CSS3
- **Backend:** Node.js, Express.js, Mongoose, CORS, Dotenv
- **Database:** MongoDB Atlas (Cloud Database)
- **MCP Server:** `@modelcontextprotocol/sdk`, Zod
- **Testing:** Node.js native test runner (`node:test`, `node:assert`)
- **Deployments:** Vercel (Frontend), Render (Backend)
- **Repository:** Git + GitHub

## Features

1. **Add Student:** Register students with ID, name, email, department, semester, and contact.
2. **View Students:** View all enrolled students in a clean responsive table.
3. **Search Students:** Search students dynamically by ID, name, or department.
4. **Edit Student:** Update existing student information with pre-filled forms.
5. **Delete Student:** Remove student records with confirmation.
6. **Form Validation & Notifications:** Real-time field validation, error alerts, and success toasts.
7. **MCP AI Integration:** Official Model Context Protocol tools for AI agent assistance.

## Project Structure

```
├── .agents/             # Antigravity agent configuration
│   └── mcp_config.json  # Antigravity local MCP server config
├── client/              # React + Vite frontend
│   ├── public/          # Static assets & _redirects (SPA routing)
│   ├── src/             # React components, styles, and API client
│   ├── index.html       # Vite HTML entry point
│   ├── vite.config.js   # Vite configuration with /api proxy
│   └── package.json
├── server/              # Express REST API backend
│   ├── config/          # MongoDB connection handler
│   ├── models/          # Student Mongoose Schema
│   ├── services/        # Reusable student business logic
│   ├── routes/          # Express REST endpoints
│   ├── tests/           # API and validation test suite
│   ├── server.js        # Main Express server entry point
│   └── package.json
├── mcp-server/          # Model Context Protocol server
│   ├── index.js         # MCP server with stdio transport & 5 tools
│   ├── tests/           # MCP tool discovery & execution test suite
│   └── package.json
├── render.yaml          # Render Blueprint (Infrastructure-as-Code)
├── vercel.json          # Vercel deployment & rewrite configuration
├── package.json         # Workspace root scripts
└── README.md
```

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and MongoDB connection state |
| `GET` | `/api/students` | Get all students (supports `?search=` query) |
| `GET` | `/api/students/:id` | Get student by ID or studentId |
| `POST` | `/api/students` | Create new student |
| `PUT` | `/api/students/:id` | Update existing student |
| `DELETE` | `/api/students/:id` | Delete student |

---

## MCP Server Configuration & Usage

The MCP server connects AI clients to the student management system using the official `@modelcontextprotocol/sdk`.

### MCP Tools Implemented

1. `list_students`: List all students with optional search query.
2. `get_student`: Retrieve student record by ID or studentId.
3. `create_student`: Create new student with validation.
4. `update_student`: Update student details.
5. `delete_student`: Remove student record.

### Antigravity Configuration (Local)

The MCP server is configured in `.agents/mcp_config.json` (workspace) and `~/.gemini/config/mcp_config.json` (global):

```json
{
  "mcpServers": {
    "student-management": {
      "command": "node",
      "args": [
        "d:/New folder/cc project 1/mcp-server/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:5000/api"
      }
    }
  }
}
```

*When the backend is deployed on Render, update `API_BASE_URL` to `https://<your-render-service>.onrender.com/api`.*

### Claude Desktop Configuration

Add this to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "student-management": {
      "command": "node",
      "args": [
        "d:/New folder/cc project 1/mcp-server/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:5000/api"
      }
    }
  }
}
```

### Running and Verifying MCP Server

* **Run standalone test suite:**
  ```bash
  npm run test:mcp
  ```
  Verifies tool discovery (all 5 tools registered), input validation rejection, and representative execution.

* **Start server manually:**
  ```bash
  npm run start:mcp
  ```

### Remote MCP Architecture Note

Deploying MCP code to GitHub makes the code available in version control, but does **not** make the MCP server remotely accessible over the internet by itself. Remote MCP access requires:
1. Hosting the MCP server on a containerized platform supporting persistent connections.
2. Using the **Streamable HTTP** transport (spec 2025-03-26) over HTTPS rather than stdio.
3. Implementing authentication (e.g., Bearer tokens or mTLS) to prevent unauthorized student record modifications.

For local development and pairing with AI assistants (Antigravity, Claude Desktop, Cursor), the **stdio transport** connecting to the deployed Render backend API is the recommended, secure approach.

---

## Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/studentDB?retryWrites=true&w=majority
FRONTEND_URL=https://<your-vercel-domain>.vercel.app
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

### MCP Server (`mcp-server/.env`)
```env
API_BASE_URL=https://<your-render-service>.onrender.com/api
```

---

## Local Setup & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/co2023smniyazi/three-tier-student-management-system.git
   cd three-tier-student-management-system
   ```

2. **Install dependencies:**
   ```bash
   cd server && npm install
   cd ../client && npm install
   cd ../mcp-server && npm install
   cd ..
   ```

3. **Configure local environment variables:**
   - Copy `server/.env.example` to `server/.env` and supply your `MONGODB_URI`.
   - Copy `client/.env.example` to `client/.env`.

4. **Run all tests:**
   ```bash
   npm test
   ```

5. **Start services:**
   - Backend: `npm run start:server`
   - Frontend: `npm run start:client`
   - MCP Server: `npm run start:mcp`

---

## Deployment Instructions

### 1. Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/co2023smniyazi/three-tier-student-management-system`.
3. Render will auto-detect settings from `render.yaml`, or configure manually:
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Health Check Path:** `/api/health`
4. Set Environment Variables:
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>` (e.g. `mongodb+srv://.../studentDB?retryWrites=true&w=majority`)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `*` (or your Vercel URL once deployed)
5. Deploy and copy your Render URL: `https://three-tier-student-management-system.onrender.com`.

### 2. Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) → **Add New...** → **Project**.
2. Select GitHub and import `three-tier-student-management-system`.
3. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client` (or keep repository root with root `vercel.json`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://three-tier-student-management-system.onrender.com/api` (Optional: `vercel.json` rewrites automatically proxy `/api/*` to the Render backend).
5. Click **Deploy**.
6. (Optional) In Render Dashboard, update `FRONTEND_URL` to your Vercel domain (`https://<your-project>.vercel.app`). The backend automatically permits all `*.vercel.app` origins.

---

## Verified Project URLs

- **GitHub Repository:** [https://github.com/co2023smniyazi/three-tier-student-management-system](https://github.com/co2023smniyazi/three-tier-student-management-system)
- **Backend (Render):** [https://three-tier-student-management-system.onrender.com](https://three-tier-student-management-system.onrender.com)
- **Frontend (Vercel):** Deployed via Vercel integration

---

## Troubleshooting

- **Database Disconnected:** Verify your IP address is whitelisted in MongoDB Atlas under Network Access (`0.0.0.0/0` for cloud deployment without expiration).
- **CORS Error:** The backend automatically authorizes `*.vercel.app` origins. If using a custom domain, add it to `FRONTEND_URL` on Render.
- **MCP Connection Refused:** Verify backend server is running and `API_BASE_URL` is reachable.
