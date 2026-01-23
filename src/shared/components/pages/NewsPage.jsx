/**
 * NEWS Page
 * お知らせ・ニュース
 */

import React from 'react';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { useSEO, SEO_PRESETS } from '../../hooks';
import { colors, typography } from '../../tokens';
import { news } from '../../data/corporate';
import { PageLayout, PageHero, Section } from './PageLayout';

// ============================================
// News Card Component
// ============================================

function NewsCard({ item, index }) {
  const { isMobile } = useBreakpoints();

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
      style={{
        background: '#0f0f18',
        borderRadius: '8px',
        padding: isMobile ? '24px' : '30px',
        border: '1px solid rgba(255,255,255,0.08)',
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
          color: 'rgba(255,255,255,0.4)',
          fontSize: '11px',
          fontFamily: typography.fontFamily.mono,
        }}>
          {item.date}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        color: '#ffffff',
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
        color: 'rgba(255,255,255,0.6)',
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

  // SEO設定
  useSEO(SEO_PRESETS.news);

  return (
    <PageLayout currentPage="news" onNavigate={onNavigate}>
      <PageHero
        title="NEWS"
        titleJa="お知らせ"
        subtitle="CUBEからの最新情報をお届けします"
      />

      <Section background="#0a0a12">
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '24px',
        }}>
          {news.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
