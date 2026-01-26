/**
 * PageHero - Editorial Style Hero Section
 * Full-width hero with animated title, subtitle, and decorative elements
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { typography } from '../../tokens';
import { useTheme } from '../../contexts';

export function PageHero({ title, titleJa, subtitle, accentColor: accentColorProp }) {
  const { isMobile, isTablet, prefersReducedMotion } = useBreakpoints();
  const { colors } = useTheme();
  const heroRef = useRef();
  const titleRef = useRef();
  const decorRef = useRef();
  const accentColor = accentColorProp || colors.gold;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.hero-label, .hero-title, .hero-subtitle, .hero-line', { opacity: 1, scaleX: 1 });
        if (decorRef.current) gsap.set(decorRef.current, { opacity: 0.15 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Label slide in from left
      tl.fromTo('.hero-label',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 },
        0.15
      );

      // Title — character rotation reveal (CJK chars)
      if (titleRef.current) {
        const text = titleRef.current.textContent || '';
        const originalHTML = titleRef.current.innerHTML;
        const chars = [...text];
        titleRef.current.innerHTML = '';
        titleRef.current.setAttribute('aria-label', text);
        const spans = [];
        chars.forEach((char) => {
          if (char === ' ' || char === '\n') {
            titleRef.current.appendChild(document.createTextNode(char));
            return;
          }
          const span = document.createElement('span');
          span.textContent = char;
          span.style.display = 'inline-block';
          span.setAttribute('aria-hidden', 'true');
          titleRef.current.appendChild(span);
          spans.push(span);
        });
        gsap.set(titleRef.current, { opacity: 1 });
        tl.fromTo(spans,
          { opacity: 0, rotationX: -90, y: 20, transformOrigin: 'bottom center' },
          { opacity: 1, rotationX: 0, y: 0, duration: 0.7, stagger: 0.04, ease: 'power3.out' },
          0.25
        );
      }

      // Subtitle fade up
      tl.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.6
      );

      // Decorative line scale in
      tl.fromTo('.hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut' },
        0.4
      );

      // Decorative letter fade
      if (decorRef.current) {
        tl.fromTo(decorRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 0.15, scale: 1, duration: 1.5, ease: 'power2.out' },
          0.2
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      style={{
        padding: isMobile ? '60px 24px 50px' : '100px 80px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 0%, ${accentColor}08 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Large decorative letter */}
      <div
        ref={decorRef}
        style={{
          position: 'absolute',
          right: isMobile ? '-15%' : '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '40vw' : '25vw',
          fontWeight: 200,
          color: colors.gold,
          opacity: 0,
          lineHeight: 0.8,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {title?.charAt(0) || 'C'}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', maxWidth: '800px' }}>
        {/* Label */}
        {titleJa && (
          <p
            className="hero-label"
            style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: accentColor,
              marginBottom: '20px',
              textTransform: 'uppercase',
              opacity: 0,
            }}
          >
            {title}
          </p>
        )}

        {/* Japanese Title */}
        <h1
          ref={titleRef}
          className="hero-title"
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px',
            fontWeight: 400,
            color: colors.text.primary,
            letterSpacing: '0.05em',
            lineHeight: 1.3,
            margin: '0 0 24px 0',
            opacity: 0,
            perspective: '400px',
          }}
        >
          {titleJa || title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="hero-subtitle"
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: isMobile ? '13px' : '15px',
              color: colors.text.secondary,
              lineHeight: 2,
              maxWidth: '500px',
              opacity: 0,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div
          className="hero-line"
          style={{
            width: '60px',
            height: '1px',
            background: accentColor,
            marginTop: '40px',
            transformOrigin: 'left',
          }}
        />
      </div>
    </section>
  );
}
