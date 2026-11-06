# TNCC Mobile UI & Responsive Engineering Guidelines

## 1. Core Principles
1. **Zero Text Clipping:** No label, button text, or headline should truncate unless deliberately styled with a viewable tooltip or expander (such as Instagram-style `... more`).
2. **Predictable Viewport Constraints:** All flex and grid child elements containing text must carry `min-w-0` to allow browser text calculation without triggering horizontal layout overflow.
3. **Safe Touch Targets:** Mobile interactive elements must satisfy minimum touch target guidelines (36px–44px height) while maintaining compact visual padding.
4. **Touch-Smooth Scrolling:** Horizontal scroll areas (such as category tabs, presets, and medals) must use `.no-scrollbar` to suppress default browser scrollbars and maintain clean aesthetics.

---

## 2. Standard Sizing Scale

### Buttons & Interactive Controls

| Element Type | Desktop Height | Mobile Height | Font Size | Horizontal Padding |
| :--- | :--- | :--- | :--- | :--- |
| **Primary CTA Button** | 42px – 44px | 36px – 38px | 13px – 14px | `px-4 sm:px-5` |
| **Secondary / Compact Button** | 36px | 32px – 34px | 12px | `px-3 sm:px-3.5` |
| **Icon-Only Action Button** | 36px × 36px | 34px × 34px | – | `p-1.5` – `p-2` |
| **Form Input Fields** | 44px | 38px – 40px | 13px – 14px | `px-3.5 py-2.5` |

### Responsive Typography Scale

| Typographic Role | Desktop Size & Leading | Mobile Size & Leading |
| :--- | :--- | :--- |
| **Page Title (H1)** | 28px – 32px / 36px | 22px – 24px / 28px |
| **Section Title (H2)** | 20px – 24px / 28px | 18px – 20px / 24px |
| **Card Heading (H3)** | 16px / 22px | 14px – 15px / 20px |
| **Body Copy** | 14px / 22px | 13px / 19px |
| **Caption & Meta** | 12px / 16px | 11px / 15px |
| **Badges & Micro-tags** | 11px / 14px | 10px / 13px |

---

## 3. Responsive Navigation Pattern

- **Desktop (>= 1024px):** Fixed left sidebar (`w-64`) with icon + text navigation items.
- **Tablet (768px – 1023px):** Compact sidebar or top navigation.
- **Mobile (< 768px):** Bottom navigation dock with 5 primary destinations (`Feed`, `Resources`, `Create Post`, `Challenges`, `Profile`).
  - Active tab highlighted in TNCC Brand Orange (`#E84020`) or Cyan (`#00B5C8`).
  - Center floating action button triggers Quick Post Composer.
  - Accommodates iOS and Android home bars via `env(safe-area-inset-bottom)`.
