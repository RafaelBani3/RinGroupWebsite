# PT RIN Group Indonesia — Corporate Web Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat\&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat\&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat\&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat\&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat\&logo=postgresql)](https://neon.tech/)
[![Tailwind\_CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat\&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat\&logo=vercel)](https://vercel.com/)

> **Production-ready corporate web platform for PT RIN Group Indonesia**

A full-stack corporate website, Content Management System (CMS), Admin Dashboard, and analytics foundation for **PT RIN Group Indonesia**, an Indonesian Food & Beverage company focused on developing and managing distinctive culinary and dining concepts.

The platform is designed to provide a premium corporate presence while giving internal teams full control over company information, restaurant brands, news, careers, media assets, SEO metadata, inquiries, and administrative access.

---

## ✦ Project Overview

The platform combines two primary experiences:

### Public Corporate Website

A premium editorial-style corporate website designed to communicate:

* Corporate identity
* Company philosophy
* Brand portfolio
* Culinary and hospitality positioning
* Career opportunities
* Corporate news and insights
* Business inquiries

### Internal CMS & Admin Dashboard

A secure management center for authorized users to manage:

* Company profile
* Restaurant brands
* Brand locations
* News & articles
* Career vacancies
* Media assets
* SEO metadata
* Website settings
* Contact inquiries
* Analytics
* Users & roles
* Audit activities

---

# Visual Direction

> **Japanese Hospitality × Modern Editorial × Premium F&B Corporate**

The visual language combines Japanese hospitality cues with contemporary editorial design rather than using a conventional restaurant or SaaS aesthetic.

### Design Principles

* Editorial composition
* Generous whitespace
* Strong typography hierarchy
* Cinematic imagery
* Restrained motion
* Premium hospitality atmosphere
* Clear information architecture
* Minimal interface clutter
* Authentic corporate storytelling

### Color System

| Token              | Color     | Usage                            |
| ------------------ | --------- | -------------------------------- |
| Warm Ivory         | `#F6F3EC` | Primary background               |
| Deep Obsidian      | `#171717` | Dark sections / primary contrast |
| Restrained Crimson | `#9E2F2F` | Accent / emphasis                |
| Brass Gold         | `#B69B63` | Premium accent                   |
| Charcoal           | `#242424` | Primary text                     |
| Muted Slate        | `#77736D` | Secondary text                   |

### Typography

* **Cormorant Garamond** — Editorial headlines and narrative sections
* **Plus Jakarta Sans** — Body copy, navigation, forms, and UI

---

# Architecture

```text
                         ┌───────────────────────┐
                         │        VERCEL         │
                         │   Next.js Application  │
                         └───────────┬───────────┘
                                     │
                 ┌───────────────────┴──────────────────┐
                 │                                      │
        ┌────────▼────────┐                   ┌─────────▼─────────┐
        │ Public Website  │                   │   Admin Dashboard │
        │                 │                   │                   │
        │ /               │                   │ /admin            │
        │ /about          │                   │ /admin/company    │
        │ /brands         │                   │ /admin/brands     │
        │ /career         │                   │ /admin/news       │
        │ /news           │                   │ /admin/careers    │
        │ /contact        │                   │ /admin/media      │
        └────────┬────────┘                   │ /admin/seo        │
                 │                            │ /admin/analytics  │
                 │                            │ /admin/contacts   │
                 │                            │ /admin/settings   │
                 │                            │ /admin/users      │
                 │                            │ /admin/activity   │
                 │                            └─────────┬─────────┘
                 │                                      │
                 └──────────────────┬───────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │    Next.js App      │
                         │                     │
                         │ Server Components   │
                         │ Server Actions      │
                         │ Route Handlers      │
                         │ Middleware          │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
        ┌────────▼────────┐ ┌───────▼────────┐ ┌──────▼─────────┐
        │   Prisma ORM    │ │ Vercel Blob     │ │    Analytics   │
        │                 │ │                 │ │                │
        │ Neon PostgreSQL │ │ Media Storage   │ │ GA4            │
        │                 │ │                 │ │ Internal Events│
        └─────────────────┘ └─────────────────┘ └────────────────┘
```

---

# Technology Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 16                                     |
| UI Library      | React 19                                       |
| Language        | TypeScript 5                                   |
| Styling         | Tailwind CSS v4 + CSS Design Tokens            |
| Database        | Neon Serverless PostgreSQL                     |
| ORM             | Prisma 6                                       |
| Authentication  | Secure HTTP-only Cookie Sessions + `jose`      |
| Authorization   | Server-side RBAC                               |
| Validation      | Zod                                            |
| Forms           | React Hook Form                                |
| Rich Text       | Structured Editor + `sanitize-html`            |
| Media Storage   | Vercel Blob                                    |
| Analytics       | Google Analytics 4 + Internal Analytics Events |
| Charts          | Recharts                                       |
| Deployment      | Vercel                                         |
| Version Control | Git / GitHub                                   |

---

# Application Structure

## Public Website

| Route             | Purpose                        |
| ----------------- | ------------------------------ |
| `/`               | Corporate homepage             |
| `/about`          | Company profile and philosophy |
| `/brands`         | Brand portfolio                |
| `/brands/[slug]`  | Dynamic brand detail           |
| `/career`         | Career opportunities           |
| `/career/[slug]`  | Vacancy detail                 |
| `/news`           | Corporate newsroom             |
| `/news/[slug]`    | Article detail                 |
| `/contact`        | Corporate inquiry form         |
| `/privacy-policy` | Privacy policy                 |
| `/terms`          | Terms and conditions           |

### Homepage

The homepage contains:

* Hero / corporate statement
* Company introduction
* Brand portfolio
* Hospitality philosophy
* Four-pillar philosophy section
* Operational process timeline
* Latest insights
* Career CTA
* Corporate contact CTA

### Brand Detail

Each brand can contain:

* Brand name
* Cuisine concept
* Brand story
* Description
* Gallery
* Locations
* Operating hours
* Social links
* Restaurant structured data

Brands are managed dynamically through the CMS.

---

# Admin Dashboard

The internal management center is available under `/admin`.

| Route              | Function                   |
| ------------------ | -------------------------- |
| `/admin`           | Executive dashboard        |
| `/admin/company`   | Company profile management |
| `/admin/brands`    | Brand portfolio management |
| `/admin/news`      | Newsroom CMS               |
| `/admin/careers`   | Career management          |
| `/admin/media`     | Media library              |
| `/admin/seo`       | SEO management             |
| `/admin/analytics` | Analytics dashboard        |
| `/admin/contacts`  | Contact inquiries          |
| `/admin/settings`  | Global settings            |
| `/admin/users`     | User & role management     |
| `/admin/activity`  | Audit trail                |

---

# CMS Capabilities

## Company Profile

Manage the centralized corporate information used throughout the public website.

Examples include:

* Company name
* Description
* Contact information
* Address
* Email
* Phone
* Social links
* Corporate metadata

The company profile is implemented as a singleton configuration.

---

## Brand Management

Administrators can:

* Create brands
* Edit brands
* Publish/unpublish brands
* Reorder brands
* Manage brand descriptions
* Manage galleries
* Manage locations
* Manage operating hours
* Manage social links

The public brand portfolio is generated dynamically from CMS data.

---

## Newsroom

Supports:

* Draft articles
* Published articles
* Scheduled articles
* Categories
* Rich text content
* Featured images
* SEO metadata
* Related content

Future scheduled articles are not exposed publicly until their publication time.

---

## Careers

Supports:

* Job title
* Department
* Location
* Employment type
* Responsibilities
* Requirements
* Application information
* Closing date
* Active/inactive state

Expired vacancies are automatically excluded from public listings and the sitemap.

---

# Media Library

Media assets are stored using **Vercel Blob** rather than the Vercel application filesystem.

Supported image formats:

```text
JPEG
PNG
WebP
AVIF
SVG
```

Current upload constraints include:

* Maximum file size: **5 MB**
* MIME type validation
* Filename sanitization
* Metadata persistence
* Public asset URLs

No persistent media storage depends on the local application filesystem.

---

# Authentication & Authorization

The application implements server-side authentication and role-based access control.

### Roles

```text
SUPER_ADMIN
ADMIN
EDITOR
```

### Permission Model

| Capability    | SUPER_ADMIN | ADMIN | EDITOR |
| ------------- | :---------: | :---: | :----: |
| Public CMS    |      ✓      |   ✓   |    ✓   |
| Company       |      ✓      |   ✓   |    ✓   |
| Brands        |      ✓      |   ✓   |    ✓   |
| News          |      ✓      |   ✓   |    ✓   |
| Careers       |      ✓      |   ✓   |    ✓   |
| Media         |      ✓      |   ✓   |    ✓   |
| SEO           |      ✓      |   ✓   |    ✓   |
| Analytics     |      ✓      |   ✓   |    —   |
| Contacts      |      ✓      |   ✓   |    ✓   |
| Settings      |      ✓      |   ✓   |    —   |
| Users         |      ✓      |   —   |    —   |
| Activity Logs |      ✓      |   ✓   |    —   |

Authorization is enforced server-side. Client-side UI restrictions are not treated as a security boundary.

---

# Security

The platform includes several security controls:

### Authentication

* HTTP-only cookies
* Secure cookies in production
* `SameSite=Lax`
* Signed/encrypted JWT session
* Required `AUTH_SECRET` in production

### Authorization

* Server-side role checks
* Protected admin routes
* Server Action authorization
* Restricted administrative sections

### Form Protection

The public contact form includes:

* Zod validation
* Honeypot anti-spam
* IP hashing
* Rate limiting
* Clean production error responses

### Rich Text Security

News content is sanitized before rendering using a strict HTML whitelist.

### Secrets

Sensitive configuration is provided through environment variables.

Never commit:

```text
.env
.env.local
.env.production
```

or any file containing production credentials.

---

# Analytics

The platform supports two analytics layers.

## Google Analytics 4

The public website supports GA4 through:

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

GA4 is intended for real website traffic and visitor analytics.

## Internal Analytics Events

Business/application events can also be stored in the Neon PostgreSQL database through the `AnalyticsEvent` model.

The Admin Analytics dashboard distinguishes between:

* Live internal event data
* Demonstration/benchmark data

When no internal events have been recorded, benchmark metrics are explicitly labeled as demonstration data and are not presented as real production traffic.

---

# SEO

The platform includes a dynamic technical SEO foundation.

### Metadata

Supports:

* Page titles
* Meta descriptions
* Canonical URLs
* Open Graph metadata
* Twitter/X cards
* Dynamic metadata
* Environment-driven site URL

### Sitemap

Dynamic:

```text
/sitemap.xml
```

The sitemap includes eligible:

* Public pages
* Published brands
* Published news
* Active careers

Draft and future-scheduled content is excluded.

### Robots

```text
/robots.txt
```

Administrative and non-public paths are restricted from crawling:

```text
/admin/
 /login
 /api/
```

### Structured Data

Schema.org JSON-LD is implemented for:

```text
Organization
WebSite
Restaurant
Article
JobPosting
```

---

# Content Integrity

The platform follows a strict editorial principle:

> **If a corporate fact cannot be verified, do not invent it.**

The website intentionally avoids unsupported claims such as:

* Exact employee counts
* Exact outlet counts
* Unverified founding years
* Artificial awards
* Revenue claims
* Unsupported market leadership statements
* Fabricated corporate achievements

The CMS acts as the primary source of truth for editable corporate content.

---

# Environment Variables

Create:

```text
.env.local
```

in the project root.

Example:

> **Never use the example values above as production credentials.**

A template is available in:

```text
.env.example
```

---

# Local Development

## 1. Clone Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment

Create:

```text
.env.local
```

and configure the required environment variables.

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Database Development Setup

For local development where schema changes are still being designed:

```bash
npx prisma migrate dev
```

Alternatively, for rapid prototyping against a development database:

```bash
npx prisma db push
```

For production environments, use migrations rather than `db push`.

---

## 6. Seed Database

Make sure:

```env
ADMIN_EMAIL="your-admin-email"
ADMIN_PASSWORD="your-strong-initial-password"
```

are configured before running the seed.

Then:

```bash
npm run prisma:seed
```

The seed initializes the required baseline CMS data and administrator account.

> Review the seed contents before running it against an existing production database.

---

## 7. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin
```

---

# Development Commands

### Start Development

```bash
npm run dev
```

### Type Check

```bash
npx tsc --noEmit
```

### Lint

```bash
npm run lint
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Development Migration

```bash
npx prisma migrate dev
```

### Deploy Existing Migrations

```bash
npx prisma migrate deploy
```

### Seed Database

```bash
npm run prisma:seed
```

### Production Build

```bash
npm run build
```

---

# Quality Verification

Before merging or deploying:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected result:

```text
TypeScript: 0 errors
ESLint: 0 warnings / 0 errors
Next.js build: successful
```

---

# Deployment

The recommended deployment architecture is:

```text
                    GitHub
                       │
                       ▼
                    Vercel
                       │
             ┌─────────┴─────────┐
             │                   │
        Preview Environment   Production
             │                   │
             ▼                   ▼
        Neon Preview         Neon Production
```

## Vercel Environment Variables

Configure the required variables in:

```text
Vercel
→ Project
→ Settings
→ Environment Variables
```

Required:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
NEXT_PUBLIC_SITE_URL
```

Optional depending on enabled services:

```text
NEXT_PUBLIC_GA_ID
BLOB_READ_WRITE_TOKEN
```

---

## Production Database Migration

Before or during production deployment:

```bash
npx prisma migrate deploy
```

Do not use:

```bash
npx prisma db push
```

as the normal production migration strategy.

---

## Production Seed

Only run:

```bash
npm run prisma:seed
```

against production after reviewing exactly what the seed will create or modify.

---

# License

This repository contains proprietary software developed for **PT RIN Group Indonesia**.

Unless explicitly authorized, the source code, design system, brand assets, corporate content, and related materials may not be reproduced, redistributed, or used for commercial purposes.

---

## Built With

**Next.js · React · TypeScript · Tailwind CSS · Prisma · Neon PostgreSQL · Vercel · Vercel Blob · Google Analytics**
