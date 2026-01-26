/**
 * ContactHero - Editorial Style Hero Section
 * Extracted from ContactPage.jsx
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { useTheme } from '../../../contexts';
import { prefersReducedMotion } from '../../../animations/gsapSetup';

export function ContactHero() {
  const { isMobile, isTablet } = useBreakpoints();
  const { colors } = useTheme();
  const heroRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.hero-vertical, .hero-title, .hero-copy, .contact-hero-line', { opacity: 1 });
        gsap.set('.hero-letter', { opacity: 0.15 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Content horizontal wipe reveal (left to right via clipPath)
      if (contentRef.current) {
        tl.fromTo(contentRef.current,
          { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.0, ease: 'power3.inOut' },
          0.2
        );
      }

      // 2. Decoration "C" — slow fade
      tl.fromTo('.hero-letter',
        { opacity: 0, scale: 0.95 },
        { opacity: 0.15, scale: 1, duration: 2.0, ease: 'power2.out' },
        0.3
      );

      // 3. Vertical text fade
      tl.fromTo('.hero-vertical',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8 },
        0.5
      );

      // 4. Title elements stagger
      tl.fromTo('.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.6
      );

      // 5. Copy
      tl.fromTo('.hero-copy',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.8
      );

      // 6. Bottom decorative line
      tl.fromTo('.contact-hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut' },
        0.5
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: isMobile ? '60vh' : '70vh',
        display: 'flex',
        alignItems: 'center',
        background: colors.bg.primary,
        overflow: 'hidden',
        padding: isMobile ? '120px 20px 80px' : '140px 80px 100px',
      }}
    >
      {/* Large decorative letter */}
      <div
        className="hero-letter"
        style={{
          position: 'absolute',
          right: isMobile ? '-5%' : '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '45vw' : '35vw',
          fontWeight: 200,
          color: colors.gold,
          opacity: 0,
          lineHeight: 0.8,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        C
      </div>

      {/* Vertical Japanese text (hidden on desktop due to nav) */}
      {isMobile && (
        <div
          className="hero-vertical"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            writingMode: 'vertical-rl',
            fontFamily: typography.fontFamily.japanese,
            fontSize: '12px',
            letterSpacing: '0.3em',
            color: colors.text.tertiary,
            zIndex: 2,
          }}
        >
          お問い合わせ
        </div>
      )}

      {/* Main content — horizontal wipe reveal */}
      <div ref={contentRef} style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        <div
          className="hero-title"
          style={{ marginBottom: isMobile ? '32px' : '48px' }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: typography.fontFamily.mono,
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: colors.gold,
              marginBottom: '20px',
            }}
          >
            CONTACT
          </span>
          <h1
            style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px',
              fontWeight: 400,
              color: colors.text.primary,
              lineHeight: 1.4,
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            一緒につくるところから、
            <br />
            始めませんか。
          </h1>
        </div>

        <p
          className="hero-copy"
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: isMobile ? '13px' : '15px',
            color: colors.text.secondary,
            lineHeight: 2,
            maxWidth: '500px',
          }}
        >
          プロジェクトの大小に関わらず、まずはお気軽にご相談ください。
          <br />
          企画段階からの壁打ちも歓迎いたします。
        </p>
      </div>

      {/* Decorative line */}
      <div
        className="contact-hero-line"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '40%',
          height: '1px',
          background: `linear-gradient(90deg, ${colors.gold} 0%, transparent 100%)`,
          transformOrigin: 'left',
        }}
      />
    </section>
  );
}
