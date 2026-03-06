# AROCK Design System Overhaul — Implementation Plan

## Summary
Full visual overhaul of nickscarabosio.com to adopt AROCK's design language: monochrome palette, vw-based typography, perspective text reveals, clip-path image wipes, WebGL canvas rendering, and refined GSAP animations with AROCK's cubic-bezier curves.

---

## Phase 1: Design Tokens & Typography

### 1.1 Update Color Palette (global.css)
- Replace lime accent system with monochrome:
  - `--color-bg-primary: #1a1a1a`
  - `--color-bg-secondary: #111111`
  - `--color-bg-tertiary: #0a0a0a`
  - `--color-text-primary: #ffffff`
  - `--color-text-secondary: #b1b1b1`
  - `--color-text-muted: #666666`
  - `--color-accent: #ffffff` (monochrome — white is the accent)
  - `--color-accent-dim: #b1b1b1`
  - `--color-border: #2a2a2a`
  - `--color-border-hover: #444444`

### 1.2 Swap Fonts to Closer Match
- Keep Instrument Serif for headings (it's already a quality serif, closest available match to AROCK's custom "a" font)
- Add a heavier weight (700/800 via Outfit or swap to Inter/DM Sans for body) — AROCK uses weight 800 for headings
- Install `@fontsource/inter` or similar geometric sans as body font to better match AROCK's "u" font
- Update `--font-heading` and `--font-body` variables

### 1.3 VW-Based Typography Scale
Replace clamp-based scale with AROCK-style vw units:
- `--text-h1: 8.3333vw` (weight 800, line-height 7.2917vw, letter-spacing -.02em)
- `--text-h2: 5.2083vw` (weight 800, line-height 4.6875vw)
- `--text-h3: 2.0833vw` (line-height 2.0833vw, letter-spacing -.02em)
- `--text-body: 0.9375vw` (weight 700, line-height 1.25vw) — slightly larger than AROCK's 0.625vw for readability
- `--text-label: 0.625vw` (weight 700, line-height 0.8333vw)
- Keep clamp wrappers for mobile sanity (min 14px for body, min 32px for h1)

### 1.4 Update Easing/Motion Tokens
- `--ease-out: cubic-bezier(.16, 1, .3, 1)` (AROCK's --o6)
- `--ease-out-soft: cubic-bezier(.22, 1, .36, 1)` (AROCK's --o5)
- `--duration-reveal: 600ms`
- `--reveal-delay: 150ms`

---

## Phase 2: Animation System Overhaul

### 2.1 CSS Text Reveal System (animations.css)
Add AROCK's signature text-reveal classes:
```css
/* Text reveal container */
.text-reveal {
  perspective: 12.5vw;
  overflow: hidden;
}

/* Hidden state */
.text-reveal-line {
  display: block;
  transform: translate3d(0, 110%, 0) rotateX(-10deg);
  transform-origin: bottom;
  transition: transform 600ms cubic-bezier(.16, 1, .3, 1);
}

/* Visible state */
.text-reveal-line.is-visible {
  transform: translate3d(0, 0, 0) rotateX(0deg);
}
```

### 2.2 Image/Video Clip-Path Reveal
```css
.media-reveal {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 800ms cubic-bezier(.16, 1, .3, 1);
}

.media-reveal.is-visible {
  clip-path: inset(0 0 0 0);
}
```

### 2.3 Update GSAP Animations in Components
- Replace `power2.out` easing with custom ease matching AROCK's curves
- Add perspective transforms (rotateX) to text entrance animations
- Increase stagger delays to 150ms (AROCK's style)
- Use translate3d instead of simple y transforms for GPU acceleration

### 2.4 Remove Old Animations
- Remove glitch, glow-pulse, float, border-pulse keyframes
- Replace with AROCK-aligned reveals

---

## Phase 3: Component Redesign

### 3.1 Nav (Nav.astro)
- Switch to minimal monochrome nav
- Remove gradient background, use clean transparent → blur on scroll
- Update text colors from accent-based active state to white underline
- Adjust font sizing to vw units
- Add AROCK-style hover: subtle opacity + translate on hover

### 3.2 Hero (Hero.astro)
- **Remove** radial gradient background (no colored accents)
- **Rewrite** text animation: use perspective text reveal (words slide up with rotateX)
- Switch h1 to vw-sized type (8.3333vw)
- Replace lime CTA buttons with monochrome white-border style
- Remove social links from hero (cleaner, AROCK-like)
- Keep scroll indicator but restyle (white, minimal)

### 3.3 About (About.astro)
- Remove `SectionLabel` colored accent
- Update heading: remove accent-colored span, all white
- Apply text-reveal animation to heading lines
- Stagger paragraph reveals with AROCK timing (600ms, 150ms stagger)

### 3.4 Ventures (Ventures.astro)
- Restyle cards: remove rounded corners (or minimal), no colored borders
- Remove accent-colored labels and glow effects
- Use clean white border, subtle hover state (translate-y + opacity)
- Update card typography to match AROCK aesthetic

### 3.5 VentureCard (VentureCard.astro)
- Strip lime/accent colors
- Remove glow hover effect
- Clean border style with white text
- Remove rounded-2xl, use subtle or no rounding

### 3.6 CTABlock (CTABlock.astro)
- Monochrome restyle
- Text reveal animation on heading
- White border button

### 3.7 Button (Button.astro)
- Primary: white background, dark text (invert of current)
- Ghost: white border, white text, no colored hover
- Remove rounded-full lime styling
- Add AROCK-style hover transition (subtle scale or opacity)

### 3.8 SectionLabel (SectionLabel.astro)
- Change from accent color to muted white/gray
- Keep uppercase tracking style

### 3.9 CustomCursor (CustomCursor.astro)
- Change from lime accent to white
- Keep behavior, just update colors

### 3.10 SocialLinks (SocialLinks.astro)
- Remove accent hover colors, use white
- Clean monochrome style

### 3.11 MobileMenu (MobileMenu.astro)
- Update to monochrome
- Add staggered delays matching AROCK (0ms, 60ms, 120ms per child)
- Remove accent hover color

### 3.12 Footer (Footer.astro)
- Monochrome cleanup
- Remove accent colors

### 3.13 Contact Page (contact.astro)
- Monochrome form styling
- White border inputs, white focus state
- White submit button with dark text

---

## Phase 4: WebGL Canvas Layer

### 4.1 Create WebGL Component (WebGLCanvas.astro)
- Add a `<canvas id="webgl-canvas">` element in BaseLayout
- Position fixed behind content (z-index: -1) or as image renderer
- Initialize WebGL context with `{ antialias: true, alpha: true }`

### 4.2 Shader Pipeline
- **Vertex shader**: Basic mesh transform with 4x4 matrix, parallax offsets
- **Fragment shader**: Texture sampling with optional grayscale conversion, luminosity adjustment, soft-edge clipping via `fwidth()`

### 4.3 Texture Management
- Load images as WebGL textures
- Support static images (preloaded) and lazy-loaded content
- Handle viewport resize and DPR

### 4.4 Scroll-Linked Effects
- Parallax displacement on scroll (via Lenis scroll position)
- Subtle depth/luminosity shifts as content scrolls into view
- Integrate with GSAP ScrollTrigger for timing

### 4.5 Fallback
- Add `<div class="webgl-fallback">` with standard `<img>` tags for browsers without WebGL support
- Feature-detect WebGL availability

---

## Phase 5: Page Transitions

### 5.1 Enhance Astro View Transitions
- Replace simple `fade` with custom AROCK-style transitions:
  - Exit: content slides up + fades out
  - Enter: content slides up from below with staggered text reveals
- Use `transition:animate` with custom animation definitions

---

## Phase 6: Performance & Polish

### 6.1 Font Optimization
- Add `<link rel="preload">` for font files
- Ensure `font-display: swap` on all @font-face rules

### 6.2 CSS Cleanup
- Remove all `--color-accent: #c8ff00` references
- Ensure no lime green appears anywhere
- Update `::selection` to monochrome (white bg, dark text)

### 6.3 Responsive Adjustments
- VW typography needs mobile floor values (use clamp or media queries for < 768px)
- Test WebGL canvas on mobile (consider disabling on low-power devices)

---

## Files to Modify
1. `src/styles/global.css` — Design tokens, base styles
2. `src/styles/animations.css` — New reveal animations
3. `src/layouts/BaseLayout.astro` — Font imports, WebGL canvas
4. `src/layouts/PageLayout.astro` — Transition updates
5. `src/components/layout/Nav.astro` — Monochrome nav
6. `src/components/layout/MobileMenu.astro` — Staggered reveals
7. `src/components/layout/Footer.astro` — Monochrome
8. `src/components/sections/Hero.astro` — Full rework
9. `src/components/sections/About.astro` — Text reveals
10. `src/components/sections/Ventures.astro` — Card restyle
11. `src/components/sections/CTABlock.astro` — Monochrome
12. `src/components/ui/Button.astro` — Monochrome variants
13. `src/components/ui/VentureCard.astro` — Clean restyle
14. `src/components/ui/SectionLabel.astro` — Color update
15. `src/components/ui/CustomCursor.astro` — White cursor
16. `src/components/ui/SocialLinks.astro` — Monochrome
17. `src/pages/contact.astro` — Form restyle
18. `package.json` — Add Inter font package

## New Files
19. `src/components/ui/WebGLCanvas.astro` — WebGL rendering component

## Execution Order
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
