# Deployment Guide

<div align="center">

# Deployment Guide

**Project:** AI-Powered Developer Portfolio

**Version:** 2.0.0

**Document Version:** 1.0

</div>

---

# Table of Contents

- Introduction
- Deployment Overview
- System Requirements
- Software Prerequisites
- Project Setup
- Installing Dependencies
- Local Development
- Ollama Installation
- Running the AI Assistant
- Production Deployment
- Vercel Deployment
- Deployment Checklist
- Troubleshooting
- Maintenance
- Future Deployment Strategy
- Conclusion

---

# Introduction

This document provides complete instructions for setting up, running, and deploying the AI-Powered Developer Portfolio in both local development and production environments.

The guide is intended for developers, contributors, and recruiters who wish to explore or host the project.

---

# Deployment Overview

The project can be executed in two environments.

| Environment       | Purpose                 |
| ----------------- | ----------------------- |
| Local Development | Development and Testing |
| Production        | Public Deployment       |

The portfolio uses a lightweight frontend architecture with optional local AI integration using Ollama.

---

# System Requirements

Minimum recommended system specifications:

| Component        | Requirement                 |
| ---------------- | --------------------------- |
| Operating System | Windows 10/11, Linux, macOS |
| Processor        | Dual-Core CPU               |
| Memory           | 8 GB RAM                    |
| Storage          | 2 GB Free Space             |
| Internet         | Required for deployment     |

Recommended specifications:

| Component | Recommendation        |
| --------- | --------------------- |
| Processor | Quad-Core CPU         |
| Memory    | 16 GB RAM             |
| Storage   | SSD                   |
| Browser   | Latest Stable Version |

---

# Software Prerequisites

The following software should be installed before running the project.

### Git

Required for cloning the repository.

### Visual Studio Code

Recommended development environment.

### Python

Used for the local development server.

Recommended version:

Python 3.10 or higher

### Ollama

Required for AI Assistant functionality.

### Modern Web Browser

Supported browsers:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

---

# Project Setup

Clone the repository:

```bash
git clone https://github.com/<username>/<repository>.git
```

Navigate to the project directory:

```bash
cd Portfolio
```

Open the project in Visual Studio Code.

---

# Installing Dependencies

If the project includes Node.js dependencies:

```bash
npm install
```

Verify installation:

```bash
npm list
```

If no additional packages are required, this step can be skipped.

---

# Local Development

Start the local development server.

Example:

```bash
python run.py
```

After the server starts, open the browser and navigate to:

```text
http://localhost:8000
```

The portfolio should now be available locally.

---

# Ollama Installation

Download and install Ollama from the official website.

After installation, verify the installation:

```bash
ollama --version
```

Download the required language model:

```bash
ollama pull llama3
```

Verify the installed models:

```bash
ollama list
```

---

# Running the AI Assistant

Start the Ollama service.

Example:

```bash
ollama serve
```

Run the selected model:

```bash
ollama run llama3
```

Once the model is available, the portfolio AI assistant can communicate with the local runtime.

---

# Production Deployment

The project is designed for static hosting platforms.

Recommended providers include:

- Vercel
- Netlify
- GitHub Pages (Frontend Only)

The AI Assistant should remain local or be migrated to a secure backend before production deployment.

---

# Vercel Deployment

## Step 1

Push the project to GitHub.

Example:

```bash
git add .

git commit -m "Production Release"

git push origin main
```

---

## Step 2

Log in to Vercel.

---

## Step 3

Import the GitHub repository.

---

## Step 4

Configure the project.

Framework Preset:

```
Other
```

Build Command:

```
None
```

Output Directory:

```
.
```

---

## Step 5

Deploy the application.

Vercel automatically provides:

- HTTPS
- CDN
- Global Deployment
- Automatic SSL
- Continuous Deployment

---

# Deployment Checklist

Before deploying, verify the following:

- Repository is up to date
- All documentation is complete
- Images are optimized
- Security headers are configured
- robots.txt is present
- vercel.json is configured
- .gitignore is updated
- External links are functional
- GitHub repository links are correct
- Certificate links are valid
- Resume download works
- AI Assistant is functioning locally

---

# Troubleshooting

## Website does not load

Possible causes:

- Python server not running
- Incorrect port
- Browser cache

Solution:

Restart the server and refresh the browser.

---

## AI Assistant not responding

Possible causes:

- Ollama not running
- Incorrect model
- Port unavailable

Verify:

```bash
ollama list
```

Start Ollama:

```bash
ollama serve
```

---

## Deployment failed

Possible causes:

- Invalid configuration
- Missing files
- Incorrect repository settings

Verify:

- vercel.json
- GitHub repository
- Build configuration

---

## Broken Links

Verify:

- GitHub URLs
- LinkedIn URL
- Certificate paths
- Resume path

---

# Maintenance

Regular maintenance activities include:

- Updating documentation
- Reviewing project dependencies
- Testing external links
- Updating certificates
- Updating resume
- Monitoring deployment status
- Reviewing AI responses
- Fixing reported issues

---

# Future Deployment Strategy

Future deployment improvements may include:

- Backend API deployment
- Docker containers
- Cloud AI hosting
- CI/CD pipeline
- GitHub Actions
- Automated testing
- Monitoring dashboards
- Logging infrastructure
- Multi-environment deployment

These enhancements will support production-scale deployments.

---

# Deployment Summary

| Component                 | Status    |
| ------------------------- | --------- |
| Local Development         | Supported |
| Python Server             | Supported |
| Ollama Integration        | Supported |
| GitHub Repository         | Supported |
| Vercel Deployment         | Supported |
| HTTPS                     | Supported |
| Documentation             | Complete  |
| Future Backend Deployment | Planned   |

---

# Conclusion

The AI-Powered Developer Portfolio has been designed with a straightforward deployment process that supports both local development and production hosting.

The combination of a lightweight frontend architecture, modular project structure, secure deployment configuration, and optional local AI integration ensures that the application can be deployed efficiently while remaining maintainable and scalable for future enhancements.

---

<div align="center">

**End of Deployment Guide**

**Author:** Vivan Pandya

</div>
