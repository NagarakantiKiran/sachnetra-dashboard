# Styling

## Approach

The app uses **Tailwind CSS** utility classes for all styling. There is no CSS-in-JS or component library. The only custom CSS is in [app/globals.css](../../app/globals.css), which defines the `.card` base class.

---

## Color Palette

The UI uses a dark theme throughout. All colors come from Tailwind's default palette.

### Backgrounds
| Usage | Tailwind Class | Hex Approx |
|-------|---------------|-----------|
| Page background | `bg-zinc-950` | `#09090b` |
| Card background | `bg-zinc-900` | `#18181b` |
| Hover rows | `bg-zinc-800` | `#27272a` |
| Input fields | `bg-zinc-800` | `#27272a` |

### Text
| Usage | Tailwind Class | Hex Approx |
|-------|---------------|-----------|
| Primary text | `text-zinc-100` | `#f4f4f5` |
| Secondary / muted | `text-zinc-400` | `#a1a1aa` |
| Disabled / labels | `text-zinc-600` | `#52525b` |

### Semantic Colors
| Meaning | Color | Tailwind Examples |
|---------|-------|-----------------|
| Positive / bullish | Emerald | `text-emerald-400`, `bg-emerald-500`, `border-emerald-500` |
| Negative / bearish | Red | `text-red-400`, `bg-red-500`, `border-red-500` |
| Neutral | Gray | `text-zinc-400`, `bg-zinc-600` |
| Primary / info | Sky | `text-sky-400`, `bg-sky-500` |
| Warning / market-moving | Yellow/Amber | `text-yellow-400`, `bg-yellow-500` |
| Threat high | Red | `text-red-400` |
| Threat medium | Yellow | `text-yellow-400` |
| Threat low | Blue | `text-blue-400` |
| Threat info | Gray | `text-zinc-400` |

---

## The `.card` Class

Defined in `globals.css`. Applied to every widget container.

```css
.card {
  background: rgba(24, 24, 27, 0.8);   /* zinc-900 at 80% opacity */
  backdrop-filter: blur(8px);           /* frosted glass effect */
  border: 1px solid rgba(63, 63, 70, 0.5); /* zinc-700 at 50% opacity */
  border-radius: 0.75rem;              /* rounded-xl */
}
```

This gives all cards a consistent frosted-glass appearance against the dark background.

---

## Layout

The page uses CSS Grid via Tailwind:

| Section | Grid | Breakpoint |
|---------|------|-----------|
| Overview cards | 4 columns | `grid-cols-4` (collapses on mobile) |
| Charts row | 2 columns equal | `grid-cols-2` |
| Bottom section | 4 columns (1 + 3) | `grid-cols-4` — TopTickers takes 1, NewsTable takes 3 |

---

## Typography

- **Font:** System font stack (Tailwind default — no custom font imported)
- **Monospace:** `font-mono` used on numeric/data values to align digits in tables and badges
- **Sizes:** Tailwind scale (`text-xs`, `text-sm`, `text-base`, etc.)

---

## Interactive States

| State | Styling |
|-------|---------|
| Button hover | `hover:bg-zinc-700` or `hover:bg-sky-600` |
| Row hover | `hover:bg-zinc-800` |
| Active/selected range button | `bg-sky-600 text-white` vs default `bg-zinc-800 text-zinc-400` |
| Focus | Default browser focus ring (no custom focus style defined) |
| Loading skeleton | `animate-pulse bg-zinc-800 rounded` |

---

## Transitions

- Slide-over detail panel uses CSS `transform: translateX()` with `transition-transform duration-300`
- Button state changes use `transition-colors`

---

## Dark Mode

Tailwind `darkMode: 'class'` is configured, but the app does not implement a light/dark toggle — the dark class is always applied via the root `<html>` element in `layout.jsx`. The entire UI is dark-only.
