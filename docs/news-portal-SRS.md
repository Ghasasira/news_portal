# Software Requirements Specification (SRS)
## News Portal with Editorial CMS, SEO, AEO & GEO

| Field | Value |
|---|---|
| **Document version** | 0.1 (Draft for review) |
| **Date** | 21 October 2026 |
| **Status** | Draft |
| **Stack** | Laravel (latest stable) + React Starter Kit (Inertia.js, SSR) |
| **Audience** | Product owner, editorial leadership, developers, QA, DevOps |

---

## Table of Contents

1. Introduction
2. Overall Description
3. System Architecture & Technology Stack
4. User Roles & Permissions
5. Functional Requirements
   - 5.1 Public Portal (Reader Experience)
   - 5.2 Content Taxonomy (Categories, Topics, Hashtags, Series)
   - 5.3 Content Management System (CMS)
   - 5.4 Editorial Workflow
   - 5.5 Media Library
   - 5.6 User & Access Management
   - 5.7 Audit, Compliance & Corrections
   - 5.8 Search
   - 5.9 SEO
   - 5.10 AI SEO, AEO & GEO
   - 5.11 Engagement (Newsletter, Push, Comments, Social)
   - 5.12 Advertising & Monetisation
   - 5.13 Analytics & Reporting
   - 5.14 Settings & Configuration
   - 5.15 Integrations & API
6. Data Model
7. Non-Functional Requirements
8. Security & Privacy
9. Deployment, DevOps & Observability
10. Testing & Acceptance
11. Release Plan (Phasing)
12. Assumptions, Risks & Open Questions
- Appendix A: URL & Routing Structure
- Appendix B: Structured Data Examples (JSON-LD)
- Appendix C: `robots.txt` & `llms.txt` Samples
- Appendix D: Permission Matrix
- Appendix E: Glossary

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for a modern **News Portal** built on **Laravel** with the **React Starter Kit (Inertia.js)**. It covers the public reader-facing site, a role-based editorial **CMS**, a complete **SEO** foundation, and forward-looking **AI SEO / AEO / GEO** capabilities so content is discoverable in classic search, answer engines and generative AI assistants.

### 1.2 Scope
The system will:
- Publish, organise and distribute news content (articles, videos, galleries, live blogs, opinion, explainers).
- Provide a CMS for multiple user roles (author, editor, auditor, system admin, etc.) with a controlled editorial workflow.
- Organise content via **categories**, **topics**, **hashtags (tags)**, **series** and **authors**.
- Maximise discoverability via technical SEO, structured data, and optimisation for answer/generative engines.
- Support newsletters, push notifications, search, analytics and monetisation.

Out of scope for v1 (see §12): native mobile apps, paywall/subscription billing, full video streaming infrastructure (embeds/CDN-hosted video only), and user-generated content publishing.

### 1.3 Definitions
See Appendix E. Key terms: **SEO**, **AEO** (Answer Engine Optimization), **GEO** (Generative Engine Optimization), **CMS**, **SSR**, **JSON-LD**, **E-E-A-T**.

### 1.4 References
- Laravel documentation; Laravel React Starter Kit (Inertia) documentation
- Schema.org `NewsArticle`, `Article`, `Person`, `Organization`, `FAQPage`, `VideoObject`, `LiveBlogPosting`, `BreadcrumbList`
- Google Search Central: News, Discover, Top Stories, Structured Data, Core Web Vitals guidance
- Google News Sitemap protocol; IPTC photo metadata standards
- `llms.txt` community specification

### 1.5 Requirement Conventions
- **MUST / SHALL** – mandatory; **SHOULD** – strongly recommended; **MAY** – optional.
- IDs follow `<Area>-<Number>` (e.g. `CMS-012`). Priority: **P0** (launch-blocking), **P1** (launch target), **P2** (post-launch).

---

## 2. Overall Description

### 2.1 Product Perspective
A standalone, multi-role web platform. Public pages are server-side rendered for speed and crawlability; the CMS is an authenticated area of the same application (separate route group and layout) sharing the same domain model.

### 2.2 Product Goals
1. Fast, reliable, highly crawlable news delivery.
2. An editorial workflow that enforces quality, accountability and traceability.
3. Strong organic discovery (search, Google News/Discover, AI answer engines).
4. A flexible taxonomy that supports breaking news, evergreen content and topic hubs.
5. Maintainable, testable codebase using conventional Laravel structure.

### 2.3 User Classes
| Class | Description |
|---|---|
| **Reader (anonymous)** | Browses, searches, shares content. |
| **Registered reader** | Optional account: saved articles, followed topics/authors, newsletter preferences, comments. |
| **Contributor / Author** | Writes and submits articles. |
| **Editor** | Reviews, edits, approves, schedules and publishes. |
| **Section / Chief Editor** | Owns a category desk or the whole newsroom; homepage curation. |
| **SEO Specialist** | Manages SEO metadata, redirects, structured data, AEO/GEO tooling. |
| **Auditor** | Read-only access to content, revisions, logs and compliance reports. |
| **Moderator** | Moderates comments and reports. |
| **Advertising Manager** | Manages ad placements and sponsored content labels. |
| **System Administrator** | Manages users, roles, settings, integrations, system health. |

### 2.4 Operating Environment
- Linux server(s) / containers, PHP 8.3+, MySQL 8 / MariaDB 10.6+ or PostgreSQL 15+, Redis, Node.js (for SSR), object storage (S3-compatible) + CDN.
- Modern evergreen browsers (last 2 versions of Chrome, Edge, Firefox, Safari; iOS Safari, Android Chrome).

### 2.5 Constraints
- Laravel + React Starter Kit with Inertia.js is mandated.
- **Inertia SSR MUST be enabled** for all public pages (SEO-critical).
- Content must be fully readable and indexable without client-side JavaScript execution for the core article body.

---

## 3. System Architecture & Technology Stack

### 3.1 Logical Architecture
```
Browser / Crawler / AI Bot
        │
     CDN / WAF (cache, TLS, bot rules)
        │
   Nginx / Octane (optional)
        │
 Laravel Application
   ├─ Inertia SSR (Node) ── renders React pages to HTML
   ├─ Public module (routes, controllers, Inertia pages)
   ├─ CMS module (authenticated, RBAC)
   ├─ SEO/GEO module (meta, schema, sitemaps, feeds, llms.txt)
   ├─ Search module (Scout → Meilisearch/Typesense)
   ├─ Queue workers (Horizon): publishing, images, notifications, indexing pings
   ├─ Scheduler: scheduled publish, sitemap, reports
   └─ Domain events → listeners (cache purge, search index, notifications)
        │
 MySQL/PostgreSQL · Redis (cache/queue/session) · S3 storage · Search engine
```

### 3.2 Recommended Technology Choices
| Concern | Choice |
|---|---|
| Backend | Laravel (latest stable), PHP 8.3+ |
| Frontend | React + TypeScript via Laravel React Starter Kit, Inertia.js, Vite |
| UI | Tailwind CSS + shadcn/ui (as shipped with the starter kit) |
| SSR | Inertia SSR (Node process managed by Supervisor/systemd/container) |
| Auth | Laravel Fortify / starter-kit auth (email+password, 2FA, email verification) |
| RBAC | `spatie/laravel-permission` (roles + granular permissions) |
| Audit trail | `spatie/laravel-activitylog` |
| Rich text editor | TipTap (ProseMirror-based) with custom news blocks |
| Media | `spatie/laravel-medialibrary` + image conversions (WebP/AVIF), S3 + CDN |
| Search | Laravel Scout with Meilisearch or Typesense |
| Queues | Redis + Laravel Horizon |
| Cache | Redis; full-page/edge caching for anonymous traffic |
| Slugs/translations | `spatie/laravel-sluggable`; optional `spatie/laravel-translatable` |
| Sitemaps | `spatie/laravel-sitemap` (extended with News sitemap) |
| Realtime (live blog) | Laravel Reverb (WebSockets) or polling fallback |
| Testing | Pest, Laravel Dusk/Playwright, Larastan, Pint |

> The above are recommendations; equivalent libraries may be substituted if they meet the requirements.

### 3.3 Code Organisation
Conventional Laravel layout with domain-oriented grouping (e.g. `app/Domain/Content`, `Taxonomy`, `Editorial`, `Seo`, `Media`, `Users`) using Actions/Services, Form Requests, Policies, Events/Listeners, API Resources and DTOs. Public and CMS Inertia pages are separated under `resources/js/pages/public` and `resources/js/pages/cms`.

---

## 4. User Roles & Permissions

### 4.1 Principles
- **RBAC with granular permissions**: roles are bundles of permissions; permissions are checked via Laravel Policies/Gates.
- **Least privilege** by default; admins may create custom roles.
- **Category/desk scoping**: roles may be scoped to specific categories (e.g. a Sports editor can only publish in Sports).
- **Ownership rules**: authors can edit only their own content unless granted broader permission.

### 4.2 Default Roles
| Role | Summary of Capability |
|---|---|
| **Super Admin / System Admin** | Full access, including users, roles, settings, integrations, system tools. |
| **Chief Editor** | All editorial actions across all categories; homepage and breaking news control; can publish/unpublish anything. |
| **Section Editor** | Review, edit, approve, publish within assigned categories; assign stories to authors. |
| **Author (Staff Journalist)** | Create/edit own drafts; submit for review; edit own content until locked. |
| **Contributor (Freelance)** | Create drafts only; cannot self-publish; limited media access. |
| **Sub-editor / Copy Editor** | Edit text, fact-check status, headline/SEO fixes; cannot publish. |
| **SEO Specialist** | Edit SEO/AEO/GEO fields, redirects, schema, sitemaps; no body-text publishing. |
| **Auditor** | Read-only access to all content states, revisions, logs, exports, compliance dashboards. |
| **Moderator** | Review/approve/remove comments; handle reports; ban/mute users. |
| **Ad Manager** | Manage ad slots, campaigns, sponsored labelling. |
| **Media Manager** | Manage media library, licenses, captions, rights metadata. |
| **Registered Reader** | Public-site account features only; no CMS access. |

The full permission matrix is in **Appendix D**.

### 4.3 Requirements
- **RBAC-001 (P0)** The system SHALL support creating, editing and deleting custom roles with arbitrary permission sets.
- **RBAC-002 (P0)** The system SHALL support assigning multiple roles to a user.
- **RBAC-003 (P0)** The system SHALL support scoping roles/permissions to one or more categories.
- **RBAC-004 (P0)** All CMS routes and actions SHALL be authorised server-side via Policies; UI hiding alone is insufficient.
- **RBAC-005 (P1)** The system SHOULD support temporary role grants with an expiry date (e.g. guest editor).
- **RBAC-006 (P1)** Role/permission changes SHALL be written to the audit log.
- **RBAC-007 (P0)** System-critical roles (Super Admin) SHALL be protected from accidental deletion/demotion of the last admin.

---

## 5. Functional Requirements

### 5.1 Public Portal (Reader Experience)

#### 5.1.1 Pages
| ID | Requirement | Pri |
|---|---|---|
| PUB-001 | **Homepage** with curated hero/lead story, top stories, breaking-news bar, latest by category, trending, most read, opinion, video/multimedia, newsletter sign-up. | P0 |
| PUB-002 | **Article page** with headline, standfirst/summary, byline(s), publish/updated timestamps, hero media, body, inline media, related stories, topic/hashtag chips, share buttons, author box, comments, next/previous in series. | P0 |
| PUB-003 | **Category page** (e.g. /politics) with featured stories, paginated list, subcategory navigation. | P0 |
| PUB-004 | **Topic hub page** (e.g. /topic/elections-2026) aggregating all related content with a topic description, timeline, key facts and FAQ. | P0 |
| PUB-005 | **Hashtag/Tag page** (e.g. /tag/kampala) with article list. | P0 |
| PUB-006 | **Author profile page** with bio, credentials, beat, social links, article list (E-E-A-T). | P0 |
| PUB-007 | **Series/Special report page** grouping multi-part coverage. | P1 |
| PUB-008 | **Search results page** with filters (date, category, topic, author, type). | P0 |
| PUB-009 | **Live blog page** with real-time updates and pinned posts. | P1 |
| PUB-010 | **Static pages**: About, Contact, Editorial policy, Ethics, Corrections policy, Privacy, Terms, Advertise, Careers. | P0 |
| PUB-011 | **Video and gallery pages**. | P1 |
| PUB-012 | **Archive pages** by date (/archive/2026/10/21). | P1 |
| PUB-013 | **404/410/500** pages with search and popular content suggestions. | P0 |
| PUB-014 | **Registered reader area**: saved articles, followed topics/authors/tags, newsletter preferences, profile. | P2 |

#### 5.1.2 Behaviour
- **PUB-020 (P0)** Public pages SHALL be server-side rendered (Inertia SSR) and deliver complete HTML including the article body, headings, meta tags and JSON-LD.
- **PUB-021 (P0)** Pagination SHALL use crawlable links (`?page=n` or `/page/n`) with `rel` hints where applicable; "load more" MAY be layered on top but not replace links.
- **PUB-022 (P0)** Breaking news banner SHALL be updatable by editors without a deploy and appear within 60 seconds site-wide.
- **PUB-023 (P1)** The portal SHOULD support dark mode and user text-size controls.
- **PUB-024 (P0)** Pages SHALL be responsive (mobile-first) and accessible (WCAG 2.2 AA).
- **PUB-025 (P1)** Related content SHALL be generated using shared topics/tags/category and recency, with an editor override.
- **PUB-026 (P1)** The portal SHOULD offer AMP-free fast mobile rendering (no AMP dependency required).
- **PUB-027 (P2)** The portal MAY support multiple languages with `hreflang` (see §5.14).

---

### 5.2 Content Taxonomy

A flexible, layered taxonomy is central to the portal. Each layer has a distinct purpose:

| Layer | Purpose | Structure | Example |
|---|---|---|---|
| **Category** | Primary editorial section/desk; drives navigation, URL structure, permissions | Hierarchical (parent → child), one *primary* + optional secondary | News → Politics → Parliament |
| **Topic** | Curated, evergreen/ongoing subject hub (entity or story-level) with its own landing page, description and SEO | Flat or light hierarchy; editorially managed | "2026 General Elections", "Climate Change", "Kampala Flood Response" |
| **Hashtag / Tag** | Lightweight, free-form labels for cross-cutting discovery and social | Flat, user/editor created, moderated & merge-able | #KampalaTraffic, #AFCON |
| **Series** | Ordered multi-part coverage/special report | Ordered list | "Inside the Oil Pipeline (Part 1–6)" |
| **Content type** | Format of content | Enumerated | News, Opinion, Analysis, Explainer, Fact-check, Interview, Live blog, Video, Gallery, Podcast, Press release, Sponsored |
| **Entity** (P2) | People, organisations, places linked via schema `about`/`mentions` | Entity registry | "Parliament of Uganda" |

#### Requirements
- **TAX-001 (P0)** Categories SHALL be hierarchical (min. 3 levels) with name, slug, description, colour/icon, SEO fields, ordering, visibility, and per-category RBAC scope.
- **TAX-002 (P0)** Every article SHALL have exactly **one primary category** and MAY have additional secondary categories. The primary category determines the canonical URL.
- **TAX-003 (P0)** **Topics** SHALL be a first-class entity with: title, slug, short description, long description (rich text), cover image, status (active/archived), parent topic (optional), related topics, pinned articles, SEO fields, FAQ block and optional timeline.
- **TAX-004 (P0)** Articles SHALL be attachable to multiple topics, with an editor-set "primary topic".
- **TAX-005 (P0)** **Hashtags/Tags** SHALL be creatable inline in the editor with autocomplete; new tags SHALL be normalised (lowercase slug, trimmed, Unicode-safe, no spaces) and de-duplicated.
- **TAX-006 (P1)** Editors with permission SHALL be able to **merge**, **rename** and **delete** tags; merging SHALL create 301 redirects and re-point articles.
- **TAX-007 (P1)** Tags with fewer than a configurable threshold of published articles (default 3) SHOULD be set to `noindex` automatically to avoid thin pages; threshold configurable.
- **TAX-008 (P1)** The system SHOULD suggest tags/topics/category from article text (keyword/entity extraction, optional AI assist) for editor confirmation.
- **TAX-009 (P0)** Tags/topics/categories SHALL have unique slugs; slug changes SHALL auto-create 301 redirects.
- **TAX-010 (P1)** **Series** SHALL support ordered parts, an intro text, cover image, and auto-rendered "Part x of n" navigation.
- **TAX-011 (P0)** A **Content type** SHALL determine the editor template, schema type and presentation.
- **TAX-012 (P1)** **Trending tags/topics** SHALL be computed from recent traffic and publication velocity and exposed in widgets.
- **TAX-013 (P2)** **Entities** (person/org/place) SHOULD be linkable from article text and mapped to schema `about` / `mentions` with `sameAs` (Wikipedia/Wikidata).
- **TAX-014 (P1)** Followable taxonomy: registered readers MAY follow topics, tags, authors and categories (feeds digests/notifications).

---

### 5.3 Content Management System (CMS)

#### 5.3.1 Dashboard
- **CMS-001 (P0)** Role-aware dashboard: my drafts, awaiting review, scheduled, recently published, assigned stories, alerts, and quick stats.
- **CMS-002 (P1)** Editors see newsroom-wide queue with filters (status, category, author, deadline, priority).

#### 5.3.2 Article Editor
- **CMS-010 (P0)** Block-based rich-text editor supporting: headings (H2–H4), paragraphs, lists, quotes/pull-quotes, tables, links (with `nofollow/sponsored/ugc` options), images, galleries, video/audio embeds, social embeds (X, Instagram, YouTube, Facebook, TikTok), code/HTML-safe embeds, horizontal rules, "Key points" box, "Related article" card, FAQ block, timeline block, fact box, infographic/chart embed.
- **CMS-011 (P0)** Fields: headline, alternate/SEO headline, social headline, standfirst/summary, body, slug, byline(s) (multiple authors + contributors), primary category, secondary categories, topics, hashtags, series, content type, hero media, location/dateline, source/credit, language, publish time, reading time (auto), flags (breaking, featured, sponsored, opinion, exclusive, developing).
- **CMS-012 (P0)** **Autosave** every ≤ 15 seconds and on blur; recoverable local draft on connection loss.
- **CMS-013 (P0)** **Revision history** with diff view and restore; every save creates a revision (retained per policy).
- **CMS-014 (P0)** **Concurrent edit protection**: soft lock with presenter indicator ("Jane is editing"), with admin override; conflict detection on save.
- **CMS-015 (P1)** Inline **comments/notes** for internal editorial discussion (not public), @mentions.
- **CMS-016 (P0)** **Preview** (desktop/mobile) using the real public template and a signed, expiring preview URL shareable with non-CMS users.
- **CMS-017 (P1)** Word count, readability score, headline length indicator, missing alt-text and missing SEO field warnings.
- **CMS-018 (P1)** Paste from Word/Google Docs with cleanup of styles.
- **CMS-019 (P1)** **Content templates** per content type (News, Explainer, Fact-check, Interview, Opinion).
- **CMS-020 (P2)** AI writing assistance (summaries, headline suggestions, tag suggestions, translation) — **assistive only**; AI-generated text SHALL never publish without human approval and SHALL be disclosed per editorial policy (see §5.10.9).

#### 5.3.3 Content Types & Special Formats
- **CMS-030 (P0)** Standard article, opinion/column, analysis, explainer, interview, press release, sponsored/branded content (clearly labelled).
- **CMS-031 (P0)** **Fact-check** type with claim, rating, evidence, sources (maps to `ClaimReview` schema).
- **CMS-032 (P1)** **Live blog** with timestamped entries, pinned entries, author per entry, realtime push to readers, and conversion to a standard article on close.
- **CMS-033 (P1)** **Video**, **gallery** and **podcast** types.
- **CMS-034 (P1)** **Breaking news / alert** object: short text, link, expiry, severity; optionally triggers push/newsletter.
- **CMS-035 (P2)** **Web stories** (AMP-free vertical story format).

#### 5.3.4 Homepage & Curation
- **CMS-040 (P0)** Drag-and-drop **homepage/section layout manager** with slots (hero, top stories, category blocks), manual pinning and automatic fill rules, with scheduled layout changes.
- **CMS-041 (P1)** Per-category front curation; per-topic pinned articles.
- **CMS-042 (P1)** A/B test headlines/images (optional, P2 for automation).

#### 5.3.5 Content Lifecycle
- **CMS-050 (P0)** States: **Draft → In Review → Changes Requested → Approved → Scheduled → Published → Updated → Unpublished → Archived**, plus **Trashed** (soft delete).
- **CMS-051 (P0)** **Scheduling** publish and unpublish times (timezone-aware); executed by the scheduler within ±1 minute.
- **CMS-052 (P0)** **Update flagging**: substantive updates set `dateModified`, show "Updated" label and optionally an update note.
- **CMS-053 (P1)** **Bulk actions**: change category, add tags/topics, publish/unpublish, trash, export (with permission checks).
- **CMS-054 (P1)** **Content embargo**: set time before which content cannot be published or viewed externally.
- **CMS-055 (P1)** **Evergreen review**: flag articles older than N months for review by owners.

---

### 5.4 Editorial Workflow

- **WF-001 (P0)** A configurable workflow engine SHALL define transitions between states, allowed roles per transition, and required fields per transition.
- **WF-002 (P0)** Default flow: Author *submits* → Section Editor *reviews* → (optional Sub-editor *copy-edits*) → Editor *approves/publishes* or *requests changes* with comments.
- **WF-003 (P0)** **Self-publish** SHALL be a permission; authors lacking it SHALL not be able to publish.
- **WF-004 (P1)** Optional **four-eyes rule**: sensitive categories/types (e.g. investigations, legal-risk) require a second approver.
- **WF-005 (P1)** **Assignments**: editors assign stories with deadlines, priority and notes; authors see assignments on their dashboard.
- **WF-006 (P1)** **Notifications** (in-app + email) for assignment, review request, changes requested, approval, publish, comment mention.
- **WF-007 (P1)** **Checklist gates** before publish: required SEO fields, image alt text, source/credit, legal flag cleared, category/topic set.
- **WF-008 (P1)** **Legal/sensitivity flag** with required review by designated role before publish.
- **WF-009 (P0)** Every transition SHALL record actor, timestamp, from/to state and comment in the audit log.

---

### 5.5 Media Library

- **MED-001 (P0)** Upload images, video, audio, documents (type/size whitelisting, antivirus scan hook optional).
- **MED-002 (P0)** Automatic image processing: responsive sizes, WebP/AVIF conversion, EXIF stripping (configurable), focal-point cropping, lazy-loading attributes, explicit width/height for CLS prevention.
- **MED-003 (P0)** Metadata: title, caption, **alt text (required to publish)**, credit/photographer, source, licence/rights, expiry of rights, tags, usage notes.
- **MED-004 (P1)** Search/filter, folders/collections, duplicate detection (hash), "where used" tracking.
- **MED-005 (P1)** Image SEO: descriptive filenames, `ImageObject` structured data, image sitemap entries, aspect ratios 16:9, 4:3, 1:1 supported for Google News/Discover (≥1200px wide for large images).
- **MED-006 (P1)** Video: upload or embed (YouTube/Vimeo/self-hosted via CDN), poster image, transcript/captions field (feeds AEO/GEO and accessibility), `VideoObject` schema.
- **MED-007 (P2)** Rights-expiry alerts and auto-flagging of content using expired media.

---

### 5.6 User & Access Management

- **USR-001 (P0)** CMS users managed by System Admin (create, invite via email, activate, suspend, delete/anonymise).
- **USR-002 (P0)** Authentication: email/password, password policy, email verification, **2FA (TOTP) mandatory for CMS users** (configurable per role), login throttling, session management and device logout.
- **USR-003 (P1)** Optional SSO (Google Workspace / Microsoft Entra / SAML/OIDC) for staff.
- **USR-004 (P0)** **Author profile** (public-facing): photo, bio, job title, expertise/beat, credentials, location, social links, contact (optional), `sameAs` links, "knows about" topics.
- **USR-005 (P1)** Per-user activity view (admin/auditor).
- **USR-006 (P1)** Account lifecycle: automatic deactivation of dormant CMS accounts (configurable).
- **USR-007 (P0)** Admin impersonation (with prominent banner and audit log) — restricted to Super Admin.
- **USR-008 (P2)** Registered readers: signup, social login, email verification, GDPR-style data export/delete.

---

### 5.7 Audit, Compliance & Corrections

- **AUD-001 (P0)** **Immutable audit log** capturing: who, what entity, action, before/after values, IP, user agent, timestamp. Covers content, taxonomy, users, roles, settings, redirects, media, publishing, and logins.
- **AUD-002 (P0)** **Auditor role** has read-only access to audit logs, all content states (incl. drafts/trashed), revision histories and exports.
- **AUD-003 (P0)** Audit log search/filter by user, entity, action, date range; **export** to CSV/JSON.
- **AUD-004 (P1)** **Compliance dashboard**: articles published without review, self-published counts, overdue reviews, missing alt text, expired rights, orphaned tags.
- **AUD-005 (P1)** **Corrections & clarifications**: public correction note attached to an article with date; maintained history; appears in structured data (`correction` / `CorrectionComment`) where supported.
- **AUD-006 (P1)** **Takedown/legal removal workflow** with reason code, requester, and approvals; support `410 Gone` with a tombstone page where appropriate.
- **AUD-007 (P1)** Audit logs retained ≥ 24 months (configurable), tamper-evident (hash chaining or write-once storage).
- **AUD-008 (P1)** Source/fact-check metadata: sources list, verification status, "fact-checked by" field (feeds E-E-A-T).
- **AUD-009 (P2)** Plagiarism/duplicate-content check hook at submit time.

---

### 5.8 Search

- **SRC-001 (P0)** Full-text search over headline, summary, body, tags, topics, authors with typo tolerance, synonyms, and relevance + recency ranking.
- **SRC-002 (P0)** Facets/filters: category, topic, tag, author, date range, content type.
- **SRC-003 (P0)** Autocomplete/suggestions (queries, topics, tags, authors).
- **SRC-004 (P1)** Search analytics: top queries, zero-result queries (feeds editorial planning and SEO).
- **SRC-005 (P0)** Search index updated within 60 seconds of publish/update/unpublish.
- **SRC-006 (P0)** Search result pages SHALL be `noindex, follow` and excluded from sitemaps.
- **SRC-007 (P1)** CMS-side search across all states (permission-aware).

---

### 5.9 SEO

#### 5.9.1 On-Page SEO
- **SEO-001 (P0)** Per-entity fields (article, category, topic, tag, author, page): SEO title, meta description, canonical URL, robots directives (`index/noindex`, `follow/nofollow`, `max-snippet`, `max-image-preview:large`, `max-video-preview`), Open Graph and X/Twitter Card fields, social image.
- **SEO-002 (P0)** **Smart defaults**: if SEO fields empty, auto-generate from headline/summary with length-safe truncation; templates configurable by SEO Specialist.
- **SEO-003 (P0)** **Live SEO panel** in editor: SERP preview (desktop/mobile), social card preview, length checks, keyword presence, heading structure, internal-link count, image alt coverage, readability.
- **SEO-004 (P0)** Exactly one `<h1>` per page; logical heading hierarchy; semantic HTML (`<article>`, `<header>`, `<time datetime>`, `<figure>`, `<nav>`).
- **SEO-005 (P0)** **Canonicalisation**: self-referencing canonical on all indexable pages; canonical handling for pagination, UTM/query parameters, syndicated/republished content (`rel=canonical` to original).
- **SEO-006 (P1)** **Internal linking** suggestions (related articles/topics) in editor; automated contextual links to topic hubs (configurable, capped).
- **SEO-007 (P1)** Breadcrumbs (visible + `BreadcrumbList` schema) reflecting primary category path.
- **SEO-008 (P0)** Clean, human-readable, stable URLs (see Appendix A); slug auto-generation with stop-word trimming and editable slug until first publish (post-publish changes create 301s).

#### 5.9.2 Technical SEO
- **SEO-020 (P0)** **XML sitemaps**: sitemap index → segmented sitemaps (articles by month, categories, topics, tags, authors, pages, images, video). Auto-updated on publish/unpublish; each ≤ 50,000 URLs/50MB.
- **SEO-021 (P0)** **Google News sitemap** (articles published in last 48 hours) with publication name, language, publication date, title.
- **SEO-022 (P0)** `robots.txt` managed from CMS (with environment-aware defaults: block staging entirely) — see Appendix C.
- **SEO-023 (P0)** **Redirect manager**: 301/302/307/410 rules, regex support, bulk CSV import, automatic redirect on slug/category change, redirect-chain/loop detection, 404 log with "create redirect" shortcut.
- **SEO-024 (P0)** **RSS/Atom feeds**: site-wide, per category, per topic, per tag, per author; full-text or summary configurable; includes media enclosures.
- **SEO-025 (P1)** **hreflang** for multi-language/regional versions (when enabled).
- **SEO-026 (P0)** HTTP status hygiene: proper 404/410, no soft-404s, trailing-slash and lowercase normalisation, HTTP→HTTPS and www/non-www canonical redirects, HSTS.
- **SEO-027 (P0)** **Core Web Vitals** targets (see §7): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at p75 on mobile.
- **SEO-028 (P1)** **IndexNow** and Google Indexing/Search Console ping integrations on publish/update/unpublish (queue-based, retry-safe).
- **SEO-029 (P1)** **SEO health dashboard**: broken links, missing meta, duplicate titles/descriptions, orphan pages, thin tag pages, redirect chains, schema validation errors; scheduled crawl/report.
- **SEO-030 (P1)** Search Console and Bing Webmaster Tools data integration (impressions, clicks, queries per URL) surfaced in article analytics.
- **SEO-031 (P1)** Pagination, faceted/search/filter URLs and parameterised URLs controlled via canonical/noindex rules.
- **SEO-032 (P1)** Image and video sitemaps; `loading="lazy"` for below-the-fold only; LCP image preloaded with `fetchpriority="high"`.
- **SEO-033 (P1)** Structured data validated automatically in CI and on publish (warn on errors).
- **SEO-034 (P1)** Publisher transparency pages and `Organization` schema for **E-E-A-T** (About, Editorial policy, Corrections policy, Ownership, Contact, Ethics, Fact-checking policy, Author pages).

#### 5.9.3 Structured Data (Schema.org / JSON-LD)
| Page | Schema Types |
|---|---|
| Site-wide | `Organization` (`NewsMediaOrganization`), `WebSite` (+ `SearchAction`), `publishingPrinciples`, `ethicsPolicy`, `correctionsPolicy`, `masthead` |
| Article | `NewsArticle` / `Article` / `OpinionNewsArticle` / `AnalysisNewsArticle` / `ReportageNewsArticle` / `BackgroundNewsArticle` with `headline`, `image` (multiple ratios), `datePublished`, `dateModified`, `author` (`Person` with `url` & `sameAs`), `publisher`, `mainEntityOfPage`, `articleSection`, `keywords`, `about`, `mentions`, `isAccessibleForFree`, `speakable` (where applicable), `wordCount`, `inLanguage` |
| Live blog | `LiveBlogPosting` with `liveBlogUpdate` (`BlogPosting`) |
| Fact-check | `ClaimReview` |
| Video | `VideoObject` (with transcript, `uploadDate`, `duration`, `thumbnailUrl`) |
| Category/Topic | `CollectionPage` + `ItemList`, `BreadcrumbList` |
| Author | `ProfilePage` + `Person` |
| FAQ/Q&A blocks | `FAQPage` (only where visible on page and compliant with guidelines) |
| Search | `SearchResultsPage` (noindex) |

- **SEO-040 (P0)** Structured data SHALL be generated server-side from the same data shown on the page (no mismatches) and rendered in SSR HTML.
- **SEO-041 (P0)** Structured data builders SHALL be centralised, unit-tested, and overridable per entity by SEO Specialists (with validation).

---

### 5.10 AI SEO, AEO & GEO

> **Context:** Beyond classic ranking, content must be discoverable, parseable and *citable* by answer engines (Google AI Overviews/AI Mode, Bing Copilot, Perplexity, ChatGPT search and other assistants) and generative models. **AEO** optimises content to be selected as a direct answer. **GEO** optimises to be cited/referenced within generated responses. **AI SEO** covers using AI to improve SEO workflows. No technique guarantees inclusion; the system provides *capabilities, structure and measurement*.

#### 5.10.1 Answer-Ready Content Structure (AEO)
- **AEO-001 (P0)** Article template SHALL support a mandatory-by-type **"Key Points / TL;DR"** block (2–5 bullets) placed at the top, rendered as semantic HTML.
- **AEO-002 (P0)** **Direct-answer paragraph**: for explainers/evergreen/FAQ-type content the editor SHALL be prompted to write a 40–60 word concise answer immediately under the relevant heading (question-style H2/H3).
- **AEO-003 (P0)** **FAQ block** (question + answer pairs) with `FAQPage` schema, rendered visibly on the page.
- **AEO-004 (P1)** **"Who / What / When / Where / Why / How"** (5W1H) summary fields for news items, used in the lede box and in structured data/summary feeds.
- **AEO-005 (P1)** **Topic hub pages** SHALL include: definition/overview, key facts, timeline, key people/entities, FAQs, and curated latest/explainer links — optimised as authoritative "source of truth" pages.
- **AEO-006 (P1)** Support **question-based headings** and a "People also ask" research field in the editor (manual or AI-suggested).
- **AEO-007 (P1)** **Fact boxes / data tables** rendered as proper HTML tables/lists (machine-parseable) rather than images.
- **AEO-008 (P1)** **Speakable** markup for key summary sections where eligible (voice assistants).
- **AEO-009 (P1)** **Glossary/definition** support for recurring terms with anchor links.

#### 5.10.2 Entity & Authority Signals (GEO / E-E-A-T)
- **GEO-001 (P0)** Every article SHALL expose **author entity** with bio, credentials, `sameAs` links, and link to an author page.
- **GEO-002 (P0)** Publisher entity (`NewsMediaOrganization`) SHALL include logo, `sameAs` (social, Wikipedia/Wikidata if available), contact, masthead, editorial & corrections policies.
- **GEO-003 (P1)** **Entity tagging**: editors can link people, organisations, places, events to registry entities; output as `about`/`mentions` with `sameAs` identifiers.
- **GEO-004 (P1)** **Source attribution block**: structured "Sources & references" section listing primary sources with links; rendered visibly and in markup (`citation`).
- **GEO-005 (P1)** **Original data/quotes** callouts: editors can mark original reporting (exclusive interviews, datasets) — displayed with a badge and `isBasedOn` / dataset links.
- **GEO-006 (P1)** **Freshness signals**: prominent, accurate `datePublished`/`dateModified`, update logs ("What changed") for developing stories; stale-content review workflow.
- **GEO-007 (P1)** **Quotable snippets**: editors may mark 1–3 "pull-fact" sentences per article (concise, self-contained, attributable) used in summary meta, social cards and the `abstract` field.
- **GEO-008 (P2)** **Citation & mention monitoring**: periodic checks (manual import or API where available) of whether the site is cited in AI answer engines for tracked queries; dashboard showing trends.

#### 5.10.3 Crawler & Machine Access Controls
- **GEO-010 (P0)** **AI crawler policy manager** in CMS: configure allow/disallow per user-agent in `robots.txt` for known AI crawlers (e.g. GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Bytespider, etc.), with a maintained, updatable list and clear distinction between *training* and *search/retrieval* agents. Default policy configurable by business decision (see §12).
- **GEO-011 (P0)** **`llms.txt`** (and optional `llms-full.txt`) endpoint auto-generated from CMS: site description, key sections, topic hubs, latest/high-value evergreen content, policies and licensing/contact — see Appendix C.
- **GEO-012 (P1)** **Clean Markdown/plain-text representations** of articles at a predictable URL (e.g. `/news/slug.md`) or via content negotiation, stripped of nav/ads for machine consumption (toggleable per policy).
- **GEO-013 (P1)** **AI usage/licensing metadata**: `meta` robots/`X-Robots-Tag` directives (e.g. `noai`-style or `max-snippet` limits where supported), TDM reservation (`tdm-reservation`/TDMRep) and a published AI usage policy page.
- **GEO-014 (P1)** **Bot verification & rate limiting**: identify crawlers via reverse DNS/IP lists, apply rate limits, log bot traffic separately (WAF/CDN rules documented).
- **GEO-015 (P1)** **Server logs/analytics segmentation** for AI user-agents and referrals from AI platforms (e.g. chat.openai.com, perplexity.ai, copilot.microsoft.com, gemini.google.com) to measure AI-driven traffic.
- **GEO-016 (P2)** Provide a **public JSON/API feed** (rate-limited, licensable) of headlines, summaries and canonical URLs for approved partners.
- **GEO-017 (P0)** Critical content SHALL NOT depend on JavaScript-only rendering (SSR guarantees), because many AI crawlers do not execute JS.

#### 5.10.4 Content Quality Scoring (AI SEO / AEO Readiness)
- **AI-001 (P1)** Editor SHALL show an **"Answer-readiness score"** with actionable checks: has TL;DR, has direct answer, has FAQ, question-style headings, sources cited, author attributed, entities tagged, dates present, tables/lists used, image alt present, summary length OK.
- **AI-002 (P1)** **Schema completeness score** per article, listing missing recommended properties.
- **AI-003 (P1)** **Topical authority view**: per topic hub, shows coverage (number/recency of articles, gaps, subtopics lacking content) to guide editorial planning.
- **AI-004 (P2)** **Content decay detection**: highlight articles losing impressions/citations for refresh.

#### 5.10.5 AI-Assisted Workflow (Optional, Human-in-the-Loop)
- **AI-010 (P2)** Provider-agnostic AI service layer (configurable provider/model, keys stored encrypted, usage limits per role).
- **AI-011 (P2)** Assist features: headline variants, SEO title/meta drafts, TL;DR/summary, FAQ suggestions, tag/topic/entity suggestions, internal-link suggestions, alt-text drafts, translation drafts, transcript summarisation.
- **AI-012 (P2)** AI outputs SHALL be clearly marked as suggestions, require explicit editor acceptance, and be logged (prompt, model, user, accepted/rejected) in the audit log.
- **AI-013 (P2)** **No auto-publish of AI-generated body content.** Policy toggles: disable AI features globally or per role/category.
- **AI-014 (P2)** Provide an **AI disclosure** field/badge (e.g. "Summary assisted by AI, reviewed by editor") configurable per policy.
- **AI-015 (P2)** Sensitive-content guard: block sending embargoed/legal-flagged/unpublished sensitive content to external AI providers unless explicitly allowed.

#### 5.10.6 On-Site AI Features for Readers (Optional)
- **AI-020 (P2)** "Ask our archive" conversational/semantic search using a retrieval-grounded (RAG) approach over published content with source citations, strict grounding, and refusal when unsupported; vector search via pgvector/Meilisearch/Typesense vector support.
- **AI-021 (P2)** Auto-generated article summaries ("Quick read") stored and reviewed by editors before display.
- **AI-022 (P2)** Related-content recommendations via embeddings.

#### 5.10.7 Measurement
- **GEO-030 (P1)** Track: AI-referrer sessions, AI-crawler hit counts per URL, pages most fetched by AI bots, and citation share for a tracked query set (manual/API).
- **GEO-031 (P1)** Report correlating AEO readiness score with impressions/CTR/citations.

#### 5.10.8 Governance
- **GEO-040 (P1)** Policy documentation page: AI usage, crawler policy, AI-assisted content disclosure, corrections.
- **GEO-041 (P1)** Changes to crawler/AI policy settings SHALL require Super Admin/SEO Specialist permission and be audit-logged.

---

### 5.11 Engagement (Newsletter, Push, Comments, Social)

- **ENG-001 (P0)** **Newsletter**: signup forms (double opt-in), list segmentation by category/topic, integration with an ESP (Mailchimp/Brevo/Sendgrid/Postmark or similar), automated daily/weekly digests and breaking alerts.
- **ENG-002 (P1)** **Web push notifications** (opt-in, per category/topic), triggered manually or by breaking news flag; frequency caps.
- **ENG-003 (P1)** **Social sharing** buttons (WhatsApp, X, Facebook, LinkedIn, Telegram, copy link) with correct OG/Twitter metadata; share-count tracking via UTM.
- **ENG-004 (P1)** **Auto-posting** to social channels via queue (Facebook, X, LinkedIn, Telegram) with per-article override.
- **ENG-005 (P1)** **Comments** (registered or verified-email), threading, moderation queue, profanity/spam filters (Akismet-compatible), report abuse, per-article disable; comments marked `ugc` nofollow.
- **ENG-006 (P2)** Reactions, bookmarks, "follow" features for registered readers.
- **ENG-007 (P1)** Reader **contact/tips form** with secure submission and spam protection (CAPTCHA/Turnstile), routed to editors.

---

### 5.12 Advertising & Monetisation

- **ADV-001 (P1)** Ad slot manager: define placements (header, in-article, sidebar, sticky, interstitial), responsive sizes, lazy-loaded, with reserved space to prevent CLS.
- **ADV-002 (P1)** Support for Google Ad Manager/AdSense and custom/direct campaigns (image/HTML with click tracking), scheduling and targeting by category/topic/device.
- **ADV-003 (P1)** **Sponsored/Branded content** flag with mandatory disclosure label and `rel="sponsored"` links; excluded from news sitemaps where required.
- **ADV-004 (P1)** Consent-aware ad/analytics loading (CMP integration).
- **ADV-005 (P1)** `ads.txt` and `app-ads.txt` managed from admin.
- **ADV-006 (P2)** Metered paywall/membership hooks (future).

---

### 5.13 Analytics & Reporting

- **ANA-001 (P0)** Integrate privacy-respecting analytics (GA4 and/or Plausible/Matomo) with consent handling.
- **ANA-002 (P1)** **Internal editorial analytics**: views, unique readers, read depth/time, referrers, traffic by category/topic/tag/author/device, top & trending articles (near real time), per-article performance page in CMS.
- **ANA-003 (P1)** **Author performance** and **desk performance** reports (visible per role; auditors read-only).
- **ANA-004 (P1)** **Publishing metrics**: time-to-publish, review turnaround, volume by status/category, corrections rate.
- **ANA-005 (P1)** **SEO reports**: impressions, clicks, CTR, position (Search Console), Google News/Discover performance, top queries per article/topic.
- **ANA-006 (P1)** **AI/AEO/GEO reports**: see §5.10.7.
- **ANA-007 (P1)** Scheduled email reports and CSV/PDF export.
- **ANA-008 (P1)** Trending and "Most read" widgets computed from analytics with caching.

---

### 5.14 Settings & Configuration

- **SET-001 (P0)** Site settings: name, logo, favicon, tagline, contact, social profiles, default meta, timezone, locale, date formats.
- **SET-002 (P0)** Navigation/menu manager (header, footer, category mega-menu).
- **SET-003 (P0)** Static page manager with block editor.
- **SET-004 (P1)** **Multi-language support** (optional): translatable content with language switcher, per-language slugs, `hreflang`; translation workflow states.
- **SET-005 (P1)** Email templates and notification settings.
- **SET-006 (P1)** Feature flags (comments, push, AI features, live blog, paywall hooks).
- **SET-007 (P0)** Cache controls: purge by URL/tag/section, automatic purge on publish/update.
- **SET-008 (P1)** Maintenance mode and read-only mode for incident handling.
- **SET-009 (P1)** Scripts/tag manager injection with permission control and CSP awareness.
- **SET-010 (P1)** Editorial style guide and policy pages management.
- **SET-011 (P0)** Settings changes are audit-logged; sensitive values encrypted.

---

### 5.15 Integrations & API

- **API-001 (P1)** Versioned, authenticated **REST (JSON) API** (Sanctum tokens) for headless/partner/mobile use; read endpoints for published content (rate-limited), write endpoints for authorised integrations.
- **API-002 (P1)** **Webhooks** for events: article published/updated/unpublished, breaking alert, comment posted.
- **API-003 (P1)** **Wire/agency ingestion** (e.g. via RSS/API/NewsML-G2 import) into a "Wire inbox" for editor curation (P2 for NewsML).
- **API-004 (P1)** **Import tool** for migrating existing content (WordPress WXR, CSV, JSON) with redirect map generation and media migration.
- **API-005 (P1)** Search Console, Bing Webmaster, IndexNow, ESP, social, push, CDN purge, S3, Slack/Teams notifications.
- **API-006 (P2)** Google News Publisher Center & Apple News feed support.
- **API-007 (P1)** OpenAPI documentation auto-generated.

---

## 6. Data Model

### 6.1 Core Entities (Overview)
```
users ─┬─< role_user >─ roles ─< permission_role >─ permissions
       └─ author_profiles (1:1)

articles ─┬─ article_revisions
          ├─< article_author (pivot, role: author|contributor|photographer)
          ├─ primary_category_id → categories
          ├─< article_category (secondary)
          ├─< article_topic (pivot, is_primary)
          ├─< article_tag
          ├─ series_id → series (+ series_position)
          ├─< article_entity (pivot)
          ├─< article_media (pivot, role: hero|inline|gallery)
          ├─ article_seo (1:1)
          ├─ article_ai_meta (1:1: tldr, faq_json, key_facts, 5w1h, speakable, ai_disclosure)
          ├─< article_corrections
          └─< article_workflow_transitions

categories (self-referencing parent_id, seo)
topics (parent_id, seo, faq_json, timeline_json)
tags (slug, merged_into_id)
series
entities (type, name, sameAs[])
media (spatie media + rights metadata)
comments (polymorphic, status)
redirects, menus, menu_items, pages, settings
ad_slots, ad_campaigns
newsletter_subscribers, push_subscriptions
audit_logs (activitylog) ; ai_usage_logs
crawler_policies, llms_txt_config
analytics_events / aggregates
```

### 6.2 Key Fields — `articles`
| Field | Type | Notes |
|---|---|---|
| id, uuid | PK | UUID for external/preview refs |
| title, seo_title, social_title | string | |
| slug | string (unique) | immutable-ish; changes create redirects |
| standfirst / summary | text | |
| body | json/longtext | block JSON + rendered HTML cache |
| content_type | enum | news, opinion, analysis, explainer, factcheck, interview, liveblog, video, gallery, podcast, press_release, sponsored |
| status | enum | per §5.3.5 |
| primary_category_id | FK | |
| language | string | |
| is_breaking, is_featured, is_sponsored, is_exclusive, is_developing | bool | |
| published_at, scheduled_at, unpublish_at, embargo_until | datetime | |
| last_substantive_update_at | datetime | drives `dateModified` |
| reading_time | int | |
| hero_media_id | FK | |
| created_by, updated_by, locked_by | FK | |
| legal_flag, requires_second_approval | bool | |
| timestamps, soft_deletes | | |

### 6.3 Indexing Notes
Indexes on `(status, published_at)`, `(primary_category_id, published_at)`, pivot composite keys, unique slugs, FULLTEXT or Scout index; partitioning/archival strategy for audit and analytics tables.

---

## 7. Non-Functional Requirements

### 7.1 Performance
- **NFR-001** Mobile p75: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**; TTFB ≤ 600 ms for cached pages, ≤ 1.2 s uncached.
- **NFR-002** Anonymous traffic served via CDN/edge full-page cache with tag-based purge; origin load minimal for cached hits.
- **NFR-003** Support ≥ 1,000 requests/second peak at the edge and ≥ 100 concurrent CMS users (to be validated against real baseline traffic).
- **NFR-004** Publish-to-live latency ≤ 60 seconds (including cache purge, search index, sitemap, feed updates).
- **NFR-005** JS budget: initial public page JS ≤ ~150 KB gzip (target); use code-splitting, islands/deferred hydration for non-critical widgets.
- **NFR-006** Images served in modern formats via responsive `srcset`; fonts self-hosted with `font-display: swap`.

### 7.2 Availability & Reliability
- **NFR-010** Target 99.9% monthly availability for public site.
- **NFR-011** Graceful degradation: if Redis/search/AI/analytics fails, public pages still render (serve stale cache).
- **NFR-012** Daily encrypted backups (DB + media), PITR for DB, tested restore (RPO ≤ 15 min, RTO ≤ 2 h targets).
- **NFR-013** Zero-downtime deployments (blue/green or rolling), safe migrations.

### 7.3 Scalability
- **NFR-020** Stateless app nodes; horizontal scaling; separate worker pool; read replicas optional.
- **NFR-021** Handle archive of ≥ 1,000,000 articles without degradation in search or category listing (pagination, indexes, caching).

### 7.4 Usability & Accessibility
- **NFR-030** WCAG 2.2 AA for public site and CMS where feasible; keyboard navigability; ARIA landmarks; colour contrast; captions/transcripts.
- **NFR-031** CMS UX optimised for speed: keyboard shortcuts, autosave, minimal clicks to publish.
- **NFR-032** Responsive CMS usable on tablets; essential flows (review/approve) usable on mobile.

### 7.5 Maintainability
- **NFR-040** Pest tests with ≥ 80% coverage on domain logic; static analysis (Larastan level ≥ 6), Pint, ESLint/Prettier, TypeScript strict.
- **NFR-041** CI pipeline: tests, linting, build, structured-data validation, Lighthouse CI budgets.
- **NFR-042** Documentation: README, architecture notes, runbooks, API docs, editorial user guide.

### 7.6 Localisation
- **NFR-050** UTF-8 everywhere; timezone-aware dates (store UTC, display in site/user timezone); translatable UI strings.

### 7.7 Compliance
- **NFR-060** Privacy law compliance as applicable (e.g. Uganda Data Protection and Privacy Act, 2019; GDPR where EU audience): consent management, data subject requests, retention policies.
- **NFR-061** Cookie/consent banner governing analytics/ads/push.

---

## 8. Security & Privacy

- **SEC-001 (P0)** OWASP Top 10 mitigations; Laravel defaults (CSRF, XSS escaping, prepared statements); strict **CSP**, HSTS, secure cookies, `SameSite`.
- **SEC-002 (P0)** **Rich-text/HTML sanitisation** server-side (allow-list) for all user/editor content and embeds; sandboxed iframes for third-party embeds.
- **SEC-003 (P0)** 2FA for CMS accounts; password hashing (Argon2id/bcrypt), breached-password checks, login throttling, lockouts.
- **SEC-004 (P0)** Authorisation via Policies on every CMS endpoint; IDOR prevention; signed URLs for previews and private media.
- **SEC-005 (P0)** File upload validation (MIME + extension + content sniffing), storage outside web root or via object storage, optional AV scan.
- **SEC-006 (P1)** WAF/CDN rules, rate limiting (per IP/user/route), bot management, DDoS protection.
- **SEC-007 (P0)** Secrets via environment/secret manager; encrypted columns for API keys; key rotation process.
- **SEC-008 (P1)** Security headers, dependency scanning (Dependabot/Composer audit/npm audit), SAST in CI, periodic penetration test before launch.
- **SEC-009 (P0)** Comprehensive audit logging (see §5.7); log retention and access controls.
- **SEC-010 (P1)** Source protection: secure tip submission; optional PGP/SecureDrop guidance; redaction of sensitive metadata (EXIF) on public media.
- **SEC-011 (P0)** Backups encrypted; least-privilege DB/storage credentials; separate admin and public subdomain/session options.
- **SEC-012 (P1)** Webhook/API signing and replay protection.

---

## 9. Deployment, DevOps & Observability

- **OPS-001** Environments: local, staging (blocked from indexing: `noindex` + auth + `Disallow: /`), production.
- **OPS-002** Containerised deployment (Docker) or managed PHP hosting; separate processes for web, queue workers (Horizon), scheduler, and Inertia SSR; process supervision and health checks.
- **OPS-003** CI/CD with automated tests, migrations, asset builds, SSR bundle build, smoke tests and rollback.
- **OPS-004** Observability: structured logs, error tracking (Sentry/Flare), APM (Telescope in dev, Pulse/OpenTelemetry in prod), uptime and synthetic checks (including SSR health), queue/scheduler monitoring, alerts to Slack/email.
- **OPS-005** CDN with tag-based purge, image optimisation, and origin shield.
- **OPS-006** Infrastructure documented/as-code (Terraform/Ansible optional).
- **OPS-007** Runbooks for: breaking-news surge, cache purge, rollback, search reindex, restore from backup, takedown.

---

## 10. Testing & Acceptance

### 10.1 Test Levels
Unit (domain actions, schema builders, slug/redirect logic), feature (HTTP/Inertia, policies), browser E2E (editor, workflow, publish), accessibility (axe), performance (Lighthouse CI, k6), security (SAST/DAST), SEO/schema validation, SSR output verification (view-source parity).

### 10.2 Key Acceptance Criteria
| # | Criterion |
|---|---|
| AC-1 | An Author can draft and submit an article; they cannot publish it without the self-publish permission. |
| AC-2 | A Section Editor can only review/publish in categories they are scoped to. |
| AC-3 | Every state transition and edit is visible in the audit log; an Auditor can view and export it but cannot modify any content. |
| AC-4 | Publishing an article updates: public page, category/topic/tag listings, search index, RSS, sitemaps and News sitemap, and purges cache within 60 seconds. |
| AC-5 | `curl` of any public article URL returns full body HTML, meta tags, canonical, and valid JSON-LD without JavaScript. |
| AC-6 | Changing a slug/category/tag creates a 301 redirect automatically; no redirect chains exceed one hop. |
| AC-7 | Tag merge re-points articles and redirects old tag URLs. |
| AC-8 | Structured data passes validation for NewsArticle, BreadcrumbList, Organization, Person, FAQPage and VideoObject test pages. |
| AC-9 | `robots.txt` and `llms.txt` are editable in-CMS, reflect AI crawler policy, and changes are audit-logged. |
| AC-10 | Mobile Lighthouse/CWV budgets met on representative article, category and home pages. |
| AC-11 | Article editor displays Answer-readiness and SEO scores with actionable checks. |
| AC-12 | Scheduled publish/unpublish executes within ±1 minute. |
| AC-13 | 2FA is enforced for all CMS roles at first login. |
| AC-14 | Corrections add a visible public note and update `dateModified`/structured data. |
| AC-15 | Staging environment is not indexable by any crawler. |

---

## 11. Release Plan (Phasing)

| Phase | Scope | Outcome |
|---|---|---|
| **Phase 0 – Foundations** | Project setup on Laravel React Starter Kit, SSR, CI/CD, auth + 2FA, RBAC, audit log, base layouts, design system | Secure skeleton |
| **Phase 1 – Core CMS & Taxonomy (MVP)** | Article editor, revisions, media library, categories/topics/tags/series, workflow, scheduling, preview, user management, basic homepage curation | Editorial team can publish |
| **Phase 2 – Public Portal & Core SEO** | Public templates (home, article, category, topic, tag, author), search, sitemaps (incl. News), feeds, redirects, structured data, robots, CWV optimisation, newsletter, analytics | Launch-ready portal |
| **Phase 3 – AEO/GEO & Advanced SEO** | Answer-ready blocks, FAQ, TL;DR, entity registry, `llms.txt`, AI crawler manager, markdown views, readiness scoring, SEO dashboard, Search Console/IndexNow integration | Answer-engine optimised |
| **Phase 4 – Engagement & Monetisation** | Comments, push, social auto-post, ads manager, live blog, corrections/takedown workflows, compliance dashboard | Growth & revenue |
| **Phase 5 – AI & Advanced** | AI assistive tools, RAG "ask the archive", citation monitoring, content decay, multi-language, API/partner feeds | Differentiation |

---

## 12. Assumptions, Risks & Open Questions

### 12.1 Assumptions
- Content volume, traffic estimates and languages will be confirmed before infrastructure sizing.
- The organisation has (or will define) editorial, ethics, corrections and AI-usage policies.
- Existing content (if any) will be migrated with URL preservation.

### 12.2 Risks
| Risk | Mitigation |
|---|---|
| AI/answer-engine behaviour changes rapidly | Keep AEO/GEO features config-driven; focus on durable fundamentals (structure, authority, crawlability); review quarterly |
| SSR complexity/performance | Cache aggressively; monitor SSR health; fallback to cached HTML |
| Thin taxonomy pages harming SEO | Auto-`noindex` thresholds; editorial governance for tags/topics |
| Breaking-news traffic spikes | CDN full-page cache, stale-while-revalidate, load testing |
| Editorial resistance to workflow | Configurable workflow, role-based simplification, training |
| Over-reliance on AI-generated content | Human-in-the-loop policy, disclosure, audit logging |
| Migration redirect loss | Redirect map generation and pre-launch crawl comparison |

### 12.3 Open Questions
1. What are the expected traffic, article volume per day and archive size?
2. Single language or multilingual at launch (and which languages)?
3. Business stance on AI crawlers: allow search/retrieval bots, block training bots, or allow all?
4. Is a paywall/membership model planned in the near term?
5. Preferred search engine (Meilisearch vs Typesense vs other), ESP and push provider?
6. Are SSO and specific compliance requirements mandated by the organisation?
7. Will the CMS and public site share one domain/deployment, or be split (e.g. `cms.example.com`)?
8. What existing platform (e.g. WordPress) is content being migrated from, and what URL patterns must be preserved?
9. Which AI provider(s), if any, are approved for assistive features and what data may be sent?
10. Is live blogging and real-time updating required at launch?

---

## Appendix A: URL & Routing Structure

| Page | Pattern | Notes |
|---|---|---|
| Home | `/` | |
| Article | `/{category}/{slug}` or `/{category}/{yyyy}/{mm}/{slug}` | Primary category path; slug unique; configurable |
| Category | `/{category}` · `/{category}/{subcategory}` | |
| Topic hub | `/topic/{slug}` | |
| Tag / hashtag | `/tag/{slug}` | |
| Author | `/author/{slug}` | |
| Series | `/series/{slug}` | |
| Live blog | `/live/{slug}` | |
| Search | `/search?q=` | `noindex, follow` |
| Archive | `/archive/{yyyy}/{mm}/{dd}` | |
| Pages | `/about`, `/editorial-policy`, `/corrections-policy`, `/ai-policy`, `/contact`, etc. | |
| Feeds | `/feed`, `/{category}/feed`, `/topic/{slug}/feed`, `/tag/{slug}/feed`, `/author/{slug}/feed` | |
| Sitemaps | `/sitemap.xml`, `/sitemaps/news.xml`, `/sitemaps/articles-{yyyy-mm}.xml`, … | |
| Machine views | `/{category}/{slug}.md`, `/llms.txt`, `/llms-full.txt` | Policy-controlled |
| CMS | `/cms/*` (or `cms.` subdomain) | Authenticated, `noindex` |
| API | `/api/v1/*` | |

---

## Appendix B: Structured Data Examples (JSON-LD)

### B.1 NewsArticle
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://example.com/politics/budget-2026-explained" },
  "headline": "Budget 2026 explained: what changes for households",
  "description": "A plain-language breakdown of the key measures in the 2026 national budget.",
  "image": [
    "https://cdn.example.com/img/budget-16x9.jpg",
    "https://cdn.example.com/img/budget-4x3.jpg",
    "https://cdn.example.com/img/budget-1x1.jpg"
  ],
  "datePublished": "2026-10-21T07:30:00+03:00",
  "dateModified": "2026-10-21T09:10:00+03:00",
  "author": [{
    "@type": "Person",
    "name": "Jane Doe",
    "url": "https://example.com/author/jane-doe",
    "sameAs": ["https://x.com/janedoe", "https://www.linkedin.com/in/janedoe"]
  }],
  "publisher": {
    "@type": "NewsMediaOrganization",
    "name": "Example News",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" },
    "publishingPrinciples": "https://example.com/editorial-policy",
    "correctionsPolicy": "https://example.com/corrections-policy",
    "ethicsPolicy": "https://example.com/ethics"
  },
  "articleSection": "Politics",
  "keywords": ["budget 2026", "tax", "households"],
  "about": [{ "@type": "Thing", "name": "National budget", "sameAs": "https://www.wikidata.org/wiki/Q..." }],
  "inLanguage": "en",
  "isAccessibleForFree": true
}
```

### B.2 FAQPage (only when FAQ is visible on the page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "When does the new tax measure take effect?",
    "acceptedAnswer": { "@type": "Answer", "text": "The measure takes effect on 1 January 2027 for all registered taxpayers." }
  }]
}
```

### B.3 BreadcrumbList
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Politics", "item": "https://example.com/politics" },
    { "@type": "ListItem", "position": 3, "name": "Budget 2026 explained" }
  ]
}
```

---

## Appendix C: `robots.txt` & `llms.txt` Samples

### C.1 `robots.txt` (policy-driven example; actual rules set by business decision)
```
User-agent: *
Disallow: /cms/
Disallow: /search
Disallow: /api/
Allow: /

# Search / retrieval AI agents (example: allow)
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Claude-SearchBot
Allow: /

# Training crawlers (example: disallow — business decision)
User-agent: GPTBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: Applebot-Extended
Disallow: /

Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemaps/news.xml
```
> Note: `robots.txt` is advisory. Enforcement of bot policy is handled at CDN/WAF level (GEO-014). The agent list must be reviewed periodically as vendors publish new user-agents.

### C.2 `llms.txt` (generated)
```
# Example News
> Independent news from Uganda and the region: politics, business, sport, and technology. Editorial standards: https://example.com/editorial-policy

## Key sections
- [Politics](https://example.com/politics): national and regional political coverage
- [Business](https://example.com/business): markets, economy, enterprise

## Topic hubs
- [2026 General Elections](https://example.com/topic/elections-2026): definitive coverage, timeline and FAQs

## Policies
- [Editorial policy](https://example.com/editorial-policy)
- [Corrections policy](https://example.com/corrections-policy)
- [AI usage & content licensing](https://example.com/ai-policy)

## Optional
- [Latest headlines (RSS)](https://example.com/feed)
```

---

## Appendix D: Permission Matrix

Legend: ✔ allowed · ◐ own content / scoped categories only · ✖ not allowed · 👁 read-only

| Capability | Contributor | Author | Sub-editor | Section Editor | Chief Editor | SEO Spec. | Auditor | Moderator | Ad Mgr | Media Mgr | System Admin |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Create draft | ✔ | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Edit own draft | ✔ | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Edit others' content | ✖ | ✖ | ◐ | ◐ | ✔ | ✖ (SEO fields only) | ✖ | ✖ | ✖ | ✖ | ✔ |
| Submit for review | ✔ | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Review / request changes | ✖ | ✖ | ◐ | ◐ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Approve & publish | ✖ | ✖ (unless granted) | ✖ | ◐ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Unpublish / archive | ✖ | ✖ | ✖ | ◐ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Delete (trash) | ✖ | ◐ (drafts) | ✖ | ◐ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Manage categories | ✖ | ✖ | ✖ | ◐ | ✔ | ✔ (SEO) | 👁 | ✖ | ✖ | ✖ | ✔ |
| Manage topics | ✖ | ✖ | ✖ | ✔ | ✔ | ✔ | 👁 | ✖ | ✖ | ✖ | ✔ |
| Create tags | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Merge / delete tags | ✖ | ✖ | ✖ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✔ |
| Homepage curation | ✖ | ✖ | ✖ | ◐ | ✔ | ✖ | 👁 | ✖ | ✖ | ✖ | ✔ |
| Breaking news alerts | ✖ | ✖ | ✖ | ✔ | ✔ | ✖ | 👁 | ✖ | ✖ | ✖ | ✔ |
| Upload media | ◐ | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✔ | ✔ |
| Manage media library | ✖ | ✖ | ✖ | ◐ | ✔ | ✖ | 👁 | ✖ | ✖ | ✔ | ✔ |
| Edit SEO / AEO / GEO fields | ✖ | ◐ (own) | ✔ | ✔ | ✔ | ✔ | 👁 | ✖ | ✖ | ✖ | ✔ |
| Manage redirects / robots / llms.txt | ✖ | ✖ | ✖ | ✖ | ✔ | ✔ | 👁 | ✖ | ✖ | ✖ | ✔ |
| Moderate comments | ✖ | ✖ | ✖ | ◐ | ✔ | ✖ | 👁 | ✔ | ✖ | ✖ | ✔ |
| Manage ads | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | 👁 | ✖ | ✔ | ✖ | ✔ |
| View analytics | ✖ | ◐ (own) | ◐ | ◐ | ✔ | ✔ | 👁 | ✖ | ✔ (ads) | ✖ | ✔ |
| View audit logs | ✖ | ✖ | ✖ | ◐ | ✔ | ✖ | 👁 | ✖ | ✖ | ✖ | ✔ |
| Export audit/compliance reports | ✖ | ✖ | ✖ | ✖ | ✔ | ✖ | ✔ | ✖ | ✖ | ✖ | ✔ |
| Manage users & roles | ✖ | ✖ | ✖ | ✖ | ◐ (editorial roles) | ✖ | 👁 | ✖ | ✖ | ✖ | ✔ |
| System settings & integrations | ✖ | ✖ | ✖ | ✖ | ✖ | ◐ (SEO) | 👁 | ✖ | ✖ | ✖ | ✔ |
| Use AI assist features | ✖ | ✔ | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✔ |

> The matrix is the default seed; permissions are individually configurable in the CMS (RBAC-001).

---

## Appendix E: Glossary

| Term | Definition |
|---|---|
| **AEO** | Answer Engine Optimization — structuring content so search/answer engines can extract and present it as a direct answer. |
| **GEO** | Generative Engine Optimization — increasing the likelihood content is retrieved, cited or referenced in generative AI responses. |
| **AI SEO** | Using AI to support SEO workflows and optimising for AI-driven discovery. |
| **CMS** | Content Management System. |
| **E-E-A-T** | Experience, Expertise, Authoritativeness, Trustworthiness — quality framework used in search quality guidelines. |
| **SSR** | Server-Side Rendering; HTML generated on the server so crawlers receive full content. |
| **Inertia.js** | Adapter that lets Laravel render React pages without a separate API layer. |
| **JSON-LD** | JSON-based format for linked-data structured markup. |
| **RAG** | Retrieval-Augmented Generation; grounding model output in retrieved documents. |
| **CWV** | Core Web Vitals: LCP, INP, CLS. |
| **Topic hub** | Authoritative landing page aggregating all content and context about a subject. |
| **Hashtag / Tag** | Lightweight, flat label used for cross-cutting discovery. |
| **RBAC** | Role-Based Access Control. |
| **llms.txt** | Proposed file giving LLMs a curated, machine-readable guide to a site's key content. |
| **IndexNow** | Protocol for instantly notifying participating search engines of URL changes. |

---

*End of document — v0.1 Draft*
