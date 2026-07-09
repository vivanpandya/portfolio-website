# System Architecture

<div align="center">

# System Architecture

### AI-Powered Developer Portfolio

**Version:** 2.0.0

**Architecture Style:** Modular Client-Side Architecture with Local AI Integration

---

This document explains the overall architecture, component organization, communication flow, data flow, module responsibilities, and design principles used in the AI-Powered Developer Portfolio.

</div>

---

# Table of Contents

- Architecture Overview
- High-Level Architecture
- Layered Architecture
- System Components
- Component Responsibilities
- Data Flow
- AI Assistant Architecture
- Project Folder Structure
- Communication Flow
- Rendering Pipeline
- Security Architecture
- Performance Architecture
- Scalability Considerations
- Future Architecture

---

# Architecture Overview

The AI-Powered Developer Portfolio follows a modular client-side architecture where each major responsibility is separated into independent modules.

The website is primarily built using HTML5, CSS3, and Vanilla JavaScript while integrating a locally hosted AI model through Ollama.

The architecture emphasizes:

- Modularity
- Maintainability
- Reusability
- Scalability
- Performance
- Security
- Separation of Concerns

---

# High-Level Architecture

```text
                        User
                          │
                          ▼
                 Portfolio Website
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
     HTML UI          CSS Engine       JavaScript
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                Portfolio Components
                          │
      ┌──────────────┬──────────────┬──────────────┐
      ▼              ▼              ▼
   Hero Section   Projects      Achievements
      │              │              │
      └──────────────┼──────────────┘
                     ▼
              AI Assistant Module
                     │
                     ▼
              Ollama Runtime
                     │
                     ▼
             Local Language Model
```

---

# Layered Architecture

```text
+------------------------------------------------------+
|                  Presentation Layer                  |
|------------------------------------------------------|
| HTML | CSS | Responsive Layout | Animations | UI     |
+------------------------------------------------------+

+------------------------------------------------------+
|                  Interaction Layer                   |
|------------------------------------------------------|
| Navigation | Carousel | Typing | Chat | Events       |
+------------------------------------------------------+

+------------------------------------------------------+
|                  Business Logic Layer                |
|------------------------------------------------------|
| AI Engine | Portfolio Data | Search | Validation     |
+------------------------------------------------------+

+------------------------------------------------------+
|                AI Processing Layer                   |
|------------------------------------------------------|
| Prompt Builder | Context Manager | Ollama           |
+------------------------------------------------------+

+------------------------------------------------------+
|                 Local AI Runtime                     |
|------------------------------------------------------|
| Llama Model | Ollama Server | Response Generator     |
+------------------------------------------------------+
```

---

# System Components

## 1. User Interface Layer

Responsible for:

- Layout
- Navigation
- Responsive Design
- Animations
- Visual Components
- User Interaction

Technologies:

- HTML5
- CSS3
- Flexbox
- CSS Grid

---

## 2. Interaction Layer

Responsible for:

- Carousel Navigation
- Typing Animation
- Button Events
- Scroll Effects
- Theme Interactions

Primary Modules:

- script.js
- cursor-orbit.js

---

## 3. Portfolio Content Layer

Contains:

- Personal Information
- Skills
- Projects
- Achievements
- Certifications
- Resume Links

This layer manages all portfolio-related information displayed to users.

---

## 4. AI Assistant Layer

Responsible for:

- User Query Processing
- Prompt Generation
- Context Management
- Response Rendering

Features:

- Intelligent Responses
- Portfolio Navigation
- Recruiter Assistance
- Knowledge-Based Answers

---

## 5. Local AI Layer

The AI Assistant communicates with a locally hosted Ollama runtime.

Responsibilities:

- Receive Prompt
- Execute Language Model
- Generate Response
- Return JSON Response

Advantages:

- No Cloud Dependency
- Privacy Focused
- Faster Local Inference
- Offline Capability

---

# Component Responsibilities

| Component       | Responsibility           |
| --------------- | ------------------------ |
| index.html      | Website Structure        |
| style.css       | Styling & Layout         |
| script.js       | User Interaction         |
| cursor-orbit.js | Cursor Animation         |
| assets          | Static Resources         |
| documentation   | Project Documentation    |
| run.py          | Local Development Server |

---

# Project Folder Structure

```text
Portfolio
│
├── assets
│   ├── certificates
│   ├── images
│   ├── icons
│   └── resume
│
├── documentation
│
├── index.html
├── style.css
├── script.js
├── cursor-orbit.js
├── run.py
├── robots.txt
├── vercel.json
├── package.json
└── README.md
```

---

# Communication Flow

```text
User
 │
 ▼
Clicks Button
 │
 ▼
JavaScript Event
 │
 ▼
UI Update
 │
 ▼
Portfolio Component
 │
 ▼
AI Assistant
 │
 ▼
Ollama Runtime
 │
 ▼
Language Model
 │
 ▼
Generated Response
 │
 ▼
Chat Window
```

---

# Rendering Pipeline

```text
HTML Parsing
      │
      ▼
DOM Creation
      │
      ▼
CSS Parsing
      │
      ▼
Render Tree
      │
      ▼
Layout
      │
      ▼
Paint
      │
      ▼
Composite
      │
      ▼
Interactive Website
```

---

# AI Assistant Architecture

```text
Visitor
   │
   ▼
Chat Window
   │
   ▼
Input Validation
   │
   ▼
Prompt Builder
   │
   ▼
Context Manager
   │
   ▼
Portfolio Knowledge Base
   │
   ▼
Ollama Runtime
   │
   ▼
Language Model
   │
   ▼
Generated Answer
   │
   ▼
Render Response
```

---

# Security Architecture

The application incorporates multiple security measures to improve reliability and protect against common web-based threats.

Implemented measures include:

- Content Security Policy (CSP)
- Secure HTTP Headers
- Clickjacking Protection
- Referrer Policy
- Permissions Policy
- XSS Prevention
- Secure External Links
- Protected AI Communication
- Git Ignore for Sensitive Files

---

# Performance Architecture

Performance optimizations include:

- Modular JavaScript
- Lightweight CSS
- Optimized Rendering
- Hardware Accelerated Animations
- Responsive Images
- Reduced DOM Complexity
- Smooth Scroll Behaviour
- Lazy Rendering Strategy

---

# Scalability Considerations

The modular architecture allows future expansion without major structural changes.

Future modules may include:

- Admin Dashboard
- Visitor Analytics
- CMS Integration
- Authentication
- Database Support
- Blog Module
- Multi-language Support
- Cloud AI Services

---

# Future Architecture

```text
Users
   │
   ▼
Portfolio Website
   │
   ▼
Backend API
   │
   ├──────── Database
   │
   ├──────── Authentication
   │
   ├──────── Visitor Analytics
   │
   ├──────── Contact Service
   │
   └──────── AI Gateway
                 │
                 ▼
         Ollama / Cloud AI Models
```

---

# Architecture Principles

The project follows the following software engineering principles:

- Separation of Concerns
- Component Reusability
- Modular Design
- Single Responsibility Principle
- Responsive First Development
- Progressive Enhancement
- Secure by Design
- Maintainable Code Structure

---

# Conclusion

The AI-Powered Developer Portfolio follows a modular, scalable, and maintainable architecture that combines modern frontend engineering with intelligent AI capabilities.

Its layered design enables clean separation between presentation, interaction, business logic, and AI processing while ensuring high performance, strong security, and future extensibility.

---

<div align="center">

**End of System Architecture Document**

**Author:** Vivan Pandya

</div>
