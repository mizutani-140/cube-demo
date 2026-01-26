/**
 * NEWS Page
 * お知らせ・ニュース
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { useSEO, SEO_PRESETS } from '../../hooks';
import { typography } from '../../tokens';
import { news } from '../../data/news';
import { PageLayout, PageHero, Section } from './PageLayout';
import { useTheme } from '../../contexts';
import { prefersReducedMotion } from '../../animations/gsapSetup';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// News Card Component
// ============================================

function NewsCard({ item, index }) {
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();

  const categoryColors = {
    news: '#8A9BAD',
    event: '#5BA4C9',
    release: colors.gold,
  };

  const categoryLabels = {
    news: 'NEWS',
    event: 'EVENT',
    release: 'RELEASE',
  };

  return (
    <article
      className="news-card"
      style={{
        background: colors.bg.secondary,
        borderRadius: '8px',
        padding: isMobile ? '24px' : '30px',
        border: `1px solid ${colors.ui.border}`,
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <span
          style={{
            background: `${categoryColors[item.category] || colors.gold}20`,
            color: categoryColors[item.category] || colors.gold,
            fontSize: '10px',
            padding: '4px 10px',
            letterSpacing: '1px',
            borderRadius: '4px',
          }}
        >
          {categoryLabels[item.category] || 'NEWS'}
        </span>
        <span style={{
          color: colors.text.muted,
          fontSize: '11px',
          fontFamily: typography.fontFamily.mono,
        }}>
          {item.date}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        color: colors.text.primary,
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: 500,
        lineHeight: 1.5,
        marginBottom: '12px',
        fontFamily: typography.fontFamily.japanese,
      }}>
        {item.title}
      </h3>

      {/* Excerpt */}
      <p style={{
        color: colors.text.tertiary,
        fontSize: '13px',
        lineHeight: 1.8,
        margin: 0,
      }}>
        {item.excerpt}
      </p>
    </article>
  );
}

// ============================================
// Main News Page
// ============================================

export default function NewsPage({ onNavigate }) {
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();
  const gridRef = useRef();

  // SEO設定
  useSEO(SEO_PRESETS.news);

  // Scroll-triggered stagger from center
  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;

    const cards = gridRef.current.querySelectorAll('.news-card');
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: {
            each: 0.08,
            from: 'center',
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageLayout currentPage="news" onNavigate={onNavigate}>
      <PageHero
        title="NEWS"
        titleJa="お知らせ"
        subtitle="CUBEからの最新情報をお届けします"
      />

      <Section background={colors.bg.primary}>
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '24px',
          }}
        >
          {news.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
