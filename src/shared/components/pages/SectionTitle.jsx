/**
 * SectionTitle - Editorial Style
 * Section heading with optional Japanese label and subtitle
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { typography } from '../../tokens';
import { useTheme } from '../../contexts';

gsap.registerPlugin(ScrollTrigger);

export function SectionTitle({ title, titleJa, subtitle, align = 'left', accent }) {
  const { isMobile, isTablet } = useBreakpoints();
  const { colors } = useTheme();
  const titleRef = useRef();
  const accentColor = accent || colors.gold;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        }
      );
    }, titleRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={titleRef}
      style={{
        textAlign: align,
        marginBottom: isMobile ? '48px' : '72px',
      }}
    >
      {titleJa && (
        <p
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: accentColor,
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          {titleJa}
        </p>
      )}
      <h2
        style={{
          fontFamily: typography.fontFamily.display,
          fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px',
          fontWeight: 300,
          color: colors.text.primary,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0 0 20px 0',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: '14px',
            color: colors.text.secondary,
            lineHeight: 1.8,
            maxWidth: align === 'center' ? '520px' : '600px',
            margin: align === 'center' ? '0 auto' : 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
