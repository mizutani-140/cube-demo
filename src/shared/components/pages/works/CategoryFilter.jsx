/**
 * CategoryFilter - Filter Tab Component
 *
 * Filterable category tabs with Anime.js click animations.
 * Pill-style buttons with gold border on active state.
 */

import React, { useRef, useCallback } from 'react';
import { useBreakpoints } from '../../../hooks/useBreakpoints';
import { colors, typography } from '../../../tokens';
import { useWorksAnimations } from './useWorksAnimations';

// Available categories
const CATEGORIES = [
  { id: 'ALL', label: 'ALL', labelJa: 'すべて' },
  { id: 'RESTAURANT', label: 'RESTAURANT', labelJa: '飲食店' },
  { id: 'COMMERCIAL', label: 'COMMERCIAL', labelJa: '商業' },
  { id: 'RETAIL', label: 'RETAIL', labelJa: '小売' },
  { id: 'RESIDENTIAL', label: 'RESIDENTIAL', labelJa: '住宅' },
  { id: 'BAR', label: 'BAR', labelJa: 'バー' },
  { id: 'BEAUTY', label: 'BEAUTY', labelJa: '美容' },
];

export function CategoryFilter({ activeFilter, onFilterChange, projectCounts = {} }) {
  const { isMobile } = useBreakpoints();
  const { animateFilterClick } = useWorksAnimations();
  const buttonRefs = useRef({});

  const handleClick = useCallback((categoryId) => {
    const button = buttonRefs.current[categoryId];
    if (button) {
      animateFilterClick(button);
    }
    onFilterChange(categoryId);
  }, [onFilterChange, animateFilterClick]);

  return (
    <div
      style={{
        padding: isMobile ? '24px 24px' : '48px 80px',
        background: colors.bg.secondary,
        borderBottom: `1px solid ${colors.ui.divider}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Section header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? '20px' : '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <p style={{
            fontFamily: typography.fontFamily.condensed,
            fontSize: typography.fontSize.xs,
            color: colors.gold,
            letterSpacing: typography.letterSpacing.display,
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Filter by Category
          </p>
          <h2 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 200,
            color: colors.text.primary,
            letterSpacing: '-0.02em',
          }}>
            全プロジェクト
          </h2>
        </div>

        <p style={{
          fontFamily: typography.fontFamily.mono,
          fontSize: '12px',
          color: colors.text.muted,
          letterSpacing: '0.05em',
        }}>
          {String(projectCounts.total || 0).padStart(2, '0')} PROJECTS
        </p>
      </div>

      {/* Filter buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: isMobile ? '8px' : '12px',
        }}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeFilter === category.id;
          const count = category.id === 'ALL'
            ? projectCounts.total
            : projectCounts[category.id] || 0;

          // Hide categories with no projects (except ALL)
          if (category.id !== 'ALL' && count === 0) return null;

          return (
            <button
              key={category.id}
              ref={(el) => { buttonRefs.current[category.id] = el; }}
              onClick={() => handleClick(category.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '10px 16px' : '12px 24px',
                background: isActive ? 'transparent' : 'transparent',
                border: `1px solid ${isActive ? colors.gold : colors.ui.border}`,
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = colors.ui.borderHover;
                  e.currentTarget.style.background = colors.bg.tertiary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = colors.ui.border;
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{
                fontFamily: typography.fontFamily.condensed,
                fontSize: isMobile ? '11px' : '12px',
                color: isActive ? colors.gold : colors.text.secondary,
                letterSpacing: typography.letterSpacing.wider,
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
              }}>
                {category.label}
              </span>

              {count > 0 && (
                <span style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: '10px',
                  color: isActive ? colors.gold : colors.text.muted,
                  opacity: 0.7,
                }}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilter;
