# API Documentation

<div align="center">

# API Documentation

**Project:** AI-Powered Developer Portfolio

**Version:** 2.0.0

**Document Version:** 1.0

</div>

---

# Table of Contents

- Introduction
- API Overview
- Architecture
- API Workflow
- Current API Implementation
- Ollama Integration
- Request Format
- Response Format
- Error Handling
- HTTP Status Codes
- Security Considerations
- Future Backend API
- API Best Practices
- Conclusion

---

# Introduction

This document describes the API communication used within the AI-Powered Developer Portfolio.

The primary purpose of the API layer is to enable communication between the Portfolio AI Assistant and the locally running Ollama language model.

The application currently operates using a local AI runtime while maintaining a modular architecture that can later be extended into a production-ready backend service.

---

# API Overview

Current communication flow:

```text
User
   │
   ▼
Portfolio Website
   │
   ▼
JavaScript
   │
   ▼
Ollama API
   │
   ▼
Local Language Model
```

The portfolio communicates with Ollama using HTTP requests and JSON payloads.

---

# Architecture

Current architecture:

```text
Browser
    │
    ▼
Portfolio UI
    │
    ▼
AI Chat Module
    │
    ▼
Ollama Runtime
    │
    ▼
Language Model
```

Future production architecture:

```text
Browser
    │
    ▼
Backend API
    │
    ▼
Authentication
    │
    ▼
AI Service Layer
    │
    ▼
Ollama
```

This separation improves security, maintainability, and scalability.

---

# API Workflow

The AI conversation follows these steps:

1. User enters a question.
2. JavaScript validates the input.
3. Request payload is prepared.
4. Request is sent to Ollama.
5. Ollama processes the prompt.
6. Language model generates a response.
7. JSON response is returned.
8. Chat interface renders the response.

---

# Current API Implementation

Current implementation uses the locally running Ollama server.

Default local endpoint:

```text
http://localhost:11434/api/chat
```

The portfolio communicates directly with this endpoint during local development.

No cloud-based AI service is required.

---

# Ollama Integration

The portfolio uses Ollama as the local inference engine.

Responsibilities include:

- Prompt processing
- Context generation
- Response generation
- Conversation handling

Advantages:

- Local execution
- Privacy
- No external API dependency
- Low latency
- Offline capability

---

# Request Format

Example request:

```json
{
  "model": "llama3",
  "messages": [
    {
      "role": "user",
      "content": "Tell me about Vivan's projects."
    }
  ],
  "stream": false
}
```

### Request Fields

| Field    | Description             |
| -------- | ----------------------- |
| model    | Language model name     |
| messages | Conversation messages   |
| role     | User or assistant       |
| content  | User prompt             |
| stream   | Streaming response flag |

---

# Response Format

Example response:

```json
{
  "model": "llama3",
  "created_at": "...",
  "message": {
    "role": "assistant",
    "content": "Vivan has developed several projects..."
  },
  "done": true
}
```

### Response Fields

| Field      | Description        |
| ---------- | ------------------ |
| model      | Model name         |
| created_at | Timestamp          |
| message    | Generated response |
| role       | Assistant          |
| content    | AI response        |
| done       | Completion status  |

---

# Error Handling

The application gracefully handles common API failures.

Possible scenarios include:

- Ollama server unavailable
- Invalid request
- Network interruption
- Empty prompt
- Timeout
- Unexpected server error

When an error occurs, a user-friendly fallback message is displayed instead of exposing technical details.

---

# HTTP Status Codes

| Code | Meaning                    |
| ---- | -------------------------- |
| 200  | Request successful         |
| 400  | Invalid request            |
| 404  | Resource not found         |
| 429  | Too many requests          |
| 500  | Internal server error      |
| 503  | Ollama service unavailable |

---

# Security Considerations

The current implementation follows several security practices.

Implemented measures include:

- Input validation
- Prompt sanitization
- Local AI execution
- Protected project files
- Secure deployment configuration

Recommended production improvements:

- Backend proxy
- Rate limiting
- Authentication
- Request logging
- API monitoring
- CORS restrictions

---

# Future Backend API

Future versions may introduce a dedicated backend service.

Possible endpoints:

| Endpoint              | Purpose             |
| --------------------- | ------------------- |
| POST /api/chat        | AI conversation     |
| GET /api/projects     | Portfolio projects  |
| GET /api/skills       | Skills information  |
| GET /api/achievements | Achievements        |
| GET /api/contact      | Contact information |

This approach separates business logic from the frontend.

---

# API Best Practices

The project follows these API design principles:

- REST-oriented communication
- JSON payloads
- Stateless requests
- Input validation
- Modular architecture
- Clear error handling
- Maintainable code structure

---

# Conclusion

The AI-Powered Developer Portfolio currently integrates with a locally hosted Ollama runtime using HTTP-based JSON communication.

This lightweight API architecture provides fast response times, improved privacy, and simplified deployment while maintaining flexibility for future backend integration.

As the project evolves, the API layer can be extended into a production-ready backend without requiring major architectural changes.

---

<div align="center">

**End of API Documentation**

**Author:** Vivan Pandya

</div>
