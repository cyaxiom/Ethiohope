/**
 * ETHIOHOPE DESIGN SYSTEM
 * 
 * Centralized design tokens and reusable patterns for consistent UI across all pages.
 * This file ensures uniform spacing, typography, colors, and layouts throughout the application.
 * 
 * Usage: Import and use these constants in your components
 * import { DS } from '@/constants/designSystem';
 */

export const DESIGN_SYSTEM = {
  // ============================================
  // CONTAINER & WIDTH SYSTEM
  // ============================================
  containers: {
    xs: 'max-w-2xl mx-auto',      // Small forms, narrow content (640px)
    sm: 'max-w-3xl mx-auto',      // FAQ sections, single column (768px)
    md: 'max-w-5xl mx-auto',      // Mission statements, medium content (1024px)
    lg: 'max-w-6xl mx-auto',      // Standard page width (1152px)
    xl: 'max-w-7xl mx-auto',      // Wide layouts, hero sections (1280px)
    full: 'max-w-full',           // Full width
    
    // With padding included
    xsPadded: 'max-w-2xl mx-auto px-4 md:px-6',
    smPadded: 'max-w-3xl mx-auto px-4 md:px-6',
    mdPadded: 'max-w-5xl mx-auto px-4 md:px-6 lg:px-8',
    lgPadded: 'max-w-6xl mx-auto px-4 md:px-6 lg:px-8',
    xlPadded: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
  },

  // ============================================
  // SPACING SYSTEM (Consistent across all pages)
  // ============================================
  spacing: {
    // Section padding (vertical)
    section: {
      xs: 'py-8 md:py-12',
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-20',
      lg: 'py-20 md:py-24 lg:py-28',
      xl: 'py-24 md:py-28 lg:py-32',
    },
    
    // Horizontal padding
    padding: {
      xs: 'px-4',
      sm: 'px-4 md:px-6',
      md: 'px-4 md:px-6 lg:px-8',
      lg: 'px-6 md:px-8 lg:px-12',
    },
    
    // Gap between elements
    gap: {
      xs: 'gap-2 md:gap-3',
      sm: 'gap-4 md:gap-6',
      md: 'gap-6 md:gap-8',
      lg: 'gap-8 md:gap-10 lg:gap-12',
      xl: 'gap-10 md:gap-12 lg:gap-16',
    },
    
    // Margin bottom for stacking
    stack: {
      xs: 'mb-4 md:mb-6',
      sm: 'mb-6 md:mb-8',
      md: 'mb-8 md:mb-10 lg:mb-12',
      lg: 'mb-10 md:mb-12 lg:mb-16',
      xl: 'mb-12 md:mb-16 lg:mb-20',
    },
  },

  // ============================================
  // TYPOGRAPHY SYSTEM (Responsive text sizes)
  // ============================================
  typography: {
    // Display headings (Hero sections)
    display: {
      xl: 'text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight tracking-tight',
      lg: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight',
      md: 'text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight',
    },
    
    // Headings
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-snug',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-bold leading-snug',
    h4: 'text-xl md:text-2xl lg:text-3xl font-semibold leading-snug',
    h5: 'text-lg md:text-xl lg:text-2xl font-semibold',
    h6: 'text-base md:text-lg lg:text-xl font-semibold',
    
    // Body text
    body: {
      lg: 'text-lg md:text-xl leading-relaxed',
      md: 'text-base md:text-lg leading-relaxed',
      sm: 'text-sm md:text-base leading-relaxed',
      xs: 'text-xs md:text-sm leading-normal',
    },
    
    // Special text
    lead: 'text-xl md:text-2xl font-light leading-relaxed',
    subtitle: 'text-lg md:text-xl text-muted-foreground leading-relaxed',
    caption: 'text-sm text-muted-foreground',
  },

  // ============================================
  // COLOR SYSTEM (Centralized Theme Colors)
  // ============================================
  // These map to CSS variables in index.css for consistent dark/light mode
  colors: {
    background: 'bg-background text-foreground',
    card: 'bg-card text-card-foreground border-border',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    muted: 'bg-muted text-muted-foreground',
    accent: 'bg-accent text-accent-foreground',
    
    // Semantic text colors
    text: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      inverse: 'text-background',
      brand: 'text-primary',
    },
    
    // Semantic border colors
    border: {
      default: 'border-border',
      brand: 'border-primary',
      accent: 'border-accent',
    }
  },

  // ============================================
  // GRID SYSTEM (Responsive layouts)
  // ============================================
  grids: {
    // Standard card grids
    cards2: 'grid grid-cols-1 lg:grid-cols-2',
    cards3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cards4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    cards6: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    
    // Auto-fit grids
    autoFit: {
      sm: 'grid grid-cols-auto-fit-sm',
      md: 'grid grid-cols-auto-fit-md',
      lg: 'grid grid-cols-auto-fit-lg',
    },
    
    // Two column layouts
    twoColumn: 'grid grid-cols-1 lg:grid-cols-2',
    twoColumnReverse: 'grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-dense',
    
    // Asymmetric grids
    sidebar: 'grid grid-cols-1 lg:grid-cols-[300px_1fr]',
    mainSidebar: 'grid grid-cols-1 lg:grid-cols-[1fr_300px]',
  },

  // ============================================
  // CARD SYSTEM (Reusable card patterns)
  // ============================================
  cards: {
    // Base card styles
    base: 'rounded-2xl bg-card border border-border shadow-sm transition-all duration-300',
    hover: 'hover:shadow-lg hover:-translate-y-1',
    active: 'hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]',
    
    // Card variants
    elevated: 'rounded-2xl bg-card border border-border shadow-lg',
    flat: 'rounded-2xl bg-card border border-border',
    outlined: 'rounded-2xl bg-transparent border-2 border-border',
    ghost: 'rounded-2xl bg-transparent',
    
    // Padding
    padding: {
      sm: 'p-4 md:p-6',
      md: 'p-6 md:p-8',
      lg: 'p-8 md:p-10 lg:p-12',
    },
    
    // Full card combinations
    standard: 'rounded-2xl bg-card border border-border shadow-sm p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
    interactive: 'rounded-2xl bg-card border border-border shadow-sm p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer',
  },

  // ============================================
  // BUTTON SYSTEM (Consistent buttons)
  // ============================================
  buttons: {
    // Base button
    base: 'inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Sizes
    sizes: {
      xs: 'px-3 py-1.5 text-xs rounded-lg',
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-2xl',
    },
    
    // Variants
    variants: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      ghost: 'bg-transparent text-foreground hover:bg-muted',
      danger: 'bg-error text-white hover:bg-error/90 shadow-md hover:shadow-lg',
      success: 'bg-success text-white hover:bg-success/90 shadow-md hover:shadow-lg',
    },
    
    // Full combinations
    primaryMd: 'inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300',
    outlineMd: 'inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300',
  },

  // ============================================
  // ANIMATION & TRANSITION
  // ============================================
  animations: {
    // Fade animations
    fadeIn: 'animate-fadeIn',
    fadeInUp: 'animate-fadeInUp',
    fadeInDown: 'animate-fadeInDown',
    
    // Transitions
    transition: {
      fast: 'transition-all duration-150',
      base: 'transition-all duration-300',
      slow: 'transition-all duration-500',
    },
    
    // Transform
    hover: {
      lift: 'hover:-translate-y-1',
      liftLarge: 'hover:-translate-y-2',
      scale: 'hover:scale-105',
      scaleSmall: 'hover:scale-[1.02]',
    },
  },

  // ============================================
  // EFFECTS & DECORATIONS
  // ============================================
  effects: {
    // Shadows
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
    },
    
    // Gradients
    gradients: {
      primary: 'bg-gradient-to-r from-primary via-primary/90 to-primary/80',
      blue: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600',
      purple: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600',
      green: 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600',
    },
    
    // Borders
    border: {
      base: 'border border-border',
      thick: 'border-2 border-border',
      colored: 'border-2 border-primary',
    },
    
    // Backdrop blur
    blur: {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    },
  },

  // ============================================
  // RESPONSIVE UTILITIES
  // ============================================
  responsive: {
    // Show/hide at breakpoints
    hideOnMobile: 'hidden md:block',
    hideOnDesktop: 'block md:hidden',
    showOnTablet: 'hidden md:block lg:hidden',
    
    // Flex direction changes
    stackOnMobile: 'flex flex-col lg:flex-row',
    stackOnMobileReverse: 'flex flex-col-reverse lg:flex-row',
    
    // Text alignment
    textCenter: 'text-center md:text-left',
    textLeft: 'text-left',
  },

  // ============================================
  // COMPONENT PATTERNS
  // ============================================
  patterns: {
    // Hero section
    hero: {
      container: 'relative min-h-screen flex items-center justify-center overflow-hidden',
      content: 'relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center',
    },
    
    // Feature section
    feature: {
      container: 'py-20 md:py-24 lg:py-28',
      content: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
      grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
    },
    
    // CTA section
    cta: {
      container: 'py-16 md:py-20 lg:py-24 bg-primary text-primary-foreground',
      content: 'max-w-4xl mx-auto px-4 md:px-6 text-center',
    },
    
    // Stats section
    stats: {
      container: 'py-16 md:py-20',
      grid: 'grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto',
    },
  },
};

// Export individual categories for tree-shaking
export const { containers, spacing, typography, grids, cards, buttons, animations, effects, responsive, patterns } = DESIGN_SYSTEM;

// Short alias for convenience
export const DS = DESIGN_SYSTEM;

// Default export
export default DESIGN_SYSTEM;
