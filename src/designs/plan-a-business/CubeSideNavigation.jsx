/**
 * CubeSideNavigation - Right-side navigation for cube view (desktop)
 * Extracted from BusinessCube.jsx
 */

import React, { useState } from 'react';
import { typography } from '../../shared/tokens';

// ============================================
// CubeSideNavigation Component
// ============================================

export function CubeSideNavigation({ businesses, activeIndex, onSelectFace, isVisible, isDark, themeColors }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!isVisible) return null;

  const inactiveNumber = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(26,24,20,0.45)';
  const inactiveText = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,24,20,0.75)';
  const subtitleColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,24,20,0.4)';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,20,0.06)';

  return (
    <nav
      aria-label="Business navigation"
      style={{
        position: 'absolute',
        right: '40px',
        top: '45%',
        transform: 'translateY(-50%)',
        zIndex: 100,
      }}
    >
      {businesses.map((business, i) => {
        const isActive = i === activeIndex;
        const isHovered = hoveredIndex === i;
        const titleJa = business.titleJa ? business.titleJa.split('｜')[0] : '';

        return (
          <button
            key={business.id}
            onClick={() => onSelectFace(i)}
            aria-label={`Navigate to ${business.shortTitle}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '4px',
              padding: '10px 14px',
              opacity: isActive || isHovered ? 1 : (isDark ? 0.5 : 0.7),
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              background: isActive || isHovered ? hoverBg : 'transparent',
              borderRadius: '6px',
              border: 'none',
              width: '100%',
              textAlign: 'right',
              position: 'relative',
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Number index */}
            <span style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: '10px',
              color: isActive ? business.color : inactiveNumber,
              opacity: isActive ? 1 : 0.6,
              letterSpacing: '0.1em',
              minWidth: '22px',
              textAlign: 'right',
              transition: 'color 0.3s ease',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Title block - right aligned like mobile */}
            <div style={{ flex: 1, textAlign: 'right' }}>
              <span style={{
                display: 'block',
                fontFamily: typography.fontFamily.display,
                fontSize: '16px',
                fontWeight: 300,
                letterSpacing: '0.06em',
                color: isActive ? business.color : (isHovered ? (isDark ? '#fff' : inactiveText) : inactiveText),
                transition: 'color 0.3s ease',
                lineHeight: 1.2,
              }}>
                {business.shortTitle}
              </span>
              {titleJa && (
                <span style={{
                  display: 'block',
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: '9px',
                  color: isActive ? business.color : subtitleColor,
                  marginTop: '3px',
                  letterSpacing: '0.15em',
                  transition: 'color 0.3s ease',
                  opacity: isActive ? 0.7 : 1,
                }}>
                  {titleJa}
                </span>
              )}
            </div>

            {/* Arrow indicator */}
            <span style={{
              color: business.color,
              opacity: isActive || isHovered ? 1 : 0.3,
              fontSize: '12px',
              transition: 'opacity 0.3s ease',
            }}>
              →
            </span>

            {/* Accent line (bottom) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              height: '1px',
              background: `linear-gradient(to left, ${business.color}, transparent)`,
              transformOrigin: 'right center',
              transform: isActive ? 'scaleX(1)' : (isHovered ? 'scaleX(0.6)' : 'scaleX(0)'),
              opacity: isActive ? 0.5 : (isHovered ? 0.35 : 0),
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }} />
          </button>
        );
      })}
    </nav>
  );
}
