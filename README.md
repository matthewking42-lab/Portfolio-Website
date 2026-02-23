# Matthew King — Portfolio Website

Full-stack portfolio website for Matthew King, Civil & Structural Design Engineer at AmcoGiffen.

**Tech stack:** Next.js 14 (App Router) · SQLite + Prisma · Leaflet.js (react-leaflet) · Tailwind CSS

## Prerequisites

Install **Node.js 18+** from https://nodejs.org before running any commands.

## Setup (first time)

```bash
# 1. Install dependencies
npm install

# 2. Create the database and push schema
npx prisma db push

# 3. Seed with all 12 projects
npm run db:seed

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000

## Pages

| Route | Description |
|---|---|
| `/` | Hero page with animated SVG lines and stat cards |
| `/about` | Bio, skills, career timeline |
| `/projects` | Full-page Leaflet map with sector filters |
| `/projects/[id]` | Blueprint technical sheet for each project |
| `/contact` | LinkedIn link + contact form |
| `/admin/login` | Password: `mkeng2024` |
| `/admin` | Dashboard — toggle published, add/edit/delete |
| `/admin/projects/new` | Add a project with click-to-place map pin |
| `/admin/projects/[id]/edit` | Edit an existing project |

## Scripts

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npx prisma studio    # Open Prisma Studio (visual DB browser)
npm run db:seed      # Re-seed the database
```

## PDF uploads

PDFs are stored in `/public/uploads/`. They are served at `/uploads/<filename>`.
Upload via the admin project form.

## Environment

`.env` file (already created):
```
DATABASE_URL="file:./dev.db"
```
"# Portfolio-Website" 
