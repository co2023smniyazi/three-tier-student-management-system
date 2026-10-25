# CampusConnect • Three-Tier Student Management System

[![CI Test & Build](https://img.shields.io/badge/CI-Passing-brightgreen?logo=github-actions)](https://github.com/co2023smniyazi/three-tier-student-management-system/actions)
[![Architecture](https://img.shields.io/badge/Architecture-3--Tier%20%2B%20MCP-blue)](https://github.com/co2023smniyazi/three-tier-student-management-system)
[![Budget](https://img.shields.io/badge/Budget-%E2%82%B90%20%2F%20%240%20(Free%20Tier)-success)](https://github.com/co2023smniyazi/three-tier-student-management-system)
[![Tests](https://img.shields.io/badge/Tests-25%20Passing-success)](https://github.com/co2023smniyazi/three-tier-student-management-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, production-grade **Three-Tier Student Information System** integrated with an official **Model Context Protocol (MCP)** server for AI-assisted operations (Claude Desktop / Antigravity). Designed with a **₹0 / $0 budget** using verified cloud free-tiers without sacrificing security, performance, or accessibility.

---

## Live Deployments & Endpoints

| Component | Host | Environment | URL |
| :--- | :--- | :--- | :--- |
| **Frontend SPA** | Vercel | Production | [campusconnect-student-management.vercel.app](https://campusconnect-student-management.vercel.app) |
| **Backend REST API** | Render | Production | [three-tier-student-management-system.onrender.com](https://three-tier-student-management-system.onrender.com) |
| **API Health Check** | Render | Production | [/api/health](https://three-tier-student-management-system.onrender.com/api/health) |
| **Database** | MongoDB Atlas | Cloud (M0) | `cluster0.se4dgkz.mongodb.net` (DB: `studentDB`) |
| **Source Code** | GitHub | Main | [co2023smniyazi/three-tier-student-management-system](https://github.com/co2023smniyazi/three-tier-student-management-system) |

---

## Architecture Overview

```mermaid
flowchart TD
    User["User / Web Browser"] -->|HTTPS (Edge Network)| Client["Tier 1: Client (React 18 + Vite)\nHosted on Vercel"]
    Claude["Claude Desktop (AI Agent)"] -->|Local stdio transport| MCPServer["AI Layer: MCP Server\n(@modelcontextprotocol/sdk)"]
    
    Client -->|REST API over HTTPS| Backend["Tier 2: Server (Node.js + Express)\nHosted on Render"]
    MCPServer -->|REST API over HTTPS| Backend
    
    Backend -->|MongoDB Wire Protocol (TLS)| Database[("Tier 3: Database (MongoDB Atlas M0)\nReplica Set • DB: studentDB")]
```

### Tier Breakdown
1. **Tier 1 (Presentation):** React 18 single-page application bundled with Vite. Built with a responsive CSS design system (dark & light themes), dynamic analytics cards, debounced search, sortable tables, mobile card views, and 1-click RFC 4180 CSV export.
2. **Tier 2 (Application Logic):** Node.js 20 & Express REST API hardened with `helmet` security headers, `express-rate-limit` (120 req/min per IP), CORS allowlisting, and switchable authentication (`AUTH_ENABLED`).
3. **Tier 3 (Data Persistence):** Managed MongoDB Atlas M0 cluster running MongoDB 7.0+ with Mongoose ODM, unique indexing, and schema validations.
4. **AI Layer (MCP Server):** Implements Anthropic's Model Context Protocol to provide 5 structured tools (`list_students`, `get_student`, `create_student`, `update_student`, `delete_student`) with strict Zod runtime verification.

---

## Key Features & Highlights

- **🌓 Dark & Light Mode:** System-aware theme toggle persisting to `localStorage` with smooth zero-jank transitions.
- **⚡ Render Cold-Start Detector:** Free-tier Render instances spin down after 15 minutes of inactivity. When a request takes longer than 3.5s, the client renders a friendly status notification explaining the spin-up.
- **📊 Real-time Dashboard:** Displays Total Students, Active Departments, Average Semester, and an SVG horizontal bar chart for department distribution.
- **🔍 Fast Search & Filter:** Instant search debounced at 300ms, filterable by Department and Semester, sortable by Name, ID, or Date.
- **📁 1-Click CSV Export:** Generates client-side formatted CSV spreadsheets with proper escaping and automatic download trigger.
- **🛡️ Secure Write Operations:** Delete confirmation dialog prevents accidental data loss; backend supports switchable token authentication (`AUTH_ENABLED`).
- **🤖 Bidirectional AI Sync:** Natural language edits executed in Claude Desktop immediately reflect in the web interface in real time.

---

## Free-Tier Operational Profiles & Limits

This application was engineered specifically to run continuously on official, 100% free-tier cloud infrastructure:

| Provider | Service Tier | Free Quota | Official Documentation |
| :--- | :--- | :--- | :--- |
| **Render** | Web Service (Free) | 512 MB RAM, spins down after 15m inactivity, 750 free instance hrs/mo | [Render Free Tier Docs](https://render.com/docs/free#free-web-services) |
| **MongoDB Atlas** | M0 Shared Cluster | 512 MB storage, shared RAM, automatic backups, zero expiration | [Atlas Free Tier Docs](https://www.mongodb.com/docs/atlas/reference/free-shared-clusters/) |
| **Vercel** | Hobby (Free) | 100 GB bandwidth / mo, global edge network, automated SSL | [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby) |

---

## REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service health, version, uptime, memory, and database state | No |
| `GET` | `/api/students/stats` | Aggregated dashboard metrics (totals, dept/semester counts) | No |
| `GET` | `/api/students` | List all students (supports `?search=`, `?page=`, `?limit=`) | No |
| `GET` | `/api/students/:id` | Get student by MongoDB `_id` or `studentId` | No |
| `POST` | `/api/students` | Register a new student record | Optional (`AUTH_ENABLED`) |
| `PUT` | `/api/students/:id` | Update student information | Optional (`AUTH_ENABLED`) |
| `DELETE` | `/api/students/:id` | Delete student record | Optional (`AUTH_ENABLED`) |

---

## Claude Desktop & MCP Server Setup

The MCP server allows Claude Desktop to manage student records through natural conversation.

### 1. Claude Desktop Configuration
Open your Claude Desktop configuration file:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the `student-management` entry:
```json
{
  "mcpServers": {
    "student-management": {
      "command": "node",
      "args": [
        "D:\\New folder\\cc project 1\\mcp-server\\index.js"
      ],
      "env": {
        "API_BASE_URL": "https://three-tier-student-management-system.onrender.com/api"
      }
    }
  }
}
```
*(Replace the args path with your machine's absolute path to `mcp-server/index.js`)*.

### 2. Available MCP Tools
- `list_students(search?)`: List all enrolled students matching query.
- `get_student(id)`: Retrieve record by ID or studentId.
- `create_student({ studentId, name, email, department, semester, contact })`: Add student with schema validation.
- `update_student({ id, ...fields })`: Modify student details.
- `delete_student({ id })`: Permanently remove student.

---

## Local Development & Setup

### 1. Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- MongoDB connection string (Atlas or local)

### 2. Quickstart
```bash
# Clone the repository
git clone https://github.com/co2023smniyazi/three-tier-student-management-system.git
cd three-tier-student-management-system

# Install all sub-project dependencies
npm run setup

# Configure environment files
cp server/.env.example server/.env
cp client/.env.example client/.env
cp mcp-server/.env.example mcp-server/.env
```

### 3. Start Development Services
```bash
# Start backend server (port 5000)
npm run start:server

# Start frontend development server (port 5173)
npm run start:client

# Start MCP server (stdio transport)
npm run start:mcp
```

---

## Automated Test Suite

Run the complete 25-case automated test suite (native `node:test` runner):

```bash
# Run server and MCP automated tests
npm test

# Run MCP server tests only
npm run test:mcp

# Build the client production bundle (Vite)
npm run build:client
```

All 25 test cases execute in ~5 seconds with 0 live database requirements.

---

## Environment Variables Reference

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Server | Express listening port | `5000` |
| `NODE_ENV` | Server | Node environment mode | `development` / `production` |
| `MONGODB_URI` | Server | MongoDB Atlas connection string | `mongodb+srv://.../studentDB` |
| `FRONTEND_URL` | Server | CORS allowlist origins (comma-separated) | `http://localhost:5173` |
| `AUTH_ENABLED` | Server | Enforce Bearer token on write endpoints | `false` |
| `MCP_API_TOKEN` | Server & MCP | Secret token for MCP write authorization | `your-secret-token` |
| `VITE_API_BASE_URL` | Client | Backend API base URL | `/api` |
| `API_BASE_URL` | MCP Server | Backend API URL for MCP client | `https://three-tier-student-management-system.onrender.com/api` |

---

## Repository Documentation

- [docs/INSPECTION.md](docs/INSPECTION.md): Initial code inspection, security audit, and baseline verification findings.
- [docs/AUTH_DESIGN.md](docs/AUTH_DESIGN.md): Switchable authentication and authorization architecture design.
- [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md): 3-minute presentation walkthrough script.
- [docs/REPORT_DRAFT.md](docs/REPORT_DRAFT.md): Complete engineering report and architecture assessment.

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
