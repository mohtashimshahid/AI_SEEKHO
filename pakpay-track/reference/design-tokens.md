---
name: PakPay Track
colors:
  surface: '#0e1321'
  surface-dim: '#0e1321'
  surface-bright: '#343948'
  surface-container-lowest: '#090e1c'
  surface-container-low: '#161b2a'
  surface-container: '#1a1f2e'
  surface-container-high: '#252a39'
  surface-container-highest: '#303444'
  on-surface: '#dee2f6'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dee2f6'
  inverse-on-surface: '#2b303f'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#ffafd3'
  on-tertiary: '#620040'
  tertiary-container: '#f876ba'
  on-tertiary-container: '#72004b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#ffafd3'
  on-tertiary-fixed: '#3d0026'
  on-tertiary-fixed-variant: '#85145a'
  background: '#0e1321'
  on-background: '#dee2f6'
  surface-variant: '#303444'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-mobile: 1.25rem
  container-padding-desktop: 2.5rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is engineered for the modern Pakistani freelancer—highly skilled, globally connected, and tech-savvy. The visual narrative balances high-stakes professionalism with the kinetic energy of a startup. It utilizes a **Glassmorphic-Industrial** style, characterized by deep, layered backgrounds and luminous interactive elements.

The UI evokes an emotional response of security and technical superiority. By utilizing high-contrast accents against a midnight canvas, the system ensures that critical financial data (invoices, status, and earnings) remains the focal point while providing a premium, "pro-tool" experience.

## Colors

The palette is anchored by **Deep Midnight Navy (#0A0F1D)** to provide maximum depth and minimize eye strain during late-night billing sessions. 

- **Primary Accent:** Vibrant Emerald Green (#10B981) represents financial growth and success, used for primary actions and "Paid" statuses.
- **Secondary Highlight:** Neon Cyan (#22D3EE) is used for data visualization, progress bars, and "Active" states.
- **Surface & Borders:** Surfaces utilize semi-transparent white overlays with a 10% border opacity to create the glass effect, ensuring the UI feels light and layered despite the dark background.

## Typography

This design system uses a dual-font strategy. **Outfit** is utilized for headlines and titles to provide a geometric, modern, and friendly character. **Inter** is reserved for body text and data-heavy tables to ensure maximum legibility at small sizes.

Headings should always be pure white (#FFFFFF) to contrast sharply against the dark background. Body text should use a muted slate-grey (#94A3B8) to establish a clear information hierarchy and reduce visual noise in long-form content.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

- **Desktop:** 12 columns, 24px gutters, max-width of 1440px.
- **Dashboard:** Side-navigation remains fixed at 280px, while the main content area expands fluidly.
- **Spacing Rhythm:** All margins and paddings should be increments of 4px. Use generous `stack-lg` spacing between card sections to maintain the airy, "glassy" feel of the interface.

## Elevation & Depth

Depth is conveyed through **Glassmorphism** and **Tonal Layering** rather than traditional shadows.

1.  **Level 0 (Base):** Deep Midnight Navy (#0A0F1D).
2.  **Level 1 (Cards/Containers):** Background blur (12px) with 5% white tint and a 1px solid border at 10% white.
3.  **Level 2 (Modals/Popovers):** Background blur (20px) with 10% white tint and a subtle outer glow using the Primary Accent color (Emerald) at 5% opacity.

Avoid drop shadows on text. Interactive elements should "glow" on hover rather than lift, using a box-shadow with a high spread and low opacity of the accent color.

## Shapes

The design system employs a **Rounded (2xl)** shape language. The primary radius is 1rem (16px) for standard cards and components. This softness offsets the high-contrast "tech" look, making the platform feel more approachable and user-friendly.

Interactive elements like buttons and chips should utilize the `rounded-xl` (24px) or `rounded-full` (pill) patterns to distinguish them from structural containers.

## Components

### Buttons
- **Primary:** Solid Emerald Green background with dark navy text. Rounded-xl. On hover, apply a 20px cyan outer glow.
- **Secondary:** Transparent background with 1px border (Emerald). Text in Emerald.
- **Ghost:** Transparent background, white text. Underline on hover.

### Inputs
- **Field:** Dark Navy background (slightly lighter than base), 1px border (White/10). On focus, border transitions to Neon Cyan with a subtle 4px cyan outer glow.
- **Label:** Small, uppercase Inter, muted grey, positioned above the field.

### Cards
- **Invoice Card:** Glassmorphic background, 16px padding. Include a vertical "status accent" bar on the left edge (Emerald for paid, Cyan for pending).

### Chips/Tags
- **Status Tags:** Pill-shaped with a low-opacity background of the status color (e.g., Emerald/10) and high-opacity text.

### Dashboard Widgets
- **Gradient Glow:** Use a radial gradient background (Secondary color to transparent) behind key metrics to create a "holographic" focus area.