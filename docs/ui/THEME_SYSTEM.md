# TNCC Theme System Specification (Light & Dark Mode)

## 1. Architecture Overview
The Tamil Nadu Creators Club (TNCC) web application features an application-wide, persistent Light and Dark theme system built for Next.js App Router and Tailwind CSS v4.

- **Default State**: **Light Mode** for all first-time visitors.
- **Persistence**: `localStorage.getItem('tncc_theme')` with automatic fallback to `'light'`.
- **Zero-Flash Strategy**: An inline blocking script injected into `<head>` inside `app/layout.tsx` inspects `localStorage` and synchronously applies the `.dark` class to `document.documentElement` before hydration, preventing theme flickering (FOUC).
- **Tailwind v4 Integration**: Uses `@custom-variant dark (&:where(.dark, .dark *));` declared in `app/globals.css`.

---

## 2. Color Palette & Token Mapping

| Token Name | Light Theme Value | Dark Theme Value | Usage Description |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `#F8F6F1` / `#FAF8F5` | `#101318` | Application page background |
| **Secondary Background** | `#F0ECE1` | `#171C24` | Sidebar, navigation, and modal headers |
| **Card Surface** | `#FFFFFF` | `#1D2430` | Content cards, composers, modals, dropdowns |
| **Primary Text** | `#0D2C5B` (TNCC Navy) | `#F5F7FA` | Primary headings, titles, active labels |
| **Body / Secondary Text**| `#4A5568` | `#A8B0BC` | Paragraphs, meta text, captions |
| **Border & Divider** | `#E2E8F0` / `gray-200` | `#303846` | Card borders, list dividers, outline rings |
| **Brand Accent 1** | `#E84020` (TNCC Orange)| `#E84020` | Action buttons, submit CTA, notifications |
| **Brand Accent 2** | `#00B5C8` (TNCC Cyan) | `#00B5C8` | Active tab highlights, XP badges, links |
| **Brand Accent 3** | `#F5A623` (TNCC Gold) | `#F5A623` | Podium medal highlights, verified stars |

> **Note on Brand Identity:** The TNCC logo and brand typography remain color-faithful across both modes.

---

## 3. Component Architecture

### A. `components/theme/ThemeProvider.tsx`
- Exposes `ThemeContext` via `useTheme()`.
- State: `theme: 'light' | 'dark'`.
- Methods:
  - `toggleTheme()`: Toggles between `'light'` and `'dark'`, syncs DOM `.dark` class, and persists to `localStorage`.
  - `setTheme(mode)`: Sets specific theme.
  - `isDark`: Boolean convenience helper.

### B. `components/theme/ThemeToggle.tsx`
- Sun / Moon button with rotation micro-animations.
- Accessible: Includes `aria-label`, title tooltip, and keyboard focus states.
- Reusable across headers, navigation menus, and profile panels.

### C. Toggle Placement
1. `tncc-community/components/layout/CommunityNavbar.tsx` (Community header bar).
2. Profile Menu Dropdown (Community user settings).
3. `components/layout/Navbar.tsx` (Public landing page desktop & mobile action bar).
4. `components/layout/MobileMenu.tsx` (Mobile slide-out drawer).
5. `app/community/auth/page.tsx` (Authentication & registration screens).
