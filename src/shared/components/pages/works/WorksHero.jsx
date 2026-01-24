/**
 * WorksHero - Hero Section Component
 *
 * Editorial impact hero with Anime.js v4 timeline animations.
 * Features large decorative "W", accent lines, and staggered text reveals.
 */

import React, { useRef, useEffect } from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { colors, typography } from '../../../tokens';
import { useWorksAnimations } from './useWorksAnimations';

export function WorksHero() {
  const { isMobile } = useBreakpoints();
  const heroRef = useRef();
  const { animateHero } = useWorksAnimations();

  useEffect(() => {
    animateHero(heroRef);
  }, [animateHero]);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '120px 24px 80px' : '0 0 0 12vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hero image */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '10%' : '50%',
        right: isMobile ? '0' : '5%',
        width: isMobile ? '100%' : '45vw',
        height: isMobile ? '40vh' : '70vh',
        transform: isMobile ? 'none' : 'translateY(-50%)',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <img
          src="/portfolio/lamb-chan-3.jpg"
          alt="CUBE Works"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isMobile ? 0.3 : 0.7,
            filter: 'brightness(0.85)',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isMobile
            ? `linear-gradient(to bottom, ${colors.bg.primary} 0%, transparent 30%, transparent 70%, ${colors.bg.primary} 100%)`
            : `linear-gradient(to right, ${colors.bg.primary} 0%, transparent 40%, transparent 80%, ${colors.bg.primary}80 100%)`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Large decorative letter */}
      <div
        className="hero-decoration"
        style={{
          position: 'absolute',
          top: isMobile ? '15%' : '10%',
          left: isMobile ? '-10%' : '-5%',
          fontFamily: typography.fontFamily.condensed,
          fontSize: isMobile ? '35vw' : '25vw',
          fontWeight: 700,
          color: colors.ui.border,
          opacity: 0.03,
          lineHeight: 0.8,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        W
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Accent line */}
        <div
          className="hero-line"
          style={{
            width: '120px',
            height: '1px',
            background: colors.gold,
            marginBottom: '32px',
            transformOrigin: 'left',
          }}
        />

        {/* Label */}
        <p
          className="hero-text"
          style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.sm,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '24px',
            opacity: 0,
          }}
        >
          Selected Works
        </p>

        {/* Main title */}
        <h1
          className="hero-text"
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '13vw' : '8vw',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            marginBottom: '40px',
            opacity: 0,
          }}
        >
          WORKS
        </h1>

        {/* Japanese subtitle */}
        <p
          className="hero-text"
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: isMobile ? '16px' : '20px',
            color: colors.text.secondary,
            letterSpacing: '0.15em',
            marginBottom: '24px',
            opacity: 0,
          }}
        >
          空間は、記憶になる。
        </p>

        {/* Description */}
        <p
          className="hero-text"
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.base,
            color: colors.text.tertiary,
            lineHeight: 1.9,
            maxWidth: '480px',
            opacity: 0,
          }}
        >
          CUBEの実績は、完成した「空間」だけではありません。
          <br />
          そこで生まれる体験、時間、記憶まで。
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className="hero-line"
        style={{
          position: 'absolute',
          bottom: isMobile ? '40px' : '80px',
          left: isMobile ? '24px' : '12vw',
          width: isMobile ? '60%' : '40%',
          height: '1px',
          background: `linear-gradient(90deg, ${colors.ui.border}, transparent)`,
          transformOrigin: 'left',
        }}
      />

      {/* Scroll indicator */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '12vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            color: colors.text.muted,
            letterSpacing: '0.2em',
            writingMode: 'vertical-rl',
          }}>
            SCROLL
          </span>
          <div style={{
            width: '1px',
            height: '60px',
            background: `linear-gradient(to bottom, ${colors.gold}, transparent)`,
          }} />
        </div>
      )}
    </section>
  );
}

export default WorksHero;
