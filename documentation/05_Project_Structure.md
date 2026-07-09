# Project Structure

<div align="center">

# Project Structure Documentation

**Project:** AI-Powered Developer Portfolio

**Version:** 2.0.0

**Document Version:** 1.0

</div>

---

# Table of Contents

- Introduction
- Project Organization
- Directory Structure
- Root Directory
- Assets Directory
- Documentation Directory
- Configuration Files
- JavaScript Modules
- Styling Architecture
- Development Utilities
- Naming Conventions
- Folder Organization Principles
- Scalability Considerations
- Future Directory Expansion
- Conclusion

---

# Introduction

This document describes the overall directory structure and organization of the AI-Powered Developer Portfolio.

The project follows a modular and maintainable structure where static assets, source files, configuration files, documentation, and development utilities are separated into dedicated directories.

This organization improves readability, scalability, maintainability, and collaboration.

---

# Project Organization

The project follows a feature-oriented directory structure.

Major categories include:

- Static Assets
- Documentation
- Source Files
- Configuration
- Development Utilities

Each category has a clearly defined responsibility.

---

# Directory Structure

```text
Portfolio
│
├── assets/
│   ├── certificates/
│   ├── icons/
│   ├── images/
│   ├── profile/
│   └── resume/
│
├── documentation/
│   ├── 01_Project_Overview.md
│   ├── 02_System_Architecture.md
│   ├── 03_Features.md
│   ├── 04_UI_UX_Design.md
│   ├── 05_Project_Structure.md
│   ├── 06_Technology_Stack.md
│   ├── 07_API_Documentation.md
│   ├── 08_AI_Assistant.md
│   ├── 09_Security.md
│   ├── 10_Performance_Optimization.md
│   ├── 11_Deployment_Guide.md
│   ├── 12_User_Guide.md
│   ├── 13_Developer_Guide.md
│   ├── 14_Testing.md
│   ├── 15_Known_Issues.md
│   ├── 16_Future_Improvements.md
│   ├── 17_Changelog.md
│   └── 18_License.md
│
├── index.html
├── style.css
├── script.js
├── cursor-orbit.js
├── run.py
├── robots.txt
├── vercel.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# Root Directory

The root directory contains the application's primary source files, configuration files, and deployment resources.

| File              | Responsibility                       |
| ----------------- | ------------------------------------ |
| index.html        | Main application entry point         |
| style.css         | Global styling and responsive layout |
| script.js         | Client-side application logic        |
| cursor-orbit.js   | Cursor animation effects             |
| run.py            | Local development server             |
| robots.txt        | Search engine crawler configuration  |
| vercel.json       | Deployment configuration             |
| package.json      | Project metadata and dependencies    |
| package-lock.json | Dependency version locking           |
| .gitignore        | Git exclusion rules                  |
| README.md         | Repository overview                  |

---

# Assets Directory

The `assets` directory contains all static resources required by the application.

```text
assets
│
├── certificates/
├── icons/
├── images/
├── profile/
└── resume/
```

### certificates/

Stores professional certifications displayed within the portfolio.

Examples:

- NASA Space Apps Challenge
- Meta Full Stack Certificate
- Additional certifications

---

### icons/

Contains custom icons used throughout the application.

Examples:

- SVG icons
- Custom graphics

---

### images/

Stores images used by the website.

Examples:

- Hero illustrations
- Background graphics
- Section images

---

### profile/

Contains profile photographs.

---

### resume/

Stores downloadable resume files.

Supported format:

- PDF

---

# Documentation Directory

The documentation directory contains technical documentation describing every aspect of the project.

Documentation categories include:

- Architecture
- Features
- Security
- Deployment
- Testing
- Performance
- Developer Guides

Keeping documentation isolated improves maintainability and collaboration.

---

# Configuration Files

Configuration files define project behavior without modifying application source code.

### package.json

Defines:

- Project metadata
- Dependencies
- Development scripts

---

### vercel.json

Defines:

- Deployment configuration
- Security headers
- Hosting behaviour

---

### robots.txt

Controls search engine crawling behaviour.

---

### .gitignore

Defines files excluded from version control.

Examples:

- node_modules
- .env
- logs
- temporary files

---

# JavaScript Modules

JavaScript files are separated according to responsibility.

## script.js

Responsible for:

- User interactions
- Navigation
- Carousel
- Typing animation
- Event handling
- Dynamic behaviour

---

## cursor-orbit.js

Responsible for:

- Cursor effects
- Interactive animations
- Visual enhancement

---

# Styling Architecture

All visual styling is maintained inside a centralized stylesheet.

Responsibilities include:

- Layout
- Typography
- Components
- Responsive behaviour
- Animations
- Themes
- Card styling

Maintaining a centralized stylesheet simplifies maintenance.

---

# Development Utilities

Development utilities assist during local development.

Current utilities include:

- Local Python server
- Git version control
- Package management
- Documentation

These utilities are not part of the production user interface.

---

# Naming Conventions

The project follows consistent naming conventions.

### Files

- Lowercase
- Hyphen-separated where applicable

Examples:

```text
project-overview.md
style.css
robots.txt
```

---

### CSS Classes

Convention:

```text
component-name
```

Examples:

- project-card
- skill-card
- hero-section
- achievement-card

---

### JavaScript

Naming conventions:

Variables:

```text
camelCase
```

Functions:

```text
verbNoun()
```

Examples:

```text
initializeCarousel()
renderProjects()
handleNavigation()
```

Constants:

```text
UPPER_SNAKE_CASE
```

Examples:

```text
MAX_WIDTH
DEFAULT_SPEED
```

---

# Folder Organization Principles

The project follows several organizational principles.

## Separation of Concerns

Each directory has one clearly defined responsibility.

---

## Maintainability

Files performing similar tasks are grouped together.

---

## Scalability

New modules can be introduced without restructuring the project.

---

## Reusability

Shared resources are centralized.

---

## Simplicity

The folder hierarchy remains shallow and easy to navigate.

---

# Scalability Considerations

The current structure supports future expansion.

Potential future directories include:

```text
backend/
database/
api/
tests/
public/
config/
```

These directories can be added without affecting the current organization.

---

# Future Directory Expansion

As the portfolio evolves, additional modules may include:

- Authentication
- Blog
- Analytics
- Dashboard
- CMS
- Visitor Tracking
- AI Memory
- Cloud Services

The existing project structure is designed to accommodate these additions with minimal modification.

---

# Conclusion

The AI-Powered Developer Portfolio follows a modular, organized, and scalable directory structure that separates assets, documentation, configuration, source code, and development utilities into clearly defined locations.

This organization improves readability, maintainability, collaboration, and future extensibility while following modern software engineering best practices suitable for production-grade web applications.

---

<div align="center">

**End of Project Structure Document**

**Author:** Vivan Pandya

</div>
