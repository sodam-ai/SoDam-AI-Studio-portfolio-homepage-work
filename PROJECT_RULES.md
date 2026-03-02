# PROJECT_RULES.md

## 📌 Project Overview

- **Project Name**: Personal Portfolio & Branding Site
- **Branding Style**: Black & White (Simple, Modern)
- **Primary Content**: AI-generated Images, Videos, and Development Portfolio
- **Target Platforms**: Mobile, Web, Desktop (Responsive)

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS v4
- **State Management**: React Context / Hooks
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Management**: JSON based content management (`content/`)

## 🎨 Design Guidelines (B&W Style)

- **Colors**:
  - Primary: `#000000` (Black)
  - Background: `#FFFFFF` (White)
  - Accents: Grayscale (`#F3F4F6`, `#9CA3AF`, `#374151`)
- **Typography**: Responsive, Modern Sans-serif (Inter/Outfit)
- **Spacing**: Minimalist, ample white space

## 📁 Directory Structure

```
root/
├── app/                # Next.js App Router
├── components/         # Reusable UI components
│   ├── ui/             # Atomic components (Buttons, etc.)
│   ├── sections/       # Page sections (Hero, Portfolio, etc.)
│   └── shared/         # Layout components
├── content/            # JSON/Markdown data for easy updates
│   ├── projects.json
│   └── site-config.json
├── public/             # Static assets (AI Images, Videos)
│   ├── images/
│   └── videos/
└── lib/                # Utilities and custom hooks
```

## 📜 Development Rules

- **Naming**: `camelCase` for variables/functions, `PascalCase` for components.
- **Completeness**: No `TODO` or `any` in production code.
- **Security**: Never hardcode API keys. Use `.env`.
- **Modularity**: Keep components small and focused.
- **Responsive-First**: Always check mobile view first.
- **Data-Driven**: Content should be manageable via `content/` folder without touching logic.

## 🚀 Deployment & Future Proofing

- Optimized for **Vercel** deployment.
- Clean separation of data and logic for easy migration/renaming.
