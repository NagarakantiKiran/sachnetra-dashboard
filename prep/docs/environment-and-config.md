# Environment and Configuration

## Environment Variables

The app requires one environment variable:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_PUBLIC_URL` | Yes | Full PostgreSQL connection string to the Railway database |

### Format
```
DATABASE_PUBLIC_URL=postgresql://username:password@host:port/dbname
```

### Where to Set It

| Environment | File / Location |
|------------|----------------|
| Local development | `.env.local` (in project root — gitignored) |
| Vercel production | Vercel project settings → Environment Variables |

### Important: Use the Public URL

Railway provides two URLs per database:
- **Internal URL** — only works from within Railway's network
- **Public URL** — works from any network (local, Vercel, etc.)

Always use the **Public URL** for `DATABASE_PUBLIC_URL`.

---

## Configuration Files

### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```
Empty — uses all Next.js 14 defaults. No custom webpack config, no environment variable exposure, no image domains.

---

### jsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
Enables the `@/` import alias. `@/lib/db` resolves to `<project-root>/lib/db.js`.

---

### tailwind.config.js
```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
}
```
- Scans `app/` and `components/` for class names (tree-shaking unused styles)
- Dark mode enabled via CSS class (always-dark, no toggle)
- No theme customization — uses Tailwind's default design tokens

---

### postcss.config.js
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
Standard PostCSS config. Tailwind generates CSS; Autoprefixer adds vendor prefixes.

---

### .env.example
```
DATABASE_PUBLIC_URL=postgresql://user:password@host:port/dbname
```
Template file committed to the repo. Copy to `.env.local` and fill in the real credentials.

---

## Local Development Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd sachnetra-dashboard

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and set DATABASE_PUBLIC_URL to your Railway Public URL

# 4. Start the dev server
npm run dev
# App available at http://localhost:3000
```

### npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start development server with hot reload |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server (after build) |
| `lint` | `next lint` | Run ESLint |
