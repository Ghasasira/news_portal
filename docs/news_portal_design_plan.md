# News Portal — Comprehensive UI/UX Design & Architecture Plan

This document synthesizes key design patterns and functional layouts extracted from the reference inspirations (GoRead, Newsora, The Irish Times redesign concept, USA Today redesign, and the NewsDaily structural template) into a concrete, implementation-ready design system.

---

## 1. Executive Summary & Core Design Philosophy

* **Information Density with Breathing Room:** High-density content (e.g., live tickers, scoreboards, ordered lists) balanced with generous whitespace and clear section demarcations.
* **Mobile-First & Fully Responsive:** Clean sheet transitions and card layouts on mobile (*GoRead / Newsora*), expanding into multi-column editorial grids on desktop (*USA Today / The Irish Times*).
* **High-Trust Editorial Aesthetics:** Clean typographic hierarchy, subtle category badging, high-contrast headline styling, and distinct metadata (author avatars, publication timestamps, read times).
* **Multimedia & Real-Time Ready:** Dedicated modules for live video/streams, breaking news tickers, live sports scores, and newsletter signups.

---

## 2. Visual Identity & Design System

### 2.1 Color Palette

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `primary-accent` | `#0066FF` / `#1D70B8` | Primary CTA buttons, category chips, active tab indicator, badges |
| `alert-breaking` | `#E11D48` / `#EF4444` | "Breaking News" tag, live pill indicator, urgent notifications |
| `bg-primary` | `#FFFFFF` | Page canvas, main article surface |
| `bg-secondary` | `#F8FAFC` | Section backdrops, card surfaces, search bar containers |
| `bg-dark-accent` | `#0B0F19` | Top banner ribbons, hero dark-card overlays, dark-mode footer |
| `text-primary` | `#0F172A` | Headlines, primary card titles (high contrast) |
| `text-secondary` | `#475569` | Excerpts, summaries, lead paragraphs |
| `text-muted` | `#94A3B8` | Timestamps, read time, view counts, bylines |
| `border-subtle` | `#E2E8F0` | Dividers, card strokes, header bottom border |

### 2.2 Typography Scale

* **Headlines & Editorial Titles:**
  * Modern Serif option (*The Irish Times style*): `Playfair Display`, `Merriweather`, or `Lora`
  * Modern Sans option (*USA Today / NewsDaily style*): `Plus Jakarta Sans`, `Inter`, or `Outfit`
* **Body & UI Elements:**
  * Primary Sans: `Inter` or `Plus Jakarta Sans` (14px–16px, line height 1.6)
* **Metadata & Badges:**
  * Uppercase / Semi-bold (11px–12px, tracking wide)

---

## 3. Global Layout & Structural Blueprint

```
+-----------------------------------------------------------------------------------+
| Top Bar: Date | Weather Widget | Trending Bar / Ticker | Socials | Auth / Subscribe|
+-----------------------------------------------------------------------------------+
| Primary Header: Logo | Global Search (with filters) | Profile / Notifications     |
+-----------------------------------------------------------------------------------+
| Sticky Category Navigation: Home | World | Tech | Sports | Opinion | Video | ...  |
+-----------------------------------------------------------------------------------+
| Breaking News Banner: [BREAKING] Dynamic ticker / slide transition               |
+-----------------------------------------------------------------------------------+
| DESKTOP HERO GRID (2:1 or 3:1 Split)                                              |
| +-----------------------------------------------+ +-------------------------------+|
| | Featured Lead Story (Large Visual Hero)      | | "Trending Now" / Top 5 List   | |
| | - Category badge                              | | 1. Story title + micro-thumb  | |
| | - Bold multi-line headline                    | | 2. Story title + micro-thumb  | |
| | - Excerpt + CTA ("Read Full Story")          | | 3. Story title + micro-thumb  | |
| +-----------------------------------------------+ +-------------------------------+|
+-----------------------------------------------------------------------------------+
| SECONDARY CONTENT SECTION (Dynamic Grids & Feeds)                                 |
| +-------------------------------------+ +-----------------------------------------+|
| | Category / Topic Grid (4 Columns)  | | Live Widget: Scores / Stock Watch       ||
| +-------------------------------------+ +-----------------------------------------+|
| | Two-Column Editorial:               | | Sidebar:                                ||
| | - "Latest News" List Feed           | | - Most Read / Subscribers Only          ||
| | - "Editor's Pick" Large Card        | | - Sport Videos / Multimedia Reel        ||
| +-------------------------------------+ +-----------------------------------------+|
+-----------------------------------------------------------------------------------+
| Multimedia / Video Carousel (Dark container with play buttons & runtimes)          |
+-----------------------------------------------------------------------------------+
| Newsletter / Subscription Hook (Full-width clean card with inline email input)   |
+-----------------------------------------------------------------------------------+
| Multi-column Footer: Directory links, App Store badges, legal, copyright          |
+-----------------------------------------------------------------------------------+
```

---

## 4. Key Component Specifications

### 4.1 Header & Utility Bar
* **Top Utility Bar:** Display current date, local weather status, social media links, and a direct "Subscribe" button with high-contrast promotion.
* **Main Header:** Minimal brand wordmark alongside an expanded search bar with category pills (*inspired by GoRead's Discover screen*).
* **Navigation Bar:** Horizontal scrollable category ribbon on tablet/mobile; sticky horizontal bar with dropdowns on desktop.

### 4.2 Hero Section & Breaking News Alert
* **Breaking News Strip:** Red tag `[BREAKING]` with auto-advancing text and an optional carousel toggle.
* **Lead Story Card:** Edge-to-edge photography with gradient scrim overlay, floating category tag, timestamp, and read time.
* **Trending / Top 5 Widget:** High-impact ranked list (`01`, `02`, `03` bold typography) paired with compact 64x64px thumbnails and category tags (*inspired by NewsDaily & Newsora*).

### 4.3 Content Cards & List Items
* **Standard Editorial Card:** 
  * Aspect ratio 16:9 thumbnail
  * Category badge above or overlapping image
  * 2-line clamped headline (semi-bold)
  * Metadata footer: author avatar, name, and publication time
* **Compact Horizontal Feed Item:** Left thumbnail (80x80px with rounded corners `12px`), right-aligned headline, source badge (e.g., CNN Indonesia, Reuters), and relative time (`2 hours ago`).

### 4.4 Multimedia & Video Hub
* Dedicated dark-mode card or full-bleed ribbon (*as seen in USA Today*):
  * Primary 16:9 featured stream with live badge (`LIVE Now • 12K watching`) and floating play button
  * Side playlist showing upcoming clips with durations (`▶ 1:24`, `▶ 2:08`)

### 4.5 Sports / Live Data Add-on (*Optional Toggle*)
* Top scoreboard ticker: Horizontal scrolling match cards with club crests, match status, and scores (`13:00`, `Arsenal vs Chelsea`).

---

## 5. Mobile App / Responsive Strategy (GoRead & Newsora Influence)

* **Bottom Navigation Bar (Mobile):** 
  * 4 tabs: `Home`, `Discover / Categories`, `Bookmarks / Saved`, `Profile`.
* **Discover Screen:**
  * Prominent search field with filter drawer toggle.
  * Horizontally scrolling pill filters (`All`, `Politics`, `Sports`, `Tech`, `Health`).
  * Staggered or card-based vertical infinite scroll.
* **Article Reader View (*The Irish Times & GoRead style*):**
  * Full-bleed cover photo with back navigation and bookmark action on top.
  * Clean bottom sheet containing publisher verification badge, author info, publication date, and uncluttered serif or clean sans body copy.
  * Floating action bar for text-resizing, font-switching, audio narration (TTS), and social sharing.

---

## 6. Recommended Tech Stack

| Layer | Recommended Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) or Nuxt 3 | Essential for SEO, Server-Side Rendering (SSR), and fast page loads |
| **Styling** | Tailwind CSS + Shadcn UI | Quick implementation of design tokens, rounded badges, cards, and drawers |
| **State & Fetching** | TanStack Query (React Query) | Ideal for live scoreboards, trending news updates, and caching |
| **Headless CMS** | Strapi, Sanity, or Ghost | Flexible editorial workflows, rich text editors, and image CDNs |
| **Search Engine** | Algolia or Meilisearch | Instant search with category filtering and autocomplete |

---

## 7. Implementation Roadmap

1. **Phase 1: Design System & Tokens:** Finalize typography, spacing scale, badge components, and responsive grid rules.
2. **Phase 2: Homepage Layouts:** Build desktop 3-column grid and mobile single-column stacked view.
3. **Phase 3: Search & Discovery:** Implement category filters, pill-tag navigations, and search result list views.
4. **Phase 4: Article Detail Page:** Optimize reading experience (typography scale, related stories rail, social sharing).
5. **Phase 5: Real-Time & Live Features:** Integrate breaking news alerts, multimedia carousel, and newsletter triggers.