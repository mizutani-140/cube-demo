/**
 * Plan A: Business-focused Cube Navigation
 * 株式会社CUBE - LIFE × ART × BUILD
 *
 * 6-face snap navigation with swipe/keyboard controls.
 * Horizontal swipe cycles 4 side faces; vertical swipe accesses top/bottom.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';

// Import shared components
import { HamburgerButton, MobileMenuOverlay } from '../../shared/components/MobileMenu';
import { ThemeToggleButton } from '../../shared/components/ThemeToggleButton';
import { useBreakpoints } from '../../shared/hooks';
import { typography } from '../../shared/tokens';
import { brand, company, businesses as corporateBusinesses, vision } from '../../shared/data/corporate';
import { useTheme } from '../../shared/contexts';

// Import extracted subcomponents
import {
  useCubeGesture,
  Scene,
  CUBE_SIZE,
  CUBE_SIZE_MOBILE,
  HORIZONTAL_RING,
  ANIMATION_DURATION,
  IDLE_RESUME_DELAY,
} from './BusinessCube3D';
import { BusinessInfoPanel } from './BusinessInfoPanel';
import { CubeSideNavigation } from './CubeSideNavigation';
import { CubeBottomNav } from './CubeBottomNav';

// ============================================
// Main Component
// ============================================

export default function BusinessCubeDesign({ onNavigate, cubeWarpRef }) {
  const { isMobile, isTablet, prefersReducedMotion } = useBreakpoints();
  const { colors, isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasEverInteracted, setHasEverInteracted] = useState(false);

  const lastHorizontalIndex = useRef(0); // Index into HORIZONTAL_RING
  const rootRef = useRef(null);
  const wasSwipeRef = useRef(false);
  const idleTimerRef = useRef(null);

  const activeBusiness = corporateBusinesses[activeFaceIndex];

  // ---- Idle Timer ----

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setHasInteracted(false);
    }, IDLE_RESUME_DELAY * 1000);
  }, []);

  // Clean up idle timer on unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // ---- Navigation Logic ----

  const animateToFace = useCallback((targetIndex) => {
    if (isAnimating) return;
    if (hasInteracted && targetIndex === activeFaceIndex) return;
    setIsAnimating(true);
    setActiveFaceIndex(targetIndex);

    // Track last horizontal position
    const hIdx = HORIZONTAL_RING.indexOf(targetIndex);
    if (hIdx !== -1) {
      lastHorizontalIndex.current = hIdx;
    }

    if (!hasInteracted) {
      setHasInteracted(true);
    }
    if (!hasEverInteracted) {
      setHasEverInteracted(true);
    }

    // Reset idle timer on every interaction
    resetIdleTimer();

    // Release animation lock after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, prefersReducedMotion ? 50 : ANIMATION_DURATION * 1000 + 50);
  }, [isAnimating, activeFaceIndex, hasInteracted, hasEverInteracted, prefersReducedMotion, resetIdleTimer]);

  const navigateHorizontal = useCallback((direction) => {
    // direction: +1 = next (left swipe), -1 = prev (right swipe)
    const isOnTopBottom = activeFaceIndex === 4 || activeFaceIndex === 5;
    let currentHIdx;

    if (isOnTopBottom) {
      // Return to last horizontal face
      currentHIdx = lastHorizontalIndex.current;
    } else {
      currentHIdx = HORIZONTAL_RING.indexOf(activeFaceIndex);
    }

    const nextHIdx = ((currentHIdx + direction) % HORIZONTAL_RING.length + HORIZONTAL_RING.length) % HORIZONTAL_RING.length;
    animateToFace(HORIZONTAL_RING[nextHIdx]);
  }, [activeFaceIndex, animateToFace]);

  const navigateSequential = useCallback((direction) => {
    // Cycle through all faces in order: 0 → 1 → 2 → 3 → 4 → 5 → 0 ...
    const total = corporateBusinesses.length;
    const nextIndex = ((activeFaceIndex + direction) % total + total) % total;
    animateToFace(nextIndex);
  }, [activeFaceIndex, animateToFace]);

  const navigateVertical = useCallback((direction) => {
    // direction: -1 = up swipe → Top, +1 = down swipe → Bottom
    if (direction < 0) {
      // Up swipe
      if (activeFaceIndex === 4) return; // Already on top
      if (activeFaceIndex === 5) {
        // On bottom → go to last horizontal
        animateToFace(HORIZONTAL_RING[lastHorizontalIndex.current]);
      } else {
        // On horizontal → go to top
        animateToFace(4);
      }
    } else {
      // Down swipe
      if (activeFaceIndex === 5) return; // Already on bottom
      if (activeFaceIndex === 4) {
        // On top → go to last horizontal
        animateToFace(HORIZONTAL_RING[lastHorizontalIndex.current]);
      } else {
        // On horizontal → go to bottom
        animateToFace(5);
      }
    }
  }, [activeFaceIndex, animateToFace]);

  // ---- Gesture Handling ----

  const { handlePointerDown, handlePointerUp, wasSwipeRef: gestureSwipeRef } = useCubeGesture({
    onSwipeLeft: useCallback(() => navigateHorizontal(1), [navigateHorizontal]),
    onSwipeRight: useCallback(() => navigateHorizontal(-1), [navigateHorizontal]),
    onSwipeUp: useCallback(() => navigateVertical(-1), [navigateVertical]),
    onSwipeDown: useCallback(() => navigateVertical(1), [navigateVertical]),
    enabled: !isAnimating && !menuOpen,
  });

  // Keep local ref in sync for click handling
  useEffect(() => {
    wasSwipeRef.current = gestureSwipeRef.current;
  });

  // ---- Face Click (navigate to page) ----

  const handleFaceClick = useCallback((business) => {
    // If the gesture was a swipe, ignore the click
    if (gestureSwipeRef.current) {
      gestureSwipeRef.current = false;
      return;
    }
    if (onNavigate) {
      onNavigate(business);
    }
  }, [onNavigate, gestureSwipeRef]);

  // ---- Keyboard Navigation ----

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (menuOpen || isAnimating) return;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateHorizontal(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateHorizontal(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigateVertical(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateVertical(1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, isAnimating, navigateHorizontal, navigateVertical]);

  // Auto-focus root for keyboard + entrance stagger
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.focus();
    }

    // Entrance animation for UI elements
    if (prefersReducedMotion || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const header = rootRef.current.querySelector('header');
      const footer = rootRef.current.querySelector('footer');
      const sideNav = rootRef.current.querySelector('nav[aria-label="Business navigation"]');
      const bottomNav = rootRef.current.querySelector('nav[aria-label="Cube face navigation"]');
      const tagline = rootRef.current.querySelector('[style*="text-align: right"]');
      const decorLine = rootRef.current.querySelector('[style*="height: 180px"]');

      const tl = gsap.timeline({ delay: 0.3 });

      // Header slides down
      if (header) {
        tl.fromTo(header,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0
        );
      }

      // Tagline slides down (desktop)
      if (tagline) {
        tl.fromTo(tagline,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.1
        );
      }

      // Side navigation items stagger in (desktop)
      if (sideNav) {
        const navItems = sideNav.querySelectorAll('button');
        if (navItems.length > 0) {
          tl.fromTo(navItems,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
            0.15
          );
        }
      }

      // Bottom nav dots pop in from center
      if (bottomNav) {
        const dots = bottomNav.querySelectorAll('button');
        if (dots.length > 0) {
          tl.fromTo(dots,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              stagger: { each: 0.04, from: 'center' },
              ease: 'back.out(2)',
            },
            0.2
          );
        }
      }

      // Decorative line draws in
      if (decorLine) {
        tl.fromTo(decorLine,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.8, ease: 'power2.inOut' },
          0.3
        );
      }

      // Footer fades up
      if (footer) {
        tl.fromTo(footer,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.25
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);


  // ---- Handlers ----

  const handleMenuToggle = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleMenuNavigate = useCallback((business) => {
    if (!onNavigate) return;

    // Find the face index for this business
    const targetIndex = corporateBusinesses.findIndex(b => b.id === business.id);
    if (targetIndex === -1) {
      onNavigate(business);
      return;
    }

    // Rotate the cube to the selected face first, then navigate
    animateToFace(targetIndex);

    // Wait for cube rotation to finish, then trigger page transition
    const delay = (prefersReducedMotion ? 50 : ANIMATION_DURATION * 1000) + 150;
    setTimeout(() => {
      onNavigate(business);
    }, delay);
  }, [onNavigate, animateToFace, prefersReducedMotion]);

  const handleSideNavClick = useCallback((index) => {
    if (!onNavigate) return;
    const business = corporateBusinesses[index];
    if (!business) return;

    // Rotate the cube to the selected face first, then navigate
    animateToFace(index);

    const delay = (prefersReducedMotion ? 50 : ANIMATION_DURATION * 1000) + 150;
    setTimeout(() => {
      onNavigate(business);
    }, delay);
  }, [onNavigate, animateToFace, prefersReducedMotion]);

  const cubeSize = isMobile ? CUBE_SIZE_MOBILE : isTablet ? 2.0 : CUBE_SIZE;
  const showParticles = !isMobile && !prefersReducedMotion;

  const showHamburger = isMobile || isTablet;
  const showSideNav = !isMobile && !isTablet;

  // Theme-aware colors
  const textSecondary = isDark ? 'rgba(255,255,255,0.5)' : colors.text.secondary;
  const textMuted = isDark ? 'rgba(255,255,255,0.28)' : colors.text.muted;

  const backgroundGradient = useMemo(() => {
    if (activeBusiness) {
      return isDark
        ? `radial-gradient(ellipse at 30% 50%, ${activeBusiness.color}25 0%, #0a0a12 55%)`
        : `radial-gradient(ellipse at 30% 50%, ${activeBusiness.color}15 0%, ${colors.bg.primary} 55%)`;
    }
    return isDark
      ? 'radial-gradient(ellipse at 30% 50%, #1a1a2e15 0%, #0a0a12 100%)'
      : `radial-gradient(ellipse at 30% 50%, ${colors.gold}08 0%, ${colors.bg.primary} 100%)`;
  }, [activeBusiness, isDark, colors]);

  return (
    <div
      ref={rootRef}
      className="cube-viewport"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        width: '100vw',
        height: '100vh',
        background: backgroundGradient,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        transition: 'background 0.8s ease',
        outline: 'none',
        touchAction: 'none',
      }}
    >
      {/* Theme Toggle Button */}
      <ThemeToggleButton
        size={16}
        style={{
          position: 'absolute',
          top: isMobile ? '18px' : '32px',
          right: showHamburger
            ? (isMobile ? '62px' : '76px')
            : '60px',
          zIndex: 2110,
        }}
      />

      {/* Hamburger Button (Mobile & Tablet) */}
      {showHamburger && (
        <HamburgerButton
          isOpen={menuOpen}
          onClick={handleMenuToggle}
          isMobile={isMobile}
          style={{
            position: 'absolute',
            top: isMobile ? '16px' : '28px',
            right: isMobile ? '16px' : '28px',
            zIndex: 2110,
          }}
        />
      )}

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={menuOpen}
        items={corporateBusinesses}
        activeId={hasInteracted ? activeBusiness?.id : null}
        onSelect={handleMenuNavigate}
        onClose={handleMenuClose}
      />

      {/* Header */}
      <header
        style={{
          position: 'absolute',
          top: isMobile ? '20px' : '35px',
          left: isMobile ? '20px' : '60px',
          zIndex: 100,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: `1px solid ${colors.gold}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: '15px',
              fontWeight: 400,
              color: colors.gold,
              letterSpacing: '-0.02em',
            }}
          >
            C
          </span>
          <div
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '5px',
              height: '5px',
              background: colors.gold,
            }}
          />
        </div>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{
            fontFamily: typography.fontFamily.display,
            color: colors.text.primary,
            fontSize: isMobile ? '15px' : '17px',
            letterSpacing: '0.02em',
            fontWeight: 400,
            margin: 0,
          }}>
            CUBE Inc.
          </h1>
          {!isMobile && (
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              color: colors.text.tertiary,
              fontSize: '9px',
              letterSpacing: '0.05em',
              marginTop: '1px',
            }}>
              株式会社CUBE
            </p>
          )}
        </div>
      </header>

      {/* Tagline (Desktop only) — shifted right to make room for theme toggle */}
      {!showHamburger && (
        <div style={{
          position: 'absolute',
          top: '35px',
          right: '112px',
          zIndex: 100,
          textAlign: 'right',
          pointerEvents: 'none',
        }}>
          <p style={{
            color: textSecondary,
            fontSize: '11px',
            letterSpacing: '2px',
            fontStyle: 'italic',
          }}>
            {brand.tagline}
          </p>
          <p style={{
            color: textMuted,
            fontSize: '9px',
            letterSpacing: '1px',
            marginTop: '4px',
          }}>
            {brand.subTagline}
          </p>
        </div>
      )}

      {/* Business Info Panel - only shown when cube is snapped to a face */}
      {hasInteracted && (
        <BusinessInfoPanel
          activeBusiness={activeBusiness}
          isMobile={isMobile}
          isDark={isDark}
          themeColors={colors}
          onExplore={handleFaceClick}
        />
      )}

      {/* 3D Cube - wrapper for transition targeting (will-change for GPU compositing) */}
      <div className="cube-3d-wrapper" style={{ position: 'absolute', inset: 0, willChange: 'transform, opacity' }}>
        <Canvas
          camera={{ position: [0, 0, isMobile ? 5.5 : 6], fov: isMobile ? 50 : 45 }}
          style={{ position: 'absolute', inset: 0 }}
          eventPrefix="client"
        >
          <Suspense fallback={null}>
            <Scene
              activeFaceIndex={activeFaceIndex}
              onNavigate={handleFaceClick}
              cubeSize={cubeSize}
              showParticles={showParticles}
              prefersReducedMotion={prefersReducedMotion}
              hasInteracted={hasInteracted}
              cubeWarpRef={cubeWarpRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Side Navigation (Desktop only) */}
      <CubeSideNavigation
        businesses={corporateBusinesses}
        activeIndex={hasInteracted ? activeFaceIndex : -1}
        onSelectFace={handleSideNavClick}
        isVisible={showSideNav}
        isDark={isDark}
        themeColors={colors}
      />

      {/* Bottom Navigation with Arrows */}
      <CubeBottomNav
        businesses={corporateBusinesses}
        activeIndex={hasInteracted ? activeFaceIndex : -1}
        onSelectFace={animateToFace}
        onNavigateSequential={navigateSequential}
        isDark={isDark}
        isMobile={isMobile}
      />

      {/* Footer */}
      <footer
        style={{
          position: 'absolute',
          bottom: isMobile ? '20px' : '35px',
          left: isMobile ? '20px' : '60px',
          right: isMobile ? '20px' : '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
          <p style={{
            color: textSecondary,
            fontSize: '9px',
            letterSpacing: '1px',
          }}>
            {company.headquarters.address.split('区')[0]}区
          </p>
          <p style={{
            color: textMuted,
            fontSize: '10px',
            letterSpacing: '2px',
            marginTop: '2px',
          }}>
            EST. 2013
          </p>
        </div>
      </footer>

      {/* Vision (Desktop only) */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '65px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <p style={{
            color: textMuted,
            fontSize: '10px',
            letterSpacing: '3px',
          }}>
            {vision.vision}
          </p>
        </div>
      )}

      {/* Decorative line (Desktop) */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '30px',
          width: '1px',
          height: '180px',
          background: `linear-gradient(to bottom, transparent, ${colors.gold}40, transparent)`,
          transform: 'translateY(-50%)',
        }} />
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          color-scheme: ${isDark ? 'dark' : 'light'};
        }

        body {
          overflow: hidden;
        }

        /* Focus visible styles for accessibility */
        button:focus-visible,
        a:focus-visible,
        [tabindex]:focus-visible {
          outline: 2px solid ${colors.gold};
          outline-offset: 2px;
        }

        /* Remove default focus for mouse users */
        button:focus:not(:focus-visible),
        a:focus:not(:focus-visible),
        [tabindex]:focus:not(:focus-visible) {
          outline: none;
        }

        .mobile-card {
          position: relative;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-card:focus-visible {
          outline: 2px solid ${colors.gold};
          outline-offset: 2px;
        }

        .mobile-card:active {
          transform: scale(0.97);
        }

        /* Menu overlay item hover effect enhancement */
        [role="dialog"] button:hover span:first-child,
        [role="dialog"] button:focus span:first-child {
          transform: scale(1.05);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
