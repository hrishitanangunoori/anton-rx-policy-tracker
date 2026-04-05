# Anton-rx-policy-tracker 

**Policy Pulse**
Policy Pulse is an AI-powered intelligence engine that centralizes and simplifies medical benefit drug coverage. It transforms dense, fragmented policies from multiple payers into a searchable, interactive Coverage Matrix, helping healthcare providers and market access analysts access critical information instantly.

The platform also features Policy Copilot, a specialized AI assistant that answers complex coverage questions in natural language, eliminating the need to manually search through hundreds of pages of policy PDFs.

**Project Overview**

Policy Pulse centralizes and normalizes medical benefit drug policies into a clean, AI-driven coverage matrix. Users can instantly compare Prior Authorization (PA) requirements, Step Therapy protocols, and Site of Care restrictions across multiple payers, including Blue Cross, Cigna, and UnitedHealthcare.

**Key Features**
Interactive Coverage Matrix: Visualize and compare policy data across multiple payers.
Policy Copilot (AI Assistant): Ask coverage questions in natural language and receive grounded, verified answers.
High-Performance Frontend: Smooth, glass-like UI with optimized rendering even for hundreds of drugs and payers.
Structured Backend Data: JSON-based storage allows lightning-fast lookups for matrix interactions and AI context.
RAG-Lite AI Integration: Ensures AI answers are grounded strictly in the provided policy data.

**Frontend**
Framework: Next.js (App Router) for server-side rendering and high-performance routing.
Styling: Tailwind CSS with Glassmorphism effect (backdrop blur, semi-transparent backgrounds, subtle borders).
Components: Shadcn UI (built on Radix UI) for tables, dialogs, and cards.
Typography: Outfit (geometric sans-serif for modern, clinical feel).
Icons & Visuals: Lucide-React icons and particle-based DNA background.
Markdown Rendering: react-markdown customized for clean, single-spaced AI outputs in dark mode.

Frontend Lead: Hrishita Nangunoori

**Backend**
Framework: FastAPI (Python) with asynchronous support for high-speed operations.
Server: Uvicorn ASGI for optimal performance.
Data Storage: Structured JSON database for fast "O(1)" lookups and AI context injection.
Logic: Handles matrix filtering/searching and prepares context for AI responses.

Backend Lead: Eeshaan Karkala

**AI & Policy Copilot**
OpenAI API: GPT-4o/GPT-4 Turbo for natural language responses.
RAG-Lite: Injects structured JSON policy data into every AI session, ensuring accuracy.
Prompt Engineering Rules:
Data Grounding: Model must say "I do not have that information" for unknown drugs.
Formatting: Clean, single-spaced Markdown with bold headers.
Conciseness: Synthesizes data across payers for quick summaries.

Open API Integration Lead : Eeshaan Karkala

**Performance Optimization**
High-density data visualization: Sticky columns and glass layers maintain 60fps even with hundreds of drugs/payers.
Backend caching: Fast JSON lookups minimize load times.
Efficient AI context injection: Only relevant data is provided to the AI, reducing latency.

**Tech Stack**
Frontend: Next.js, Tailwind CSS, Shadcn UI, Lucide-React, react-markdown
Backend: FastAPI, Uvicorn, Python, JSON database
AI: OpenAI API (GPT-4o/GPT-4 Turbo)
Design: Glassmorphism, particle-based DNA visuals, Outfit font

Team
-------------------------------------------------------------------------------------------------------------------------------------------------
Name	                                  Role                                               Responsibilities
-------------------------------------------------------------------------------------------------------------------------------------------------
Hrishita Nangunoori	                Frontend Lead             Next.js, Tailwind CSS, Shadcn UI, Glassmorphism UI, markdown rendering, design
Eeshaan Karkala	                    Backend Lead              FastAPI development, API integrations, AI context injection, JSON database  
                                                              management, backend logic
