/**
 * WorksHero - Hero Section Component
 *
 * Typographic hero with GSAP clip-path reveal, character-level text animation,
 * and parallax decoration. Awwwards-level entrance sequence.
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';
import { splitText } from '../../../animations/splitText';
import { prefersReducedMotion } from '../../../animations/gsapSetup';

export function WorksHero() {
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();
  const heroRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.hero-line, .hero-text, .hero-label', { opacity: 1 });
        gsap.set('.hero-decoration', { opacity: 0.15 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Content area clip-path reveal from center
      if (contentRef.current) {
        tl.fromTo(contentRef.current,
          { clipPath: 'inset(30% 30% 30% 30%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' },
          0
        );
      }

      // 2. Accent lines scale in
      tl.fromTo('.hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut', stagger: 0.2 },
        0.2
      );

      // 3. Label slide in
      tl.fromTo('.hero-label',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 },
        0.5
      );

      // 4. WORKS title — character rotation drop
      if (titleRef.current) {
        const { chars, revert } = splitText(titleRef.current, { type: 'chars' });
        if (chars.length > 0) {
          gsap.set(titleRef.current, { opacity: 1 });
          tl.fromTo(chars,
            {
              opacity: 0,
              rotationX: -90,
              y: 40,
              transformOrigin: 'top center',
            },
            {
              opacity: 1,
              rotationX: 0,
              y: 0,
              duration: 0.8,
              stagger: 0.06,
              ease: 'power3.out',
            },
            0.6
          );
        }
      }

      // 5. Japanese subtitle — character fade up
      if (subtitleRef.current) {
        const { chars: subChars, revert: subRevert } = splitText(subtitleRef.current, { type: 'chars' });
        if (subChars.length > 0) {
          gsap.set(subtitleRef.current, { opacity: 1 });
          tl.fromTo(subChars,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.04,
              ease: 'power2.out',
            },
            1.0
          );
        }
      }

      // 6. Description fade up
      tl.fromTo('.hero-desc',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.2
      );

      // 7. Decoration "W" — slow scale + fade
      tl.fromTo('.hero-decoration',
        { opacity: 0, scale: 0.9 },
        { opacity: 0.15, scale: 1, duration: 2.0, ease: 'power2.out' },
        0.3
      );

      // 8. Scroll indicator fade in
      tl.fromTo('.hero-scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 1.0 },
        2.0
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

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
      {/* Subtle radial glow behind text */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: isMobile ? '30%' : '25%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '120vw' : '60vw',
          height: isMobile ? '120vw' : '60vw',
          background: `radial-gradient(circle, ${colors.gold}06 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Large decorative letter */}
      <div
        className="hero-decoration"
        style={{
          position: 'absolute',
          top: '50%',
          right: isMobile ? '-5%' : '8%',
          transform: 'translateY(-50%)',
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '45vw' : '30vw',
          fontWeight: 200,
          color: colors.gold,
          opacity: 0,
          lineHeight: 0.85,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
        }}
        aria-hidden="true"
      >
        W
      </div>

      {/* Main content with clip-path reveal */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: isMobile ? '100%' : '60%',
        }}
      >
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
          className="hero-label"
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

        {/* Main title — split by GSAP */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '15vw' : '9vw',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            marginBottom: '40px',
            opacity: 0,
            perspective: '600px',
          }}
        >
          WORKS
        </h1>

        {/* Japanese subtitle — split by GSAP */}
        <p
          ref={subtitleRef}
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
          className="hero-desc"
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
        <div
          className="hero-scroll-indicator"
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '12vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: 0,
          }}
        >
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
