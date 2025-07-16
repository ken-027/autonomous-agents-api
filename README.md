# Autonomous Agents API

A modern, production-ready Node.js/Express API for portfolio, powered by autonomous agents and LangGraph. This API enables dynamic portfolio Q&A, developer info retrieval, and AI-powered cover letter generation—all with robust session management and security best practices.

**Live Demo:** [agentic-api.ksoftdev.site/api-docs](https://agentic-api.ksoftdev.site/api-docs)

---

## 🚀 Features

- **Portfolio Chatbot Agent**: Ask about projects, skills, experience, and more.
- **Comprehensive Portfolio Data**: Endpoints for experiences, services, projects, certificates, and skills.
- **Session Management**: Secure sessions with PostgreSQL.
- **Rate Limiting & Security**: Built-in protection against abuse and common vulnerabilities.
- **OpenAPI/Swagger Documentation**: Interactive API docs for easy exploration.

---

## 📚 API Endpoints

| Endpoint | Method | Description | Body |
|----------|--------|-------------|------|
| `/api/v1/agents` | GET | List all available agents | - |
| `/api/v1/agents/:agent` | POST | Interact with a specific agent (e.g., portfolio, cover-letter) | `{ "message": "...", "history": [...] }` |

### Example: Chat with the Portfolio Agent
```bash
curl -X POST https://agentic-api.ksoftdev.site/api/v1/agents/portfolio \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your frontend projects?"}'
```

### Example: Chat with the Github Agent
```bash
curl -X POST https://agentic-api.ksoftdev.site/api/v1/agents/github \
  -H "Content-Type: application/json" \
  -d '{"message": "What is your top programming language?"}'
```

---

## 🏁 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/ken-027/agentic-api.git
cd agentic-api
npm install
```

### 2. Development Mode
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Run Tests
```bash
npm run test:e2e
```

### 5. Run with Docker
```bash
docker-compose up --build
```

---

## 🛠️ Tech Stack

- **Node.js & Express** – Fast, scalable backend framework
- **TypeScript** – Type-safe JavaScript
- **LangChain/LangGraph** – Autonomous agent orchestration
- **PostgreSQL** – Session and data storage
- **Swagger/OpenAPI** – API documentation

---

## 📖 Documentation

- **Swagger UI:** [https://agentic-api.ksoftdev.site/api-docs](https://agentic-api.ksoftdev.site/api-docs)
- **Swagger JSON:** [https://agentic-api.ksoftdev.site/swagger.json](https://agentic-api.ksoftdev.site/swagger.json)
