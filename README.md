# Three-Tier Student Management System with MCP Server

A clean, responsive, and robust three-tier student management application built with React, Node.js/Express, MongoDB Atlas, and an official Model Context Protocol (MCP) server.

## Architecture

```
User / Browser
      │
      ▼
React Frontend (Netlify)
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
MCP Server (stdio transport for Claude Desktop / Cursor / Antigravity)
Accesses shared backend REST API / database service
```

## Technology Stack

- **Frontend:** React 18, Vite, CSS3
- **Backend:** Node.js, Express.js, Mongoose, CORS, Dotenv
- **Database:** MongoDB Atlas (Cloud Database)
- **MCP Server:** `@modelcontextprotocol/sdk`, Zod
- **Testing:** Node.js native test runner (`node:test`, `node:assert`)
- **Deployments:** Netlify (Frontend), Render (Backend)

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
├── netlify.toml         # Netlify build configuration
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

## MCP Server Tools

The MCP server connects AI clients to the student management system:

1. `list_students`: List all students with optional search query.
2. `get_student`: Retrieve student record by ID or studentId.
3. `create_student`: Create new student with validation.
4. `update_student`: Update student details.
5. `delete_student`: Remove student record.

### MCP Client Configuration

To connect this MCP server to Claude Desktop or compatible AI clients, add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "student-management": {
      "command": "node",
      "args": ["d:/New folder/cc project 1/mcp-server/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:5000/api"
      }
    }
  }
}
```

*Note: Replace `API_BASE_URL` with your live Render backend URL when deployed.*

## Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/studentDB?retryWrites=true&w=majority
FRONTEND_URL=https://<your-netlify-subdomain>.netlify.app
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

### MCP Server (`mcp-server/.env`)
```env
API_BASE_URL=https://<your-render-service>.onrender.com/api
```

## Local Setup & Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "cc project 1"
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

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Start services:**
   - Start backend: `npm run start:server`
   - Start frontend: `npm run start:client`
   - Start MCP server: `npm run start:mcp`

## Deployment Instructions

### 1. Backend on Render
1. Create a **New Web Service** linked to your GitHub repository.
2. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
3. Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Netlify URL (or `*` initially).

### 2. Frontend on Netlify
1. Create a **New Site from Git** linked to your repository.
2. Settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist` (or `dist`)
3. Environment Variables:
   - `VITE_API_BASE_URL`: `https://<your-render-app>.onrender.com/api`

## Verified Deployment URLs

- **GitHub Repository:** *(Configured during step 7)*
- **Frontend (Netlify):** *(Configured during step 10)*
- **Backend (Render):** *(Configured during step 8)*

## Troubleshooting

- **Database Disconnected:** Verify your IP address is whitelisted in MongoDB Atlas under Network Access (`0.0.0.0/0` for cloud deployment).
- **CORS Error:** Ensure `FRONTEND_URL` on Render matches your Netlify domain.
- **MCP Connection Refused:** Verify backend server is running and `API_BASE_URL` is reachable.
