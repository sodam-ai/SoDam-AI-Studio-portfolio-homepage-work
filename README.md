<p align="center">
  <h1 align="center">SoDam AI Studio</h1>
  <p align="center">
    AI-Powered Creative Portfolio — Built entirely through Vibe Coding
    <br />
    <a href="#features"><strong>Features »</strong></a> · <a href="#getting-started"><strong>Getting Started »</strong></a> · <a href="README.ko.md"><strong>한국어 README »</strong></a>
  </p>
</p>

---

## Overview

**SoDam AI Studio** is a premium personal portfolio website showcasing AI-driven creative work across image synthesis, video production, and vibe coding. The entire project was designed and built through **AI agent orchestration** — coordinating multiple AI coding assistants (Gemini, Claude, Codex) via natural language instructions, without writing code manually.

## Tech Stack

| Category               | Technology                       |
| ---------------------- | -------------------------------- |
| **Framework**          | Next.js 15.1.0 (App Router)      |
| **Language**           | TypeScript 5                     |
| **Styling**            | Tailwind CSS 4.2.0               |
| **Animation**          | Framer Motion 11                 |
| **Form Handling**      | React Hook Form + Zod validation |
| **Icons**              | Lucide React                     |
| **Image Optimization** | Next.js Image + Sharp            |
| **Sanitization**       | DOMPurify                        |
| **Package Manager**    | pnpm                             |

## Features

- 🎨 **Premium Dark Theme** — Cinematic UI with gradient accents and glassmorphism effects
- ✨ **Smooth Animations** — Page transitions and micro-interactions powered by Framer Motion
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile viewports
- 🖼️ **Dynamic Project Showcase** — Category filtering with interactive project cards
- 🤖 **AI Interactive Terminal** — Embedded AI assistant experience
- 🔧 **Admin Panel** — Full CMS for managing projects, settings, and contact info
- 🛡️ **Input Validation** — Zod schemas + DOMPurify sanitization
- 🖥️ **SEO Optimized** — Semantic HTML, meta tags, and structured data

## Pages

| Page        | Route      | Description                                          |
| ----------- | ---------- | ---------------------------------------------------- |
| **Home**    | `/`        | Hero section, project showcase, philosophy           |
| **Work**    | `/work`    | Project archive with category filters                |
| **About**   | `/about`   | Creator introduction and career timeline             |
| **Contact** | `/contact` | Contact methods (email, KakaoTalk, Instagram, phone) |
| **Admin**   | `/admin`   | Content management panel                             |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── admin/              # Admin panel
│   ├── api/                # API routes (projects, settings, contact)
│   ├── contact/            # Contact page
│   ├── work/               # Work archive + project detail pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles + Tailwind
├── components/
│   ├── features/           # Feature-specific components (admin forms)
│   ├── sections/           # Page section components (Hero, Showcase, etc.)
│   ├── shared/             # Shared/reusable components
│   └── ui/                 # Base UI primitives
├── content/                # JSON data files (projects, contact, settings)
├── data/                   # Static data constants
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

## Getting Started

### Prerequisites

- **Node.js** 18.17 or higher
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/personal-portfolio.git
cd personal-portfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The dev server will start at **http://localhost:3000**.

### Build for Production

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start
```

## Environment Setup

Create a `.env.local` file in the root directory if needed:

```env
# Add environment variables here as needed
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Admin Panel

Access the admin panel at `/admin` to manage:

- **Projects** — Add, edit, reorder portfolio projects
- **Settings** — Site configuration, SEO, branding
- **Contact** — Contact information and social links

## Built With Vibe Coding

This project demonstrates the future of software development — **Vibe Coding**. Every line of code was generated through natural language instructions using AI agent orchestration:

- **Gemini (Antigravity)** — Main orchestrator, architecture design, primary development
- **Claude Code** — Code generation, automation tasks
- **Codex (ChatGPT)** — Code review, refactoring assistance

## License

This project is for personal portfolio use.

---

<p align="center">
  <sub>Built with ❤️ and AI · SoDam AI Studio</sub>
</p>
