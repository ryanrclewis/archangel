---
name: "Archangel Laboratories"
version: "1.0.0"
description: "A civic-minded editorial design system combining warm archival parchment surfaces, 19th-century Sherwin-Williams Heritage neutrals, crisp ink rules, New York editorial serif headlines, and Apple-native sans/mono utility typography."
colors:
  light:
    paper: "#f7f4ec"
    paperWarm: "#d9cfae"
    ink: "#101010"
    muted: "#4a3a2c"
    hairline: "#c2b49a"
    blue: "#005ea8"
    blueDark: "#003a6b"
    red: "#b31942"
    green: "#2e7044"
    amber: "#8f5f00"
    purple: "#5c399b"
    white: "#ffffff"
    onAccent: "#ffffff"
    shellBackground: "rgba(247, 244, 236, 0.94)"
    headerBackground: "rgba(247, 244, 236, 0.96)"
    backdropBackground: "rgba(247, 244, 236, 0.18)"
    cardBackground: "rgba(255, 255, 255, 0.28)"
    cardHoverBackground: "#ffffff"
    tagBackground: "rgba(255, 255, 255, 0.34)"
    paletteFooterBackground: "#ffffff"
  dark:
    paper: "#171817"
    paperWarm: "#2b2a25"
    ink: "#f4f0e6"
    muted: "#b8b0a2"
    hairline: "#5d594f"
    blue: "#78b4e5"
    blueDark: "#9bc7ed"
    red: "#e0647e"
    green: "#83c29a"
    amber: "#d7ad58"
    purple: "#b39ddb"
    white: "#fffdf5"
    onAccent: "#171817"
    shellBackground: "rgba(23, 24, 23, 0.96)"
    headerBackground: "rgba(23, 24, 23, 0.97)"
    backdropBackground: "rgba(23, 24, 23, 0.38)"
    cardBackground: "rgba(255, 255, 255, 0.045)"
    cardHoverBackground: "rgba(255, 255, 255, 0.1)"
    tagBackground: "rgba(255, 255, 255, 0.06)"
    paletteFooterBackground: "#2b2a25"
  categoryArt:
    light:
      default: "linear-gradient(135deg, #d9d9df, #ffffff)"
      blue: "linear-gradient(135deg, #8cb8e0, #e6f0fa)"
      green: "linear-gradient(135deg, #9fc8ad, #edf5ef)"
      amber: "linear-gradient(135deg, #e3c17b, #fff4d8)"
      red: "linear-gradient(135deg, #df9aaa, #fcecef)"
      purple: "linear-gradient(135deg, #bba8da, #f0ebf8)"
    dark:
      default: "linear-gradient(135deg, #34363a, #555860)"
      blue: "linear-gradient(135deg, #315674, #527d9f)"
      green: "linear-gradient(135deg, #365f48, #5b896b)"
      amber: "linear-gradient(135deg, #70582e, #a27c3f)"
      red: "linear-gradient(135deg, #713846, #a85567)"
      purple: "linear-gradient(135deg, #554a70, #7a68a0)"
  values:
    faith: "#6338A8"
    reason: "#3E5163"
    theHumanHeart: "#B81D3A"
    dignity: "#8A2474"
    love: "#8C1D40"
    magnificentHumanity: "#7A421D"
    capital: "#7D6210"
    prosperity: "#1B7A4B"
    light: "#946308"
    truth: "#3D4043"
    hope: "#146C94"
    fraternity: "#2B613E"
    labor: "#A64121"
    subsidiarity: "#2E4799"
    ourCommonHome: "#4F6D2A"
    unity: "#1C4E80"
    life: "#B02230"
    evangelization: "#9C5700"
    charity: "#99265C"
    ourPosterity: "#0F6E6E"
    peaceOnEarth: "#0B63A3"
    liberty: "#1E56A0"
    thePursuitOfHappiness: "#8F5B00"
    theCommonDefense: "#2B3E78"
    justice: "#A61C34"
    domesticTranquility: "#1E6B63"
    theGeneralWelfare: "#246652"
    theUnitedStatesOfAmerica: "#343B82"
typography:
  families:
    serif: '"New York", "Iowan Old Style", "Palatino", "Palatino Linotype", Georgia, serif'
    sans: '"SF Pro Display", "SF Pro Text", "SF Pro", "San Francisco", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif'
    mono: '"SF Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  scale:
    heroH1:
      fontFamily: "{typography.families.serif}"
      fontSize: "clamp(3rem, 6.5vw, 6rem)"
      fontWeight: 500
      lineHeight: 0.99
      letterSpacing: "0"
    sectionH2:
      fontFamily: "{typography.families.serif}"
      fontSize: "clamp(2rem, 4.5vw, 4.5rem)"
      fontWeight: 500
      lineHeight: 0.98
      letterSpacing: "0"
    cardH3:
      fontFamily: "{typography.families.serif}"
      fontSize: "clamp(1.65rem, 3vw, 3rem)"
      fontWeight: 500
      lineHeight: 0.98
      letterSpacing: "0"
    lede:
      fontFamily: "{typography.families.sans}"
      fontSize: "clamp(1.05rem, 2vw, 1.35rem)"
      fontWeight: 400
      lineHeight: 1.5
    prose:
      fontFamily: "{typography.families.sans}"
      fontSize: "1.02rem"
      fontWeight: 400
      lineHeight: 1.72
    body:
      fontFamily: "{typography.families.sans}"
      fontSize: "0.95rem"
      fontWeight: 400
      lineHeight: 1.55
    nav:
      fontFamily: "{typography.families.sans}"
      fontSize: "0.72rem"
      fontWeight: 600
      lineHeight: 1
      letterSpacing: "0.08em"
      textTransform: "uppercase"
    brandMark:
      fontFamily: "{typography.families.mono}"
      fontSize: "0.76rem"
      fontWeight: 400
      letterSpacing: "0.08em"
      textTransform: "uppercase"
    chip:
      fontFamily: "{typography.families.mono}"
      fontSize: "0.75rem"
      fontWeight: 600
      lineHeight: 1
      letterSpacing: "0.08em"
      textTransform: "uppercase"
    button:
      fontFamily: "{typography.families.sans}"
      fontSize: "0.78rem"
      fontWeight: 600
      lineHeight: 1
      letterSpacing: "0.08em"
      textTransform: "uppercase"
    code:
      fontFamily: "{typography.families.mono}"
      fontSize: "0.82rem"
      fontWeight: 400
      lineHeight: 1.55
spacing:
  shellMaxWidth: "1440px"
  contentNarrow: "62rem"
  contentStandard: "72rem"
  contentWide: "78rem"
  headerHeightDesktop: "72px"
  headerHeightMobile: "56px"
  sectionPaddingY: "clamp(2rem, 5vw, 5.5rem)"
  sectionPaddingX: "clamp(1rem, 4vw, 4rem)"
  gridGap: "clamp(1rem, 2vw, 1.5rem)"
  cardPadding: "clamp(1.5rem, 3vw, 2.5rem)"
  xs: "0.35rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "3.5rem"
rounded:
  none: "0px"
  xs: "0.25rem"
  sm: "0.65rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  pill: "999px"
  full: "50%"
components:
  siteShell:
    maxWidth: "{spacing.shellMaxWidth}"
    background: "{colors.light.shellBackground}"
    borderX: "1px solid {colors.light.hairline}"
  siteHeader:
    height: "{spacing.headerHeightDesktop}"
    background: "{colors.light.headerBackground}"
    borderBottom: "inset 0 -1px 0 {colors.light.ink}"
    backdropFilter: "blur(10px)"
  buttonPrimary:
    background: "{colors.light.ink}"
    color: "{colors.light.paper}"
    border: "1px solid {colors.light.ink}"
    borderRadius: "{rounded.pill}"
    minHeight: "44px"
  buttonSecondary:
    background: "transparent"
    color: "{colors.light.ink}"
    border: "1px solid {colors.light.ink}"
    borderRadius: "{rounded.pill}"
    minHeight: "44px"
  projectCard:
    background: "{colors.light.cardBackground}"
    hoverBackground: "{colors.light.cardHoverBackground}"
    borderRadius: "{rounded.xl}"
    padding: "{spacing.cardPadding}"
    minHeight: "24rem"
  projectCardFeatured:
    background: "{colors.light.paperWarm}"
    borderRadius: "{rounded.xl}"
    padding: "{spacing.lg}"
    minHeight: "18rem"
  clientChip:
    borderRadius: "{rounded.pill}"
    minHeight: "2rem"
    padding: "0.3rem 0.6rem"
    fontFamily: "{typography.families.mono}"
    fontSize: "0.75rem"
  commandPalette:
    background: "{colors.light.paper}"
    borderBottom: "1px solid {colors.light.ink}"
    backdrop: "{colors.light.backdropBackground}"
  detailGrid:
    background: "{colors.light.ink}"
    cellBackground: "{colors.light.paper}"
    border: "1px solid {colors.light.ink}"
    gap: "1px"
    borderRadius: "{rounded.none}"
---

# Archangel Laboratories — Design System Reference

## Overview

**Archangel Laboratories** is a civic-minded design and engineering studio building digital tools for families, communities, teams, and public institutions ordered toward human flourishing and the common good.

The visual language blends **archival editorial print** with **modern Apple-native utility craft**:

- **Material Language:** A translucent warm parchment sheet (`--shell-background`) framed by delicate 1px vertical rules (`--hairline`) floating over a full-bleed fixed photographic backdrop (`/background.jpeg` or seasonal `/background.webp`). The site feels like a broadsheet monograph or civic dossier laid over fine art.
- **Color Provenance:** Neutrals derive from 19th-century **Sherwin-Williams Historic Heritage (1820–1920)** pigments — specifically *Colonial Revival Ivory* (`#d9cfae`), *Renwick Beige* (`#c2b49a`), and *Rookwood Dark Brown* (`#4a3a2c`) — paired with crisp printer's ink (`#101010`) and high-legibility civic accents (cobalt blue, crimson red, forest green, ochre amber).
- **Typographic Tension:** Expressive, tightly leaded `New York` serif headlines (`line-height: 0.98–0.99`) anchor every view, contrasted against clean `SF Pro Display` body copy and uppercase tracked `SF Mono` metadata, chips, and badges.
- **Dual Modes & Seasonal Themes:** Full light and dark color schemes (`prefers-color-scheme: dark` plus user-controlled `data-theme="light" | "dark"`), alongside configurable studio themes (`Standard` and `America 250`) that swap the fixed backdrop image and curated hero typewriter phrases.

---

## Colors

### Core Palette Tokens

All UI surfaces, ink, borders, and semantic accents must reference CSS custom properties defined in `app/globals.css`.

| Token | Role | Light Mode | Heritage / Origin | Dark Mode | Notes |
|---|---|---|---|---|---|
| `--paper` | Primary solid canvas | `#f7f4ec` | Warm Archival Parchment | `#171817` | Solid dropdowns, cards, modals, case study figures |
| `--paper-warm` | Secondary / emphasized surface | `#d9cfae` | Colonial Revival Ivory (SW 94432) | `#2b2a25` | Featured project cards, code blocks, table headers |
| `--ink` | Primary text & primary rules | `#101010` | Deep Printer's Ink | `#f4f0e6` | 17.3:1 (light) / 15.6:1 (dark) contrast on `--paper` |
| `--muted` | Secondary copy & labels | `#4a3a2c` | Rookwood Dark Brown (SW 94242) | `#b8b0a2` | 9.9:1 (light) / 8.3:1 (dark) contrast on `--paper` |
| `--hairline` | Subtle dividers & borders | `#c2b49a` | Renwick Beige (SW 94101) | `#5d594f` | Non-text structural framing, inputs, table rules |
| `--blue` | Primary interactive accent / links | `#005ea8` | Civic Cobalt | `#78b4e5` | Inline links, focus rings, info callouts |
| `--blue-dark` | Deep interactive / hover link | `#003a6b` | Deep Navy | `#9bc7ed` | Status text, hover link state, featured badge |
| `--red` | Emphasis, destructive, warning | `#b31942` | Civic Crimson | `#e0647e` | Warning/caution callouts, danger actions |
| `--green` | Positive / Live status | `#2e7044` | Heritage Forest | `#83c29a` | Live status, check-off confirmation |
| `--amber` | In-progress / Attention / Coach | `#8f5f00` | Ochre Amber | `#d7ad58` | Callouts, needs-work indicators, dirty dots |
| `--purple` | Cultural / academic tone | `#5c399b` | Royal Violet | `#b39ddb` | Client tone chips, row hovers, card hover tints |
| `--white` | Pure highlight surface | `#ffffff` | Bright Paper White | `#fffdf5` | Card hover surface in light mode; **do not use as text on pastel dark accents** |
| `--on-accent` | Foreground on solid accent fills | `#ffffff` | High-Contrast Light | `#171817` | Guarantees ≥ 4.5:1 WCAG AA contrast on `--blue`, `--red`, `--green`, `--amber` in both modes |

### Translucent Layer Tokens

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--shell-background` | `rgba(247, 244, 236, 0.94)` | `rgba(23, 24, 23, 0.96)` | Main `1440px` editorial shell over backdrop |
| `--header-background` | `rgba(247, 244, 236, 0.96)` | `rgba(23, 24, 23, 0.97)` | Sticky header with `backdrop-filter: blur(10px)` |
| `--backdrop-background` | `rgba(247, 244, 236, 0.18)` | `rgba(23, 24, 23, 0.38)` | Blurred scrim behind mega-menu & command palette |
| `--card-background` | `rgba(255, 255, 255, 0.28)` | `rgba(255, 255, 255, 0.045)` | Resting project cards and admin panels |
| `--card-hover-background` | `var(--white)` | `rgba(255, 255, 255, 0.1)` | Hovered project card fill |
| `--tag-background` | `rgba(255, 255, 255, 0.34)` | `rgba(255, 255, 255, 0.06)` | Neutral tag chip resting fill |

### Dynamic Value & Phrase Color System (`phraseStyles.ts`)

Each project carries philosophical/civic value phrases (defined in `app/data/value-colors.json`). Rather than rendering raw hex codes directly, `getPhraseThemePalette()` computes WCAG-compliant foreground, tinted background, and border colors for **both** light and dark themes:

- **Contrast floor:** Enforces minimum **5.2:1** in light mode (tested against `#f7f4ec`, `#ffffff`, and `#d9cfae`) and **5.5:1** in dark mode (tested against `#171817`, `#2b2a25`, and `#2f302f`).
- **Light chip recipe:** Tinted background at `0.13` alpha, border at `0.40` alpha, darkened hue-preserving foreground.
- **Dark chip recipe:** Luminous tinted background at `0.20` alpha, border at `0.46` alpha, lightened hue-preserving foreground.
- **Bindings:** Emits `--chip-fg-{light,dark}`, `--chip-bg-{light,dark}`, `--chip-border-{light,dark}`, `--phrase-fg-{light,dark}`, and `--value-hover-color-{light,dark}`.

### Contrast & Foreground Pairing Rule

> **Important:** In dark mode, `--blue` (`#78b4e5`), `--red` (`#e0647e`), `--green` (`#83c29a`), and `--amber` (`#d7ad58`) are high-luminance pastels intended for text/borders on dark paper. When used as **solid button or badge fills**, foreground text MUST use dark ink (`var(--paper)` / `#171817`), never `var(--white)` (`#fffdf5`), to maintain ≥ 4.5:1 WCAG AA contrast.

---

## Typography

### Font Families

Self-hosted `.woff2` fonts in `/public/fonts/`:

| Role | Token | Primary Face | Declared Weights | Fallback Stack |
|---|---|---|---|---|
| **Display & Editorial Headings** | `--font-serif` | `New York` | `400`, `500` | `"Iowan Old Style", "Palatino", "Palatino Linotype", Georgia, serif` |
| **UI & Body Prose** | `--font-sans` | `SF Pro Display` | `400`, `600` | `"SF Pro Text", "SF Pro", "San Francisco", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif` |
| **Metadata, Code & Chips** | `--font-mono` | `SF Mono` | `400`, `600` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |

*Note: Only use weights `400` and `500` for `New York`, and `400` and `600` for `SF Pro Display` and `SF Mono` (avoid `700` unless a bold face is loaded, to prevent faux-bold rendering).*

### Type Scale & Hierarchy

| Style | Font | Size | Weight | Line Height | Tracking / Transform | Usage |
|---|---|---|---|---|---|---|
| **Hero H1** | `New York` | `clamp(3rem, 6.5vw, 6rem)` | `500` | `0.99` | `0` / Sentence | Homepage hero, project detail title (`max-width: 14ch` on home) |
| **Section H2** | `New York` | `clamp(2rem, 4.5vw, 4.5rem)` | `500` | `0.98` | `0` / Sentence | Homepage section headers (`Bespoke`, `Government`, etc.) |
| **Page H1 (Subpages)** | `New York` | `clamp(2.4rem, 5vw, 4.25rem)` | `500` | `1.0–1.02` | `0` / Title | Tag pages, Category pages *(align to serif)*, Admin hero |
| **Card Title H3** | `New York` | `clamp(1.65rem, 3vw, 3rem)` | `500` | `0.98` | `0` / Title | Project cards on homepage and tag listings |
| **Case Study H2** | `New York` | `clamp(1.5rem, 2.5vw, 2rem)` | `500` | `1.2` | `0` / Sentence | Long-form Markdown section headings with bottom hairline |
| **Case Study H3** | `SF Pro Display` | `1.2rem` | `600` | `1.3` | `0` / Sentence | Long-form Markdown subheadings |
| **Lede / Intro** | `SF Pro Display` | `clamp(1.05rem, 2vw, 1.35rem)` | `400` | `1.5` | `0` | Hero subtitle, archive/project intro (`--muted`, `max-width: 48rem`) |
| **Long-Form Prose** | `SF Pro Display` | `1.02rem` | `400` | `1.72` | `0` | Case study body paragraphs (`--ink`) |
| **Card Body** | `SF Pro Display` | `0.95–1rem` | `400` | `1.55` | `0` | Project card descriptions (clamped to 4 lines, `--muted`) |
| **Button Label** | `SF Pro Display` / `SF Mono` | `0.74–0.78rem` | `600` | `1` | `0.06–0.08em` / `UPPERCASE` | Pill CTAs and admin controls |
| **Nav & Metadata** | `SF Pro Display` / `SF Mono` | `0.72–0.76rem` | `600` | `1` | `0.08em` / `UPPERCASE` | Site mark, nav items, card toplines, table headers |
| **Value Chip** | `SF Mono` | `0.75rem` | `600` | `1` | `0.08em` / `UPPERCASE` | Accessible pill badges (minimum `12px` / `0.75rem`) |
| **Code Block** | `SF Mono` | `0.82rem` | `400` | `1.55` | `0` | Fenced code blocks in case studies |

---

## Layout

### Page Framing & Shell

- **Fixed Viewport Backdrop:** `body` renders a full-bleed fixed image (`left/cover no-repeat fixed`), dimmed in dark mode with `rgba(12, 14, 15, 0.78)`.
- **Editorial Shell (`.site-shell`):** Centered `width: min(100%, 1440px)` with `1px solid var(--hairline)` left/right framing on desktop (`> 760px`), collapsing to full-bleed `border: 0` on mobile.
- **Sticky Header (`.site-header`):** `72px` desktop height, `56px` mobile height, spanning full shell width (`z-index: 101`).
- **Global Footer (`.site-footer`):** Single horizontal row (`justify-content: space-between`, wraps cleanly) displaying studio credit, contact email, and social handle. *Should be rendered consistently across all public pages via `PageLayout`.*

### Container Width Tiers

| Tier | Max Width | Usage |
|---|---|---|
| **Shell** | `1440px` (`90rem`) | Outer framed page sheet, homepage grids |
| **Wide** | `78rem` (`1248px`) | Project detail hero |
| **Standard** | `72rem` (`1152px`) | Tag listings, Admin Studio, recommended unified subpage container |
| **Narrow** | `62rem` (`992px`) | Category hero/carousel inset, nav mega-dropdown, command palette |
| **Prose Measure** | `48rem` (`768px` / `~65–75ch`) | `.lede` copy and recommended reading column for case study paragraphs |

### Grid Systems & Breakpoints

- **Homepage & Tag Project Grid:** 2-column CSS Grid (`repeat(2, minmax(0, 1fr))`), `gap: clamp(1rem, 2vw, 1.5rem)`. Featured cards span 2 columns (`grid-column: span 2`).
- **Project Detail Specs (`.detail-grid`):** 2-column hairline bento (`1.35fr` Highlights / `0.65fr` Links) using `gap: 1px; background: var(--ink)` for crisp 1px interior rules.
- **Category Lineup:** Horizontal scroll-snap flex track (`scroll-snap-type: x mandatory`) with `20rem` (`min(78vw, 20rem)`) cards and calculated edge inset.
- **Responsive Breakpoints:**
  - `≤ 1080px`: 3-column layouts collapse to 2 columns.
  - `≤ 960px`: Admin 4-up stats collapse to 2-up; editor sidebar stacks above form.
  - `≤ 768px`: Unified mobile navigation breakpoint (header switches from inline nav to mobile drawer, header height shifts to `56px`, all grids collapse to `1fr`, portrait embeds stack).
  - `≤ 430px`: `h1` floors at `3rem`; primary/secondary CTA buttons expand to `width: 100%`.

---

## Elevation & Depth

Archangel Laboratories relies on **tonal surface layering and crisp 1px rules** rather than heavy drop shadows.

### Layering Stack

1. **Layer 0 — Fixed Backdrop:** Full-bleed photograph (`--body-background`).
2. **Layer 1 — Editorial Sheet:** Translucent parchment `.site-shell` (`94%` light / `96%` dark opacity).
3. **Layer 2 — Content Surfaces:** Translucent cards (`--card-background`), warm inset blocks (`--paper-warm`), and solid `--paper` detail cells.
4. **Layer 3 — Sticky Chrome:** `.site-header` (`z-index: 101`) with `backdrop-filter: blur(10px)` and `inset 0 -1px 0 var(--ink)`.
5. **Layer 4 — Sheet Overlays:** Full-width top-anchored dropdowns (`.site-nav-dropdown`, `.command-palette`, `z-index: 100`) paired with a frosted full-shell scrim (`.site-nav-backdrop`, `.command-palette-backdrop`, `z-index: 98–99`, `backdrop-filter: blur(12px) saturate(0.82)`).
6. **Layer 5 — Floating Controls & Notifications:** Theme toggle (`z-index: 110`) and admin status toasts (`z-index: 140`).

### Shadow Scale

| Level | Value | Usage |
|---|---|---|
| **Flat** | `none` | Cards at rest, hairline grids, callouts, tables |
| **Subtle Lift** | `0 3px 10px rgba(16, 16, 16, 0.1)` | Hovered interactive tag chips in command palette |
| **Dropdown Sheet** | `0 20px 40px rgba(16, 16, 16, 0.08)` | Expanded mega-nav dropdown and command palette |
| **Floating Toast** | `0 14px 32px rgba(0, 0, 0, 0.2)` | Admin feedback toast |

---

## Shapes

| Token | Value | Application |
|---|---|---|
| **Architectural (`none`)** | `0px` | Editorial shell, sticky header, mega-dropdown, command palette, project detail bento grid, embedded iframes |
| **Micro (`xs`)** | `0.25rem` (`4px`) | Keyboard shortcut badges (`<kbd>`), inline code pills (`0.3rem`) |
| **Small (`sm`)** | `0.65rem` (`~10px`) | Category art tiles, admin inputs/selects, heritage swatches |
| **Medium (`md`)** | `0.75rem` (`12px`) | Case study code blocks, callouts, tables, figures, Mermaid diagrams |
| **Large (`lg`)** | `1rem` (`16px`) | Admin stat cards, project list cards, sticky editor bar |
| **Extra Large (`xl`)** | `1.5rem` (`24px`) | Homepage & tag project cards, admin panels |
| **Pill (`pill`)** | `999px` | Primary/secondary CTA buttons, value chips, card "Learn more" CTA, admin tabs/pills/toasts |
| **Circle (`full`)** | `50%` | Carousel previous/next controls, floating theme toggle, status indicator dots |

---

## Motion & Micro-interaction

- **Primary Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (crisp editorial deceleration) for sheet reveals and emoji lifts; standard `ease` for opacity/color fades.
- **Durations:**
  - `140–160ms`: Color, border, opacity, and subtle lift (`translateY(-1px)` / `translateY(-2px)`).
  - `180–240ms`: Header transitions, backdrop blur fades, dropdown close.
  - `300ms`: Mega-menu and Command Palette open (`max-height`, `clip-path: inset(0)`, `scaleY(1)`).
- **Signature Micro-interactions:**
  - **Hover-Revealed Emoji:** Navigation links and dropdown items keep emojis hidden (`opacity: 0; scale(0.8)`) at rest and reveal them smoothly on hover/focus. Project card emojis perform a subtle playful tilt (`translateY(-2px) scale(1.15) rotate(-4deg)`).
  - **Value-Tinted Title Hover:** Hovering a project card shifts its `New York` serif `h3` to the WCAG-verified accent color of its primary value phrase.
  - **Hero Typewriter:** Types at `80ms/char`, pauses `1400ms`, deletes at `40ms/char`, with a `1s steps(1)` blinking block caret.
  - **Sibling Dimming:** Opening a header menu dims inactive nav items to `opacity: 0.55` to focus attention.

---

## Voice & Content Strategy

- **Tone:** Civic-minded, dignified, clear, and humane — avoiding startup hype or consumer-electronics clichés.
- **Philosophical Anchoring:** Hero typewriter phrases link directly to primary civic and philosophical texts (founding documents and social encyclicals), establishing the studio's moral horizon.
- **Microcopy Standards:**
  - Use plain, direct labels (`Start a project`, `View work`, `Learn more`, `Highlights`, `Links`).
  - Keep project card taglines to a crisp 1–2 sentences (hard-clamped to 4 lines).
  - Case studies follow structured technical-editorial prose: concise overview, numbered lists, GFM comparison tables, GitHub-style semantic callouts (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`), captioned figures, and architecture diagrams.

---

## Components

### 1. Site Header & Mega-Dropdown (`SiteHeader`)
- **Structure:** Left `.site-mark` (32×32 icon + uppercase mono title); right `.site-nav` (4 category menus: `Bespoke`, `Government`, `Industry`, `Research` + `Search ⌘K` trigger).
- **Behavior:** Hover or keyboard focus opens a full-width top-anchored dropdown sheet (1 column for ≤ 5 projects, 2 columns for > 5 projects) with a `180ms` close grace timer. Clicking the nav item navigates directly to `/categories/[category]`.
- **Mobile (`≤ 768px`):** Replaces inline nav with a 3-bar hamburger toggle opening a `320px` right slide-over drawer.

### 2. Primary & Secondary Buttons (`.button-primary`, `.button-secondary`)
- **Geometry:** Pill-shaped (`999px`), `min-height: 44px`, `1px solid var(--ink)`, uppercase `0.78rem`, `letter-spacing: 0.08em`.
- **States:**
  - Primary: Solid `var(--ink)` fill, `var(--paper)` text.
  - Secondary: Transparent fill, `var(--ink)` text.
  - Hover/Focus: Use a consistent high-contrast interactive state across both light and dark modes (e.g., `var(--blue)` with `var(--paper)` or inverted `var(--ink)`/`var(--paper)` — avoid `--white` on pastel dark accents).

### 3. Project Card (`.project-card`)
- **Anatomy:**
  1. `.project-card-topline`: Uppercase project type on left; optional `FEATURED` badge + emoji on right.
  2. `h3`: `New York` serif title (transitions to primary value color on hover).
  3. `p`: 4-line clamped tagline/description in `--muted`.
  4. Optional `.what-it-proves` (featured cards only): Mono callout with `2px solid var(--hairline)` left rule.
  5. `ProjectClients`: Row of WCAG-computed `.client-chip` value pills.
  6. `.project-card-link`: Pill CTA (`Learn more`) that inverts to `--ink` / `--paper` on card hover.
- **Featured Variant (`.project-card--featured`):** Spans 2 columns on desktop with solid `--paper-warm` surface.

### 4. Value & Phrase Chips (`.client-chip`)
- **Anatomy:** Pill (`999px`), `min-height: 2rem` (`32px`), `SF Mono` `0.75rem`, uppercase `0.08em` tracking.
- **Coloring:** Driven dynamically by `getPhraseChipStyle()` with light/dark CSS custom properties guaranteeing ≥ 5.2:1 (light) / ≥ 5.5:1 (dark) contrast.
- **Interactive Variant:** Used in Command Palette and Tag Switcher (`/tags/[tag]`) as clickable `<Link>` pills with item count badges and active `1.5px` currentColor ring.

### 5. Command Palette (`CommandPalette`)
- **Trigger:** `⌘K` / `Ctrl+K`, hover, or click on header `Search`.
- **Anatomy:** Top-anchored sheet matching `.site-nav-dropdown` mechanics. Contains a `1.25–1.6rem` borderless search input (`border-bottom: 1px solid var(--muted)`), horizontally scrollable tag chips when empty, `Quick Links` with `→` prefixes, and keyboard-navigable (`↑`/`↓`/`Enter`/`Esc`) search results.

### 6. Project Detail & Case Study Markdown (`ProjectPage`, `CaseStudyMarkdown`)
- **Hero:** Full-width `New York` `h1`, uppercase `.detail-meta` (type, launch date, optional italicized `.degree-meta`), value chips, and `.lede`. Supports side-by-side portrait embeds (`max 390px`) or full-width landscape embeds.
- **Specs Grid:** Sharp `1px solid var(--ink)` 2-column `.detail-grid` pairing `Highlights` (bulleted hairline list) and `Links` (primary pill buttons).
- **Case Study:** Separated by `1px solid var(--ink)`. Renders `New York` `h2`s with bottom hairlines, `SF Pro Display` `h3`s, `SF Mono` `h4`s, tinted `0.75rem`-radius code blocks, bordered tables with `--paper-warm` headers, semantic callouts (`note`/`tip` in `--blue`, `important` in `--amber`, `warning`/`caution` in `--red`), captioned figures, and theme-reactive Mermaid diagrams.

### 7. Floating Theme Toggle (`ThemeToggle`)
- **Placement:** Fixed bottom-right (`1.25rem` desktop, `0.85rem` mobile), `3.15rem` circular button (`z-index: 110`) rotating a split contrast icon `180deg` between light and dark modes.
- **Styling & Optional Variant:** Defaults to the editorial paper-and-ink style (`--paper` surface, `--ink` icon, `1px solid var(--hairline)` border, `--paper-warm` hover). An alternate Liquid Glass variant (`.theme-toggle--liquid-glass`) is preserved behind the `USE_LIQUID_GLASS` boolean in `app/components/ThemeToggle.tsx` for one-line switching.

### 8. Admin Studio (`/admin`)
- Built directly on the site's core tokens (`--paper`, `--ink`, `--muted`, `--hairline`, `--blue`, `--amber`, `--red`, `--green`) inside `PageLayout`.
- Uses `1.5rem` rounded `.admin-panel` containers, 4-up `.admin-stats` cards with `New York` serif metrics, pill tab navigation with amber dirty-state indicators, live palette/card previews, and a 40-color Sherwin-Williams Historic Heritage picker.

---

## Do's and Don'ts

### Do
- **Do** use semantic CSS variables (`--paper`, `--paper-warm`, `--ink`, `--muted`, `--hairline`, `--blue`, `--red`, `--green`, `--amber`) for all colors — never hardcode hex values or light-only `rgba(16, 16, 16, ...)` tints.
- **Do** use `New York` (`var(--font-serif)`, weight `500`) for all `h1` and `h2` display headings across every page (including Category pages).
- **Do** route all value/phrase colors through `phraseStyles.ts` (`getPhraseChipStyle`, `getPhraseAccentVars`, `getValueHoverVars`) so light and dark WCAG AA contrast is mathematically guaranteed.
- **Do** pair bright dark-mode accent fills (`--blue`, `--red`, `--green`, `--amber`) with dark ink text (`var(--paper)`), not `var(--white)`.
- **Do** keep visible `:focus-visible` rings (`2px solid var(--blue); outline-offset: 2px`) on every interactive link, card, row, and button.
- **Do** wrap all public pages in `PageLayout` with consistent header, container width, and footer chrome.
- **Do** constrain long-form reading copy to a comfortable editorial measure (`45–52rem` / `~65–75ch`).

### Don't
- **Don't** mix unrelated visual metaphors (e.g., glossy iOS Liquid Glass or stark `#000`/`#fff`) into the warm parchment-and-ink editorial system.
- **Do** preserve `public/icon.svg` (wing mark) and native Apple-platform stock emojis across section headers, nav hover reveals, and project cards as part of the studio's intentional identity.
- **Don't** use `var(--red)` as the hover color for neutral primary CTAs — reserve `--red` for destructive actions, warnings, and intentional editorial highlights.
- **Don't** declare `font-weight: 700` on `SF Pro Display` or `SF Mono` without loading a 700 weight face; use `600` (Semibold).
- **Don't** scope shared utility classes (like `.search-hint`) inside unrelated parent selectors (`.command-palette-trigger .search-hint`), or leave unstyled class names (`.archive-empty`) and undefined CSS variables (`--typewriter-hover-color`) in stylesheets.
- **Don't** duplicate entire dark-mode token blocks or hardcode `LIGHT_PAPER` / `DARK_PAPER` values without keeping `globals.css`, `phraseStyles.ts`, and `/api/admin/colors` synchronized.
