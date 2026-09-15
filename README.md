# PT RIN Group Indonesia — Corporate Web Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

A production-grade, full-stack corporate web presence, Content Management System (CMS), Admin Dashboard, and Website Analytics platform for **PT RIN Group Indonesia**, an Indonesian Food & Beverage company focused on developing and managing distinctive culinary and dining concepts (Sukiyaki RIN, Yakiniku TEN, Ryu Jin, Sumomatsu, etc.).

---

## Visual Direction

> **Japanese Hospitality × Modern Editorial × Premium F&B Corporate**

- **Curated Color Tokens**: Warm Ivory (`#F6F3EC`), Deep Obsidian (`#171717`), Restrained Crimson (`#9E2F2F`), Brass Gold (`#B69B63`), Charcoal (`#242424`), Muted Slate (`#77736D`).
- **Editorial Typography**: *Cormorant Garamond* (headings & editorial narratives) paired with *Plus Jakarta Sans* (modern UI typography).
- **Aesthetic Principles**: Generous whitespace, cinematic reveals, restrained micro-interactions, and content authenticity (no fabricated statistics or artificial claims).

---

## Platform Architecture

```text
                                  VERCEL
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
             PUBLIC CORPORATE                  ADMIN DASHBOARD
             WEBSITE (/ & /about)                & CMS (/admin/*)
                     │                               │
                     └───────────────┬───────────────┘
                                     │
                            NEXT.JS APP ROUTER
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
               Server Actions                  Route Handlers
               & Components                     (SEO/Sitemap)
                     │                               │
                     └───────────────┬───────────────┘
                                     │
                                 PRISMA ORM
                                     │
                                     ▼
                              NEON POSTGRESQL
                      (Pooled & Direct SSL Connections)
```

---

## Technology Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Server Components)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Prisma 6.4.1
- **Authentication**: Secure Session Management via HTTP-Only Cookies & `jose` JWT signing
- **Authorization**: Strict Server-Side Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `EDITOR`)
- **Validation**: Zod + React Hook Form
- **Rich Text**: Structured Editorial Editor with HTML sanitization (`sanitize-html`)
- **Analytics**: Google Analytics 4 (`NEXT_PUBLIC_GA_ID`) + Business KPI Summaries (Recharts)
- **Technical SEO**: Dynamic `sitemap.xml`, `robots.txt`, Schema.org JSON-LD (`Organization`, `WebSite`, `Article`, `JobPosting`, `Restaurant`)

---

## Application Structure

### Public Corporate Website
- `/`: Cinematic Homepage (Hero, About, Brand Portfolio, Philosophy 4 Pillars, 5-Step Process Timeline, Latest Insights, Careers CTA)
- `/about`: Corporate Philosophy, Culinary Standards, Japanese Hospitality (*Omotenashi*)
- `/brands`: Brand Portfolio Showcase
- `/brands/[slug]`: Dynamic Brand Detail (Cuisine Concept, Story, Gallery, Outlet Locations & Operating Hours)
- `/career`: Careers Overview & Culture
- `/career/[slug]`: Dynamic Vacancy Detail (Responsibilities, Requirements, Expiration Guard, Direct Application)
- `/news`: Newsroom & Category Filters
- `/news/[slug]`: Article Detail (Reading Time, Sanitized Body, Related Posts, Schema.org Article)
- `/contact`: Corporate Inquiries Form (Zod validated, honeypot anti-spam, saves to database)
- `/privacy-policy` & `/terms`: Legal compliance documentation

### Internal Admin Dashboard (`/admin`)
- `/login`: Secure Administrator Authentication
- `/admin`: Executive Dashboard (Visitor KPIs, recent inquiries, audit activities)
- `/admin/company`: Singleton Company Profile Editor
- `/admin/brands`: Portfolio Manager (Add/edit brands, manage outlets, reorder display order)
- `/admin/news`: Newsroom CMS (Rich text editing, draft/published/scheduled workflow)
- `/admin/careers`: Vacancy Manager (Job specifications, closing dates, active states)
- `/admin/media`: Media Asset Library (Upload, folders, alt tags, dimensions, copy URL)
- `/admin/seo`: Route-by-route Search Engine Optimization Editor
- `/admin/analytics`: Visualized Visitor Trends, Top Pages, and Channels (Recharts)
- `/admin/contacts`: Inbound Inquiries Inbox (Mark read, archive)
- `/admin/settings`: Global Configuration & Public Maintenance Mode Toggle
- `/admin/users`: User Account & Role Administration (`SUPER_ADMIN` only)
- `/admin/activity`: Immutable Audit Trail

---

## Environment Variables Configuration

Create a `.env.local` file in the root directory (never commit this file):

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-sample.neon.tech/neondb?sslmode=require"

# Authentication Secrets (Generate 32+ character random string)
AUTH_SECRET="your-generated-random-secret-key-32-chars-minimum"

# Initial Super Admin Seed Credentials
ADMIN_EMAIL="admin@ringroup.co.id"
ADMIN_PASSWORD="your-strong-initial-admin-password"

# Public Configuration
NEXT_PUBLIC_SITE_URL="https://ringroup.co.id"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

A template with empty values is provided in `.env.example`.

---

## Local Development & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Database Migration & Schema Push
When connecting to your Neon PostgreSQL database:
```bash
npx prisma db push
# or
npx prisma migrate dev --name init
```

### 4. Database Seeding
To initialize the verified brand portfolio (Sukiyaki RIN, Yakiniku TEN, Ryu Jin, Sumomatsu), singleton company profile, categories, and initial `SUPER_ADMIN` account:
```bash
npm run prisma:seed
```
*Note: Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `.env.local` before running seed.*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public website and [http://localhost:3000/admin](http://localhost:3000/admin) for the management center.

---

## Verification & Quality Checks

Run the type checker:
```bash
npx tsc --noEmit
```

Run ESLint:
```bash
npm run lint
```

Build production bundle:
```bash
npm run build
```

---

## Deployment to Vercel

1. Push your repository to GitHub (ensure `.env.local` is in `.gitignore`).
2. Import project into Vercel.
3. Configure the following **Environment Variables** in Vercel Project Settings:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_GA_ID`
4. Set Build Command: `prisma generate && next build`
5. Deploy.

---

## Content Integrity & Security Principles

- **Zero Fabricated Facts**: Unconfirmed corporate dates, exact outlet counts, or artificial revenue figures are omitted. The dynamic CMS remains the definitive source of truth.
- **Role-Based Authorization**: Enforced on server actions and route handlers. Client-side state is never trusted for privilege escalation.
- **Anti-Spam Protection**: Corporate contact form incorporates automated honeypot trapping and hashed IP rate limiting.
- **Zero Credentials Exposure**: No database strings, API secrets, or passwords appear in client bundles or public error traces.
#   R i n G r o u p W e b s i t e  
 