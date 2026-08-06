---
name: Kinetic Enterprise
colors:
  surface: '#031427'
  surface-dim: '#031427'
  surface-bright: '#2a3a4f'
  surface-container-lowest: '#000f21'
  surface-container-low: '#0b1c30'
  surface-container: '#102034'
  surface-container-high: '#1b2b3f'
  surface-container-highest: '#26364a'
  on-surface: '#d3e4fe'
  on-surface-variant: '#c2c6d9'
  inverse-surface: '#d3e4fe'
  inverse-on-surface: '#213145'
  outline: '#8c90a2'
  outline-variant: '#424656'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#0062ff'
  on-primary-container: '#f3f3ff'
  inverse-primary: '#0053da'
  secondary: '#43f09c'
  on-secondary: '#00391f'
  secondary-container: '#01d382'
  on-secondary-container: '#005531'
  tertiary: '#ffb59c'
  on-tertiary: '#5c1900'
  tertiary-container: '#c84000'
  on-tertiary-container: '#fff1ed'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#56ffa9'
  secondary-fixed-dim: '#2ce28f'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#00522f'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832700'
  background: '#031427'
  on-background: '#d3e4fe'
  surface-variant: '#26364a'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  arabic-body:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 260px
  sidebar-collapsed: 64px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system embodies a **Corporate / Modern** aesthetic with a strong emphasis on high-performance utility. It strikes a balance between the streamlined efficiency of Linear and the robust information density of GitHub. The visual language is defined by precision, using ample whitespace and structural clarity to reduce cognitive load in complex task management environments. 

The personality is authoritative yet approachable—avoiding decorative flair in favor of functional elegance. The interface should feel like a high-end professional tool: fast, reliable, and meticulously organized. Surfaces are clean, borders are soft, and the overall atmosphere is one of focused productivity.

## Colors

The palette is anchored by a vibrant "Pilot Blue" (Primary) and "Momentum Green" (Secondary), optimized for clarity and professional impact within a high-density interface.

- **Dark Mode:** The primary color mode. It utilizes a "Deep Navy" foundation, moving away from pure black to maintain depth and sophisticated shadows. Primary and Secondary colors use a fidelity variant to ensure they remain vibrant and accessible against dark surfaces.
- **Light Mode:** An available theme variant. It transitions to a clean, high-clarity white and soft gray foundation to provide a crisp, editorial feel. 
- **Functional Colors:** Primary blue is reserved for critical actions and active states. Secondary green is used sparingly for success indicators and growth-oriented data visualizations. Neutral slate tones provide structural scaffolding and secondary text clarity.

## Typography

The system utilizes **Inter** for all English Latin scripts to ensure maximum legibility and a systematic, tech-forward appearance. For Arabic localization, **Cairo** is implemented, chosen for its modern geometric structure that complements Inter’s proportions.

The type scale is strictly functional. Headlines use tighter letter spacing and heavier weights to establish clear hierarchy, while body text maintains a generous line height (1.5x) to facilitate long reading sessions in task descriptions and reports. A dedicated "Label" tier is used for metadata, badges, and small UI hints.

## Layout & Spacing

The layout utilizes a **fixed-fluid hybrid model**. The sidebar is a fixed-width element (`260px`) that can collapse into a rail icon view to maximize the primary work area. The main content area is fluid but capped at a `1440px` max-width to prevent line lengths from becoming unreadable on ultra-wide monitors.

**Breakpoints:**
- **Desktop (1024px+):** Full sidebar + wide content.
- **Tablet (768px - 1023px):** Sidebar collapses to an icon rail or remains hidden via a hamburger trigger.
- **Mobile (<767px):** Content is full-width with `16px` side margins; navigation resides in a bottom-sheet or full-screen drawer.

A strict 8px spacing grid ensures vertical rhythm. All component spacing should be multiples of 4px or 8px.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** supplemented by **Ambient Shadows**. In the primary Dark Mode, depth is communicated by subtle shifts in surface luminosity and deep, soft shadows to maintain a sophisticated atmosphere.

- **Level 0 (Base):** Background color (`surface`).
- **Level 1 (Cards/Sidebar):** Raised slightly with a `1px` subtle border and a faint shadow.
- **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow and increased border contrast to separate the element from the background layers.

No glassmorphism is used. Contrast and clear borders are the primary drivers of depth.

## Shapes

The design system employs a **Rounded** (Level 2) shape language. This provides a "soft-enterprise" feel—professional enough for a SaaS environment but modern enough to feel accessible.

- **Standard Elements (Buttons, Inputs):** `0.5rem` (8px) radius.
- **Containers (Cards, Large Sections):** `1rem` (16px) radius.
- **Interactive Floating Elements (Modals, Toasts):** `1.5rem` (24px) radius.

This consistency in rounding helps soften the high-density information layout, making the interface feel less intimidating.

## Components

### Buttons
- **Primary:** High-contrast Pilot Blue with white text. Solid fill.
- **Secondary:** Surface-container-high (Dark Mode) or Slate-100 (Light Mode) with a subtle border.
- **Ghost:** No background or border until hover. Used for table actions.
- **Interaction:** Subtle `y-1` translation on click to provide tactile feedback.

### Input Fields
- Use a `1px` border. In Dark Mode, use a subtle outline that brightens on focus. On focus, the border transitions to Primary Blue with a `3px` soft outer glow (halo) in the same color at 10% opacity.

### Cards
- Lightweight containers with a `1px` border. Cards should use a slightly lighter surface color than the background to create a tiered visual hierarchy.

### Navigation
- **Sidebar:** Uses high-contrast icons (React Icons) and semi-bold text. Active states are indicated by a Primary Blue vertical bar on the left and a subtle background tint.
- **Command Palette (Ctrl + K):** A centered modal with a search input, using Level 2 elevation and a backdrop dimming effect to focus the user.

### Data Visualization
- Charts must use a refined palette: Primary Blue for the main trend, Secondary Green for positive comparisons, and Neutral Slate for baseline data. Avoid 3D effects or heavy gradients.