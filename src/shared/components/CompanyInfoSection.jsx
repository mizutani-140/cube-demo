/**
 * CompanyInfoSection - Shared company overview grid
 * Used by AboutPage and AccessPage
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { typography } from '../tokens';
import { brand, company } from '../data/corporate';
import { useTheme } from '../contexts';

gsap.registerPlugin(ScrollTrigger);

export function CompanyInfoSection({ animationDirection = 'up' }) {
  const { isMobile } = useBreakpoints();
  const { colors, isDark } = useTheme();
  const sectionRef = useRef();
  const reducedMotion = useBreakpoints().prefersReducedMotion;

  const accents = isDark
    ? ['#d4af37', '#5b8def', '#4caf7a', '#9b7dd4', '#4db6ac', '#e8945a', '#d47b8a']
    : ['#9a7a18', '#2c5aa0', '#2e7d4f', '#6a4fa0', '#2d8a80', '#c07030', '#a85060'];

  const infoItems = [
    { label: '会社名', value: brand.name },
    { label: '設立', value: company.founded },
    { label: '資本金', value: company.capital },
    { label: '代表者', value: `${company.ceoTitle} ${company.ceo}` },
    { label: 'TEL', value: company.tel },
    { label: '本社所在地', value: `${company.headquarters.postalCode} ${company.headquarters.address}` },
    { label: '営業所', value: `${company.office.postalCode} ${company.office.address}` },
  ];

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.company-info-item');
      const fromVars = animationDirection === 'left'
        ? { opacity: 0, x: -20 }
        : { opacity: 0, y: 30 };
      const toVars = animationDirection === 'left'
        ? { opacity: 1, x: 0 }
        : { opacity: 1, y: 0 };

      gsap.fromTo(items, fromVars, {
        ...toVars,
        duration: animationDirection === 'left' ? 0.5 : 0.6,
        stagger: animationDirection === 'left' ? 0.06 : 0.08,
        ease: animationDirection === 'left' ? 'power2.out' : 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, animationDirection]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: isMobile ? '80px 24px' : '160px 80px',
        background: colors.bg.warm,
      }}
    >
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '60px' }}>
          <p style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.xs,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Company
          </p>
          <h2 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '36px' : '48px',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}>
            会社概要
          </h2>
        </div>

        {/* Info grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '0',
          borderTop: `1px solid ${colors.ui.border}`,
        }}>
          {infoItems.map((item, i) => {
            const accent = accents[i];
            return (
              <div
                key={i}
                className="company-info-item"
                style={{
                  padding: isMobile ? '24px 0 24px 16px' : '32px 0 32px 20px',
                  borderBottom: `1px solid ${colors.ui.border}`,
                  borderRight: isMobile ? 'none' : (i % 2 === 0 ? `1px solid ${colors.ui.border}` : 'none'),
                  paddingRight: isMobile ? '0' : (i % 2 === 0 ? '40px' : '0'),
                  marginLeft: isMobile ? '0' : (i % 2 === 1 ? '40px' : '0'),
                  borderLeft: `3px solid ${accent}`,
                }}
              >
                <p style={{
                  fontFamily: typography.fontFamily.condensed,
                  fontSize: '11px',
                  color: accent,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: typography.fontFamily.body,
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
