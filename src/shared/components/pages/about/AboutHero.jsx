/**
 * AboutHero - Hero Section with Scale + Parallax + Text Reveal
 *
 * Extracted from AboutPage for modularity.
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { typography } from '../../../tokens';
import { brand } from '../../../data/corporate';
import { useTheme } from '../../../contexts';
import { prefersReducedMotion } from '../../../animations/gsapSetup';

gsap.registerPlugin(ScrollTrigger);

// Hero images
const HERO_IMAGE = '/about.jpg';

export function AboutHero() {
  const { isMobile } = useBreakpoints();
  const { colors, isDark } = useTheme();
  const heroRef = useRef();
  const imageRef = useRef();
  const titleRef = useRef();
  const yearRef = useRef();

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.about-hero-text, .about-hero-line, .about-hero-decoration', { opacity: 1 });
        gsap.set('.about-hero-decoration', { opacity: 0.15 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Image scale reveal: 1.2→1 with opacity
      if (imageRef.current) {
        tl.fromTo(imageRef.current,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          0
        );

        // Parallax on scroll (image moves slower)
        if (!isMobile) {
          gsap.to(imageRef.current, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
      }

      // 2. Decorative line scale in
      tl.fromTo('.about-hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut' },
        0.4
      );

      // 3. Label slide in
      tl.fromTo('.about-hero-label',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 },
        0.6
      );

      // 4. "LIFE × ART × BUILD" — word-level rotation entrance
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.about-title-word');
        if (words.length > 0) {
          gsap.set(titleRef.current, { opacity: 1 });
          tl.fromTo(words,
            { opacity: 0, rotationX: -90, y: 30, transformOrigin: 'bottom center' },
            { opacity: 1, rotationX: 0, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
            0.7
          );
        }
      }

      // 5. Japanese tagline stagger
      tl.fromTo('.about-hero-tagline',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.2
      );

      // 6. Description fade
      tl.fromTo('.about-hero-desc',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.4
      );

      // 7. Decorative "A" — slow scale + fade
      tl.fromTo('.about-hero-decoration',
        { opacity: 0, scale: 0.9 },
        { opacity: 0.15, scale: 1, duration: 2.0, ease: 'power2.out' },
        0.3
      );

      // 8. Year counter animation: 2000 → 2013
      if (yearRef.current) {
        const counter = { value: 2000 };
        tl.fromTo('.about-hero-year-label',
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          0.8
        );
        tl.to(counter, {
          value: 2013,
          duration: 1.5,
          ease: 'power2.out',
          snap: { value: 1 },
          onUpdate: () => {
            if (yearRef.current) {
              yearRef.current.textContent = Math.round(counter.value);
            }
          },
        }, 0.9);
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        paddingRight: isMobile ? '0' : '120px',
        position: 'relative',
      }}
    >
      {/* Left - Image with scale + parallax */}
      <div style={{
        position: 'relative',
        minHeight: isMobile ? '50vh' : '100vh',
        overflow: 'hidden',
        order: isMobile ? 2 : 1,
      }}>
        <img
          ref={imageRef}
          src={HERO_IMAGE}
          alt="CUBEの建築空間 - 内装設計の作品例"
          width={800}
          height={600}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0,
            willChange: 'transform',
          }}
          loading="eager"
          fetchpriority="high"
        />

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isMobile
            ? (isDark ? 'linear-gradient(to bottom, rgba(6,6,10,0.3), rgba(6,6,10,0.6))' : 'linear-gradient(to bottom, rgba(245,242,235,0.3), rgba(245,242,235,0.6))')
            : (isDark ? 'linear-gradient(to left, rgba(6,6,10,0.95), transparent 30%)' : 'linear-gradient(to left, rgba(245,242,235,0.95), transparent 30%)'),
        }} />

        {/* Year badge with counter */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          textAlign: 'left',
        }}>
          <p
            className="about-hero-year-label"
            style={{
              fontFamily: typography.fontFamily.condensed,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em',
              marginBottom: '4px',
              opacity: 0,
            }}
          >
            ESTABLISHED
          </p>
          <p
            ref={yearRef}
            style={{
              fontFamily: typography.fontFamily.condensed,
              fontSize: '48px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.15)',
              lineHeight: 1,
            }}
          >
            2013
          </p>
        </div>
      </div>

      {/* Right - Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '140px 24px 80px' : '0 60px 0 80px',
        position: 'relative',
        zIndex: 2,
        order: isMobile ? 1 : 2,
        overflow: 'hidden',
      }}>
        {/* Large decorative letter */}
        <div
          className="about-hero-decoration"
          style={{
            position: 'absolute',
            top: '50%',
            right: isMobile ? '-5%' : '-10%',
            transform: 'translateY(-50%)',
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '45vw' : '25vw',
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
          A
        </div>

        {/* Decorative line */}
        <div
          className="about-hero-line"
          style={{
            width: '80px',
            height: '1px',
            background: colors.gold,
            marginBottom: '40px',
            transformOrigin: 'left',
          }}
        />

        {/* Label */}
        <p
          className="about-hero-label"
          style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.xs,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '20px',
            opacity: 0,
          }}
        >
          About CUBE
        </p>

        {/* Main concept — character rotation reveal */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '11vw' : '4.5vw',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '32px',
            opacity: 0,
            perspective: '500px',
          }}
        >
          <span className="about-title-word" style={{ display: 'inline-block' }}>LIFE</span>
          <span className="about-title-word" style={{ display: 'inline-block', color: colors.gold, margin: '0 0.03em', fontFamily: typography.fontFamily.japanese }}>×</span>
          <span className="about-title-word" style={{ display: 'inline-block' }}>ART</span>
          <span className="about-title-word" style={{ display: 'inline-block', color: colors.gold, margin: '0 0.03em', fontFamily: typography.fontFamily.japanese }}>×</span>
          <span className="about-title-word" style={{ display: 'inline-block' }}>BUILD</span>
        </h1>

        {/* Japanese tagline */}
        <p
          className="about-hero-tagline"
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: isMobile ? '18px' : '20px',
            color: colors.text.secondary,
            letterSpacing: '0.2em',
            marginBottom: '40px',
            opacity: 0,
          }}
        >
          暮らしを、空間から編集する。
        </p>

        {/* Description */}
        <p
          className="about-hero-desc"
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.base,
            color: colors.text.tertiary,
            lineHeight: 2,
            maxWidth: '400px',
            opacity: 0,
          }}
        >
          {brand.description}
        </p>
      </div>
    </section>
  );
}
