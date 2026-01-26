/**
 * Coming Soon Page
 * Lamb CHAN / LIFE NOSTALGIA 用のプレースホルダーページ
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { typography } from '../../tokens';
import { PageLayout } from './PageLayout';
import { businesses } from '../../data/corporate';
import { useTheme } from '../../contexts';

// ============================================
// Coming Soon Content
// ============================================

function ComingSoonContent({ businessId }) {
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();
  const contentRef = useRef();
  const business = businesses.find(b => b.id === businessId);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.coming-soon-element',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.45
        }
      );
    }, contentRef);
    return () => ctx.revert();
  }, []);

  if (!business) return null;

  return (
    <section
      ref={contentRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '120px 24px 80px' : '0 80px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '150vw' : '80vw',
        height: isMobile ? '150vw' : '80vw',
        background: `radial-gradient(circle, ${business.color}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Large background text */}
      <div
        className="coming-soon-element"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: typography.fontFamily.condensed,
          fontSize: isMobile ? '20vw' : '15vw',
          fontWeight: 700,
          color: colors.ui.border,
          opacity: 0.3,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        COMING SOON
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
        {/* Icon */}
        <div
          className="coming-soon-element"
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 32px',
            border: `2px solid ${business.color}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: '14px',
            color: business.color,
            letterSpacing: '2px',
          }}>
            {business.icon}
          </span>
        </div>

        {/* Title */}
        <h1
          className="coming-soon-element"
          style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '10vw' : '5vw',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          {business.shortTitle}
        </h1>

        {/* Japanese subtitle */}
        <p
          className="coming-soon-element"
          style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: isMobile ? '14px' : '18px',
            color: colors.text.secondary,
            letterSpacing: '0.15em',
            marginBottom: '40px',
          }}
        >
          {business.titleJa}
        </p>

        {/* Coming Soon label */}
        <div
          className="coming-soon-element"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <span style={{
            width: '40px',
            height: '1px',
            background: business.color,
          }} />
          <span style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: '14px',
            color: business.color,
            letterSpacing: '4px',
          }}>
            COMING SOON
          </span>
          <span style={{
            width: '40px',
            height: '1px',
            background: business.color,
          }} />
        </div>

        {/* Description */}
        <p
          className="coming-soon-element"
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: typography.fontSize.base,
            color: colors.text.tertiary,
            lineHeight: 1.9,
            marginBottom: '48px',
          }}
        >
          {business.description}
        </p>

        {/* Points */}
        <div
          className="coming-soon-element"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '48px',
          }}
        >
          {business.points.map((point, i) => (
            <span
              key={i}
              style={{
                fontFamily: typography.fontFamily.body,
                fontSize: '12px',
                color: colors.text.tertiary,
                padding: '8px 16px',
                border: `1px solid ${colors.ui.border}`,
                borderRadius: '20px',
              }}
            >
              {point}
            </span>
          ))}
        </div>

        {/* Instagram Link */}
        {(businessId === 'lambchan' || businessId === 'lifenostalgia') && (
          <a
            href={businessId === 'lambchan'
              ? 'https://www.instagram.com/lamb._.chan0321/'
              : 'https://www.instagram.com/life_nostalgia_mishuku/'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="coming-soon-element"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 28px',
              background: 'transparent',
              border: `1px solid ${business.color}`,
              borderRadius: '30px',
              color: business.color,
              fontFamily: typography.fontFamily.body,
              fontSize: '14px',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              marginBottom: '40px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = business.color;
              e.currentTarget.style.color = colors.bg.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = business.color;
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
        )}

        {/* Footer message */}
        <p
          className="coming-soon-element"
          style={{
            fontFamily: typography.fontFamily.body,
            fontSize: '13px',
            color: colors.text.muted,
            letterSpacing: '0.05em',
          }}
        >
          {(businessId === 'lambchan' || businessId === 'lifenostalgia')
            ? '最新情報はInstagramをチェック！'
            : '詳細は近日公開予定です。お楽しみに。'}
        </p>
      </div>

      {/* Decorative corners */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '100px' : '120px',
        left: isMobile ? '24px' : '80px',
        width: '60px',
        height: '60px',
        borderTop: `1px solid ${colors.ui.border}`,
        borderLeft: `1px solid ${colors.ui.border}`,
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '40px' : '80px',
        right: isMobile ? '24px' : '80px',
        width: '60px',
        height: '60px',
        borderBottom: `1px solid ${colors.ui.border}`,
        borderRight: `1px solid ${colors.ui.border}`,
        opacity: 0.5,
      }} />
    </section>
  );
}

// ============================================
// Main Component
// ============================================

export default function ComingSoonPage({ businessId, onNavigate }) {
  return (
    <PageLayout currentPage={businessId} onNavigate={onNavigate} hideFooter>
      <ComingSoonContent businessId={businessId} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,200;9..144,400;9..144,600&family=Sora:wght@300;400;500&family=Antonio:wght@400;500;600;700&family=Noto+Serif+JP:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>
    </PageLayout>
  );
}
