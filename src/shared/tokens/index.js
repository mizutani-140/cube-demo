/**
 * Design Tokens - Architectural Editorial Design System
 *
 * Aesthetic: Japanese spatial harmony meets editorial boldness
 * 「間」- The beauty of intentional space
 *
 * Direction: Dramatic asymmetry, vertical Japanese text,
 * bold typography, architectural precision with warmth
 */

// ============================================
// COLOR SYSTEM
// ============================================

export const colors = {
  // Primary brand - Aged brass/antique gold
  gold: '#b8941f',
  goldLight: '#d4af37',
  goldDark: '#8a6f17',
  goldMuted: 'rgba(184, 148, 31, 0.12)',
  goldVibrant: '#e6c229',

  // Background - Rich, ink-like blacks with warmth
  bg: {
    primary: '#06060a',
    secondary: '#0c0c12',
    tertiary: '#14141c',
    elevated: '#1a1a24',
    card: '#101016',
    warm: '#0a0908',
    paper: '#f5f2eb',       // For light sections
    paperDark: '#e8e4d9',
  },

  // Accent colors - Cool & Sharp
  accents: {
    works: '#C7B99A',       // Pale gold - Works
    about: '#8A9BAD',       // Light steel - About
    access: '#5BA4C9',      // Sky blue - Access
    contact: '#C8CDD5',     // Light gray - Contact
    food: '#c43d3d',        // Deep red - LambCHAN
    gallery: '#5FAD8B',     // Sage green - Life Nostalgia
  },

  // Text hierarchy - Warmer whites
  text: {
    primary: '#f8f6f1',
    secondary: 'rgba(248, 246, 241, 0.75)',
    tertiary: 'rgba(248, 246, 241, 0.50)',
    muted: 'rgba(248, 246, 241, 0.28)',
    accent: '#b8941f',
    inverse: '#06060a',
    // Japanese text specific
    brushBlack: '#1a1814',
    inkGray: '#3d3a35',
  },

  // UI elements
  ui: {
    border: 'rgba(248, 246, 241, 0.06)',
    borderHover: 'rgba(248, 246, 241, 0.14)',
    borderActive: 'rgba(184, 148, 31, 0.5)',
    divider: 'rgba(248, 246, 241, 0.04)',
    overlay: 'rgba(6, 6, 10, 0.92)',
    overlayLight: 'rgba(6, 6, 10, 0.7)',
    grain: 'rgba(248, 246, 241, 0.02)',
  },
};

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font families - Bold, distinctive choices
  fontFamily: {
    // Custom display font for brand/logo
    brand: "'Magnum', 'Arial Black', sans-serif",
    // Custom display font for headings
    display: "'GeosansLight', 'Fraunces', 'Playfair Display', serif",
    // Japanese sans for body text
    japanese: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
    // Geometric sans with character
    body: "'Noto Sans JP', 'Sora', sans-serif",
    // Technical/accent monospace
    mono: "'IBM Plex Mono', 'JetBrains Mono', monospace",
    // Ultra-condensed for impact
    condensed: "'Antonio', 'Bebas Neue', sans-serif",
    // Elegant sans for navigation
    nav: "'Outfit', 'DM Sans', sans-serif",
  },

  // Font sizes - Dramatic editorial scale
  fontSize: {
    '2xs': '0.625rem',  // 10px
    xs: '0.6875rem',    // 11px
    sm: '0.8125rem',    // 13px
    base: '0.9375rem',  // 15px
    md: '1.0625rem',    // 17px
    lg: '1.25rem',      // 20px
    xl: '1.5rem',       // 24px
    '2xl': '2rem',      // 32px
    '3xl': '2.75rem',   // 44px
    '4xl': '3.75rem',   // 60px
    '5xl': '5rem',      // 80px
    '6xl': '6.5rem',    // 104px
    hero: '8rem',       // 128px
    mega: '12rem',      // 192px
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.015em',
    normal: '0',
    wide: '0.04em',
    wider: '0.08em',
    widest: '0.15em',
    display: '0.25em',
    mega: '0.4em',
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
    japanese: 1.9,      // For vertical Japanese text
  },

  // Font weights
  fontWeight: {
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
};

// ============================================
// SPACING & LAYOUT
// ============================================

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px

  // Semantic spacing
  section: {
    mobile: '4rem',
    tablet: '6rem',
    desktop: '8rem',
  },

  container: {
    mobile: '1.25rem',
    tablet: '2.5rem',
    desktop: '5rem',
  },
};

// ============================================
// EFFECTS & SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  md: '0 4px 12px rgba(0, 0, 0, 0.5)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.6)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.7)',
  glow: {
    gold: '0 0 40px rgba(201, 162, 39, 0.3)',
    goldIntense: '0 0 60px rgba(201, 162, 39, 0.5)',
    soft: '0 0 60px rgba(250, 250, 249, 0.05)',
  },
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
};

export const gradients = {
  // Background gradients
  bgPrimary: 'linear-gradient(180deg, #08080c 0%, #0f0f14 100%)',
  bgRadial: 'radial-gradient(ellipse at 50% 0%, #16161e 0%, #08080c 70%)',
  bgMesh: `
    radial-gradient(at 40% 20%, rgba(201, 162, 39, 0.08) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.06) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(14, 165, 233, 0.04) 0px, transparent 50%)
  `,

  // Gold gradients
  gold: 'linear-gradient(135deg, #c9a227 0%, #dbb842 50%, #c9a227 100%)',
  goldSubtle: 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, transparent 100%)',
  goldShine: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',

  // Text gradients
  textShimmer: 'linear-gradient(90deg, #c9a227, #fafaf9, #c9a227)',

  // Overlay gradients
  fadeTop: 'linear-gradient(180deg, rgba(8,8,12,0.95) 0%, transparent 100%)',
  fadeBottom: 'linear-gradient(0deg, rgba(8,8,12,0.95) 0%, transparent 100%)',
  vignette: 'radial-gradient(ellipse at center, transparent 0%, rgba(8,8,12,0.4) 100%)',
};

// ============================================
// BORDERS & RADIUS
// ============================================

export const borders = {
  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
};

// ============================================
// ANIMATION & MOTION
// ============================================

export const animation = {
  // Durations
  duration: {
    instant: '0.1s',
    fast: '0.2s',
    normal: '0.4s',
    slow: '0.6s',
    slower: '0.8s',
    slowest: '1.2s',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Custom dramatic easings
    dramatic: 'cubic-bezier(0.16, 1, 0.3, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  // Common transitions
  transition: {
    colors: 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
    transform: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    opacity: 'opacity 0.3s ease',
    all: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  // Named breakpoints for responsive hooks
  mobile: 640,   // max-width for mobile
  tablet: 1024,  // max-width for tablet
  // Tailwind-style breakpoints
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// ============================================
// Z-INDEX LAYERS
// ============================================

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  overlay: 400,
  toast: 500,
  tooltip: 600,
  max: 9999,
};

// ============================================
// 3D CUBE CONFIGURATIONS
// ============================================

export const cubeConfig = {
  mobile: {
    size: 1.6,
    cameraPosition: [0, 0, 5],
    fov: 55,
    rotateSpeed: 0.08,
  },
  tablet: {
    size: 2,
    cameraPosition: [0, 0, 5.5],
    fov: 50,
    rotateSpeed: 0.1,
  },
  desktop: {
    size: 2.2,
    cameraPosition: [0, 0, 6],
    fov: 45,
    rotateSpeed: 0.12,
  },
};

// ============================================
// GLOBAL STYLES (CSS-in-JS helper)
// ============================================

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,200;9..144,400;9..144,600;9..144,700&family=Sora:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Antonio:wght@400;500;600;700&family=Noto+Serif+JP:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap');

  @font-face {
    font-family: 'Magnum';
    src: url('/fonts/MAGNUM__.woff2') format('woff2'),
         url('/fonts/MAGNUM.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'GeosansLight';
    src: url('/fonts/GeosansLight.woff2') format('woff2'),
         url('/fonts/GeosansLight.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --color-gold: ${colors.gold};
    --color-gold-light: ${colors.goldLight};
    --color-bg-primary: ${colors.bg.primary};
    --color-bg-secondary: ${colors.bg.secondary};
    --color-bg-paper: ${colors.bg.paper};
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --font-display: ${typography.fontFamily.display};
    --font-body: ${typography.fontFamily.body};
    --font-japanese: ${typography.fontFamily.japanese};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${typography.fontFamily.body};
    background: ${colors.bg.primary};
    color: ${colors.text.primary};
    line-height: ${typography.lineHeight.normal};
    position: relative;
  }

  /* Subtle film grain overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.025;
    pointer-events: none;
    z-index: 9999;
  }

  ::selection {
    background: ${colors.gold};
    color: ${colors.bg.primary};
  }

  /* Vertical Japanese text utility */
  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-family: ${typography.fontFamily.japanese};
    letter-spacing: 0.15em;
    line-height: 1.8;
  }

  .vertical-text-upright {
    writing-mode: vertical-rl;
    text-orientation: upright;
  }

  /* Editorial large text */
  .text-editorial {
    font-family: ${typography.fontFamily.display};
    font-weight: 200;
    letter-spacing: -0.02em;
    line-height: 1.05;
  }

  /* Condensed impact text */
  .text-impact {
    font-family: ${typography.fontFamily.condensed};
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.goldMuted};
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.gold};
  }

  /* Stagger animation utility classes */
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes revealLine {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  .animate-fade-up {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }

  .animate-slide-left {
    animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
`;
